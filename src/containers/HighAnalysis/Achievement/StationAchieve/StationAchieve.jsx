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
    resetStore: PropTypes.func,
  }

  // 数据获取方式: 
  // f5刷新 => 有路径, 无reducer数据 => 路径数据重新写入reducer并发起对应的页面请求 didmount
  // 别的页面带参数进入该页面 => 有路径 路径参数写入reducer并发起对应请求 didmount
  // 别的页面不带参数直接点击目录处进入页面 => 无路径 等待数据得到后, 自动写入默认项, 当默认项齐全后, 发送页面请求 willprops
  // 本页路径参数: station={code:stationCode,device:[deviceCodes],date:[startTime,endTime],quota:quotaCode}
  constructor(props){
    super(props);
    const { search } = props.history.location;
    const stationInfoStr = searchUtil(search).getValue('station') || '';
    const {
      stationCodes = [],
      deviceFullcodes = [],
      startTime = moment().subtract(1, 'year').subtract(2, 'day').format('YYYY-MM-DD'),
      endTime = moment().subtract(2, 'day').format('YYYY-MM-DD'),
      indicatorCode,
    } = stationInfoStr ? this.getSearchParam(stationInfoStr) : {};
    this.state = {
      stationInfoStr,
      searchCode: stationCodes[0] || null,
      searchDevice: deviceFullcodes,
      searchDates: [startTime, endTime],
      searchQuota: indicatorCode,
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
    const preDevices = this.props.modeDevices;
    const { areaStation, modeDevices, pageName, quotaInfo, history } = nextProps;
    const { stationInfoStr, searchCode, searchDevice, searchQuota } = this.state;
    const { search } = history.location;
    const newSearchPath = searchUtil(search).getValue('station') || '';
    const prePageName = this.props.pageName;
    if (areaStation.length > 0 && !searchCode) { // 电站数据获得 => 存默认电站并发起设备请求.
      const { stations = [] } = areaStation[0] || {};
      const firstStation = stations[0] || {};
      this.setState({ searchCode: firstStation.stationCode });
      this.props.getDevices({ stationCode: firstStation.stationCode });
    }
    if (this.getIsDevicesChange(preDevices, modeDevices)) { // 得到设备数据, 存默认设备,若已有指标,发起路径变化
      const selectedDevice = [];
      modeDevices.forEach(e => {
        const { children = [] } = e || {};
        children.forEach(m => {
          selectedDevice.push(m.value);
        });
      });
      this.setState({ searchDevice: selectedDevice });
      // preDevices === 0为初始加载 => 自动切换路径
      // preDevices > 0为切换电站 => 选中默认设备即可
      preDevices.length === 0 && searchQuota && this.historyChange(searchCode, selectedDevice, undefined, searchQuota);
    }
    if (quotaInfo.length > 0 && !searchQuota) { // 得到指标 => 存选中
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

  componentWillUnmount(){
    this.props.resetStore();
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

  getSearchParam = (infoStr) => {
    let searchParam = {};
    try {
      searchParam = JSON.parse(infoStr);
    } catch(err){ console.log(err); }
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

  stationChange = (searchCode) => this.setState({searchCode})

  historyChange = (code, device = [], date = [
    moment().subtract(1, 'year').subtract(2, 'day').format('YYYY-MM-DD'),
    moment().subtract(2, 'day').format('YYYY-MM-DD'),
  ], quota) => { // 切换路径 => 托管外部进行请求
    const { history } = this.props;
    const { search } = history.location;
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
      const curveEndTime = moment(endTime).format('YYYY-MM');
      const defaultDeviceCode = deviceFullcodes[0];
      const rangeMonths = this.getAllMonths(startTime, endTime);
      const defaultDeviceName = this.getDeviceName(defaultDeviceCode);
      const monthParam = {
        stationCodes,
        startTime: moment(startTime).format('YYYY-MM'),
        endTime: curveEndTime,
        deviceFullcodes: defaultDeviceCode ? [defaultDeviceCode] : [],
      };
      const deviceParam = {
        stationCodes,
        deviceFullcodes,
        startTime: curveEndTime,
        endTime: curveEndTime,
      };
      this.props.resetCurve({
        curveDeviceFullcode: defaultDeviceCode,
        curveDeviceName: defaultDeviceName,
        curveDevicesTime: curveEndTime, // 邻比分析设备选中时间
        curveAllMonths: rangeMonths,
        curveCheckedMonths: rangeMonths,
        curveTopStringify: infoStr,
      });
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

  getDeviceName = (deviceCode) => {
    const { modeDevices } = this.props;
    let deviceName = '';
    modeDevices.find(e => {
      const { children = [] } = e || {};
      return children.find(m => {
        const getResultName = m.value === deviceCode;
        getResultName && (deviceName = m.label);
        return getResultName;
      });
    });
    return deviceName;
  }

  render() {
    const { pageName, changeStore } = this.props;
    const { searchCode, searchDevice, searchDates, searchQuota, stationInfoStr } = this.state;
    return (
      <div className={styles.stationAchieve} >
        <StationSearch
          {...this.props}
          searchCode={searchCode}
          searchDevice={searchDevice}
          searchDates={searchDates}
          searchQuota={searchQuota}
          stationInfoStr={stationInfoStr}
          pageQuery={this.pageQuery}
          stationChange={this.stationChange}
        />
        <AnimationBox changeStore={changeStore} pageName={pageName}>
          <LostAnalysis
            {...this.props}
            active={pageName === 'lost'}
            pageQuery={this.pageQuery}
            stationInfoStr={stationInfoStr}
          />
          <StopAnalysis
            {...this.props}
            active={pageName === 'stop'}
            pageQuery={this.pageQuery}
            stationInfoStr={stationInfoStr}
          />
          <CurveAnalysis
            {...this.props}
            active={pageName === 'curve'}
            pageQuery={this.pageQuery}
            stationInfoStr={stationInfoStr}
          />
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
  resetStore: () => dispatch({ type: stationAchieveAction.resetStore }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StationAchieve);

