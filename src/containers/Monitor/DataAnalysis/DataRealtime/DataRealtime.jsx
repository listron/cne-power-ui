import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './dataRealtime.scss';
import { realtimeAction } from './realtimeReducer';
import { commonAction } from '../../../alphaRedux/commonAction';
import RealtimeSearch from '../../../../components/Monitor/DataAnalysis/DataRealtime/RealtimeSearch';
import RealtimeDataType from '../../../../components/Monitor/DataAnalysis/DataRealtime/RealtimeDataType';
import PointTree from '../../../../components/Monitor/DataAnalysis/DataRealtime/PointTree';
import RealtimeChart from '../../../../components/Monitor/DataAnalysis/DataRealtime/RealtimeChart';
import RealtimeList from '../../../../components/Monitor/DataAnalysis/DataRealtime/RealtimeList';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer/index';
import Cookie from 'js-cookie';

class DataRealtime extends Component {
  static propTypes = {
    realtimeType: PropTypes.string,
    enterpriseId: PropTypes.string,
    resetRealtimeStore: PropTypes.func,
    getSecendInterval: PropTypes.func,
    stopRealtimeChart: PropTypes.func,
    stopRealtimeList: PropTypes.func,
  };

  componentDidMount(){ // 获取数据时间间隔
    const { enterpriseId } = this.props;
    this.props.getSecendInterval({ enterpriseId });
  }

  componentWillUnmount() { // 停止定时并重置数据。
    const { stopRealtimeChart, stopRealtimeList, resetRealtimeStore} = this.props;
    stopRealtimeChart();
    stopRealtimeList();
    resetRealtimeStore();
  }

  render() {
    const { realtimeType } = this.props;
    return (
      <div className={styles.dataRealtime}>
        <CommonBreadcrumb breadData={[{ name: '实时数据' }]} style={{ marginLeft: '40px' }} />
        <div className={styles.contentBox}>
          <div className={styles.realtimeContent} >
            <RealtimeSearch {...this.props} />
            <RealtimeDataType {...this.props} />
            <div className={styles.dataCenter}>
              <PointTree {...this.props} />
              {realtimeType === 'chart' && <RealtimeChart {...this.props} />}
              {realtimeType === 'list' && <RealtimeList {...this.props} />}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.monitor.dataRealtime.toJS(),
  stations: state.common.get('stations').toJS(),
  filterDevices: state.common.get('filterDevices').toJS(),
  stationTypeCount: state.common.get('stationTypeCount'),
  enterpriseId: Cookie.get('enterpriseId'),
});

const mapDispatchToProps = (dispatch) => ({
  changeRealtimeStore: payload => dispatch({ type: realtimeAction.CHANGE_REALTIME_STORE, payload }),
  resetRealtimeStore: payload => dispatch({ type: realtimeAction.RESET_REALTIME, payload }),
  getPointInfo: payload => dispatch({ type: realtimeAction.getPointInfo, payload }),
  getRealtimeChart: payload => dispatch({ type: realtimeAction.getRealtimeChart, payload }),
  getRealtimeList: payload => dispatch({ type: realtimeAction.getRealtimeList, payload }),
  stopRealtimeChart: () => dispatch({ type: realtimeAction.stopRealtimeChart }),
  stopRealtimeList: () => dispatch({ type: realtimeAction.stopRealtimeList }),
  getSecendInterval: payload => dispatch({ type: realtimeAction.getSecendInterval, payload }),
  getAvailableDeviceType: payload => dispatch({ type: realtimeAction.getAvailableDeviceType, payload }),
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile,
    payload: {
      ...payload,
      actionName: realtimeAction.CHANGE_REALTIME_STORE
    }
  })
});

export default connect(mapStateToProps, mapDispatchToProps)(DataRealtime);
