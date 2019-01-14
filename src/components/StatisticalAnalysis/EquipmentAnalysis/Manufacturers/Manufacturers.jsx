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
    conversioneffList: PropTypes.array,
    faultNumList: PropTypes.array,
    faultHoursList: PropTypes.array,
    deviceCapacityList: PropTypes.array,
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
    const { conversioneffList, faultNumList, faultHoursList, deviceCapacityList } = this.props;
    return (
      <div className={styles.manufacturers}>
        <Search {...this.props} />
        <div className={styles.manuCont}>
          <Charts graphId={"conversioneff"} type={"conversioneff"} data={conversioneffList} />
          <Charts graphId={"faultHours"} type={"faultHours"} data={faultHoursList} />
          <Charts graphId={"faultNum"} type={"faultNum"} data={faultNumList} />
          <Charts graphId={"deviceCapacity"} type={"deviceCapacity"} data={deviceCapacityList} />
        </div>
      </div>
    )
  }
}

export default Manufacturers