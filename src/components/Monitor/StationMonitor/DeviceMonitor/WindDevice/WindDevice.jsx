import React, { Component } from 'react';
import WindStatistics from './WindStatistics';
import {InverterTenMin,SactterChart,SequenceChart} from './windChart';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import DevicePointsData from './windPointsData';
import WindDeviceHeader from './WindDeviceHeader';
import CommonBreadcrumb from '../../../../Common/CommonBreadcrumb';
import PropTypes from 'prop-types';
import styles from '../eachDeviceMonitor.scss';
import moment from 'moment';

class WindDevice extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    match: PropTypes.object,
    getwindturbineData: PropTypes.func,
    getSequencechartData: PropTypes.func,
    devices: PropTypes.array,
    windturbineData: PropTypes.object,
    sequencechart: PropTypes.object,
    deviceAlarmList: PropTypes.array,
    devicePointData: PropTypes.array,
    singleStationData: PropTypes.object,
    resetDeviceStore: PropTypes.func,
  }

  componentDidMount() {
    const { deviceCode, deviceTypeCode, stationCode } = this.props.match.params;
    const startTime = moment().utc().subtract(72, 'hours').format();
    const endTime = moment().utc().format();
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode,
      timeParam: `${startTime}/${endTime}`,
    };
    this.props.getwindturbineData(params);
    this.props.getSequencechartData(params);
    this.getData(stationCode, deviceCode, deviceTypeCode,startTime,endTime);
    this.getTenMinData(stationCode, deviceCode, deviceTypeCode,startTime,endTime);
  }

  componentWillReceiveProps(nextProps) {
    const { deviceCode, deviceTypeCode, stationCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextDevice = nextParams.deviceCode;
    const nextType = nextParams.deviceTypeCode;
    const nextStation = nextParams.stationCode;
    const startTime = moment().utc().subtract(72, 'hours').format();
    const endTime = moment().utc().format();
    if (nextDevice !== deviceCode || nextType !== deviceTypeCode || nextStation !== stationCode) {
      clearTimeout(this.timeOutId);
      clearTimeout(this.timeOutTenMin);
      const params = {
        stationCode: nextStation,
        deviceCode: nextDevice,
        deviceTypeCode: nextType,
        timeParam: `${startTime}/${endTime}`,
      };
      this.props.getwindturbineData(params);
      this.props.getSequencechartData(params);
      this.getData(nextStation, nextDevice, nextType,startTime,endTime);
      this.getTenMinData(nextStation, nextDevice, nextType,startTime,endTime);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutId);
    clearTimeout(this.timeOutTenMin);
    this.props.resetDeviceStore();
  }

  getData = (stationCode, deviceCode, deviceTypeCode,startTime,endTime) => {
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode,
      timeParam: `${startTime}/${endTime}`,
    };
    this.timeOutId = setTimeout(() => {
      this.props.getwindturbineData(params);
      this.getData(stationCode, deviceCode, deviceTypeCode,startTime,endTime);
    },10000)
  }

  getTenMinData = (stationCode, deviceCode, deviceTypeCode,startTime,endTime) => {
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode,
      timeParam: `${startTime}/${endTime}`,
    };
    this.timeOutTenMin = setTimeout(() => {
      this.props.getSequencechartData(params);
      this.getData(stationCode, deviceCode, deviceTypeCode,startTime,endTime);
    },600000)
  }

  render() {
    const { devices, sequencechart, deviceAlarmList, devicePointData, loading, singleStationData, deviceDetail } = this.props;
    const { stationCode, deviceTypeCode, deviceCode } = this.props.match.params;
    const sequenceChartList1=sequencechart.scatterPlotList1 ||[]; // 实际功率
    const scatterPlotList2=sequencechart.scatterPlotList2 ||[]; //理论功率
    const sequenceChartList=sequencechart.sequenceChartList || []; // 时序图
    const backData = { path: `/monitor/singleStation/${stationCode}`, name: '返回电站' };
    const breadCrumbData = {
      breadData: [{
        link: true,
        name: singleStationData && singleStationData.stationName || '',
        path: `/monitor/singleStation/${stationCode}`,
      }, {
        name: deviceDetail.deviceName,
      }],
      iconName: 'iconfont icon-windlogo',
    };
    return (
      <div className={styles.windDevice}>
        <CommonBreadcrumb {...breadCrumbData} style={{ backgroundColor: '#fff' }} backData={{ ...backData }} />
        <div className={styles.deviceContent}>
          <WindDeviceHeader deviceDetail={deviceDetail} devices={devices} stationCode={stationCode} />
          <WindStatistics deviceDetail={deviceDetail} />
          <div className={styles.windChart} >
            <InverterTenMin sequenceChart={sequenceChartList} loading={loading} />
            <SactterChart theory={scatterPlotList2} actual={sequenceChartList1} /> 
            <SequenceChart sequenceChartList={sequenceChartList} />
          </div>
          <DeviceAlarmTable deviceAlarmList={deviceAlarmList} loading={loading} deviceDetail={deviceDetail} stationCode={stationCode} deviceTypeCode={deviceTypeCode} deviceCode={deviceCode}  {...this.props} />
          <DevicePointsData devicePointData={devicePointData} deviceDetail={deviceDetail} />
        </div>
      </div>
    )
  }
}

export default WindDevice;

