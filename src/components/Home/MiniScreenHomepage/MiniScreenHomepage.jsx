import React, { Component } from 'react';
import HomepageTop from './HomepageTop';
import StationGeneral from './HomeParts/StationGeneral';
import MonthGenChart from './HomeParts/MonthGenChart';
import OutputPower from './HomeParts/OutputPower';
import DeviceStatus from './HomeParts/DeviceStatus';
import EqpHours from './HomeParts/EqpHours';
import FaultList from './HomeParts/FaultList';
import AlarmList from './HomeParts/AlarmList';
import CenterMap from './CenterMap';
import styles from './miniScreen.scss';
import PropTypes from 'prop-types';

class FullHomepage extends Component {

  static propTypes = {
    username: PropTypes.string,
    userFullName: PropTypes.string,
    userLogo: PropTypes.string,
    enterpriseId: PropTypes.string,
    mapStation: PropTypes.array,
    realTimeInfo: PropTypes.object,
    completeRate: PropTypes.object,
    energySaving: PropTypes.object,
    operationInfo: PropTypes.object,
    changeLoginStore: PropTypes.func,
    homepageReset: PropTypes.func,
    getMapStation: PropTypes.func,
    getRealTimeData: PropTypes.func,
    getCompleteRate: PropTypes.func,
    getEnergySaving: PropTypes.func,
    monthPower: PropTypes.array,
    getMonthPower: PropTypes.func,
    getEqpHours: PropTypes.func,
    getFaultNumber: PropTypes.func,
    getSingleStation: PropTypes.func,
    alarmList: PropTypes.array,
    getAlarmList: PropTypes.func,
    getOutputDiagram: PropTypes.func,
    getOperationInfo: PropTypes.func,
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
    this.props.getCompleteRate({ enterpriseId });
    this.props.getEnergySaving({ enterpriseId });
    this.props.getMonthPower({ enterpriseId, stationType });
    this.props.getEqpHours({ enterpriseId, stationType });
    this.props.getFaultNumber({ enterpriseId, stationType });
    this.props.getAlarmList({ enterpriseId });
    this.props.getOutputDiagram({ enterpriseId, stationType });
    this.props.getOperationInfo({ enterpriseId });
  }

  render() {
    const {
      changeLoginStore, enterpriseId, username, userFullName, userLogo, resetCommonStore,
      realTimeInfo, // 10s实时数据 
      energySaving,
      getMonthPower, monthPower, // 各月发电
      resetMonitorData,
    } = this.props;
    const { hasMultipleType } = this.state;
    return (
      <div id="homepage" className={styles.homepage}>
        <HomepageTop
          changeLoginStore={changeLoginStore}
          realTimeInfo={realTimeInfo}
          energySaving={energySaving}
          resetMonitorData={resetMonitorData}
          resetCommonStore={resetCommonStore}
          username={username}
          userFullName={userFullName}
          userLogo={userLogo}
        />
        <div className={styles.innerContent} id="homepageContent">
          <div className={styles.middleBox}>
            <div className={styles.leftInfo}>
              <StationGeneral hasMultipleType={hasMultipleType} realTimeInfo={realTimeInfo} />
              <MonthGenChart
                monthPower={monthPower}
                getMonthPower={getMonthPower}
                enterpriseId={enterpriseId}
                hasMultipleType={hasMultipleType}
              />
            </div>
            <div className={styles.mapInfo}>
              <CenterMap {...this.props} />
            </div>
            <div className={styles.rightInfo}>
              <OutputPower hasMultipleType={hasMultipleType} {...this.props} />
              <DeviceStatus hasMultipleType={hasMultipleType} realTimeInfo={realTimeInfo} />
            </div>
          </div>
          <div className={styles.bottomBox}>
            <EqpHours hasMultipleType={hasMultipleType} {...this.props} />
            <FaultList hasMultipleType={hasMultipleType} {...this.props} />
            <AlarmList {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

export default FullHomepage;
