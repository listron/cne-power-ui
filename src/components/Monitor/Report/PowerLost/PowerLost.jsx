import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './powerLost.scss';
import TimeSelectReport from '../../../Common/TimeSelect/TimeSelectReport';
import SummaryMode from '../../../Common/SummaryMode';
import TableList from './TableList';
import moment from 'moment';
import { Button } from 'antd';
import path from '../../../../constants/path';
const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;

class PowerLost extends Component {
  static propTypes = {
    getPowerLostList: PropTypes.func,
    changePowerLostStore: PropTypes.func,
    downLoadFile: PropTypes.func,
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
    
    const dateTypes = {
      "day": 1,
      "month": 2,
      "year": 3,
      "custom": 4,
    };
    this.props.changePowerLostStore({ dateType: dateTypes[value.timeStyle], startTime: value.startTime, endTime: value.endTime })
  }
  onModechange = (value) => {
    const modeType = {
      "area": 1,
      "station": 2,
      "modal": 3,
      "wind": 4,
    };
    const list=(value.modeStyle==='area'||value.modeStyle==='station')?value.list:value.list.map((e,i)=>(e.split('_')[0]));
    this.props.changePowerLostStore({ summaryType: modeType[value.modeStyle], summaryData: list })
  }
  onSearch = () => {
    
    this.onChangeFilter()
  }
  onChangeFilter = (value) => {
    const { dateType, startTime, endTime, summaryType, summaryData, sortField, sortMethod, pageNum, pageSize, } = this.props;
    const params = { dateType, startTime, endTime, summaryType, summaryData, sortField, sortMethod, pageNum, pageSize };
    this.props.getPowerLostList({ ...params, ...value })
  }

  exportList = () => {
    //地址未改，当前是电量报表得地址
    const url = `${APIBasePath}${monitor.exportGen}`;
    let { dateType, startTime, endTime, summaryType, summaryData, sortField, sortMethod, downLoadFile } = this.props;
      const params={dateType, startTime, endTime, summaryType, summaryData, sortField, sortMethod};
    let timeZone = moment().zone();
    const modeType = ['状态', '区域', '电站', '型号', '风机'];
    const dateTypes = ['日', '日', '月', '年', '自定义'];
    downLoadFile({
      url,
      fileName: `${modeType[summaryType]}-${dateTypes[dateType]}损失电量报表-${startTime}-${endTime}.xlsx`,
      params: {
        ...params,
        // startTime: moment(startTime).utc().format(),
        // endTime: moment(endTime).utc().format(),
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
            showFault={false}
            modeStyle={'wind'}
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

export default PowerLost;