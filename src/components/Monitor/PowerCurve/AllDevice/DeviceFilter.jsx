import React, { Component } from "react";
import PropTypes from "prop-types";
import { Select, DatePicker, Button, Icon } from 'antd';
import moment from 'moment';
import styles from "./allDeviceCurve.scss";
import StationSelect from '../../../Common/StationSelect';
import DeviceSelect from '../../../Common/DeviceSelect/index';

const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
class DeviceFilter extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  onOk = (selectdevice) => {
    console.log('selectdevice: ', selectdevice);
    const deviceFullCode=selectdevice.map((e,i)=>e.deviceCode);
    this.props.changeAllDeviceStore({
      deviceFullCode
    })


  }
  selectStation = (selectedStationInfo) => { // 电站选择。
    const { getDeviceModel, changeAllDeviceStore } = this.props;
    const { stationCode } = selectedStationInfo[0];
    getDeviceModel({ // 风电设备类型下的设备编号
      stationCodes: stationCode,
      deviceTypeCode: 101,
    });
    console.log(stationCode);
    changeAllDeviceStore({
      stationCode, deviceTypeCode: 101,
    })


  }
  
 
  seekDeviceData = () => {//查询按钮
    const { stationCode, deviceFullCode, startTime, endTime, getAllDeviceCurveData, getPowerdeviceList, deviceShowType } = this.props;
    const params = { stationCode, deviceFullCode, startTime, endTime };
    deviceShowType === 'graph' ? getAllDeviceCurveData({ ...params, }) : getPowerdeviceList({ ...params, })
  }
  timeChange = (time) => {//时间选择
    console.log('time', time);
    const startTime = moment(time[0]).format('YYYY-MM-DD');
    const endTime = moment(time[1]).format('YYYY-MM-DD');
    console.log('startTime: ', startTime);
    console.log('endTime: ', endTime);
    this.props.changeAllDeviceStore({
      startTime,
      endTime
    })


  }
  selectShowType = (type) => { // 切换图表展示类型 'graph'图 / 'list'表格
    const { changeAllDeviceStore } = this.props;
    changeAllDeviceStore({ deviceShowType: type })
  }

  showChart = () => {
    this.selectShowType('graph');
  }

  showList = () => {
    this.selectShowType('list');
  }
  render() {
    const { windDeviceMode, stations, stationCode, deviceTypeCode, deviceShowType,deviceFullCode } = this.props;
    console.log('stationCode: ', stationCode);
    console.log('windDeviceMode: ', windDeviceMode);
    const test1 = 350;
    const test2 = 202;
    const test3 = '2019-03-07~2019-03-08';
    return (
      <div className={styles.filterStyle}>
        <div className={styles.searchPart}>
          <div className={styles.stationSelect}>
            <span className={styles.text}>电站名称</span>
            <StationSelect
              data={stations.filter(e => e.stationType === 1)}
              onOK={this.selectStation}
              style={{ width: '200px' }}
              value={stations.filter(e => e.stationCode === stationCode)}
            />
          </div>
          <div className={styles.typeSelect}>
            <span className={styles.text}>选择设备</span>

            <DeviceSelect
              disabled={+stationCode ? false : true}
              stationCode={+stationCode}
              deviceTypeCode={101}
              style={{ width: 'auto', minWidth: '198px' }}
              onOK={this.onOk}
              multiple={true}
              deviceShowNumber={true}
              holderText={'请选择'}
              value={deviceFullCode}
            />
          </div>
          <div className={styles.timeSelect}>
            <span className={styles.text}>时间选择</span>
            <RangePicker
              defaultValue={[moment(moment().subtract(1, "days"), 'YYYY/MM/DD'), moment(moment(), 'YYYY/MM/DD')]}
              format={'YYYY/MM/DD'}
              onChange={this.timeChange}
            />
          </div>
          <Button className={styles.buttonStyle} onClick={this.seekDeviceData}>查询</Button>
          {deviceShowType === 'list' ? <Button className={styles.buttonStyle} onClick={this.seekDeviceData}>导出</Button> : ''}
          <a href={`#/monitor/powercurve/${test1}/${test2}/${test3}`}>点击跳转</a>
        </div>
        <div className={styles.showType}>
          <div className={styles.tabIcons}>
            <Icon onClick={this.showChart} type="bar-chart" className={deviceShowType === 'graph' ? styles.active : styles.normal} />
            <Icon onClick={this.showList} type="bars" className={deviceShowType === 'list' ? styles.active : styles.normal} />
          </div>

        </div>
      </div>
    )
  }
}
export default (DeviceFilter)