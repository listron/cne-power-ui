import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import styles from './pvDataRealtime.scss';
import {pvRealtimeAction} from './pvRealtimeReducer';
import {commonAction} from '../../../alphaRedux/commonAction';
import RealtimeSearch from '../../../../components/Monitor/PvDataAnalysis/PvDataRealtime/PvRealtimeSearch';
import RealtimeDataType from '../../../../components/Monitor/PvDataAnalysis/PvDataRealtime/PvRealtimeDataType';
import PointTree from '../../../../components/Monitor/PvDataAnalysis/PvDataRealtime/PvPointTree';
import RealtimeChart from '../../../../components/Monitor/PvDataAnalysis/PvDataRealtime/PvRealtimeChart';
import RealtimeList from '../../../../components/Monitor/PvDataAnalysis/PvDataRealtime/PvRealtimeList';
import Footer from '../../../../components/Common/Footer/index';
import Cookie from 'js-cookie';

class PvDataRealtime extends Component {
  static propTypes = {
    realtimeType: PropTypes.string,
    enterpriseId: PropTypes.string,
    resetRealtimeStore: PropTypes.func,
    getSecendInterval: PropTypes.func,
    stopRealtimeChart: PropTypes.func,
    stopRealtimeList: PropTypes.func,
  };

  componentDidMount() { // 获取数据时间间隔
    const {enterpriseId} = this.props;
    this.props.getSecendInterval({enterpriseId});
  }

  componentWillUnmount() { // 停止定时并重置数据。
    const {stopRealtimeChart, stopRealtimeList, resetRealtimeStore} = this.props;
    stopRealtimeChart();
    stopRealtimeList();
    resetRealtimeStore();
  }

  render() {
    const {realtimeType} = this.props;
    return (
      <div className={styles.dataRealtime}>
        <div className={styles.contentBox}>
          <div className={styles.realtimeContent}>
            <RealtimeSearch {...this.props} />
            <div className={styles.dataContent}>
              <RealtimeDataType {...this.props} />
              <div className={styles.dataCenter}>
                <PointTree {...this.props} />
                {realtimeType === 'chart' && <RealtimeChart {...this.props} />}
                {realtimeType === 'list' && <RealtimeList {...this.props} />}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.monitor.pvDataRealtime.toJS(),
  stations: state.common.get('stations').toJS(),
  stationTypeCount: state.common.get('stationTypeCount'),
  enterpriseId: Cookie.get('enterpriseId'),
});

const mapDispatchToProps = (dispatch) => ({
  changeRealtimeStore: payload => dispatch({type: pvRealtimeAction.CHANGE_REALTIME_STORE, payload}),
  resetRealtimeStore: payload => dispatch({type: pvRealtimeAction.RESET_REALTIME, payload}),
  getPointInfo: payload => dispatch({type: pvRealtimeAction.getPointInfo, payload}),
  getRealtimeChart: payload => dispatch({type: pvRealtimeAction.getRealtimeChart, payload}),
  getRealtimeList: payload => dispatch({type: pvRealtimeAction.getRealtimeList, payload}),
  stopRealtimeChart: () => dispatch({type: pvRealtimeAction.stopRealtimeChart}),
  stopRealtimeList: () => dispatch({type: pvRealtimeAction.stopRealtimeList}),
  getSecendInterval: payload => dispatch({type: pvRealtimeAction.getSecendInterval, payload}),
  getAvailableDeviceType: payload => dispatch({type: pvRealtimeAction.getAvailableDeviceType, payload}),
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile,
    payload: {
      ...payload,
      actionName: pvRealtimeAction.CHANGE_REALTIME_STORE,
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PvDataRealtime);
