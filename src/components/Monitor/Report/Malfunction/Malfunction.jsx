import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './malfunction.scss';
import { Button } from 'antd';
import TimeSelectReport from '../../../Common/TimeSelect/TimeSelectReport';
import SummaryMode from '../../../Common/SummaryMode';
import TableList from './TableList';
import moment from 'moment';
import path from '../../../../constants/path';
const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;

class Malfunction extends Component {
  static propTypes = {
    getMalfunctionList: PropTypes.func,
    downLoadFile: PropTypes.func,
    changeMalfunctionStore: PropTypes.func,
    getMalfunctionDetail: PropTypes.func,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    dateType: PropTypes.number,
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
    this.props.changeMalfunctionStore({ dateType: dateTypes[value.timeStyle], startTime: value.startTime, endTime: value.endTime })
  }
  onModechange = (value) => {
    console.log(value)
    const modeType = {
      "area": 1,
      "station": 2,
      "modal": 3,
      "wind": 4,
      "fault": 5,
    }
    this.props.changeMalfunctionStore({ summaryType: modeType[value.modeStyle], summaryData: value.list })
  }
  onSearch = () => {
    
    this.onChangeFilter()
  }
  onChangeFilter = (value) => {
    const { dateType, startTime, endTime, summaryType, summaryData, sortField, sortMethod, pageNum, pageSize, } = this.props;
    const params = { dateType, startTime, endTime, summaryType, summaryData, sortField, sortMethod, pageNum, pageSize };
    this.props.getMalfunctionList({ ...params, ...value })
    this.props.getMalfunctionDetail({ ...params, ...value })
  }

  exportList = () => {
    const url = `${APIBasePath}${monitor.exportDevicefault}`;
    let { dateType, startTime, endTime, summaryType, summaryData, sortField, sortMethod, downLoadFile } = this.props;
    let timeZone = moment().zone();
    // const modeType = ['状态', '区域', '电站', '型号', '风机','设备状态'];
    // const dateTypes = ['日', '日', '月', '年', '自定义'];
    downLoadFile({
      url,
      fileName: `故障报表-${startTime}-${endTime}.xlsx`,
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
            showStatus={false}
            regionStationDevice={regionStationDeviceData}
            stationDevicemode={stationDevicemodeData}
            regionStation={regionStationData}
            region={regionData} />
          <Button className={styles.btn} onClick={this.onSearch}>查询</Button>
          <Button className={styles.btn} onClick={this.exportList}>导出</Button>
        </div>
        <TableList {...this.props} />
      </div>
    )
  }
}

export default Malfunction;