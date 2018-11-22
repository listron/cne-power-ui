import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomepageTop from '../../components/Home/HomepageTop';
import StationGeneral from '../../components/Home/HomeParts/StationGeneral';
import MonthGenChart from '../../components/Home/HomeParts/MonthGenChart';
import { CompleteRate, OperationInfo, EnergySaving } from '../../components/Home/HomeParts/HomeFuncParts';
import OutputPower from '../../components/Home/HomeParts/OutputPower';
import DeviceStatus from '../../components/Home/HomeParts/DeviceStatus';
import EqpHours from '../../components/Home/HomeParts/EqpHours';
import FaultList from '../../components/Home/HomeParts/FaultList';
import AlarmList from '../../components/Home/HomeParts/AlarmList';
import CenterMap from '../../components/Home/CenterMap';
import styles from './homepage.scss';
import { loginAction } from '../Login/loginAction';
import { homepageAction } from './homepageAction';
import PropTypes from 'prop-types';

class Homepage extends Component {

  static propTypes = {
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
    getMonthPower: PropTypes.func,
    getEqpHours: PropTypes.func,
    getFaultNumber: PropTypes.func,
    getSingleStation: PropTypes.func,
    getAlarmList: PropTypes.func,
    getOutputDiagram: PropTypes.func,
    getOperationInfo: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      hasMultipleType: false, // 用户是否有多种类型电站。
    }
  }

  componentDidMount(){
    this.props.getMapStation(); // 先获取电站信息
  }

  componentWillReceiveProps(nextProps){
    const { mapStation } = nextProps;
    const preStations = this.props.mapStation;
    if(preStations.length === 0 && mapStation.length > 0){ // 拿到电站信息后，再请求页面数据
      const stationTypeSet = new Set(mapStation.map(e=>e.stationType));
      this.setState({ hasMultipleType: stationTypeSet.size > 1 });
      this.getOriginData();
    }
  }

  componentWillUnmount(){
    this.props.homepageReset();
  }

  getOriginData = () => { // 获取所有页面内数据。
    this.props.getRealTimeData();
    this.props.getCompleteRate();
    this.props.getEnergySaving();
    this.props.getMonthPower();
    this.props.getEqpHours();
    this.props.getFaultNumber();
    this.props.getAlarmList();
    this.props.getOutputDiagram();
    this.props.getOperationInfo();
  }

  render() {
    const { changeLoginStore, realTimeInfo, mapStation, completeRate, energySaving, operationInfo } = this.props;
    const { hasMultipleType } = this.state;
    return (
      <div className={styles.homepage}>
        <HomepageTop changeLoginStore={changeLoginStore} realTimeInfo={realTimeInfo} />
        <div className={styles.innerContent}>
          <div className={styles.middleBox}>
            <div className={styles.leftInfo}>
              <StationGeneral hasMultipleType={hasMultipleType} realTimeInfo={realTimeInfo}  />
              <CompleteRate mapStation={mapStation} completeRate={completeRate} />
              <MonthGenChart {...this.props} />
            </div>
            <div className={styles.mapInfo}>
              <CenterMap {...this.props} />
            </div>
            <div className={styles.rightInfo}>
              <OutputPower hasMultipleType={hasMultipleType} {...this.props} />
              <OperationInfo operationInfo={operationInfo} />
              <DeviceStatus hasMultipleType={hasMultipleType} realTimeInfo={realTimeInfo}  />
            </div>
          </div>
          <div className={styles.bottomBox}>
            <EnergySaving energySaving={energySaving} />
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
});


export default connect(mapStateToProps, mapDispatchToProps)(Homepage);