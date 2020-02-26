import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginAction } from '../Login/loginAction';
import { commonAction } from '../alphaRedux/commonAction';
import { homepageAction } from './homepageAction';
import { allStationAction } from '../Monitor/StationMonitor/AllStation/allStationAction';
import Cookie from 'js-cookie';
import axios from 'axios';
import MiniHomepage from '../../components/Home/MiniHomepage/MiniHomepage';
import FullHomepage from '../../components/Home/FullHomepage/FullHomepage';
// import MiniScreenHomepage from '../../components/Home/MiniScreenHomepage/MiniScreenHomepage';

class Homepage extends Component {

  state = {
    homepageType: null,
  }

  componentDidMount(){
    this.getHomepageType();
  }

  getHomepageType = async () => { // 获取主页类型
    const result = await axios.get('/menuBoardRequired.json') || {};
    const { data } = result;
    const { miniHomepageIds, fullScreenHomepageIds } = data || {};
    const enterpriseId = Cookie.get('enterpriseId');
    // fullScreenHomepageIds
    // homepageType: miniTheme-小版另类主题, miniFullScreen-小版一屏版本
    let homepageType = 'normal';
    if (miniHomepageIds.includes(enterpriseId)) { // 小版另类主题
      homepageType = 'miniTheme';
    } else if (fullScreenHomepageIds.includes(enterpriseId)) { // 小版一屏
      homepageType = 'miniFullScreen';
    }
    this.setState({ homepageType });
  }

  render() {
    const { homepageType } = this.state;
    return ( // minipage: 精简版主页, fullpage完全版主页。
      <React.Fragment>
        { homepageType === 'normal' && <FullHomepage {...this.props} />}
        { homepageType === 'miniTheme' && <MiniHomepage {...this.props} />}
        {/* { homepageType === 'miniFullScreen' && <MiniScreenHomepage {...this.props} />} */}
      </React.Fragment>
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
  getUnhandleList: () => dispatch({type: homepageAction.getUnhandleList}),

  resetMonitorData: params => dispatch({ type: allStationAction.resetMonitorData, params }),
  resetCommonStore: params => dispatch({ type: commonAction.resetCommonStore, params }),
});


export default connect(mapStateToProps, mapDispatchToProps)(Homepage);