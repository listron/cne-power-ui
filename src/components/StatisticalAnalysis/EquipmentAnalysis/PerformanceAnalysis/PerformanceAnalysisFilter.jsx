import React, { Component } from "react";
import styles from "./performanceAnalysisFilter.scss";
import moment from 'moment';
import { Select, Switch ,DatePicker } from 'antd';

import StationSelect from "../../../../components/Common/StationSelect";

class PerformanceAnalysisFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectStation: []
    }
  }
   //选择时间
   onChangeDuration = (value) => {
    let startTime, endTime;
    if (value === 'today') {
      startTime = moment().hour(0).minute(0).second(0).utc().format();
      endTime = moment().utc().format();
    } else if (value === 'yesterday') {
      startTime = moment().subtract(1, 'days').hour(0).minute(0).second(0).utc().format();
      endTime = moment().subtract(1, 'days').hour(23).minute(59).second(59).utc().format();
    } else if (value === 'last7') {
      startTime = moment().subtract(7, 'days').hour(0).minute(0).second(0).utc().format();
      endTime = moment().utc().format();
    } else if (value === 'last30') {
      startTime = moment().subtract(30, 'days').hour(0).minute(0).second(0).utc().format();
      endTime = moment().utc().format();
    }
  }


  //选择电站
  stationSelected = (rest) => {
    const stationCodes = rest.map((item, index) => {
      return item.stationCode
    });
    this.setState({
      contrastSwitch:false,
      selectStation: rest,
      stationCodes: stationCodes
    });
  };


  //选择设备类型
  selectDeviceType = (value) => {
    const { getStationDeviceModel, stationCode } = this.props;
    getStationDeviceModel({
      stationCode,
      deviceTypeCode: value
    })
  }
  //选择设备型号
  selectDeviceModel = (value) => {
    const { stationCode, deviceModeCode, deviceTypeCode, getStationDevicePoints } = this.props;
    getStationDevicePoints({
      stationCode,
      deviceModeCode,
      deviceTypeCode,
    })
  }
  contrastSwitch=(checked)=>{
    const{contrastSwitch}=this.state;
    console.log(checked);
    this.setState({
      contrastSwitch:checked
    })

  }

  render() {
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY/MM/DD';
    const { stationCode, stations, deviceTypeCode, stationDeviceTypes, deviceModeCode, deviceModels } = this.props;
    const { selectStation ,contrastSwitch} = this.state;

    return (
      <div className={styles.performanceSearch}>
        <div className={styles.conditionalQuery}>
          <span className={styles.searchText}>条件查询</span>
          <StationSelect data={stations} holderText="请选择电站名称" value={selectStation} onChange={this.stationSelected} className={styles.switch} />
          <Select className={styles.duration} style={{ width: 120 }} defaultValue={'last30'} onChange={this.onChangeDuration}>
            <Option value="today">今天</Option>
            <Option value="yesterday">昨天</Option>
            <Option value="last7">最近7天</Option>
            <Option value="last30">最近30天</Option>
            <Option value="other">其他时间段</Option>
          </Select>
          <Switch  className={styles.switch} onChange={this.contrastSwitch} />
          <span className={styles.switchText}>对比同期</span>
          {contrastSwitch?<RangePicker
            defaultValue={[moment('2018/11/01', dateFormat), moment('2018/11/20', dateFormat)]}
            format={dateFormat}
          />:''
       }
         
        </div>
        <div className={styles.equipmentSelection}>
          <span className={styles.equipmentText}>设备选择</span>
          <Select placeholder="请选择设备类型" onChange={this.selectDeviceType} value={deviceTypeCode} >
            <Option key={null} value={null}>{'逆变器'}</Option>
            {stationDeviceTypes.map(e => {
              if (!e) { return null; }
              return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
            })}
          </Select>
          {/* <Select className={styles.modelSelect} onChange={this.selectDeviceModel} value={deviceModeCode} placeholder="请选择设备型号">
                <Option key={null} value={null}>{'全部设备型号'}</Option>
                {deviceModels.map(e=>{
                  if(!e){ return null; }
                  return <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>
                })}
               </Select> */}

        </div>
      </div>
    )
  }
}

export default PerformanceAnalysisFilter;