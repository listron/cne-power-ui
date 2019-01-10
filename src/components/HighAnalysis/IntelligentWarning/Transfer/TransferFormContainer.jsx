import React, { Component } from "react";
import styles from './transferForm.scss';
import WarningStatisticTop from '../commonArea/WarningStatisticTop';
import TransferFormFilter from './TransferFormFilter';
import TransferFormTable from './TransferFormTable';

class TransferFormContaienr extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount(){
    const { getTransferFormStatistic, warningStatus, warningType,getTransferForm } = this.props
    getTransferFormStatistic({ warningStatus, warningType })
    this.queryTransferFrom()
  }
  onChangeFilter = (value) => {
   
    this.queryTransferFrom(value)
  }

  queryTransferFrom = (value) => {
    const { getTransferForm, warningTypeStatus,warningType, rangTime, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType, } = this.props;
    const params = { warningTypeStatus,  rangTime, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType }
    getTransferForm({ ...params, ...value })
  }
  render() {
    const { stations, deviceTypes, } = this.props;
    return (
      <div className={styles.transferFormContaienr}>
        <WarningStatisticTop {...this.props} warningStatus={'2'} />
        <TransferFormFilter {...this.props} stations={stations} deviceTypes={deviceTypes} onSearch={this.onChangeFilter} />
        <TransferFormTable {...this.props} />
      </div>
    )
  }
}
export default (TransferFormContaienr)