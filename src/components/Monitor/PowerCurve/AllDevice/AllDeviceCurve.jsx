import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./allDeviceCurve.scss";
import DeviceFilter from "./DeviceFilter";
import WindDeviceTable from "./WindDeviceTable";
import WindDeviceGraph from "./WindDeviceGraph";
import moment from 'moment';

class AllDeviceCurve extends Component {
  static propTypes = {
    startTime:PropTypes.string,
    deviceShowType:PropTypes.string,
    endTime:PropTypes.string,
    stationCode:PropTypes.number,
    changeAllDeviceStore:PropTypes.func,
    getDeviceModel:PropTypes.func,
    getAllDeviceCurveData:PropTypes.func,
    getPowerdeviceList:PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
  }
  // componentDidMount(){
  //   const{stationCode,deviceFullCode,getAllDeviceCurveData}=this.props;
  //   const startTime = moment().subtract(1, "days").format('YYYY-MM-DD');
  //   const endTime = moment().format('YYYY-MM-DD');
  //   const params={stationCode,deviceFullCode,startTime,endTime};
  //   getAllDeviceCurveData({...params, })
  // }
  onChangeFilter=(value)=>{
    const{stationCode,deviceFullCode,startTime,endTime,getAllDeviceCurveData,getPowerdeviceList,deviceShowType}=this.props;
    const params={stationCode,deviceFullCode,startTime,endTime};
    deviceShowType==='graph'? getAllDeviceCurveData({...params, ...value}):getPowerdeviceList({...params, ...value})
  }
  render() {
    const{deviceShowType}=this.props;
    return (
      <div className={styles.allDeviceBox}>
        <DeviceFilter {...this.props} onChangeFilter={this.onChangeFilter}  />
        {deviceShowType==='graph'&&<WindDeviceGraph {...this.props} onChangeFilter={this.onChangeFilter} />}
        {deviceShowType==='list'&&<WindDeviceTable {...this.props} onChangeFilter={this.onChangeFilter} />}
      </div>
    )
  }
}
export default (AllDeviceCurve)