import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import StopStatusChart from '../../../../components/HighAnalysis/Achievement/StopAchieve/StopStatusChart';
import AreaStation from '../../../../components/Common/AreaStation';
import AutoSelect from '../../../../components/Common/AutoSelect';
import { stopStatusAction } from './stopStatusReducer';
import { Button, DatePicker } from 'antd';
import searchUtil from '../../../../utils/searchUtil';
import styles from './stop.scss';
const { RangePicker } = DatePicker;

class StopStatus extends Component {

  static propTypes = {
    stopStringify: PropTypes.string,
    stopStatusLoading: PropTypes.bool,
    location: PropTypes.object,
    history: PropTypes.object,
    areaStation: PropTypes.array,
    modeDevices: PropTypes.array,
    deviceCodes: PropTypes.array,
    stationCode: PropTypes.number,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    getDevices: PropTypes.func,
    changeStore: PropTypes.func,
    getStopStatus: PropTypes.func,
  }

  componentDidMount(){
    const { history, stopStringify, areaStation, modeDevices } = this.props;
    const { search } = history.location;
    const infoStr = searchUtil(search).getValue('stop');
    if (infoStr && infoStr !== stopStringify) { // 有search路径但无访问记录: 刷新或其他页面路径改变进入。
      const { stationCode, deviceCodes, startTime, endTime } = this.getQueryParam(infoStr);
      this.props.changeStore({
        stopStringify: infoStr,
        stationCode,
        deviceCodes,
        startTime,
        endTime,
      });
      this.props.getDevices({ stationCode });
      this.queryChart({ stationCode, deviceCodes, startTime, endTime });
    }
    if (!infoStr && areaStation.length > 0 && modeDevices.length === 0) { // 从别的同级页面初次进入该页面 => code获取保存继续请求后续参数。
      this.propsAreaStationChange(areaStation);
    }
  }

  componentWillReceiveProps(nextProps){
    const nextLocation = nextProps.history.location;
    const nextDevices = nextProps.modeDevices;
    const nextArea = nextProps.areaStation;
    const nextSearch = nextLocation.search || '';
    const { stopStringify, modeDevices, areaStation } = this.props;
    const infoStr = searchUtil(nextSearch).getValue('stop');
    if (infoStr && infoStr !== stopStringify) { // 搜索信息有变
      const { stationCode, deviceCodes, startTime, endTime } = this.getQueryParam(infoStr);
      this.props.changeStore({
        stopStringify: infoStr,
        stationCode,
        deviceCodes,
        startTime,
        endTime,
      });
      this.queryChart({ stationCode, deviceCodes, startTime, endTime });
    }
    if (!infoStr && areaStation.length === 0 && nextArea.length > 0) { // 刷新 得到电站数据
      this.propsAreaStationChange(nextArea);
    }
    if (this.getIsDevicesChange(modeDevices, nextDevices)) { // 得到设备信息
      this.propsModeDevicesChange(modeDevices, nextDevices, infoStr);
    }
  }

  getIsDevicesChange = (pre, cur) => { // 判断设备是否发生改变
    if(pre.length === 0 && cur.length > 0) {
      return true;
    }
    if (pre.length > 0 && cur.length > 0) { // deviceFullCode唯一。进行比较。
      let isDeviceChange = false;
      const preMode = pre[0] || {};
      const preChild = preMode.children || [];
      const preDevice = preChild[0] || {};
      const curMode = cur[0] || {};
      const curChild = curMode.children || [];
      const curDevice = curChild[0] || {};
      (preMode.value !== curMode.value || preDevice.value !== curDevice.value) && (isDeviceChange = true);
      return isDeviceChange;
    }
    return false;
  }

  propsAreaStationChange = (areaStation = []) => { // 得到电站信息. => 默认选中第一个。
    const { stations = [] } = areaStation[0] || {};
    const { stationCode } = stations[0] || {};
    this.props.changeStore({ stationCode });
    this.props.getDevices({ stationCode });
  }

  propsModeDevicesChange = (preDevices, modeDevices, infoStr) => { // 设备信息获取
    const deviceCodes = this.getDevices(modeDevices);
    if (!infoStr && preDevices.length === 0) { // 路径中无设备, 初次得到设备信息(目录跳转)
      // => 所有设备选中deviceCodes, 自动切换路径history, 设备信息存储modeDevices
      const { stationCode } = this.props;
      this.props.changeStore({ modeDevices, deviceCodes });
      this.historyChange(
        stationCode,
        deviceCodes.join('_'),
        moment().subtract(1, 'year').subtract(2, 'day').format('YYYY-MM-DD'),
        moment().subtract(2, 'day').format('YYYY-MM-DD'),
      );
    }
    if (infoStr && preDevices.length === 0) { // 路径中有设备, 初次得到设备信息(F5刷新) => 设备信息存储modeDevices
      this.props.changeStore({ modeDevices });
    }
    if (infoStr && preDevices.length > 0 ) { // 路径中有设备, 用户切换电站 => 设备信息存储modeDevices, 所有设备选中deviceCodes
      this.props.changeStore({ modeDevices, deviceCodes });
    }
  }

  getDevices = (modeInfo = []) => {
    const codes = [];
    modeInfo.forEach(e => {
      const { children = [] } = e || {};
      if (children.length > 0) {
        codes.push(...(children.map(m => m.value)));
      }
    });
    return codes;
  }

  historyChange = (code, device, startTime, endTime) => {
    const { history } = this.props;
    const { search } = history.location;
    const newSearch = searchUtil(search).replace({
      stop: JSON.stringify({ code, device, dates: [startTime, endTime] }),
    }).stringify();
    history.push(`/analysis/achievement/analysis/stop?${newSearch}`);
  }

  getQueryParam = (infoStr) => {
    let searchParam = {}
    try {
      searchParam = JSON.parse(infoStr) || {};
    } catch (err) { null; }
    const { code, device = '', dates = [] } = searchParam;
    return {
      stationCode: code,
      deviceCodes: device.split('_').filter(e => !!e),
      startTime: dates[0],
      endTime: dates[1],
    };
  }

  onStationChange = ([regionName, stationCode, stationName]) => {
    this.props.changeStore({
      stationCode,
      deviceCodes: [],
    });
    this.props.getDevices({ stationCode });
  }

  onDeviceChange = (deviceCodes) => {
    this.props.changeStore({ deviceCodes: deviceCodes.map(e => e.value) });
  }

  onDateChange = (momentInfo, [startTime, endTime]) => {
    this.props.changeStore({ startTime, endTime });
  }

  goSearch = () => { // 查询
    const { stationCode, deviceCodes, startTime, endTime } = this.props;
    this.historyChange(stationCode, deviceCodes.join('_'), startTime, endTime);
  }

  queryChart = ({ stationCode, ...rest}) => {
    this.props.getStopStatus({
      ...rest,
      stationCodes: [stationCode],
    });
  }

  render() {
    const { areaStation, stationCode, modeDevices, deviceCodes, startTime, endTime, stopStatusLoading, stopStringify } = this.props;
    const searchInfoLost = modeDevices.length === 0; // 未选择设备 => 不可查询
    let device = [], dates = [];
    try{
      const stopInfo = JSON.parse(stopStringify);
      device = stopInfo.device.split('_');
      dates = stopInfo.dates;
    } catch(error){ null; } // 任性吞错误，嘎嘎。~
    const deviceChanged = deviceCodes.length !== device.length || deviceCodes.find(e => !device.includes(e));
    const timeChanged = startTime !== dates[0] || endTime !== dates[1];
    const searchForbidden = stopStatusLoading || searchInfoLost || (!timeChanged && !deviceChanged);
    return (
      <div className={styles.stop}>
        <div className={styles.searchPart}>
          <div className={styles.eachParts}>
            <span className={styles.text}>选择电站</span>
            <AreaStation
              data={areaStation}
              value={stationCode ? [stationCode] : []}
              onChange={this.onStationChange}
              mode="station"
            />
          </div>
          <div className={styles.eachParts}>
            <span className={styles.text}>选择设备</span>
            <AutoSelect
              data={modeDevices}
              value={deviceCodes}
              onChange={this.onDeviceChange}
              style={{width: '150px'}}
              maxTagCount={0}
            />
          </div>
          <div className={styles.eachParts}>
            <span className={styles.text}>选择时间</span>
            <RangePicker
              value={[startTime ? moment(startTime) : null, endTime ? moment(endTime) : null]}
              disabledDate={(cur) => moment().subtract(2, 'day').isBefore(cur, 'day')}
              onChange={this.onDateChange}
              allowClear={false}
              style={{width: '220px'}}
            />
          </div>
          <Button
            disabled={searchForbidden}
            onClick={this.goSearch}
            className={styles.search}
            loading={stopStatusLoading}
          >查询</Button>
        </div>
        <StopStatusChart {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveStop.toJS(),
  areaStation: state.highAanlysisReducer.achieveLayout.get('areaStation').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeStore: payload => dispatch({ type: stopStatusAction.changeStore, payload }),
  getDevices: payload => dispatch({ type: stopStatusAction.getDevices, payload }),
  getStopStatus: payload => dispatch({ type: stopStatusAction.getStopStatus, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StopStatus);

