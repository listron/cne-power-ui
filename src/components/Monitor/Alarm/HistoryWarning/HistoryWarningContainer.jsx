import React, { Component } from 'react';
import styles from './historyWarning.scss';
import HistoryWarningFilter from './HistoryWarningFilter';
import HistoryWarningTable from './HistoryWarningTable';
import PropTypes from 'prop-types';
class HistoryWarningContainer extends Component {
  static propTypes = {
    history: PropTypes.object,
    theme: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const searchInfo = this.props.history.location.search;//拿到路径中的电站编码
    const stationCode = searchInfo.substring(searchInfo.indexOf('=') + 1);
    const pathParams = this.props.history.location.state || {};
    const { stationType = '', deviceName = '' } = pathParams;
    this.queryHistoryWarning({
      stationCodes: stationCode ? [stationCode] : [],
      stationType,
      deviceName,
    });
  }

  onChangeFilter = (value) => {
    this.queryHistoryWarning(value);
  }

  queryHistoryWarning = (value) => {
    const { getHistoryarningList, warningTypeStatus, warningType, rangTime, stationType, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType, pageSize, pageNum, endTime } = this.props;
    const params = { warningTypeStatus, warningType, stationType, rangTime, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType, pageSize, pageNum, endTime };
    getHistoryarningList({ ...params, ...value });
  }

  render() {
    const { stations, deviceTypes, theme } = this.props;
    return (
      <div className={`${styles.historyWarningContainer} ${styles[theme]}`}>
        <HistoryWarningFilter {...this.props} stations={stations} deviceTypes={deviceTypes} onSearch={this.onChangeFilter} />
        <HistoryWarningTable {...this.props} onChangeFilter={this.onChangeFilter} />
      </div>
    );
  }
}
export default (HistoryWarningContainer);
