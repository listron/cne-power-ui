import React from "react";
import PropTypes from "prop-types";
import styles from "./faultAllFan.scss";
import Footer from '../../../../components/Common/Footer';
import FaultAllFanMain from '../../../../components/HighAnalysis/FaultDiagnose/FaultAllFan/FaultAllFan';
import {faultAllFanAction} from "./faultAllFanAction";
import {connect} from "react-redux";
import {commonAction} from "../../../alphaRedux/commonAction";

class FaultAllFan extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    stations: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    changeFaultAllFanStore: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  onChangeFilter = (params) => {
    const { changeFaultAllFanStore } = this.props;
    changeFaultAllFanStore({...params});
  };

  callBackList = () => {
    const {
      history,
      match:{
        params: {
          stationCode
        }
      },
    } = this.props;
    history.push(`/analysis/faultDiagnose/fanWarn/${stationCode}`);
  };

  render() {
    return (
      <div className={styles.faultAllFan}>
        <div className={styles.AllFanContent}>
          <div className={styles.title}>
            <div>故障预警</div>
            <div onClick={this.callBackList}>返回算法模型视图</div>
          </div>
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
  getStationDeviceList: payload => dispatch({ type: faultAllFanAction.getStationDeviceList, payload }),
  getResetTask: payload => dispatch({ type: faultAllFanAction.getResetTask, payload }),
  getFaultInfo: payload => dispatch({ type: faultAllFanAction.getFaultInfo, payload }),
  getFaultReport: payload => dispatch({ type: faultAllFanAction.getFaultReport, payload }),
  getStandAloneList: payload => dispatch({ type: faultAllFanAction.getStandAloneList, payload }),
  getSimilarityList: payload => dispatch({ type: faultAllFanAction.getSimilarityList, payload }),
  getAllFanResultList: payload => dispatch({ type: faultAllFanAction.getAllFanResultList, payload }),
  getTenMinutesBefore: payload => dispatch({ type: faultAllFanAction.getTenMinutesBefore, payload }),
  getTenMinutesAfter: payload => dispatch({ type: faultAllFanAction.getTenMinutesAfter, payload }),
  getTenMinutesDiff: payload => dispatch({ type: faultAllFanAction.getTenMinutesDiff, payload }),
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile,
    payload: {
      ...payload,
      actionName: faultAllFanAction.changeFaultAllFanStore
    }
  })
});
export default connect(mapStateToProps, mapDispatchToProps)(FaultAllFan)
