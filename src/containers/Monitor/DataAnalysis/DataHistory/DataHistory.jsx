import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './dataHistory.scss';
import { historyAction } from './historyReducer';
import { commonAction } from '../../../alphaRedux/commonAction';
import HistorySearch from '../../../../components/Monitor/DataAnalysis/DataHistory/HistorySearch';
import HistoryDataType from '../../../../components/Monitor/DataAnalysis/DataHistory/HistoryDataType';
import PointTree from '../../../../components/Monitor/DataAnalysis/DataHistory/PointTree';
import HistoryChart from '../../../../components/Monitor/DataAnalysis/DataHistory/HistoryChart';
import HistoryList from '../../../../components/Monitor/DataAnalysis/DataHistory/HistoryList';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer/index';
import Cookie from 'js-cookie';

class DataHistory extends Component {
  static propTypes = {
    historyType: PropTypes.string,
    enterpriseId: PropTypes.string,
    resetHistoryStore: PropTypes.func,
    getSecendInterval: PropTypes.func,
  };

  componentDidMount() { // 获取数据时间间隔
    const { enterpriseId, getSecendInterval } = this.props;
    getSecendInterval({ enterpriseId });
  }

  componentWillUnmount() {
    this.props.resetHistoryStore();
  }

  render() {
    const { historyType } = this.props;
    return (
      <div className={styles.dataHistory}>
        <div className={styles.contentBox}>
          <div className={styles.historyContent} >
            <HistorySearch {...this.props} />
            {/* <HistoryDataType {...this.props} /> */}
            <div className={styles.dataCenter}>
              <PointTree {...this.props} />
              {historyType === 'chart' && <HistoryChart {...this.props} />}
              {historyType === 'list' && <HistoryList {...this.props} />}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.monitor.dataHistory.toJS(),
  stations: state.common.get('stations').toJS(),
  filterDevices: state.common.get('filterDevices').toJS(),
  stationTypeCount: state.common.get('stationTypeCount'),
  enterpriseId: Cookie.get('enterpriseId'),
});

const mapDispatchToProps = (dispatch) => ({
  changeHistoryStore: payload => dispatch({ type: historyAction.CHANGE_HISTORY_STORE, payload }),
  resetHistoryStore: payload => dispatch({ type: historyAction.RESET_HISTORY, payload }),
  getPointInfo: payload => dispatch({ type: historyAction.getPointInfo, payload }),
  getChartHistory: payload => dispatch({ type: historyAction.getChartHistory, payload }),
  getListHistory: payload => dispatch({ type: historyAction.getListHistory, payload }),
  getSecendInterval: payload => dispatch({ type: historyAction.getSecendInterval, payload }),
  getAvailableDeviceType: payload => dispatch({ type: historyAction.getAvailableDeviceType, payload }),
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile,
    payload: {
      ...payload,
      actionName: historyAction.CHANGE_HISTORY_STORE,
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataHistory);
