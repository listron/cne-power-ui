

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
    history: PropTypes.object,
    areaStation: PropTypes.array,
    quotaInfo: PropTypes.array,
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
      searchQuota: stationInfo.searchQuota || [],
    };
  }

  componentDidMount(){
    const { searchCode } = this.state;
    searchCode && this.props.getDevices({ stationCode: searchCode });
  }

  componentWillReceiveProps(nextProps){
    // 得到区域数据 ==> 请求机型 areaStation
    const { areaStation, modeDevices, quotaInfo } = nextProps;
    const { stationInfoStr } = this.state;
    const preArea = this.props.areaStation;
    const preDevice = this.props.modeDevices;
    const preQuota = this.props.quotaInfo;
    if (!stationInfoStr && preArea.length === 0 && areaStation.length > 0) { // 路径无参数时 得到电站数据
      this.propsAreaStationChange(areaStation);
    }
    if (!stationInfoStr && preDevice.length === 0 && modeDevices.length > 0 && !stationInfoStr) { // 路径无参数时  得到设备数据
      this.propsModeDevicesChange(modeDevices);
    }
    if (!stationInfoStr && preQuota.length === 0 && quotaInfo.length > 0 && !stationInfoStr) { // 路径无参数时  得到指标
      this.propsQuotaChange(quotaInfo);
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
    const { searchCode, searchDates, searchQuota } = this.state;
    const searchDevice = this.getAllDeviceCodes(modeDevices);
    if (searchQuota.length > 0) { // 已有指标
      this.historyChange(searchCode, searchDevice, searchDates, searchQuota);
    } else { // 存入state, 得到quota时再请求
      this.setState({ searchDevice });
    }
  }

  propsQuotaChange = (quotaInfo) => { // 得到指标
    const { searchCode, searchDevice, searchDates } = this.state;
    // 第一个指标作为数据
    const firstType = quotaInfo[0] || {};
    const quotas = firstType.children || [];
    const firstQuota = quotas[0] || {};
    const searchQuota = [firstType.indicatorCode, firstQuota.indicatorCode];
    if (searchDevice.length > 0) {
      this.historyChange(searchCode, searchDevice, searchDates, searchQuota);
    } else { // 存入, 待设备得到再请求
      this.setState({ searchQuota });
    }
  }

  historyChange = (searchCode, searchDevice, searchDates, searchQuota) => { // 切换路径 => 托管外部进行请求
    const { location, history } = this.props;
    const { search } = location;
    const newSearch = searchUtil(search).replace({station: JSON.stringify({
      searchCode, searchDevice, searchDates, searchQuota,
    })}).stringify();
    history.push(`/analysis/achievement/analysis/station?${newSearch}`);
  }

  getAllDeviceCodes = (modeDevices = []) => { // 解析所有设备得到codes数组
    const codes = [];
    modeDevices.forEach(e => {
      const { devices = [] } = e || {};
      devices.forEach(m => {
        codes.push(m.deviceFullcode);
      });
    });
    return codes;
  }

  onStationChange = ([regionName, stationCode, stationName]) => {
    this.setState({ searchCode: stationCode });
    this.props.getDevices({ stationCode });
  }

  onDeviceChange = (devices) => this.setState({ searchDevice: devices });

  onDateChange = ([], [start, end]) => this.setState({ searchDates: [start, end] });

  queryCharts = () => {
    const { searchCode, searchDevice, searchDates, searchQuota } = this.state;
    this.historyChange(searchCode, searchDevice, searchDates, searchQuota);
  }

  resetCharts = () => {
    console.log('重置');
  }

  render() {
    const { areaStation, modeDevices } = this.props;
    const { searchCode, searchDevice, searchDates } = this.state;
    console.log(searchCode)
    return (
      <div className={styles.topSearch}>
        <div>
          <span>选择电站</span>
          <AreaStation
            data={areaStation}
            value={[searchCode]}
            onChange={this.onStationChange}
            mode="station"
          />
        </div>
        <div>
          <span>选择设备</span>
          <AutoSelect
            data={modeDevices}
            value={searchDevice}
            onChange={this.onDeviceChange}
          />
        </div>
        <div>
          <span>选择时间</span>
          <RangePicker
            value={[moment(searchDates[0]), moment(searchDates[1])]}
            onChange={this.onDateChange}
            style={{width: '220px'}}
          />
        </div>
        <div>
          <Button onClick={this.queryCharts}>查询</Button>
          <Button onClick={this.resetCharts}>恢复图表</Button>
        </div>
      </div>
    );
  }
}

export default StationSearch;
