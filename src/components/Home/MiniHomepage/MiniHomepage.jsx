import React, { Component } from 'react';
// import { connect } from 'react-redux';
import TopParts from './TopParts';
// import StationGeneral from '../../components/Home/HomeParts/StationGeneral';
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

  static propTypes = {}

  componentDidMount() {
    console.log('now this page has been did mount');
  }

  render() {
    const changeLoginStore = () => {};
    const resetMonitorData = () => {};
    const resetCommonStore = () => {};
    const energySaving = {};
    const username = '阿里';
    const userLogo = 'jkfwejflkew';
    const userFullName = '阿里巴巴';
    return (
      <div className={styles.miniHome}>
        <TopParts
          changeLoginStore = {changeLoginStore}
          resetMonitorData = {resetMonitorData}
          resetCommonStore = {resetCommonStore}
          energySaving = {energySaving}
          username = {username}
          userLogo = {userLogo}
          userFullName = {userFullName}
        />
        这个页面应该是后被渲染的那个。
      </div>
    );
  }
}

