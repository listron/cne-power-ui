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
    const { location, stopStringify } = this.props;
    const { search } = location;
    const infoStr = searchUtil(search).getValue('stop');
    if (infoStr && !stopStringify) { // 有search路径但无访问记录 初始或刷新进入。
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
  }

  componentWillReceiveProps(nextProps){
    const nextLocation = nextProps.location;
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
    if (!stopStringify && areaStation.length === 0 && nextArea.length > 0) { // 刷新 得到电站数据
      this.propsAreaStationChange(nextArea);
    }
    if (!stopStringify && modeDevices.length === 0 && nextDevices.length > 0) { // 第一次 得到设备信息
      this.propsModeDevicesChange(nextDevices);
    }
  }

  propsAreaStationChange = (areaStation = []) => { // 得到电站信息. => 默认选中第一个。
    const { stations = [] } = areaStation[0] || {};
    const { stationCode } = stations[0] || {};
    this.props.changeStore({ stationCode });
    this.props.getDevices({ stationCode });
  }

  propsModeDevicesChange = (modeDevices) => { // 初始得到电站下设备信息;
    const { stationCode } = this.props;
    const deviceCodes = [];
    modeDevices.forEach(e => {
      const { children = [] } = e || {};
      if (children.length > 0) {
        deviceCodes.push(...children.map(m => m.value));
      }
    });
    this.props.changeStore({ modeDevices, deviceCodes });
    this.historyChange(
      stationCode,
      deviceCodes.join('_'),
      moment().subtract(1, 'year').format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD'),
    );
  }

  historyChange = (code, device, startTime, endTime) => {
    const { location, history } = this.props;
    const { search } = location;
    const newSearch = searchUtil(search).replace({
      stop: JSON.stringify({ code, device, dates: [startTime, endTime] }),
    }).stringify();
    history.push(`/analysis/achievement/analysis/stop?${newSearch}`);
  }

  getQueryParam = (infoStr) => {
    const searchParam = JSON.parse(infoStr) || {};
    const { code, device = '', dates = [] } = searchParam;
    return {
      stationCode: code,
      deviceCodes: device.split('_').filter(e => !!e),
      startTime: dates[0],
      endTime: dates[1],
    };
  }

  onStationChange = ([regionName, stationCode, stationName]) => {
    this.props.changeStore({ stationCode, modeDevices: [] });
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
    this.historyChange(stationCode, deviceCodes.map(e => e.value).join('_'), startTime, endTime);
  }

  queryChart = ({ stationCode, ...rest}) => {
    this.props.getStopStatus({
      ...rest,
      stationCodes: [stationCode],
    });
  }

  render() {
    const { areaStation, stationCode, modeDevices, deviceCodes, startTime, endTime } = this.props;
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
              onChange={this.onDateChange}
              allowClear={false}
              style={{width: '220px'}}
            />
          </div>
          <Button onClick={this.goSearch} className={styles.search}>查询</Button>
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

