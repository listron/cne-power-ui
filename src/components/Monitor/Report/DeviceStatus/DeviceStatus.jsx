import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceStatus.scss';
import TimeSelectReport from '../../../Common/TimeSelect/TimeSelectReport';
import SummaryMode from '../../../Common/SummaryMode';
import TableList from './TableList';
import moment from 'moment';
import { Button } from 'antd';


class DeviceStatus extends Component {
  static propTypes = {
    getDeviceStatusList: PropTypes.func,
    changeDeviceStatusStore: PropTypes.func,
    dateType: PropTypes.number,
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
  }

  export = () => {

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
          <Button className={styles.btn} onClick={this.export}>导出</Button>
        </div>
        <TableList {...this.props} onChangeFilter={this.onChangeFilter} />
      </div>
    )
  }
}

export default DeviceStatus;