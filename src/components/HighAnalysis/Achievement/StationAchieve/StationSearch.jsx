

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
    location: PropTypes.object,
    lostChartDevice: PropTypes.string, // chart选中的设备
    history: PropTypes.object,
    areaStation: PropTypes.array,
    modeDevices: PropTypes.array,
    getDevices: PropTypes.func,

    searchCode: PropTypes.number,
    searchDevice: PropTypes.array,
    searchDates: PropTypes.array,
    searchQuota: PropTypes.number,
  }

  constructor(props){
    super(props);
    this.state = {
      searchCode: props.searchCode,
      searchDevice: props.searchDevice,
      searchDates: props.searchDates,
      searchQuota: props.searchQuota,
    };
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
    this.props.getDevices({ stationCode });
  }

  onDeviceChange = (devices) => this.setState({ searchDevice: devices.map(e => e.value) });

  onDateChange = ([], [start, end]) => this.setState({ searchDates: [start, end] });

  queryCharts = () => {
    const { searchCode, searchDevice, searchDates, searchQuota } = this.state;
    this.historyChange(searchCode, searchDevice, searchDates, searchQuota);
  }

  resetCharts = () => {
    console.log('重置');
  }

  render() {
    const { areaStation, modeDevices, lostChartDevice } = this.props;
    const { searchCode, searchDevice, searchDates } = this.state;
    const recoveryDisable = !lostChartDevice;
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
          >查询</Button>
        </div>
        <Button
          onClick={this.resetCharts}
          disabled={recoveryDisable}
          className={`${styles.recovery} ${recoveryDisable ? styles.disabled : null}`}
        >恢复图表</Button>
      </div>
    );
  }
}

export default StationSearch;
