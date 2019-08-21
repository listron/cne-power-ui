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
    location: PropTypes.object,
    areaStation: PropTypes.array,
    modeDevices: PropTypes.array,
    changeStore: PropTypes.func,
    getDevices: PropTypes.func,
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
    } = stationInfoStr ? this.getSearchParam : {};
    this.state = {
      stationInfoStr,
      searchCode: stationCodes[0] || null,
      searchDevice: deviceFullcodes,
      searchDates: [startTime, endTime],
      searchQuota: quota,
    };
  }

  componentDidMount() {
    // const { stationInfoStr } = this.state;
    // const { lostChartTimeMode } = this.props;
    // if (stationInfoStr) { // 有路径信息的didmount => 必然处于损失页面.
    //   const params = this.getSearchParam(stationInfoStr);
    //   this.props.changeStore({ lostStringify: stationInfoStr });
    //   this.props.getDevices({ stationCode: params.stationCodes[0] });
    //   this.queryLostPage(params, lostChartTimeMode);
    // }
  }

  componentWillReceiveProps(nextProps){
    // const { areaStation, modeDevices, pageName } = nextProps;
    // const { searchCode, stationInfoStr, searchDevice } = this.state;
    // if (areaStation.length > 0 && !stationInfoStr && !searchCode) { // 电站数据获得 => 无stationInfoStr时, 存默认电站并发起设备请求.
    //   const { stations = [] } = areaStation[0] || {};
    //   const firstStation = stations[0] || {};
    //   this.setState({ searchCode: firstStation.stationCode });
    //   this.props.getDevices({ stationCode: firstStation.stationCode });
    // }
    // if (modeDevices.length > 0 && !stationInfoStr && searchDevice.length === 0) {
    //   // 设备数据获得 => 无stationInfoStr时, 存默认设备, lost页若已得到指标, 发起路径变化; 其余页面直接存入路径变化
    //   const selectedDevice = [];
    //   modeDevices.forEach(e => {
    //     const { children = [] } = e || {};
    //     children.forEach(m => {
    //       selectedDevice.push(m.value);
    //     });
    //   });
    //   this.setState({ searchDevice: selectedDevice });
    //   // 指标? 
    // }
    // 指标数据获得 => 无stationInfoStr时, 存默认指标, lost也若已有设备, 发起路径变化; 其余页面不动
    // 路径变化 => 根据当前页面, 发起对应页面的所有请求
    // pageName变化 => 若路径变化, 则发起页面的所有请求
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
      searchParam = JSON.parse(infoStr)
    } catch(err){ null; }
    return {
      stationCodes: [searchParam.searchCode],
      deviceFullcodes: searchParam.searchDevice || [],
      startTime: searchParam.searchDates[0],
      endTime: searchParam.searchDates[1],
      indicatorCode: searchParam.searchQuota,
    };
  }

  queryLostPage = (params, lostChartTimeMode) => {
    this.props.getLostRank({ ...params });
    this.props.getLostTrend({ ...params, type: lostChartTimeMode });
    this.props.getLostTypes({ ...params });
  }

  queryStopPage = (params, stopChartTimeMode) => {
    this.props.getStopElec({ ...params });
    this.props.getStopRank({ ...params });
    this.props.getStopTrend({ ...params, type: stopChartTimeMode });
    this.props.getStopTypes({ ...params });
  }

  queryCurvePage = ({ stationCodes = [], deviceFullcodes = [], startTime, endTime }) => {
    const curveStartTime = moment(startTime).format('YYYY-MM');
    const defaultDevice = deviceFullcodes[0];
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
    this.props.getCurveDevices(deviceParam);
    this.props.getCurveDevicesAep(deviceParam);
    this.props.getCurveDevicesPsd(deviceParam);
    this.props.getCurveMonths(monthParam);
    this.props.getCurveMonthAep(monthParam);
    this.props.getCurveMonthPsd(monthParam);
  }

  render() {
    const { pageName, changeStore } = this.props;
    return (
      <div className={styles.stationAchieve} >
        <StationSearch {...this.props} />
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
});

export default connect(mapStateToProps, mapDispatchToProps)(StationAchieve);

