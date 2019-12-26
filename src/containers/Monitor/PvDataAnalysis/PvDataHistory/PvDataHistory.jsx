import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import styles from './pvDataHistory.scss';
import {pvHistoryAction} from './pvHistoryReducer';
import {commonAction} from '../../../alphaRedux/commonAction';
import PvHistorySearch from '../../../../components/Monitor/PvDataAnalysis/PvDataHistory/PvHistorySearch';
import PvPointTree from '../../../../components/Monitor/PvDataAnalysis/PvDataHistory/PvPointTree';
import PvHistoryChart from '../../../../components/Monitor/PvDataAnalysis/PvDataHistory/PvHistoryChart';
import PvHistoryList from '../../../../components/Monitor/PvDataAnalysis/PvDataHistory/PvHistoryList';
import Footer from '../../../../components/Common/Footer/index';
import Cookie from 'js-cookie';

class PvDataHistory extends Component {
  static propTypes = {
    historyType: PropTypes.string,
    enterpriseId: PropTypes.string,
    resetHistoryStore: PropTypes.func,
    getSecendInterval: PropTypes.func,
  };

  componentDidMount() { // 获取数据时间间隔
    const {enterpriseId, getSecendInterval} = this.props;
    getSecendInterval({enterpriseId});
  }

  componentWillUnmount() {
    this.props.resetHistoryStore();
  }

  render() {
    const {historyType} = this.props;
    return (
      <div className={styles.dataHistory}>
        <div className={styles.contentBox}>
          <div className={styles.historyContent}>
            <PvHistorySearch {...this.props} />
            <div className={styles.dataCenter}>
              <PvPointTree {...this.props} />
              {historyType === 'chart' && <PvHistoryChart {...this.props} />}
              {historyType === 'list' && <PvHistoryList {...this.props} />}
            </div>
          </div>
          <Footer/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.monitor.pvDataHistory.toJS(),
  stations: state.common.get('stations').toJS(),
  filterDevices: state.common.get('filterDevices').toJS(),
  stationTypeCount: state.common.get('stationTypeCount'),
  enterpriseId: Cookie.get('enterpriseId'),
});

const mapDispatchToProps = (dispatch) => ({
  changeHistoryStore: payload => dispatch({type: pvHistoryAction.CHANGE_HISTORY_STORE, payload}),
  resetHistoryStore: payload => dispatch({type: pvHistoryAction.RESET_HISTORY, payload}),
  getPointInfo: payload => dispatch({type: pvHistoryAction.getPointInfo, payload}),
  getChartHistory: payload => dispatch({type: pvHistoryAction.getChartHistory, payload}),
  getListHistory: payload => dispatch({type: pvHistoryAction.getListHistory, payload}),
  getSecendInterval: payload => dispatch({type: pvHistoryAction.getSecendInterval, payload}),
  getAvailableDeviceType: payload => dispatch({type: pvHistoryAction.getAvailableDeviceType, payload}),
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile,
    payload: {
      ...payload,
      actionName: pvHistoryAction.CHANGE_HISTORY_STORE,
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PvDataHistory);
