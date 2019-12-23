import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import searchUtil from '@utils/searchUtil';
import { overviewAction } from './overviewReducer';
import HearderTab from '@components/Monitor/DataAnalysis/Overview/HeaderTab/HearderTab';
import StationOverview from '@components/Monitor/DataAnalysis/Overview/StationOverview/StationOverview';
import DeviceOverview from '@components/Monitor/DataAnalysis/Overview/DeviceOverview/DeviceOverview';
import PointsOverview from '@components/Monitor/DataAnalysis/Overview/PointsOverview/PointsOverview';
import Footer from '@components/Common/Footer/index';
import styles from './overview.scss';

class Overview extends Component{
  static propTypes = {
    theme: PropTypes.string,
    history: PropTypes.object,
    location: PropTypes.object,
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

  shouldComponentUpdate(nextProps){
    const { location, history } = nextProps;
    const preLocation = this.props.location;
    const { pathname, search } = preLocation;
    const preSearch = preLocation.search;
    if (!location.search && preSearch) { // 点击目录菜单 => 页面维持不改, 路径维持不变。
      history.push(`${pathname}${search}`);
      return false;
    }
    return true;
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
    const tab = this.getSearchTab();
    const { theme } = this.props;
    return(
      <div className={`${styles.overview} ${styles[theme]}`}>
        <div className={styles.contentBox}>
          <HearderTab {...this.props} />
          <div className={styles.dataOverview}>
            {tab === 'station' && <StationOverview {...this.props} />}
            {tab === 'device' && <DeviceOverview {...this.props} />}
            {tab === 'point' && <PointsOverview {...this.props} />}
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
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) =>({
  getOverviewStation: payload => dispatch({ type: overviewAction.getOverviewStation, payload }),
  getOverviewDates: payload => dispatch({ type: overviewAction.getOverviewDates, payload }),
  getOverviewDevices: payload => dispatch({ type: overviewAction.getOverviewDevices, payload }),
  getConnectedDevices: payload => dispatch({ type: overviewAction.getConnectedDevices, payload }),
  getOverviewPoints: payload => dispatch({ type: overviewAction.getOverviewPoints, payload }),
  changeOverviewStore: payload => dispatch({ type: overviewAction.changeStore, payload }),
  resetOverview: () => dispatch({ type: overviewAction.reset }),
  getPoints: params => dispatch({ // 默认执行changeStore, 此处可选择指定saga函数执行
    type: overviewAction.getPointInfo,
    payload: {
      ...params,
      actionName: overviewAction[params.actionName || 'changeStore'],
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
