import React, { Component } from "react";
import PropTypes from "prop-types";
import { Select, DatePicker, Button, Icon } from 'antd';
import moment from 'moment';
import styles from "./allDeviceCurve.scss";
import StationSelect from '../../../Common/StationSelect';
import DeviceSelect from '../../../Common/DeviceSelect/index';
import path from '../../../../constants/path';
const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;
const RangePicker = DatePicker.RangePicker;
class DeviceFilter extends Component {
  static propTypes = {
    startTime: PropTypes.string,
    deviceFullCode: PropTypes.array,
    powerCurveListData: PropTypes.array,
    selectdeviceCode: PropTypes.array,
    stations: PropTypes.array,
    deviceShowType: PropTypes.string,
    endTime: PropTypes.string,
    stationCode: PropTypes.number,
    changeAllDeviceStore: PropTypes.func,
    getDeviceModel: PropTypes.func,
    getAllDeviceCurveData: PropTypes.func,
    getPowerdeviceList: PropTypes.func,
    downLoadFile: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
  }
  onOk = (selectdevice) => {
    const deviceFullCode = selectdevice.map((e, i) => e.deviceCode);
    this.props.changeAllDeviceStore({
      deviceFullCode,
      selectdeviceCode: selectdevice
    })
  }
  selectStation = (selectedStationInfo) => { // 电站选择。
    const { getDeviceModel, changeAllDeviceStore } = this.props;
    const { stationCode } = selectedStationInfo[0];
    getDeviceModel({ // 风电设备类型下的设备编号
      stationCodes: stationCode,
      deviceTypeCode: 101,
    });

    changeAllDeviceStore({
      stationCode, deviceTypeCode: 101, deviceFullCode: [], selectdeviceCode: []
    })
  }
  seekDeviceData = () => {//查询按钮
    const { stationCode, deviceFullCode, startTime, endTime, getAllDeviceCurveData, getPowerdeviceList,changeAllDeviceStore } = this.props;
    const params = { stationCode, deviceFullCode, startTime: moment(startTime).utc().format(), endTime: moment(endTime).utc().format(), };
    if(startTime===moment().subtract(1, "days").format('YYYY-MM-DD')&&endTime===moment().format('YYYY-MM-DD')){
      const preDay=moment().startOf('day').subtract(1, "days");
      const curDay=moment().format('YYYY-MM-DD HH:mm:ss');
      params.startTime=moment(preDay).utc().format()
      params.endTime=moment(curDay).utc().format()
    }
    getAllDeviceCurveData({ ...params, })
    getPowerdeviceList({ ...params, })
    changeAllDeviceStore({checkedAll:true})
  }
  timeChange = (time) => {//时间选择
   
    const startTime = moment(time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    
    let endTime=moment(time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    
    const isToday  = moment(endTime).isSame(moment(), 'd');
    
    isToday ? endTime = moment().format('YYYY-MM-DD HH:mm:ss') : endTime;
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
  exportList = () => {
    const url = `${APIBasePath}${monitor.exportPowerdevice}`;
    let { startTime, endTime, stationCode, deviceFullCode, stations, downLoadFile } = this.props;
    startTime = moment(startTime).utc().format();
    endTime = moment(endTime).utc().format();
    let timeZone = moment().zone();
    const stationInfo = stations.filter((e, i) => e.stationCode)[0];
    downLoadFile({ // 
      url,
      fileName: `${stationInfo.stationName}-${startTime}-${endTime}功率曲线.xlsx`,
      params: {
        stationCode,
        deviceFullCode,
        startTime,
        endTime,
        timeZone: timeZone / -60
      },
    })
  }
  disabledDate = (current) => { // 不可选时间

    return current && current > moment().endOf('day')

  }
  render() {
    const { stations, stationCode, deviceShowType, selectdeviceCode, powerCurveListData } = this.props;
    return (
      <div className={styles.filterStyle}>
        <div className={styles.searchPart}>
          <div className={styles.stationSelect}>
            <span className={styles.text}>电站名称</span>
            <StationSelect
              data={stations.filter(e => e.stationType === 0)}
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
              needAllCheck={true}
              value={selectdeviceCode}
            />
          </div>
          <div className={styles.timeSelect}>
            <span className={styles.text}>时间选择</span>
            <RangePicker
              defaultValue={[moment(moment().startOf('day').subtract(1, "days"), 'YYYY/MM/DD HH:mm:ss'), moment(moment(), 'YYYY/MM/DD HH:mm:ss')]}
              format={'YYYY/MM/DD '}
              disabledDate={this.disabledDate}
              onChange={this.timeChange}
            />
          </div>
          <Button className={styles.buttonStyle} disabled={selectdeviceCode.length > 0 ? false : true} onClick={this.seekDeviceData}>查询</Button>
          {deviceShowType === 'list' ? <Button className={styles.buttonStyle} onClick={this.exportList}
            disabled={powerCurveListData.length === 0}
          >导出</Button> : ''}
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