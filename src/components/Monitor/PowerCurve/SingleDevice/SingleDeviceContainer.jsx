import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './singleDevice.scss';
import WindSingleDeviceTable from './WindSingleDeviceTable';
import SingleWindDeviceCharts from './SingleWindDeviceCharts';
import { Icon, Button, Switch } from 'antd';
import { Link } from 'react-router-dom';
import DeviceSelect from '../../../Common/DeviceSelect/index';
import path from '../../../../constants/path';
import moment from 'moment';
const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;

class SingleDeviceContainer extends Component {
  static propTypes = {
    getSingleDeviceCurveList: PropTypes.func,
    downLoadFile: PropTypes.func,
    getDeviceInfo: PropTypes.func,
    getwinddistributionchart: PropTypes.func,
    getSingleDeviceCurveData: PropTypes.func,
    getsequencechart: PropTypes.func,
    getpowerspeedchart: PropTypes.func,
    changeSingleDeviceStore: PropTypes.func,
    getpitchanglespeedchart: PropTypes.func,
    getRoseChart: PropTypes.func,
    correct: PropTypes.number,
    stationCode: PropTypes.string,
    match: PropTypes.object,
    deviceFullCode: PropTypes.array,
    stations: PropTypes.array,
    deviceShowType: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    airDensity: PropTypes.string,
    selectDeviceFullCode: PropTypes.array,
    deviceInfo: PropTypes.object,
  }

  componentDidMount() {
    const { stationCode, deviceFullCode, time } = this.props.match.params;
    const { changeSingleDeviceStore } = this.props;
    this.props.getDeviceInfo({ // 风电设备类型下的设备编号
      deviceFullcode: deviceFullCode,
    });
    const startTime = time ? time.split('~')[0] : '';
    const endTime = time ? time.split('~')[1] : '';
    const singleDeviceFullCode = deviceFullCode ? [deviceFullCode] : [];
    const params = { stationCode, deviceFullCode: singleDeviceFullCode, startTime: moment(startTime).utc().format(), endTime: moment(endTime).utc().format() };
    if (endTime === moment().format('YYYY-MM-DD')) {
      const curDay = moment().format('YYYY-MM-DD');
      params.endTime = moment(curDay).utc().format();
    }
    changeSingleDeviceStore({
      ...params,
    });
    this.props.getRoseChart({ ...params, deviceFullCode });
    this.props.getwinddistributionchart({ ...params, deviceFullCode });
    this.queryGraphData({ ...params });
  }
  componentWillReceiveProps(nextProp) {
    const { stationCode, deviceFullCode } = nextProp;
    const { time } = nextProp.match.params;
    const { time: preTime } = this.props.match.params;
    const startTime = time ? time.split('~')[0] : '';
    const endTime = time ? time.split('~')[1] : '';
    const params = { stationCode, deviceFullCode, startTime: moment(startTime).utc().format(), endTime: moment(endTime).utc().format() };
    if (time !== preTime) {
      this.props.changeSingleDeviceStore({
        ...params,
      });
      this.props.getRoseChart({ ...params, deviceFullCode: deviceFullCode[0] });
      this.props.getwinddistributionchart({ ...params, deviceFullCode: deviceFullCode[0] });
      this.queryGraphData({ ...params });
    }
    if (deviceFullCode && deviceFullCode.length) {
      const preLength = (this.props.deviceFullCode && this.props.deviceFullCode.length) ? this.props.deviceFullCode.length : 0;
      const curLength = deviceFullCode && deviceFullCode.length;
      (preLength !== curLength) && this.queryGraphData(params);
      deviceFullCode.find(e => !this.props.deviceFullCode.includes(e)) && this.queryGraphData(params);
    }
  }
  onOk = (selectdevice) => {
    const deviceFullCode = [this.props.match.params.deviceFullCode].concat(selectdevice.map((e, i) => (e.deviceCode)));
    this.props.changeSingleDeviceStore({
      deviceFullCode,
      selectDeviceFullCode: selectdevice,
    });
  }

  onSwitchChange = (checked) => {
    const tableFullCode = this.props.match.params.deviceFullCode;
    const { stationCode, deviceFullCode, startTime, endTime, pageNum, pageSize } = this.props;
    const params = { stationCode, deviceFullCode, startTime, endTime, pageNum, pageSize };
    this.props.changeSingleDeviceStore({ correct: checked ? 1 : 0 });

    this.props.getSingleDeviceCurveList({ ...params, deviceFullCode: tableFullCode, pageNum, pageSize, correct: checked ? 1 : 0 });
  }
  onChangeFilter = (value) => {
    const { stationCode, deviceFullCode, startTime, endTime } = this.props;
    const params = { stationCode, deviceFullCode, startTime, endTime };
    this.queryGraphData({ ...params, ...value });
  }
  queryGraphData = (value) => {
    const tabledeviceFullCode = this.props.match.params.deviceFullCode;
    const { stationCode, deviceFullCode, startTime, endTime, correct, pageNum, pageSize } = this.props;
    const params = { stationCode, deviceFullCode, startTime, endTime };
    this.props.getSingleDeviceCurveData({ ...params, correct, ...value });
    this.props.getsequencechart({ ...params, ...value });
    this.props.getpowerspeedchart({ ...params, ...value });
    this.props.getpitchanglespeedchart({ ...params, ...value });
    this.props.getSingleDeviceCurveList({ ...params, ...value, deviceFullCode: tabledeviceFullCode, pageNum, pageSize, correct });
  }
  selectShowType = (type) => { // 切换图表展示类型 'graph'图 / 'list'表格
    const { changeSingleDeviceStore } = this.props;
    changeSingleDeviceStore({ deviceShowType: type });
  }
  showChart = () => {
    this.selectShowType('graph');
  }
  showList = () => {
    this.selectShowType('list');
  }
  exportList = () => {
    const url = `${APIBasePath}${monitor.exportPowerdevice}`;
    const deviceFullCode = this.props.match.params.deviceFullCode;
    let { startTime, endTime } = this.props;
    const { stationCode, stations, downLoadFile } = this.props;
    startTime = moment(startTime).utc().format();
    endTime = moment(endTime).utc().format();
    const timeZone = moment().utcOffset();
    const stationInfo = stations.filter((e, i) => e.stationCode)[0];
    downLoadFile({ // 
      url,
      fileName: `${stationInfo.stationName}-${startTime}-${endTime}功率曲线.xlsx`,
      params: {
        stationCode,
        deviceFullCode: [deviceFullCode],
        startTime,
        endTime,
        timeZone: timeZone / 60,
      },
    });
  }
  render() {
    const singleStation = this.props.match.params.stationCode;
    const disabledDevice = this.props.match.params.deviceFullCode;
    const time = this.props.match.params.time;
    const beginTime = time ? time.split('~')[0] : '';
    const overTime = time ? time.split('~')[1] : '';
    const { stations, deviceShowType, stationCode, airDensity, selectDeviceFullCode, deviceInfo } = this.props;
    const deviceTypeCode = 101;
    const stationInfo = stations ? stations.filter(e => (e.stationCode === +singleStation))[0] : {};
    const pathAllDevice = '#/monitor/powercurve';
    return (
      <div className={styles.singleDevice}>
        <div className={styles.headerStyle}>
          <div className={styles.left}>
            <div className={styles.singleInfo}>电站名称:{stationInfo && stationInfo.regionName}-{stationInfo && stationInfo.stationName}</div>
            <div className={styles.singleInfo}>设备名称:{deviceInfo.deviceName}</div>
            <div className={styles.singleInfo}>时间:{moment(beginTime).format('YYYY/MM/DD')}~{moment(overTime).format('YYYY/MM/DD')}</div>
            {deviceShowType === 'graph' && <div className={styles.singleInfo}>增加对比设备:
            <DeviceSelect
                disabled={stationInfo ? false : true}
                stationCode={+stationCode}
                deviceTypeCode={deviceTypeCode}
                style={{ width: 'auto', minWidth: '198px' }}
                onOK={this.onOk}
                max={2}
                disabledDevice={[disabledDevice]}
                multiple={true}
                deviceShowNumber={true}
                value={selectDeviceFullCode}
                holderText={'请选择风机'}
              />

            </div>}
            {deviceShowType === 'list' && <div>
              <Switch onChange={this.onSwitchChange} />空气密度校验
           </div>}
          </div>
          <div className={styles.right}>
            <a href={pathAllDevice} >
              <Icon type="arrow-left" className={styles.backIcon} />
            </a>
          </div>

        </div>
        <div className={styles.showType}>
          <div className={styles.tabIcons}>
            <Icon onClick={this.showChart} type="bar-chart" className={deviceShowType === 'graph' ? styles.active : styles.normal} />
            <Icon onClick={this.showList} type="bars" className={deviceShowType === 'list' ? styles.active : styles.normal} />
          </div>
          {deviceShowType === 'list' && <Button onClick={this.exportList} className={styles.exportStyle}>导出</Button>}
          {deviceShowType === 'graph' && <div className={styles.rightInfo}>现场空气密度:{(airDensity || airDensity === 0) ? airDensity : '--'}kg/m³</div>}
        </div>
        {deviceShowType === 'graph' ? <SingleWindDeviceCharts {...this.props} onChangeFilter={this.onChangeFilter} /> : <WindSingleDeviceTable {...this.props} onChangeFilter={this.onChangeFilter} />}

      </div>

    );
  }
}
export default (SingleDeviceContainer);
