import React, { Component } from "react";
import styles from "./manufacturers.scss";
import PropTypes from 'prop-types';
import Search from './Search';
import Charts from './chart';

class Manufacturers extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    getChartsData: PropTypes.func,
    stationCode: PropTypes.array,
    deviceTypeNameLike: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    manufacturers: PropTypes.array,
    chartsData: PropTypes.array,
  }

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    const { stationCode, deviceTypeNameLike, startDate, endDate, manufacturers } = this.props;
    const parms = { stationCode, deviceTypeNameLike, startDate, endDate, manufacturers }
    this.props.getChartsData(parms)
  }

  render() {
    const { chartsData } = this.props;
    const manufacturer = chartsData.map(e=>e.manufacturer);
    const deviceModeName = chartsData.map(e=>e.deviceModeName);
    const xData = manufacturer;
    const conversioneff =  chartsData.map(e=>e.conversioneff);
    const faultNum = chartsData.map(e=>e.faultNum);
    const faultHours = chartsData.map(e=>e.faultHours);
    const deviceCapacity = chartsData.map(e=>e.deviceCapacity);
    console.log(xData,conversioneff,faultNum,faultHours,deviceCapacity)
    const conversioneffHasData=conversioneff.length>0?true:false
    const durationHasData=conversioneff.length>0?true:false
    const faultNumHasData=conversioneff.length>0?true:false
    const capacityHasdata=conversioneff.length>0?true:false
    return (
      <div className={styles.manufacturers}>
        <Search {...this.props} />
        <div className={styles.manuCont}>
          <Charts graphId={"efficiency"} type={"efficiency"} hasData={conversioneffHasData} xData={xData} yData={conversioneff} />
          <Charts graphId={"duration"} type={"duration"} hasData={durationHasData} xData={xData} yData={faultHours} />
          <Charts graphId={"frequency"} type={"frequency"} hasData={faultNumHasData} xData={xData} yData={faultNum} />
          <Charts graphId={"capacity"} type={"capacity"} hasData={capacityHasdata} xData={xData} yData={deviceCapacity} />
        </div>
      </div>
    )
  }
}

export default Manufacturers