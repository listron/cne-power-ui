import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomepageTop from '../../components/Home/HomepageTop';
import StationGeneral from '../../components/Home/HomeParts/StationGeneral';
import MonthGenChart from '../../components/Home/HomeParts/MonthGenChart';
import { CompleteRate, OperationInfo } from '../../components/Home/HomeParts/HomeFuncParts';
import OutputPower from '../../components/Home/HomeParts/OutputPower';
import DeviceStatus from '../../components/Home/HomeParts/DeviceStatus';
import EqpHours from '../../components/Home/HomeParts/EqpHours';
import FaultList from '../../components/Home/HomeParts/FaultList';
import AlarmList from '../../components/Home/HomeParts/AlarmList';
import CenterMap from '../../components/Home/CenterMap';
import styles from './homepage.scss';
import { loginAction } from '../Login/loginAction';
import { commonAction } from '../alphaRedux/commonAction';
import { homepageAction } from './homepageAction';
import { allStationAction } from '../Monitor/StationMonitor/AllStation/allStationAction';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';

class Homepage extends Component {

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

  constructor(props){
    super(props);
    this.state = {
      hasMultipleType: false, // 用户是否有多种类型电站。
    };
  }

  componentDidMount() {
    const { getMapStation, enterpriseId } = this.props;
    getMapStation({ enterpriseId }); // 先获取电站信息
  }

  componentWillReceiveProps(nextProps) {
    const { mapStation } = nextProps;
    const preStations = this.props.mapStation;
    if (preStations.length === 0 && mapStation.length > 0) { // 拿到电站信息后，再请求页面数据
      const stationTypeSet = new Set(mapStation.map(e=>e.stationType));
      this.setState({ hasMultipleType: stationTypeSet.size > 1 });
      const originType = stationTypeSet.has(0) ? 0 : 1;
      this.getOriginData(originType);
      this.getMonitorData();
    }
  }

  componentWillUnmount(){
    this.clocker && clearTimeout(this.clocker);
    this.props.homepageReset();
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
      mapStation, // 电站地图
      completeRate, energySaving, operationInfo,
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
              <CompleteRate mapStation={mapStation} completeRate={completeRate} />
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
              <OperationInfo operationInfo={operationInfo} />
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

const mapStateToProps = (state) => ({
  ...state.homepage.toJS(),
  enterpriseId: Cookie.get('enterpriseId'),
  username: state.common.get('username'),
  userFullName: state.common.get('userFullName'),
  userLogo: state.common.get('userLogo'),
});

const mapDispatchToProps = (dispatch) => ({
  changeLoginStore: params => dispatch({ type: loginAction.CHANGE_LOGIN_STORE_SAGA, params }),
  changeHomepageStore: payload => dispatch({type: homepageAction.changeHomepageStore, payload}),
  homepageReset: payload => dispatch({type: homepageAction.homepageReset, payload}),

  getRealTimeData: payload => dispatch({type: homepageAction.getRealTimeData, payload}),
  getCompleteRate: payload => dispatch({type: homepageAction.getCompleteRate, payload}),
  getEnergySaving: payload => dispatch({type: homepageAction.getEnergySaving, payload}),
  getMonthPower: payload => dispatch({type: homepageAction.getMonthPower, payload}),
  getEqpHours: payload => dispatch({type: homepageAction.getEqpHours, payload}),
  getFaultNumber: payload => dispatch({type: homepageAction.getFaultNumber, payload}),
  getMapStation: payload => dispatch({type: homepageAction.getMapStation, payload}),
  getSingleStation: payload => dispatch({type: homepageAction.getSingleStation, payload}),
  getAlarmList: payload => dispatch({type: homepageAction.getAlarmList, payload}),
  getOutputDiagram: payload => dispatch({type: homepageAction.getOutputDiagram, payload}),
  getOperationInfo: payload => dispatch({type: homepageAction.getOperationInfo, payload}),

  resetMonitorData: params => dispatch({ type: allStationAction.resetMonitorData, params }),
  resetCommonStore: params => dispatch({ type: commonAction.resetCommonStore, params }),
});


export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
