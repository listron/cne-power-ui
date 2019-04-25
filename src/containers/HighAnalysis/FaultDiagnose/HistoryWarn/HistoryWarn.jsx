import React from "react";
import PropTypes from "prop-types";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import styles from "./historyWarn.scss";
import Footer from '../../../../components/Common/Footer';
import HistoryWarnMain from '../../../../components/HighAnalysis/FaultDiagnose/HistoryWarn/HistoryWarn';
import {connect} from "react-redux";
import { historyWarnAction } from "./historyWarnAction";
import {algorithmControlAction} from "../AlgorithmControl/algorithmControlAction";

class HistoryWarn extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    stationCode: PropTypes.number,
    deviceTypeCode:PropTypes.number,
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
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  onChangeFilter = (params) => {
    console.log(params, "params");
    const {
      getFaultWarnHistory,
      changeHistoryWarnStore,
      selectDeviceCode,
      algorithmModalId,
      createTimeStart,
      createTimeEnd,
      pageSize,
      pageNum,
      sortField,
      sortMethod,
      stationCode
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
      ...params
    };
    /**
     * 因为用的都是用的一个onChangeFilter
     * 电站选择和风机名称不需要改变之后就触发接口
     * 所以要判断如果是这个两个参数都有值
     * stationCode
     * selectDeviceCode
     * */
    if (params.stationCode && params.selectDeviceCode) {
      return getFaultWarnHistory(newParams);
    }
    if (params.stationCode || params.selectDeviceCode) {
      return changeHistoryWarnStore({
        ...params
      });
    }
    return getFaultWarnHistory(newParams);
  };

  render() {
    return (
      <div className={styles.faultWarnList}>
        <CommonBreadcrumb breadData={[{name:'历史预警'}]} style={{marginLeft:'38px'}} />
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
  }
};
const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: historyWarnAction.resetStore }),
  changeHistoryWarnStore: payload => dispatch({ type: historyWarnAction.changeHistoryWarnStore, payload }),
  getFaultWarnHistory: payload => dispatch({ type: historyWarnAction.getFaultWarnHistory, payload }),
  getAlgoOptionList: payload => dispatch({ type: algorithmControlAction.getAlgoOptionList, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(HistoryWarn)
