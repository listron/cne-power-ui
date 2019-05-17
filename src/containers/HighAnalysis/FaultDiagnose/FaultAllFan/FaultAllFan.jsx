import React from "react";
import PropTypes from "prop-types";
import styles from "./faultAllFan.scss";
import Footer from '../../../../components/Common/Footer';
import FaultAllFanMain from '../../../../components/HighAnalysis/FaultDiagnose/FaultAllFan/FaultAllFan';
import {faultAllFanAction} from "./faultAllFanAction";
import {connect} from "react-redux";
import {commonAction} from "../../../alphaRedux/commonAction";
import {algorithmControlAction} from "../AlgorithmControl/algorithmControlAction";

class FaultAllFan extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    stations: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    faultInfo: PropTypes.object,
    changeFaultAllFanStore: PropTypes.func,
    resetStore: PropTypes.func,
    getListView: PropTypes.func,
    getFaultInfo: PropTypes.func,
    changeAlgorithmControlStore: PropTypes.func,
  };

  componentDidMount() {
    const {
      getFaultInfo,
      match: {
        params: {
          stationCode
        }
      }
    } = this.props;
    // 调用任务详情
    const taskId = localStorage.getItem("taskId");
    const params = {
      taskId,
      stationCode,
      deviceFullcode: ""
    };
    getFaultInfo(params)
  }

  componentWillUnmount() {
    const { resetStore } = this.props;
    resetStore();
  }

  onChangeFilter = (params) => {
    const { changeFaultAllFanStore } = this.props;
    changeFaultAllFanStore({...params});
  };

  callBackList = () => {
    const {
      history,
      match: {
        params: {
          stationCode
        }
      },
    } = this.props;
    history.push(`/analysis/faultDiagnose/fanWarn/${stationCode}`);
  };

  callBackAlgorithmControlList = () => {
    const {
      history,
      getListView,
      changeAlgorithmControlStore
    } = this.props;
    const listParams = {
      stationCode:null,
      algorithmIds: [],
      startTime:"",
      endTime:"",
      status:null,
      pageSize:null,
      pageNum:null,
      sortField:"",
      sortMethod:""
    };
    history.push(`/analysis/faultDiagnose/algorithmControl`);
    changeAlgorithmControlStore({
      viewType: "list"
    });
    // 列表
    getListView(listParams);
  };

  render() {
    const faultWarnNum = localStorage.getItem("faultWarnNum");
    return (
      <div className={styles.faultAllFan}>
        <div className={styles.AllFanContent}>
          {(faultWarnNum) ? (
            <div className={styles.title}>
              <div>算法控制台</div>
              <div onClick={this.callBackAlgorithmControlList}>返回算法控制台列表</div>
            </div>
          ) : (
            <div className={styles.title}>
              <div>故障预警</div>
              <div onClick={this.callBackList}>返回算法模型视图</div>
            </div>
          )}
        </div>
        <FaultAllFanMain onChangeFilter={this.onChangeFilter} {...this.props} />
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.highAanlysisReducer.faultAllFan.toJS(),
    stations: state.common.get('stations'),
  }
};
const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: faultAllFanAction.resetStore }),
  changeFaultAllFanStore: payload => dispatch({ type: faultAllFanAction.changeFaultAllFanStore, payload }),
  changeAlgorithmControlStore: payload => dispatch({ type: algorithmControlAction.changeAlgorithmControlStore, payload }),
  getResetTask: payload => dispatch({ type: faultAllFanAction.getResetTask, payload }),
  getFaultInfo: payload => dispatch({ type: faultAllFanAction.getFaultInfo, payload }),
  getFaultReport: payload => dispatch({ type: faultAllFanAction.getFaultReport, payload }),
  getStandAloneList: payload => dispatch({ type: faultAllFanAction.getStandAloneList, payload }),
  getSimilarityList: payload => dispatch({ type: faultAllFanAction.getSimilarityList, payload }),
  getAllFanResultList: payload => dispatch({ type: faultAllFanAction.getAllFanResultList, payload }),
  getTenMinutesBefore: payload => dispatch({ type: faultAllFanAction.getTenMinutesBefore, payload }),
  getTenMinutesAfter: payload => dispatch({ type: faultAllFanAction.getTenMinutesAfter, payload }),
  getTenMinutesDiff: payload => dispatch({ type: faultAllFanAction.getTenMinutesDiff, payload }),
  getListView: payload => dispatch({ type: algorithmControlAction.getListView, payload }),
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile,
    payload: {
      ...payload,
      actionName: faultAllFanAction.changeFaultAllFanStore
    }
  })
});
export default connect(mapStateToProps, mapDispatchToProps)(FaultAllFan)
