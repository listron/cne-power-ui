

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
  }

  constructor(props){
    super(props);
    const { search } = props.location;
    const stationInfoStr = searchUtil(search).getValue('station');
    const stationInfo = stationInfoStr ? JSON.parse(stationInfoStr) : {};
    const defaultStartTime = moment().subtract(1, 'year').format('YYYY-MM-DD');
    const defaultEndTime = moment().format('YYYY-MM-DD');
    this.state = {
      stationInfoStr,
      searchCode: stationInfo.searchCode,
      searchDevice: stationInfo.searchDevice || [],
      searchDates: stationInfo.searchDates || [defaultStartTime, defaultEndTime],
    };
  }

  componentDidMount(){
    const { searchCode } = this.state;
    searchCode && this.props.getDevices({ stationCode: searchCode });
  }

  componentWillReceiveProps(nextProps){
    // 得到区域数据 ==> 请求机型 areaStation
    const { areaStation, modeDevices } = nextProps;
    const { stationInfoStr } = this.state;
    const preArea = this.props.areaStation;
    const preDevice = this.props.modeDevices;
    if (!stationInfoStr && preArea.length === 0 && areaStation.length > 0) { // 路径无参数时 得到电站数据
      this.propsAreaStationChange(areaStation);
    }
    if (!stationInfoStr && preDevice.length === 0 && modeDevices.length > 0 && !stationInfoStr) { // 路径无参数时  得到设备数据
      this.propsModeDevicesChange(modeDevices);
    }
  }

  propsAreaStationChange = (areaStation = []) => { // 得到电站信息.
    const { stations = [] } = areaStation[0] || {};
    const firstStation = stations[0] || {};
    this.props.getDevices({ stationCode: firstStation.stationCode });
    if (!this.state.searchCode) { // 路径无数据 => 存入state待请求.
      this.setState({
        searchCode: firstStation.stationCode,
      });
    }
  }

  propsModeDevicesChange = (modeDevices) => { // 得到电站下设备信息;
    const { searchCode, searchDates } = this.state;
    const searchDevice = this.getAllDeviceCodes(modeDevices);
    this.setState({ searchDevice });
    this.historyChange(searchCode, searchDevice, searchDates);
  }

  historyChange = (searchCode, searchDevice, searchDates) => { // 切换路径 => 托管外部进行请求
    const { location, history } = this.props;
    const { search } = location;
    const newSearch = searchUtil(search).replace({station: JSON.stringify({
      searchCode, searchDevice, searchDates,
    })}).stringify();
    history.push(`/analysis/achievement/analysis/station?${newSearch}`);
  }

  getAllDeviceCodes = (modeDevices = []) => { // 解析所有设备得到codes数组
    const codes = [];
    modeDevices.forEach(e => {
      const { children = [] } = e || {};
      children.forEach(m => {
        codes.push(m.value);
      });
    });
    return codes;
  }

  onStationChange = ([regionName, stationCode, stationName]) => {
    this.setState({ searchCode: stationCode });
    this.props.getDevices({ stationCode });
  }

  onDeviceChange = (devices) => this.setState({ searchDevice: devices.map(e => e.value) });

  onDateChange = ([], [start, end]) => this.setState({ searchDates: [start, end] });

  queryCharts = () => {
    const { searchCode, searchDevice, searchDates } = this.state;
    this.historyChange(searchCode, searchDevice, searchDates);
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
            />
          </div>
          <Button onClick={this.queryCharts} className={styles.search}>查询</Button>
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
