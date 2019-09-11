import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, DatePicker } from 'antd';
import moment from 'moment';
import styles from './actuatorSearch.scss';
import searchUtil from '../../../../../utils/searchUtil';
import AreaStation from '../../../../Common/AreaStation';
import AutoSelect from '../../../../Common/AutoSelect';
const { RangePicker } = DatePicker;

// 禁止选择时间
const disabledDate = current => current && current > moment().subtract(2, 'days');

export default class ActuatorSearch extends Component {

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
    const actuatorInfoStr = searchUtil(search).getValue('actuator');
    const actuatorInfo = actuatorInfoStr ? JSON.parse(actuatorInfoStr) : {};
    const defaultEndTime = moment().subtract(2, 'days').format('YYYY-MM-DD');
    const defaultStartTime = moment(defaultEndTime).subtract(1, 'year').format('YYYY-MM-DD');
    this.state = {
      actuatorInfoStr,
      searchCode: actuatorInfo.searchCode,
      searchDevice: actuatorInfo.searchDevice || [],
      searchDates: actuatorInfo.searchDates || [defaultStartTime, defaultEndTime],
      actuatorFlag: false, // 控制第一次进来，有数据的时候
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
    const { actuatorInfoStr, actuatorFlag } = this.state;
    const preArea = this.props.areaStation;
    const preDevice = this.props.modeDevices;
    if (!actuatorInfoStr && preArea.length === 0 && areaStation.length > 0) { // 路径无参数时 得到电站数据
      this.propsAreaStationChange(areaStation);
    }
    if (!actuatorInfoStr && preDevice.length === 0 && modeDevices.length > 0 && !actuatorInfoStr) { // 路径无参数时  得到设备数据
      this.propsModeDevicesChange(modeDevices);
    }
    // 路径有参数 更改电站 得到新的设备数据
    if(actuatorInfoStr && modeDevices.length > 0 && JSON.stringify(modeDevices) !== JSON.stringify(preDevice)){
      // 选数据前三个设备
      const searchDeviceFilter = this.getAllDeviceCodes(modeDevices);
      // 接受跳转过来的设备
      const { searchDevice: stateSearchDevice } = this.state;
      const searchDevice = stateSearchDevice.length === 0 ? searchDeviceFilter : stateSearchDevice;
      this.setState({searchDevice});
    }
    // 判断从别的页面头次进入页面，电站和指标分析数据是有的话，改变state值， 发送请求
    if(!actuatorInfoStr && !actuatorFlag && areaStation.length > 0) {
      this.setState({
        actuatorFlag: true,
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
    const newSearch = searchUtil(search).replace({actuator: JSON.stringify({
        searchCode, searchDevice, searchDates,
      })}).stringify();
    history.push(`/analysis/achievement/analysis/actuator?${newSearch}`);
  };

  getAllDeviceCodes = (modeDevices = []) => { // 解析所有设备得到codes数组
    // 默认取第一个电站下的所有设备
    const arr = [];
    modeDevices && modeDevices.forEach(cur => {
      const { children } = cur || {};
      children && children.forEach(item => {
        arr.push(item.value);
      });
    });
    return arr;
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
            />
          </div>
          <div className={styles.eachParts}>
            <span className={styles.text}>选择时间</span>
            <RangePicker
              allowClear={false}
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
