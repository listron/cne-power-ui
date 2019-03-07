import React, { Component } from "react";
import PropTypes from "prop-types";
import { Select, DatePicker, Button, Icon } from 'antd';
import moment from 'moment';
import styles from "./allDeviceCurve.scss";
import StationSelect from '../../../Common/StationSelect';
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
class DeviceFilter extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  selectStation = (selectedStationInfo) => { // 电站选择。
    const { getStationDeviceTypes, changeAllDeviceStore } = this.props;
    const { stationCode } = selectedStationInfo[0];
    getStationDeviceTypes({ // 设备类型
      stationCodes: stationCode,
    });
    console.log(stationCode);
    changeAllDeviceStore({
      stationCode
    })


  }
  selectDeviceType = (selectdevice) => {//设备选择
    console.log('selectdevice: ', selectdevice);
    this.props.changeAllDeviceStore({
      deviceFullCode:selectdevice
    })
  }
  seekDeviceData = () => {//查询按钮
    const{stationCode,deviceFullCode,startTime,endTime,getAllDeviceCurveData,getPowerdeviceList,deviceShowType}=this.props;
    const params={stationCode,deviceFullCode,startTime,endTime};
    deviceShowType==='graph'? getAllDeviceCurveData({...params, }):getPowerdeviceList({...params, })
  }
  timeChange = (time) => {//时间选择
    console.log('time', time);
    const startTime=moment(time[0]).format('YYYY-MM-DD');
    const endTime=moment(time[1]).format('YYYY-MM-DD');
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
    const { stationDeviceTypes, stations, stationCode, deviceTypeCode, deviceShowType } = this.props;
    return (
      <div className={styles.filterStyle}>
        <div className={styles.searchPart}>
          <div className={styles.stationSelect}>
            <span className={styles.text}>电站名称</span>
            <StationSelect
              data={stations}
              onOK={this.selectStation}
              style={{ width: '200px' }}
              value={stations.filter(e => e.stationCode === stationCode)}
            />
          </div>
          <div className={styles.typeSelect}>
            <span className={styles.text}>选择设备</span>
            <Select
              style={{ width: '200px' }}
              onChange={this.selectDeviceType}
              value={deviceTypeCode}
              placeholder="请选择风机"
              disabled={stationDeviceTypes.length === 0}
            >
              {stationDeviceTypes.map(e => (
                <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
              ))}
            </Select>
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