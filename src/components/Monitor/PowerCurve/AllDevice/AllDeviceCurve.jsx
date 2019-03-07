import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./allDeviceCurve.scss";
import DeviceFilter from "./DeviceFilter";
import WindDeviceTable from "./WindDeviceTable";
import WindDeviceGraph from "./WindDeviceGraph";

class AllDeviceCurve extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
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