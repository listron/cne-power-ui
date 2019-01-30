import React, { Component } from "react";
import styles from './historyWarning.scss';
import HistoryWarningFilter from './HistoryWarningFilter';
import HistoryWarningTable from './HistoryWarningTable';
class HistoryWarningContainer extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount(){
    this.queryHistoryWarning()
  }
  onChangeFilter = (value) => {
    this.queryHistoryWarning(value)
  }
  queryHistoryWarning = (value) => {
    const { getHistoryarningList, warningTypeStatus, warningType, rangTime,stationType, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType, pageSize, pageNum,endTime } = this.props;
    const params = { warningTypeStatus, warningType,stationType, rangTime, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType, pageSize, pageNum,endTime }
    getHistoryarningList({ ...params, ...value })
  }
  render() {
    const { stations, deviceTypes } = this.props;
    return (
      <div className={styles.historyWarningContainer}>
        <HistoryWarningFilter {...this.props} stations={stations} deviceTypes={deviceTypes} onSearch={this.onChangeFilter} />
        <HistoryWarningTable {...this.props} onChangeFilter={this.onChangeFilter} />
      </div>
    )
  }
}
export default (HistoryWarningContainer)