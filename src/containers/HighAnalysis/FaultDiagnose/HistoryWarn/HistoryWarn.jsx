import React from 'react';
import PropTypes from 'prop-types';
import styles from './historyWarn.scss';
import Footer from '../../../../components/Common/Footer';
import HistoryWarnMain from '../../../../components/HighAnalysis/FaultDiagnose/HistoryWarn/HistoryWarn';
import {connect} from 'react-redux';
import { historyWarnAction } from './historyWarnAction';
import {algorithmControlAction} from '../AlgorithmControl/algorithmControlAction';

class HistoryWarn extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    stationCode: PropTypes.number,
    deviceTypeCode: PropTypes.number,
    getFaultWarnHistory: PropTypes.func,
    changeHistoryWarnStore: PropTypes.func,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    algorithmModalId: PropTypes.array,
    selectDeviceCode: PropTypes.array,
    algorithmModalName: PropTypes.array,
    resetStore: PropTypes.func,
  };

  componentWillUnmount() {
    const { resetStore } = this.props;
    resetStore();
  }

  onChangeFilter = (params) => {
    const {
      getFaultWarnHistory,
      selectDeviceCode,
      algorithmModalId,
      createTimeStart,
      createTimeEnd,
      pageSize,
      pageNum,
      sortField,
      sortMethod,
      stationCode,
      algorithmModalName,
    } = this.props;
    const newParams = {
      stationCode,
      selectDeviceCode,
      algorithmModalId,
      createTimeStart,
      createTimeEnd,
      pageSize,
      pageNum,
      sortField,
      sortMethod,
      algorithmModalName,
      ...params,
    };
    getFaultWarnHistory(newParams);
  };

  render() {
    return (
      <div className={styles.faultWarnList}>
        <div className={styles.faultWarnListContainer}>
          <div className={styles.faultWarnListContent}>
            <HistoryWarnMain onChangeFilter={this.onChangeFilter} {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.highAanlysisReducer.historyWarnReducer.toJS(),
    algoOptionList: state.highAanlysisReducer.algorithm.get('algoOptionList').toJS(),
    stations: state.common.get('stations'),
  };
};
const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: historyWarnAction.resetStore }),
  changeHistoryWarnStore: payload => dispatch({ type: historyWarnAction.changeHistoryWarnStore, payload }),
  getFaultWarnHistory: payload => dispatch({ type: historyWarnAction.getFaultWarnHistory, payload }),
  getAlgoOptionList: payload => dispatch({ type: algorithmControlAction.getAlgoOptionList, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(HistoryWarn);
