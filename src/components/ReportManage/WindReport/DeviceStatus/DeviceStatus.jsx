import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceStatus.scss';
import TimeSelectReport from '../../../Common/TimeSelect/TimeSelectReport';
import SummaryMode from '../../../Common/SummaryMode';
import TableList from './TableList';
import moment from 'moment';
import { Button, message } from 'antd';
import path from '../../../../constants/path';
const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;
message.config({
  top: 200,
  duration: 1,
  maxCount: 3,
});
class DeviceStatus extends Component {
  static propTypes = {
    getDeviceStatusList: PropTypes.func,
    downLoadFile: PropTypes.func,
    getDeviceStatusDetail: PropTypes.func,
    dateType: PropTypes.number,
    changeDeviceStatusStore: PropTypes.func,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    summaryType: PropTypes.number,
    summaryData: PropTypes.array,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    tableType: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    regionStationDeviceData: PropTypes.array,
    stationDevicemodeData: PropTypes.array,
    regionStationData: PropTypes.array,
    regionData: PropTypes.array,
    deviceStatusList: PropTypes.array,
    statusDetailList: PropTypes.array,
  }

  componentWillReceiveProps() {

  }

  onTimeChange = (value) => {

    const dateTypes = {
      'day': 1,
      'month': 2,
      'year': 3,
      'custom': 4,
    };

    this.props.changeDeviceStatusStore({ dateType: dateTypes[value.timeStyle], startTime: value.startTime, endTime: value.endTime });
  }
  onModechange = (value) => {

    const modeType = {
      'area': 1,
      'station': 2,
      'modal': 3,
      'wind': 4,
      'status': 5,
    };
    const list = (value.modeStyle === 'area' || value.modeStyle === 'station') ? value.list : value.list.map((e, i) => (e.split('_')[0]));
    this.props.changeDeviceStatusStore({ summaryType: modeType[value.modeStyle], summaryData: list });
  }
  onSearch = () => {
    const { summaryData } = this.props;
    if (summaryData.length > 0) {
      const resetStatus = { sortField: '', sortMethod: '', pageNum: 1, pageSize: 10 };
      this.onChangeFilter(resetStatus);
    } else {
      message.warning('请选择汇总对象');
    }
  }
  onChangeFilter = (value) => {
    const { dateType, startTime, endTime, summaryType, summaryData, sortField, sortMethod, pageNum, pageSize, tableType } = this.props;
    const params = { dateType, startTime, endTime, summaryType, summaryData, sortField, sortMethod, pageNum, pageSize };
    tableType === 'all' && this.props.getDeviceStatusList({ ...params, ...value });
    tableType === 'detail' && this.props.getDeviceStatusDetail({ ...params, ...value });
  }

  exportList = () => {
    const url = `${APIBasePath}${monitor.exportDeviceStatus}`;
    const { dateType, startTime, endTime, summaryType, summaryData, sortField, sortMethod, downLoadFile } = this.props;
    const params = { dateType, startTime, endTime, summaryType, summaryData, sortField, sortMethod };
    const timeZone = moment().utcOffset();
    // const modeType = ['状态', '区域', '电站', '型号', '风机','设备状态'];
    // const dateTypes = ['日', '日', '月', '年', '自定义'];
    downLoadFile({
      url,
      fileName: `设备状态报表-${startTime}-${endTime}.xlsx`,
      params: {
        ...params,
        // startTime: moment(startTime).utc().format(),
        // endTime: moment(endTime).utc().format(),
        timeZone: timeZone / 60,
      },
    });
  }

  render() {
    const { regionStationDeviceData, stationDevicemodeData, regionStationData, regionData, dateType, startTime, endTime, summaryType, summaryData, sortField, sortMethod, pageNum, pageSize, statusDetailList, deviceStatusList, tableType } = this.props;
    const params = { dateType, startTime, endTime, summaryType, summaryData, sortField, sortMethod, pageNum, pageSize };
    const disabledStatus = (tableType === 'all' && deviceStatusList.length === 0) || (tableType === 'detail' && statusDetailList.length === 0);
    return (
      <div style={{ width: '100%' }}>
        <div className={styles.topStyles} >
          <TimeSelectReport onChange={this.onTimeChange} />
          <SummaryMode onChange={this.onModechange}
            showFault={false}
            modeStyle={'wind'}
            regionStationDevice={regionStationDeviceData}
            stationDevicemode={stationDevicemodeData}
            regionStation={regionStationData}
            region={regionData} />
          <Button className={styles.btn} onClick={this.onSearch}>查询</Button>
          <Button className={styles.btn} onClick={this.exportList} disabled={disabledStatus} >导出</Button>
        </div>
        <TableList {...this.props} onChangeFilter={this.onChangeFilter} params={params} />
      </div>
    );
  }
}

export default DeviceStatus;
