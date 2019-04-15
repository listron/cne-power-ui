import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceStatus.scss';
import TimeSelectReport from '../../../Common/TimeSelect/TimeSelectReport';
import SummaryMode from '../../../Common/SummaryMode';
import TableList from './TableList';
import moment from 'moment';
import { Button } from 'antd';
import path from '../../../../constants/path';
const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;

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
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    regionStationDeviceData: PropTypes.array,
    stationDevicemodeData: PropTypes.array,
    regionStationData: PropTypes.array,
    regionData: PropTypes.array,
  }

  onTimeChange = (value) => {
    console.log(value)
    const dateTypes = {
      "day": 1,
      "month": 2,
      "year": 3,
      "custom": 4,
    };
    this.props.changeDeviceStatusStore({ dateType: dateTypes[value.timeStyle], startTime: value.startTime, endTime: value.endTime })
  }
  onModechange = (value) => {
    console.log(value)
    const modeType = {
      "area": 1,
      "station": 2,
      "modal": 3,
      "wind": 4,
      "status": 5,
    }
    this.props.changeDeviceStatusStore({ summaryType: modeType[value.modeStyle], summaryData: value.list })
  }
  onSearch = () => {
    // const {dataType,startTime,endTime,summaryType,summaryData,sortField,sortMethod,pageNum,pageSize,}=this.props;
    // const params={dataType,startTime,endTime,summaryType,summaryData,sortField,sortMethod,pageNum,pageSize};
    // this.props.getPowerReportList({...params})
    this.onChangeFilter()
  }
  onChangeFilter = (value) => {
    const { dateType, startTime, endTime, summaryType, summaryData, sortField, sortMethod, pageNum, pageSize, } = this.props;
    console.log('startTime: ', startTime);
    const params = { dateType, startTime, endTime, summaryType, summaryData, sortField, sortMethod, pageNum, pageSize };
    this.props.getDeviceStatusList({ ...params, ...value })
    this.props.getDeviceStatusDetail({ ...params, ...value })
  }

  exportList = () => {
    const url = `${APIBasePath}${monitor.exportDeviceStatus}`;
    let { dateType, startTime, endTime, summaryType, summaryData, sortField, sortMethod, downLoadFile } = this.props;
    let timeZone = moment().zone();
    // const modeType = ['状态', '区域', '电站', '型号', '风机','设备状态'];
    // const dateTypes = ['日', '日', '月', '年', '自定义'];
    downLoadFile({
      url,
      fileName: `设备状态报表-${startTime}-${endTime}.xlsx`,
      params: {
        dateType,
        startTime: moment(startTime).utc().format(),
        endTime: moment(endTime).utc().format(),
        summaryType,
        summaryData,
        sortField,
        sortMethod,
        timeZone: timeZone / -60
      },
    })
  }

  render() {
    const { regionStationDeviceData, stationDevicemodeData, regionStationData, regionData } = this.props;
    return (
      <div style={{ width: '100%' }}>
        <div className={styles.topStyles}  >
          <TimeSelectReport onChange={this.onTimeChange} />
          <SummaryMode onChange={this.onModechange}
            showFault={false}
            regionStationDevice={regionStationDeviceData}
            stationDevicemode={stationDevicemodeData}
            regionStation={regionStationData}
            region={regionData} />
          <Button className={styles.btn} onClick={this.onSearch}>查询</Button>
          <Button className={styles.btn} onClick={this.exportList}>导出</Button>
        </div>
        <TableList {...this.props} onChangeFilter={this.onChangeFilter} />
      </div>
    )
  }
}

export default DeviceStatus;