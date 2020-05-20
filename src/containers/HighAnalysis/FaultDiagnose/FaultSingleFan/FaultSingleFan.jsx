import React from 'react';
import PropTypes from 'prop-types';
import styles from './faultSingleFan.scss';
import Footer from '../../../../components/Common/Footer';
import FaultSingleFanMain from '../../../../components/HighAnalysis/FaultDiagnose/FaultSingleFan/FaultSingleFan';
import {faultSingleFanAction} from './faultSingleFanAction';
import {connect} from 'react-redux';
import {faultWarnListAction} from '../FaultWarnList/faultWarnListAction';

class FaultSingleFan extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    stations: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    changeSingleFanStore: PropTypes.func,
    changeWarnListStore: PropTypes.func,
    getList: PropTypes.func,
    getFanList: PropTypes.func,
    resetStore: PropTypes.func,
    getFaultInfo: PropTypes.func,
    faultInfo: PropTypes.object,
  };

  componentDidMount() {
    const {
      getFaultInfo,
    } = this.props;
    const stationCode = this.getPortfolioCode();
    // 调用任务详情
    const taskId = localStorage.getItem('taskId');
    // 单风机设备全编码
    const deviceFullcode = localStorage.getItem('deviceFullCode');
    const params = {
      taskId,
      stationCode,
      deviceFullcode,
    };
    getFaultInfo(params);
  }

  componentWillUnmount() {
    const { resetStore } = this.props;
    resetStore();
    // 移除
    localStorage.removeItem('deviceFullName');
  }

  onChangeFilter = (params) => {
    const { changeSingleFanStore } = this.props;
    changeSingleFanStore({
      ...params,
    });
  };

  getPortfolioCode = () => {
    const arr = window.location.href.split('/');
    return arr[arr.length - 1];
  };

  callBackList = () => {
    const {
      history,
      getList,
      changeWarnListStore,
    } = this.props;
    const stationCode = this.getPortfolioCode();
    // 返回列表需要的参数
    const listParams = {
      stationCode: `${stationCode}`,
      pageSize: 10,
      pageNum: 1,
      sortField: 'prediction_date',
      sortMethod: 'desc',
    };
    history.push(`/analysis/faultDiagnose/fanWarn/${stationCode}`);
    changeWarnListStore({
      viewType: 3, //展示列表
    });
    getList(listParams);
  };

  callBackFans = () => {
    const {
      history,
      getFanList,
      changeWarnListStore,
    } = this.props;
    const stationCode = this.getPortfolioCode();
    // 返回列表需要的参数
    const fansParams = {
      stationCode: `${stationCode}`,
    };
    history.push(`/analysis/faultDiagnose/fanWarn/${stationCode}`);
    changeWarnListStore({
      viewType: 2, //展示列表
    });
    getFanList(fansParams);
  };

  callBackHistory = () => {
    const {
      history,
    } = this.props;
    history.push('/analysis/faultDiagnose/historyWarn');
  };

  render() {
    const faultHistory = localStorage.getItem('faultHistory');
    return (
      <div className={styles.faultSingleFan}>
        <div className={styles.singleFanContent}>
          {(!faultHistory || faultHistory === '') && (
            <div className={styles.title}>
              <div>故障预警</div>
              <div className={styles.backFont} onClick={this.callBackList}>返回列表视图</div>
            </div>
          )}
          {faultHistory === '1' && (
            <div className={styles.title}>
              <div>历史预警</div>
              <div className={styles.backFont} onClick={this.callBackHistory}>返回历史预警</div>
            </div>
          )}
          {faultHistory === '2' && (
            <div className={styles.title}>
              <div>故障预警</div>
              <div className={styles.backFont} onClick={this.callBackFans}>返回风机视图</div>
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
  };
};
const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: faultSingleFanAction.resetStore }),
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
  getFanList: payload => dispatch({ type: faultWarnListAction.getFanList, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(FaultSingleFan);
