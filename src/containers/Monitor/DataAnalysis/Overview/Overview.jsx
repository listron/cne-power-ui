import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import searchUtil from '@utils/searchUtil';
import { overviewAction } from './overviewReducer';
import HearderTab from '@components/Monitor/DataAnalysis/Overview/HeaderTab/HearderTab';
import StationList from '@components/Monitor/DataAnalysis/Overview/StationOverview/StationList';
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
    const { search } = this.props.history.location;
    const { tab = '', pages = '', station = '', device = '', point = ''} = searchUtil(search).parse();
    if (tab) { // 刷新 => 重新请求三个页面相关数据, 并存储路径信息映射reducer
      const allPages = pages.split('_').filter(e => !!e); // 开启的tab页面
      this.props.changeOverviewStore({
        tab: '', // 激活的tab页, station, device, points
        pages: allPages,
        stationSearch: station,
        deviceSearch: device,
        pointSearch: point,
      });
    }
  }

  componentWillUnmount() {
    this.props.resetOverview();
  }

  // initQuery(allPages, stationStr, deviceStr, pointStr){
  //   allPages.includes('station') && this.props.getOverviewDates();
  //   allPages.includes('device') && this.props.getOverviewDevices();
  //   allPages.includes('point') && this.props.getOverviewPoints();
  // }

  // jsonStrFormat = (jsonStr = '') => {
  //   let jsonRes = {};
  //   try {
  //     jsonRes = JSON.parse(jsonStr) || {};
  //   } catch(error){ console.log(error); }
  //   return jsonRes;
  // }

  render(){
    // const { scatterDiagramType } = this.props;
    return(
      <div className={styles.overview}>
        <CommonBreadcrumb breadData={[{ name: '数据概览' }]} style={{ paddingLeft: '40px' }} />
        <div className={styles.contentBox}>
          <HearderTab {...this.props} />
          <div className={styles.dataOverview}>
            <StationList {...this.props} />
            数据概览页面
            {/* <ScatterDiagramSearch {...this.props} /> */}
            {/* <ScatterDiagramDataType {...this.props} /> */}
            {/* <div className={styles.dataCenter}>
              {scatterDiagramType === 'chart' && <ScatterDiagramChart {...this.props} />}
              {scatterDiagramType === 'list' && <ScatterDiagramList {...this.props} />}
            </div> */}
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
  getOverviewPoints: payload => dispatch({ type: overviewAction.getOverviewPoints, payload }),
  changeOverviewStore: payload => dispatch({ type: overviewAction.CHANGE_OVERVIEW_STORE, payload }),
  resetOverview: () => dispatch({ type: overviewAction.RESET_OVERVIEW }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
