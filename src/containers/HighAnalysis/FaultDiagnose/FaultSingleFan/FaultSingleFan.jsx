import React from "react";
import PropTypes from "prop-types";
import styles from "./faultSingleFan.scss";
import Footer from '../../../../components/Common/Footer';
import FaultSingleFanMain from '../../../../components/HighAnalysis/FaultDiagnose/FaultSingleFan/FaultSingleFan';
import {faultSingleFanAction} from "./faultSingleFanAction";
import {connect} from "react-redux";
import {faultWarnListAction} from "../FaultWarnList/faultWarnListAction";


const data = [{
  id: 1,
  name: "叶片结冰预测"
},{
  id: 2,
  name: "叶片结冰预测"
},{
  id: 3,
  name: "叶片结冰预测"
},{
  id: 4,
  name: "叶片结冰预测"
},{
  id: 5,
  name: "叶片结冰预测"
},{
  id: 6,
  name: "叶片结冰预测"
},{
  id: 7,
  name: "叶片结冰预测"
},{
  id: 8,
  name: "叶片结冰预测"
},{
  id: 9,
  name: "叶片结冰预测"
},{
  id: 10,
  name: "叶片结冰预测"
},{
  id: 11,
  name: "叶片结冰预测"
},{
  id: 12,
  name: "叶片结冰预测"
},{
  id: 13,
  name: "叶片结冰预测"
},{
  id: 14,
  name: "叶片结冰预测"
},{
  id: 15,
  name: "叶片结冰预测"
},{
  id: 16,
  name: "叶片结冰预测"
},{
  id: 17,
  name: "叶片结冰预测"
},{
  id: 18,
  name: "叶片结冰预测"
}];
class FaultSingleFan extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    stations: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    changeSingleFanStore: PropTypes.func,
    changeWarnListStore: PropTypes.func,
    getList: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
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
      match:{
        params: {
          stationCode
        }
      },
      getList,
      changeWarnListStore
    } = this.props;
    // 返回列表需要的参数
    const listParams = {
      stationCode,
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

  render() {
    return (
      <div className={styles.faultSingleFan}>
        <div className={styles.singleFanContent}>
          <div className={styles.title}>
            <div>故障预警</div>
            <div onClick={this.callBackList}>返回列表视图</div>
          </div>
        </div>
        <FaultSingleFanMain onChangeFilter={this.onChangeFilter} data={data} {...this.props} />
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
  getStationDeviceList: payload => dispatch({ type: faultSingleFanAction.getStationDeviceList, payload }),
  getStandAloneList: payload => dispatch({ type: faultSingleFanAction.getStandAloneList, payload }),
  getSimilarityList: payload => dispatch({ type: faultSingleFanAction.getSimilarityList, payload }),
  getAllFanResultList: payload => dispatch({ type: faultSingleFanAction.getAllFanResultList, payload }),
  getTenMinutesBefore: payload => dispatch({ type: faultSingleFanAction.getTenMinutesBefore, payload }),
  getTenMinutesAfter: payload => dispatch({ type: faultSingleFanAction.getTenMinutesAfter, payload }),
  getTenMinutesDiff: payload => dispatch({ type: faultSingleFanAction.getTenMinutesDiff, payload }),
  changeSingleFanStore: payload => dispatch({ type: faultSingleFanAction.changeSingleFanStore, payload }),
  changeWarnListStore: payload => dispatch({ type: faultWarnListAction.changeWarnListStore, payload }),
  getList: payload => dispatch({ type: faultWarnListAction.getList, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(FaultSingleFan)
