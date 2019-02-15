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

class DataHistory extends Component {
  static propTypes = {
    stationCode: PropTypes.number,
    deviceTypeCode: PropTypes.number,
    deviceCodes: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    pointCodes: PropTypes.array, // 选中的测点
    timeSpace:  PropTypes.string,
    historyType:  PropTypes.string,
    
    stationDeviceTypes: PropTypes.array, // 电站下可选设备类型
    pointInfo: PropTypes.array, // 选中设备内可选测点信息。
    allHistory: PropTypes.array, // chart图 - 所有历史数据
    partHistory: PropTypes.array, // 表格内 - 分页后的历史数据

    changeHistoryStore: PropTypes.func,
    resetHistoryStore: PropTypes.func,
  };


  componentWillUnmount() {
    this.props.resetHistoryStore();
  }

  render() {
    return (
      <div className={styles.dataHistory}>
        <CommonBreadcrumb breadData={[{ name: '历史趋势' }]} />
        <div className={styles.historyContent} >
          <HistorySearch {...this.props} />
          <HistoryDataType {...this.props} />
          <div>
            <PointTree />
            <HistoryChart />
            <HistoryList />
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
});

const mapDispatchToProps = (dispatch) => ({
  changeHistoryStore: payload => dispatch({ type: historyAction.CHANGE_HISTORY_STORE, payload }),
  resetHistoryStore: payload => dispatch({ type: historyAction.RESET_HISTORY, payload }),
  getPointInfo: payload => dispatch({ type: historyAction.getPointInfo, payload }),
  getHistory: payload => dispatch({ type: historyAction.getHistory, payload }),
  getStationDeviceTypes: params => dispatch({
    type: commonAction.getStationDeviceTypes,
    payload: {
      params, 
      deviceTypeAction: historyAction.GET_HISTORY_SUCCESS,
      resultName: 'stationDeviceTypes'
    }
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataHistory);
