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
    selectOption: PropTypes.string,
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
    const { conversioneffList, faultNumList, faultHoursList, deviceCapacityList, selectOption } = this.props;
    return (
      <div className={styles.manufacturers}>
        <Search {...this.props} />
        <div className={styles.manuCont}>
          <Charts graphId={"conversioneff"} type={"conversioneff"} data={conversioneffList} selectOption={selectOption} />
          <Charts graphId={"faultHours"} type={"faultHours"} data={faultHoursList} selectOption={selectOption} />
          <Charts graphId={"faultNum"} type={"faultNum"} data={faultNumList} selectOption={selectOption} />
          <Charts graphId={"deviceCapacity"} type={"deviceCapacity"} data={deviceCapacityList} selectOption={selectOption} />
        </div>
      </div>
    )
  }
}

export default Manufacturers