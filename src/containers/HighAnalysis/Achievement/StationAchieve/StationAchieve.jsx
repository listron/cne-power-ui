import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import StationSearch from '../../../../components/HighAnalysis/Achievement/StationAchieve/StationSearch';
import AnimationBox from '../../../../components/HighAnalysis/Achievement/StationAchieve/AnimationBox';
import LostAnalysis from '../../../../components/HighAnalysis/Achievement/StationAchieve/LostAnalysis/LostAnalysis';
import StopAnalysis from '../../../../components/HighAnalysis/Achievement/StationAchieve/StopAnalysis/StopAnalysis';
import CurveAnalysis from '../../../../components/HighAnalysis/Achievement/StationAchieve/PowerCurve/CurveAnalysis';
import { stationAchieveAction } from './stationAchieveReducer';
import searchUtil from '../../../../utils/searchUtil';
import styles from './station.scss';

class StationAchieve extends Component {

  static propTypes = {
    pageName: PropTypes.string,
    lostChartTimeMode: PropTypes.string,
    stopChartTimeMode: PropTypes.string,
    lostStringify: PropTypes.string,
    stopTopStringify: PropTypes.string,
    curveTopStringify: PropTypes.string,
    location: PropTypes.object,
    history: PropTypes.object,
    areaStation: PropTypes.array,
    modeDevices: PropTypes.array,
    quotaInfo: PropTypes.array,
    changeStore: PropTypes.func,
    getDevices: PropTypes.func,
    resetLost: PropTypes.func,
    getLostRank: PropTypes.func,
    getLostTrend: PropTypes.func,
    getLostTypes: PropTypes.func,
    resetStop: PropTypes.func,
    getStopElec: PropTypes.func,
    getStopRank: PropTypes.func,
    getStopTrend: PropTypes.func,
    getStopTypes: PropTypes.func,
    resetCurve: PropTypes.func,
    getCurveDevices: PropTypes.func,
    getCurveDevicesAep: PropTypes.func,
    getCurveDevicesPsd: PropTypes.func,
    getCurveMonths: PropTypes.func,
    getCurveMonthAep: PropTypes.func,
    getCurveMonthPsd: PropTypes.func,
  }

  // 数据获取方式: 
  // f5刷新 => 有路径, 无reducer数据 => 路径数据重新写入reducer并发起对应的页面请求 didmount
  // 别的页面带参数进入该页面 => 有路径 路径参数写入reducer并发起对应请求 didmount
  // 别的页面不带参数直接点击目录处进入页面 => 无路径 等待数据得到后, 自动写入默认项, 当默认项齐全后, 发送页面请求 willprops
  constructor(props){
    super(props);
    const { search } = props.location;
    const stationInfoStr = searchUtil(search).getValue('station') || '';
    const {
      stationCodes = [],
      deviceFullcodes = [],
      startTime = moment().subtract(1, 'year').format('YYYY-MM-DD'),
      endTime = moment().format('YYYY-MM-DD'),
      quota,
    } = stationInfoStr ? this.getSearchParam(stationInfoStr) : {};
    this.state = {
      stationInfoStr,
      searchCode: stationCodes[0] || null,
      searchDevice: deviceFullcodes,
      searchDates: [startTime, endTime],
      searchQuota: quota,
    };
  }

  componentDidMount() {
    const { stationInfoStr } = this.state;
    if (stationInfoStr) { // 有路径信息的didmount => 必然处于损失页面.
      const params = this.getSearchParam(stationInfoStr);
      this.props.changeStore({ lostStringify: stationInfoStr });
      this.props.getDevices({ stationCode: params.stationCodes[0] });
      this.pageQuery(stationInfoStr, 'lost');
    }
  }

  componentWillReceiveProps(nextProps){
    const { areaStation, modeDevices, pageName, quotaInfo, location } = nextProps;
    const { stationInfoStr, searchCode, searchDevice, searchQuota } = this.state;
    const { search } = location;
    const newSearchPath = searchUtil(search).getValue('station') || '';
    const prePageName = this.props.pageName;
    if (areaStation.length > 0 && !stationInfoStr && !searchCode) { // 电站数据获得 => 存默认电站并发起设备请求.
      const { stations = [] } = areaStation[0] || {};
      const firstStation = stations[0] || {};
      this.setState({ searchCode: firstStation.stationCode });
      this.props.getDevices({ stationCode: firstStation.stationCode });
    }
    if (modeDevices.length > 0 && !stationInfoStr && searchDevice.length === 0) { // 设备数据获得 => 存默认设备,若已有指标,发起路径变化
      const selectedDevice = [];
      modeDevices.forEach(e => {
        const { children = [] } = e || {};
        children.forEach(m => {
          selectedDevice.push(m.value);
        });
      });
      this.setState({ searchDevice: selectedDevice });
      if(quotaInfo.length > 0) { // 路径自动变化
        this.historyChange(searchCode, selectedDevice, undefined, searchQuota);
      }
    }
    if (quotaInfo.length > 0 && !stationInfoStr && !searchQuota) { // 得到指标 => 存选中
      const firstType = quotaInfo[0] || {};
      const quotas = firstType.children || [];
      let selectedQuota;
      if(quotas.length > 0){
        selectedQuota = quotas[0] || {};
      } else {
        selectedQuota = firstType;
      }
      this.setState({ searchQuota: selectedQuota.value });
      searchDevice.length > 0 && this.historyChange(searchCode, searchDevice, undefined, selectedQuota.value);
    }
    if (newSearchPath !== stationInfoStr) { // 页面路径发生变化 => 直接重新请求当前模块的所有图表数据, 并重置页面内选中信息。
      const params = this.getSearchParam(newSearchPath);
      this.setState({
        stationInfoStr: newSearchPath,
        searchCode: params.stationCodes[0],
        searchDevice: params.deviceFullcodes,
        searchDates: [params.startTime, params.endTime],
        searchQuota: params.indicatorCode,
      });
      this.pageQuery(newSearchPath, pageName);
    }
    if (prePageName !== pageName) { // 页面tabs切换 => 未请求过 或切换但路径数据出现变化 => 重新请求并重置页面信息。
      const { lostStringify, stopTopStringify, curveTopStringify } = this.props;
      const needQuery = (pageName === 'lost' && lostStringify !== newSearchPath)
        || (pageName === 'stop' && stopTopStringify !== newSearchPath)
        || (pageName === 'curve' && curveTopStringify !== newSearchPath);
      needQuery && this.pageQuery(newSearchPath, pageName);
    }
  }

  getAllDeviceCodes = (modeDevices = []) => { // 解析所有设备得到codes数组
    const codes = [];
    modeDevices.forEach(e => {
      const { children = [] } = e || {};
      children.forEach(m => {
        codes.push(m.value);
      });
    });
    return codes;
  }

  getSearchParam = (infoStr) => {
    let searchParam = {};
    try {
      searchParam = JSON.parse(infoStr);
    } catch(err){ null; }
    const { code, device = [], date = [], quota } = searchParam;
    return {
      stationCodes: [code],
      deviceFullcodes: device || [],
      startTime: date[0],
      endTime: date[1],
      indicatorCode: quota,
    };
  }

  getQuota = (quotaList = [], quotaCode) => {
    let selectedQuota = {};
    quotaList.find(e => {
      const { value, children = [] } = e || {};
      if (children.length > 0) {
        return children.find(m => {
          m.value === quotaCode && (selectedQuota = { ...m });
          return m.value === quotaCode;
        });
      }
      value === quotaCode && (selectedQuota = { ...e });
      return value === quotaCode;
    });
    return selectedQuota;
  }

  historyChange = (code, device = [], date = [
    moment().subtract(1, 'year').format('YYYY-MM-DD'),
    moment().format('YYYY-MM-DD'),
  ], quota) => { // 切换路径 => 托管外部进行请求
    const { location, history } = this.props;
    const { search } = location;
    const newSearch = searchUtil(search).replace({station: JSON.stringify({
      code, device, date, quota,
    })}).stringify();
    history.push(`/analysis/achievement/analysis/station?${newSearch}`);
  }

  pageQuery = (infoStr, page) => { // 请求某个tab页下所有数据, 讲清空选中项信息。
    const params = this.getSearchParam(infoStr);
    if (page === 'lost') {
      this.props.resetLost({ lostStringify: infoStr });
      this.props.getLostRank({ ...params });
      this.props.getLostTrend({ ...params, type: 'month' });
      this.props.getLostTypes({ ...params });
    }
    if (page === 'stop') {
      this.props.resetStop({ stopTopStringify: infoStr });
      this.props.getStopElec({ ...params });
      this.props.getStopRank({ ...params });
      this.props.getStopTrend({ ...params, type: 'month' });
      this.props.getStopTypes({ ...params });
    }
    if (page === 'curve') {
      const { stationCodes, deviceFullcodes, startTime, endTime } = params;
      const curveStartTime = moment(startTime).format('YYYY-MM');
      const defaultDevice = deviceFullcodes[0];
      const rangeMonths = this.getAllMonths(startTime, endTime);
      const monthParam = {
        stationCodes,
        startTime: curveStartTime,
        endTime: moment(endTime).format('YYYY-MM'),
        deviceFullcodes: defaultDevice ? [defaultDevice] : [],
      };
      const deviceParam = {
        stationCodes,
        deviceFullcodes,
        startTime: curveStartTime,
        endTime: curveStartTime,
      };
      this.props.changeStore({
        curveDeviceFullcode: defaultDevice,
        curveStartTime, // 邻比分析设备选中时间
        curveAllMonths: rangeMonths,
        curveCheckedMonths: rangeMonths,
      });
      this.props.resetCurve({ curveTopStringify: infoStr });
      this.props.getCurveDevices(deviceParam);
      this.props.getCurveDevicesAep(deviceParam);
      this.props.getCurveDevicesPsd(deviceParam);
      this.props.getCurveMonths(monthParam);
      this.props.getCurveMonthAep(monthParam);
      this.props.getCurveMonthPsd(monthParam);
    }
  }

  getAllMonths = (startTime, endTime) => {
    if (moment(startTime).isBefore(endTime, 'day') || moment(startTime).isSame(endTime, 'day')) {
      let configTime = moment(startTime);
      const allMonths = [configTime.format('YYYY-MM')];
      while(configTime.isBefore(endTime, 'M')){
        configTime = configTime.add(1, 'M');
        allMonths.push(configTime.format('YYYY-MM'));
      }
      return allMonths;
    }
    return [];
  }

  render() {
    const { pageName, changeStore } = this.props;
    const { searchCode, searchDevice, searchDates, searchQuota } = this.state;
    return (
      <div className={styles.stationAchieve} >
        <StationSearch
          {...this.props}
          searchCode={searchCode}
          searchDevice={searchDevice}
          searchDates={searchDates}
          searchQuota={searchQuota}
        />
        <AnimationBox changeStore={changeStore} pageName={pageName}>
          <LostAnalysis {...this.props} active={pageName === 'lost'} />
          <StopAnalysis {...this.props} active={pageName === 'stop'} />
          <CurveAnalysis {...this.props} active={pageName === 'curve'} />
        </AnimationBox>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveStation.toJS(),
  areaStation: state.highAanlysisReducer.achieveLayout.get('areaStation').toJS(),
  quotaInfo: state.highAanlysisReducer.achieveLayout.get('quotaInfo').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeStore: payload => dispatch({ type: stationAchieveAction.changeStore, payload }),
  getDevices: payload => dispatch({ type: stationAchieveAction.getDevices, payload }),
  getLostRank: payload => dispatch({ type: stationAchieveAction.getLostRank, payload }),
  getLostTrend: payload => dispatch({ type: stationAchieveAction.getLostTrend, payload }),
  getLostTypes: payload => dispatch({ type: stationAchieveAction.getLostTypes, payload }),

  getStopElec: payload => dispatch({ type: stationAchieveAction.getStopElec, payload }),
  getStopRank: payload => dispatch({ type: stationAchieveAction.getStopRank, payload }),
  getStopTrend: payload => dispatch({ type: stationAchieveAction.getStopTrend, payload }),
  getStopTypes: payload => dispatch({ type: stationAchieveAction.getStopTypes, payload }),

  getCurveDevices: payload => dispatch({ type: stationAchieveAction.getCurveDevices, payload }),
  getCurveDevicesAep: payload => dispatch({ type: stationAchieveAction.getCurveDevicesAep, payload }),
  getCurveDevicesPsd: payload => dispatch({ type: stationAchieveAction.getCurveDevicesPsd, payload }),
  getCurveMonths: payload => dispatch({ type: stationAchieveAction.getCurveMonths, payload }),
  getCurveMonthAep: payload => dispatch({ type: stationAchieveAction.getCurveMonthAep, payload }),
  getCurveMonthPsd: payload => dispatch({ type: stationAchieveAction.getCurveMonthPsd, payload }),

  resetLost: payload => dispatch({ type: stationAchieveAction.resetLost, payload }),
  resetStop: payload => dispatch({ type: stationAchieveAction.resetStop, payload }),
  resetCurve: payload => dispatch({ type: stationAchieveAction.resetCurve, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StationAchieve);

