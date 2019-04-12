import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './powerReport.scss';
import TimeSelectReport from '../../../Common/TimeSelect/TimeSelectReport';
import SummaryMode from '../../../Common/SummaryMode';
import TableList from './table';
import moment from 'moment';
import { Button } from 'antd';

class PowerReport extends Component {
  static propTypes = {
    getPowerReportList: PropTypes.func,
    changePowerReportStore: PropTypes.func,
    dataType: PropTypes.number,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    summaryType: PropTypes.number,
    summaryData: PropTypes.array,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
  }

  onTimeChange = (value) => {
    console.log(value)
    const dataTypes = {
      "day": 1,
      "month": 2,
      "year": 3,
      "custom": 4,
    };
    this.props.changePowerReportStore({ dataType: dataTypes[value.timeStyle], startTime: value.startTime, endTime: value.endTime })
  }
  onModechange = (value) => {
    console.log(value)
    const modeType = {
      "area": 1,
      "station": 2,
      "modal": 3,
      "wind": 4,
    }
    this.props.changePowerReportStore({ summaryType: modeType[value.modeStyle], summaryData: value.list })
  }
  onSearch = () => {
    // const {dataType,startTime,endTime,summaryType,summaryData,sortField,sortMethod,pageNum,pageSize,}=this.props;
    // const params={dataType,startTime,endTime,summaryType,summaryData,sortField,sortMethod,pageNum,pageSize};
    // this.props.getPowerReportList({...params})
    this.onChangeFilter()
  }
  onChangeFilter = (value) => {
    const { dataType, startTime, endTime, summaryType, summaryData, sortField, sortMethod, pageNum, pageSize, } = this.props;
    console.log('startTime: ', startTime);
    const params = { dataType, startTime, endTime, summaryType, summaryData, sortField, sortMethod, pageNum, pageSize };
    this.props.getPowerReportList({ ...params, ...value })
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
            showStatus={false}
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

export default PowerReport;