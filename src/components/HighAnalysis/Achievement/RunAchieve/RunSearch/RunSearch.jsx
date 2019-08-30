

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, DatePicker } from 'antd';
import moment from 'moment';
import styles from './runSearch.scss';
import searchUtil from '../../../../../utils/searchUtil';
import AreaStation from '../../../../Common/AreaStation';
import AutoSelect from '../../../../Common/AutoSelect';
const { RangePicker } = DatePicker;

// 禁止选择时间
const disabledDate = current => current && current > moment().subtract(2, 'days');

export default class RunSearch extends Component {

  static propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
    areaStation: PropTypes.array,
    modeDevices: PropTypes.array,
    getDevices: PropTypes.func,
    changeStore: PropTypes.func,
  };

  constructor(props){
    super(props);
    const { search } = props.history.location;
    const stationInfoStr = searchUtil(search).getValue('run');
    const stationInfo = stationInfoStr ? JSON.parse(stationInfoStr) : {};
    const defaultEndTime = moment().subtract(2, 'days').format('YYYY-MM-DD');
    const defaultStartTime = moment(defaultEndTime).subtract(1, 'year').format('YYYY-MM-DD');
    this.state = {
      stationInfoStr,
      searchCode: stationInfo.searchCode,
      searchDevice: stationInfo.searchDevice || [],
      searchDates: stationInfo.searchDates || [defaultStartTime, defaultEndTime],
      areaFlag: false, // 控制第一次进来，有数据的时候
      searchFlag: true, // 控制切换电站搜索
    };
  }

  componentDidMount(){
    const { searchCode } = this.state;
    searchCode && this.props.getDevices({ stationCode: searchCode });
  }

  componentWillReceiveProps(nextProps){
    // 得到区域数据 ==> 请求机型 areaStation
    const { areaStation, modeDevices } = nextProps;
    const { stationInfoStr, areaFlag } = this.state;
    const preArea = this.props.areaStation;
    const preDevice = this.props.modeDevices;
    if (!stationInfoStr && preArea.length === 0 && areaStation.length > 0) { // 路径无参数时 得到电站数据
      this.propsAreaStationChange(areaStation);
    }
    if (!stationInfoStr && preDevice.length === 0 && modeDevices.length > 0 && !stationInfoStr) { // 路径无参数时  得到设备数据
      this.propsModeDevicesChange(modeDevices);
    }
    // 路径有参数 更改电站 得到新的设备数据
    if(stationInfoStr && modeDevices.length > 0 && JSON.stringify(modeDevices) !== JSON.stringify(preDevice)){
      const searchDevice = this.getAllDeviceCodes(modeDevices);
      this.setState({searchDevice});
    }
    // 判断从别的页面头次进入页面，电站和指标分析数据是有的话，改变state值， 发送请求
    if(!stationInfoStr && !areaFlag && areaStation.length > 0) {
      this.setState({
        areaFlag: true,
      }, () => {
        this.propsAreaStationChange(areaStation);
      });
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
  };

  propsModeDevicesChange = (modeDevices) => { // 得到电站下设备信息;
    const { searchCode, searchDates, searchFlag } = this.state;
    const searchDevice = this.getAllDeviceCodes(modeDevices);
    this.setState({ searchDevice });
    searchFlag && this.historyChange(searchCode, searchDevice, searchDates);
  };

  historyChange = (searchCode, searchDevice, searchDates) => { // 切换路径 => 托管外部进行请求
    const { location, history } = this.props;
    const { search } = location;
    const newSearch = searchUtil(search).replace({run: JSON.stringify({
        searchCode, searchDevice, searchDates,
      })}).stringify();
    history.push(`/analysis/achievement/analysis/run?${newSearch}`);
  };

  getAllDeviceCodes = (modeDevices = []) => { // 解析所有设备得到codes数组
    const codes = [];
    // 默认取第一个电站下的第一条数据的前三个
    modeDevices[0] && modeDevices[0].children && modeDevices[0].children.forEach((e, i) => {
      if(i < 3) { // 默认取前三个
        codes.push(e.value);
      }
    });
    return codes;
  };

  onStationChange = ([regionName, stationCode]) => {
    this.setState({
      searchCode: stationCode,
      searchDevice: [],
      searchFlag: false,
    }, () => {
      this.props.getDevices({ stationCode });
      this.props.changeStore({ modeDevices: [] });
    });
  };

  onDeviceChange = (devices) => this.setState({ searchDevice: devices.map(e => e.value) });

  onDateChange = ([], [start, end]) => this.setState({ searchDates: [start, end] });

  queryCharts = () => {
    const { searchCode, searchDevice, searchDates } = this.state;
    this.setState({
      searchFlag: true,
    }, () => {
      this.historyChange(searchCode, searchDevice, searchDates);
    });
  };

  render() {
    const { areaStation, modeDevices } = this.props;
    const { searchCode, searchDevice, searchDates } = this.state;
    const searchFlag = searchCode && searchDevice && searchDevice.length !== 0;

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
              max={3}
            />
          </div>
          <div className={styles.eachParts}>
            <span className={styles.text}>选择时间</span>
            <RangePicker
              value={[moment(searchDates[0]), moment(searchDates[1])]}
              onChange={this.onDateChange}
              style={{width: '220px'}}
              disabledDate={disabledDate}
            />
          </div>
          <Button disabled={!searchFlag} onClick={this.queryCharts}>查询</Button>
        </div>
      </div>
    );
  }
}
