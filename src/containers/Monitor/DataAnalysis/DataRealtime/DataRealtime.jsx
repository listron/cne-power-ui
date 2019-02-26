import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './dataRealtime.scss';
import { Button } from 'antd';
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
  };

  componentDidMount(){ // 获取数据时间间隔
    const { enterpriseId } = this.props;
    this.props.getSecendInterval({ enterpriseId });
  }

  componentWillUnmount() {
    this.props.resetRealtimeStore();
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
  stationTypeCount: state.common.get('stationTypeCount'),
  enterpriseId: Cookie.get('enterpriseId'),
});

const mapDispatchToProps = (dispatch) => ({
  changeRealtimeStore: payload => dispatch({ type: realtimeAction.CHANGE_REALTIME_STORE, payload }),
  resetRealtimeStore: payload => dispatch({ type: realtimeAction.RESET_REALTIME, payload }),
  getPointInfo: payload => dispatch({ type: realtimeAction.getPointInfo, payload }),
  getRealtimeChart: payload => dispatch({ type: realtimeAction.getRealtimeChart, payload }),
  getRealtimeList: payload => dispatch({ type: realtimeAction.getRealtimeList, payload }),
  getSecendInterval: payload => dispatch({ type: realtimeAction.getSecendInterval, payload }),
  getStationDeviceTypes: params => dispatch({
    type: commonAction.getStationDeviceTypes,
    payload: {
      params, 
      deviceTypeAction: realtimeAction.GET_REALTIME_SUCCESS,
      resultName: 'stationDeviceTypes'
    }
  }),
  downLoadFile: payload => dispatch({ type: commonAction.downLoadFile, payload })
});

export default connect(mapStateToProps, mapDispatchToProps)(DataRealtime);
