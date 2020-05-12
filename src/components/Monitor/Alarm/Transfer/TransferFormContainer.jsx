import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './transferForm.scss';
import WarningStatisticTop from '../commonArea/WarningStatisticTop';
import TransferFormFilter from './TransferFormFilter';
import TransferFormTable from './TransferFormTable';


class TransferFormContaienr extends Component {
  static propTypes = {
    getTransferFormStatistic: PropTypes.func,
    getTransferForm: PropTypes.func,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    warningStatus: PropTypes.string,
    warningType: PropTypes.string,
    deviceTypeCode: PropTypes.array,
    warningTypeStatus: PropTypes.string,
    deviceTypes: PropTypes.array,
    warningLevel: PropTypes.array,
    rangTime: PropTypes.array,
    stationCodes: PropTypes.array,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
    deviceName: PropTypes.string,
    durationType: PropTypes.string,
    stations: PropTypes.array,
    theme: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    const { getTransferFormStatistic, warningStatus, warningType } = this.props;
    getTransferFormStatistic({ warningStatus, warningType });
    this.queryTransferFrom();
  }
  onChangeFilter = (value) => {

    this.queryTransferFrom(value);
  }

  queryTransferFrom = (value) => {
    const { getTransferForm, warningTypeStatus, warningType, rangTime, stationType, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType, pageSize, pageNum } = this.props;
    const params = { warningTypeStatus, warningType, rangTime, deviceTypeCode, stationType, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType, pageSize, pageNum };
    getTransferForm({ ...params, ...value });
  }
  render() {
    const { stations, deviceTypes, theme } = this.props;
    return (
      <div className={`${styles.transferFormContaienr} ${styles[theme]}`}>
        <WarningStatisticTop {...this.props} warningStatus={'3'} />
        <div className={styles.dataCenter}>
          <TransferFormFilter {...this.props} stations={stations} deviceTypes={deviceTypes} onSearch={this.onChangeFilter} />
          <TransferFormTable {...this.props} onChangeFilter={this.onChangeFilter} />
        </div>
      </div>
    );
  }
}
export default (TransferFormContaienr);
