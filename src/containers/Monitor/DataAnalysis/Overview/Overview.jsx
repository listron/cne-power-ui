import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import searchUtil from '@utils/searchUtil';
import { overviewAction } from './overviewReducer';
import { commonAction } from '../../../../containers/alphaRedux/commonAction';
import HearderTab from '@components/Monitor/DataAnalysis/Overview/HeaderTab/HearderTab';
import StationOverview from '@components/Monitor/DataAnalysis/Overview/StationOverview/StationOverview';
import DeviceOverview from '@components/Monitor/DataAnalysis/Overview/DeviceOverview/DeviceOverview';
import CommonBreadcrumb from '@components/Common/CommonBreadcrumb';
import Footer from '@components/Common/Footer/index';
import styles from './overview.scss';

class Overview extends Component{
  static propTypes = {
    history: PropTypes.object,
    changeOverviewStore: PropTypes.func,
    resetOverview: PropTypes.func,
  };

  componentDidMount(){ // 路径有效信息: ?tab=station&pages=staion_device_point&station={...}&device={...}&point={...}
    const { history } = this.props;
    const { search, pathname } = history.location;
    const { tab = '', pages = '' } = searchUtil(search).parse();
    if (tab) { // 刷新页面, 路径信息存入reducer即可
      const allPages = pages.split('_').filter(e => !!e); // 开启的tab页面
      this.props.changeOverviewStore({ tab, pages: allPages });
    } else { // 将默认激活页填入路径
      this.props.changeOverviewStore({
        tab: 'station', // 默认激活的tab => station
        pages: ['station'],
      });
      history.push(`${pathname}?tab=station&pages=station`);
    }
  }

  componentWillUnmount() {
    this.props.resetOverview();
  }

  getSearchTab = () => {
    const { history } = this.props;
    const { search } = history.location;
    const { tab = '' } = searchUtil(search).parse();
    return tab;
  }

  render(){
    const tab = this.getSearchTab()
    return(
      <div className={styles.overview}>
        <CommonBreadcrumb breadData={[{ name: '数据概览' }]} style={{ paddingLeft: '40px' }} />
        <div className={styles.contentBox}>
          <HearderTab {...this.props} />
          <div className={styles.dataOverview}>
            {tab === 'station' && <StationOverview {...this.props} />}
            {tab === 'device' && <DeviceOverview {...this.props} />}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.monitor.overview.toJS(),
  stations: state.common.get('stations').toJS(),
});

const mapDispatchToProps = (dispatch) =>({
  getOverviewStation: payload => dispatch({ type: overviewAction.getOverviewStation, payload }),
  getOverviewDates: payload => dispatch({ type: overviewAction.getOverviewDates, payload }),
  getOverviewDevices: payload => dispatch({ type: overviewAction.getOverviewDevices, payload }),
  // afterDeviceTypePointGet: payload => dispatch({ type: overviewAction.afterDeviceTypePointGet, payload }),
  getOverviewPoints: payload => dispatch({ type: overviewAction.getOverviewPoints, payload }),
  changeOverviewStore: payload => dispatch({ type: overviewAction.changeStore, payload }),
  resetOverview: () => dispatch({ type: overviewAction.reset }),
  getPoints: params => {
    console.log(params);
    dispatch({
      type: commonAction.getPoints,
      payload: {
        ...params,
        actionName: overviewAction[params.actionName || 'changeStore'], // 默认执行changeStore, 此处可选择指定saga函数执行
      },
    })
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
