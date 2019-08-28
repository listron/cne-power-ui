

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, DatePicker } from 'antd';
import moment from 'moment';
import styles from './stationStyle.scss';
import searchUtil from '../../../../utils/searchUtil';
import AreaStation from '../../../Common/AreaStation';
import AutoSelect from '../../../Common/AutoSelect';
const { RangePicker } = DatePicker;

class StationSearch extends Component {

  static propTypes = {
    pageName: PropTypes.string,
    location: PropTypes.object,
    lostChartDevice: PropTypes.object, // chart选中的设备
    stopChartDevice: PropTypes.object,
    stopChartTime: PropTypes.string,
    stopChartTypes: PropTypes.object,
    history: PropTypes.object,
    areaStation: PropTypes.array,
    modeDevices: PropTypes.array,
    getDevices: PropTypes.func,
    pageQuery: PropTypes.func,
    stationChange: PropTypes.func,

    stationInfoStr: PropTypes.string,
    searchCode: PropTypes.number,
    searchDevice: PropTypes.array,
    searchDates: PropTypes.array,
    searchQuota: PropTypes.string,
  }

  constructor(props){
    super(props);
    const { stationInfoStr, searchCode, searchDevice, searchDates, searchQuota } = props;
    this.state = {
      stationInfoStr,
      searchCode,
      searchDevice,
      searchDates,
      searchQuota,
      queryTimer: null,
    };
  }

  componentWillReceiveProps(nextProps){
    const { stationInfoStr } = nextProps;
    if (stationInfoStr !== this.state.stationInfoStr ) { // 外界路径自动改变时进行数据同步映射。
      let searchParam = {};
      try {
        searchParam = JSON.parse(stationInfoStr);
      } catch(err){ null; }
      const { code, device = [], date = [], quota } = searchParam;
      this.setState({
        stationInfoStr,
        searchCode: code,
        searchDevice: device,
        searchDates: date,
        searchQuota: quota,
      });
    }
  }

  historyChange = (code, device = [], date = [
    moment().subtract(1, 'year').format('YYYY-MM-DD'),
    moment().format('YYYY-MM-DD'),
  ], quota) => { // 切换路径 => 托管外部进行请求
    const { location, history } = this.props;
    const { search } = location;
    const newSearch = searchUtil(search).replace({station: JSON.stringify({
      code, device, date, quota,
    })}).stringify();
    history.push(`/analysis/achievement/analysis/station?${newSearch}`);
  }

  onStationChange = ([regionName, stationCode, stationName]) => {
    this.setState({ searchCode: stationCode, searchDevice: [] });
    this.props.stationChange(stationCode);
    this.props.getDevices({ stationCode });
  }

  onDeviceChange = (devices) => this.setState({ searchDevice: devices.map(e => e.value) });

  onDateChange = ([], [start, end]) => this.setState({ searchDates: [start, end] });

  queryCharts = () => {
    const { searchCode, searchDevice, searchDates, searchQuota, queryTimer } = this.state;
    if (!queryTimer) { // 防抖
      this.historyChange(searchCode, searchDevice, searchDates, searchQuota);
      const tmpTimer = setTimeout(() => {
        this.setState({ queryTimer: null });
      }, 1000);
      this.setState({ queryTimer: tmpTimer });
    }
  }

  getQueryDisable = () => {
    const { pageName } = this.props;
    const { searchDevice, searchCode, searchQuota, queryTimer } = this.state;
    const infoLoss = !searchDevice || searchDevice.length === 0 || !searchCode;
    const quotaLoss = pageName === 'lost' && !searchQuota;
    // let pathSame = true;
    // try { //路径不变暂时, 不发请求。
    //   const stateStr = JSON.stringify({
    //     code: searchCode,
    //     device: searchDevice,
    //     date: searchDates,
    //     quota: searchQuota,
    //   });
    //   stateStr !== stationInfoStr && (pathSame = false);
    // } catch(err){ null; }
    return infoLoss || quotaLoss || queryTimer; // || pathSame 
  }

  getResetDisable = () => { // 恢复图表按钮
    const { pageName, lostChartDevice, stopChartDevice, stopChartTime, stopChartTypes } = this.props;
    let resetDisable = false;
    if (pageName === 'lost') {
      !lostChartDevice && (resetDisable = true);
    }
    if (pageName === 'stop') {
      !(stopChartDevice || stopChartTime || stopChartTypes) && (resetDisable = true);
    }
    return resetDisable;
  }

  recoverPage = () => { // 恢复图表
    const { stationInfoStr, pageName } = this.props;
    this.props.pageQuery(stationInfoStr, pageName);
  }

  render() {
    const { areaStation, modeDevices } = this.props;
    const { searchCode, searchDevice, searchDates } = this.state;
    const recoveryDisable = this.getResetDisable();
    console.log(searchCode)
    return (
      <div className={styles.topSearch}>
        <div className={styles.leftPart}>
          <div className={styles.eachParts}>
            <span className={styles.text}>选择电站</span>
            <AreaStation
              data={areaStation}
              value={[searchCode]}
              onChange={this.onStationChange}
              mode="station"
            />
          </div>
          <div className={styles.eachParts}>
            <span className={styles.text}>选择设备</span>
            <AutoSelect
              data={modeDevices}
              value={searchDevice}
              onChange={this.onDeviceChange}
              style={{width: '150px'}}
              maxTagCount={0}
            />
          </div>
          <div className={styles.eachParts}>
            <span className={styles.text}>选择时间</span>
            <RangePicker
              value={[moment(searchDates[0]), moment(searchDates[1])]}
              onChange={this.onDateChange}
              style={{width: '220px'}}
              allowClear={false}
            />
          </div>
          <Button
            onClick={this.queryCharts}
            className={styles.search}
            disabled={this.getQueryDisable()}
          >查询</Button>
        </div>
        <Button
          onClick={this.recoverPage}
          disabled={recoveryDisable}
          className={`${styles.recovery} ${recoveryDisable ? styles.disabled : null}`}
        >恢复图表</Button>
      </div>
    );
  }
}

export default StationSearch;
