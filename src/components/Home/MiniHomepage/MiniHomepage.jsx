import React, { Component } from 'react';
import TopParts from './TopParts';
import ContentParts from './ContentParts';
// import MonthGenChart from '../../components/Home/HomeParts/MonthGenChart';
// import { CompleteRate, OperationInfo } from '../../components/Home/HomeParts/HomeFuncParts';
// import OutputPower from '../../components/Home/HomeParts/OutputPower';
// import DeviceStatus from '../../components/Home/HomeParts/DeviceStatus';
// import EqpHours from '../../components/Home/HomeParts/EqpHours';
// import FaultList from '../../components/Home/HomeParts/FaultList';
// import AlarmList from '../../components/Home/HomeParts/AlarmList';
// import CenterMap from '../../components/Home/CenterMap';
import styles from './miniHome.scss';
// import { loginAction } from '../Login/loginAction';
// import { commonAction } from '../alphaRedux/commonAction';
// import { homepageAction } from './homepageAction';
// import { allStationAction } from '../Monitor/StationMonitor/AllStation/allStationAction';
import PropTypes from 'prop-types';
// import Cookie from 'js-cookie';

export default class MiniHomepage extends Component {

  static propTypes = {
    username: PropTypes.string,
    userLogo: PropTypes.string,
    userFullName: PropTypes.string,
    realTimeInfo: PropTypes.object,
    energySaving: PropTypes.object,
    enterpriseId: PropTypes.string,
    mapStation: PropTypes.array,
    getMapStation: PropTypes.func,
    homepageReset: PropTypes.func,
    getRealTimeData: PropTypes.func,
    getEnergySaving: PropTypes.func,
    getMonthPower: PropTypes.func,
    getOutputDiagram: PropTypes.func,
    getOperationInfo: PropTypes.func,
    changeLoginStore: PropTypes.func,
    resetMonitorData: PropTypes.func,
    resetCommonStore: PropTypes.func,
  }

  state = {
    hasMultipleType: false, // 用户是否有多种类型电站。
  }

  componentDidMount() {
    const { getMapStation, enterpriseId, mapStation } = this.props;
    getMapStation({ enterpriseId }); // 先获取电站信息
    if (mapStation.length > 0) {
      this.gettedStationInfo(mapStation);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { mapStation } = nextProps;
    const preStations = this.props.mapStation;
    if (preStations.length === 0 && mapStation.length > 0) { // 拿到电站信息后，再请求页面数据
      this.gettedStationInfo(mapStation);
    }
  }

  componentWillUnmount(){
    this.clocker && clearTimeout(this.clocker);
    this.props.homepageReset();
  }

  gettedStationInfo = (mapStation) => {
    const stationTypeSet = new Set(mapStation.map(e=>e.stationType));
    this.setState({ hasMultipleType: stationTypeSet.size > 1 });
    const originType = stationTypeSet.has(0) ? 0 : 1;
    this.getOriginData(originType);
    this.getMonitorData();
  }

  getMonitorData = () => { // 10s实时监控
    const { enterpriseId } = this.props;
    this.props.getRealTimeData({ enterpriseId });
    this.clocker = setTimeout(this.getMonitorData, 10 * 1000); // 10s一刷新
  }

  getOriginData = (stationType) => { // 首次获取所有页面内初始数据。
    const { enterpriseId } = this.props;
    this.props.getEnergySaving({ enterpriseId });
    this.props.getMonthPower({ enterpriseId, stationType });
    this.props.getOutputDiagram({ enterpriseId, stationType });
    this.props.getOperationInfo({ enterpriseId });
  }

  render() {
    const { changeLoginStore, resetMonitorData, resetCommonStore } = this.props;
    const { username, userLogo, userFullName, realTimeInfo, energySaving } = this.props;
    return (
      <div className={styles.miniHome}>
        <TopParts
          changeLoginStore = {changeLoginStore}
          resetMonitorData = {resetMonitorData}
          resetCommonStore = {resetCommonStore}
          energySaving = {energySaving}
          realTimeInfo={realTimeInfo}
          username = {username}
          userLogo = {userLogo}
          userFullName = {userFullName}
        />
        <ContentParts {...this.props} />
      </div>
    );
  }
}

