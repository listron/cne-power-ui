import React from "react";
import PropTypes from "prop-types";
import styles from "./faultSingleFan.scss";
import Footer from '../../../../components/Common/Footer';
import FaultSingleFanMain from '../../../../components/HighAnalysis/FaultDiagnose/FaultSingleFan/FaultSingleFan';
import {faultSingleFanAction} from "./faultSingleFanAction";
import {connect} from "react-redux";
import {faultWarnListAction} from "../FaultWarnList/faultWarnListAction";

class FaultSingleFan extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    stations: PropTypes.object,
    history: PropTypes.object,
    changeSingleFanStore: PropTypes.func,
    changeWarnListStore: PropTypes.func,
    getList: PropTypes.func,
    resetStore: PropTypes.func,
    faultInfo: PropTypes.object,
  };

  componentWillUnmount() {
    const { resetStore } = this.props;
    resetStore();
  }

  onChangeFilter = (params) => {
    const { changeSingleFanStore } = this.props;
    changeSingleFanStore({
      ...params
    });
  };

  callBackList = () => {
    const {
      history,
      faultInfo:{
        stationCode
      },
      getList,
      changeWarnListStore
    } = this.props;
    // 返回列表需要的参数
    const listParams = {
      stationCode: `${stationCode}`,
      pageSize: 10,
      pageNum: 1,
      sortField: "",
      sortMethod: "",
    };
    history.push(`/analysis/faultDiagnose/fanWarn/${stationCode}`);
    changeWarnListStore({
      viewType: 3 //展示列表
    });
    getList(listParams);
  };

  callBackHistory = () => {
    const {
      history
    } = this.props;
    history.push(`/analysis/faultDiagnose/historyWarn`);
  };

  render() {
    const faultHistory = localStorage.getItem("faultHistory");
    return (
      <div className={styles.faultSingleFan}>
        <div className={styles.singleFanContent}>
          {faultHistory === "1" ? (
            <div className={styles.title}>
              <div>历史预警</div>
              <div onClick={this.callBackHistory}>返回历史预警</div>
            </div>
          ): (
            <div className={styles.title}>
              <div>故障预警</div>
              <div onClick={this.callBackList}>返回列表视图</div>
            </div>
          )}
        </div>
        <FaultSingleFanMain onChangeFilter={this.onChangeFilter} {...this.props} />
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.highAanlysisReducer.faultSingleFan.toJS(),
    stations: state.common.get('stations'),
  }
};
const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: faultSingleFanAction.resetStore }),
  getStationDeviceList: () => dispatch({ type: faultSingleFanAction.getStationDeviceList }),
  getStandAloneList: payload => dispatch({ type: faultSingleFanAction.getStandAloneList, payload }),
  getSimilarityList: payload => dispatch({ type: faultSingleFanAction.getSimilarityList, payload }),
  getAllFanResultList: payload => dispatch({ type: faultSingleFanAction.getAllFanResultList, payload }),
  getTenMinutesBefore: payload => dispatch({ type: faultSingleFanAction.getTenMinutesBefore, payload }),
  getTenMinutesAfter: payload => dispatch({ type: faultSingleFanAction.getTenMinutesAfter, payload }),
  getTenMinutesDiff: payload => dispatch({ type: faultSingleFanAction.getTenMinutesDiff, payload }),
  changeSingleFanStore: payload => dispatch({ type: faultSingleFanAction.changeSingleFanStore, payload }),
  changeWarnListStore: payload => dispatch({ type: faultWarnListAction.changeWarnListStore, payload }),
  getFaultInfo: payload => dispatch({ type: faultSingleFanAction.getFaultInfo, payload }),
  getList: payload => dispatch({ type: faultWarnListAction.getList, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(FaultSingleFan)
