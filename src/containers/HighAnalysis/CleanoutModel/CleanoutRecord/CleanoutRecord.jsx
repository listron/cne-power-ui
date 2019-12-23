import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './cleanoutRecord.scss';
import { cleanoutRecordAction } from './cleanoutRecordAction';
import Footer from '../../../../components/Common/Footer';
import CleanoutRecordMain from '../../../../components/HighAnalysis/CleanoutModel/CleanoutRecord/CleanoutRecordMain/CleanoutRecordMain';
import CleanoutRecordDetail from '../../../../components/HighAnalysis/CleanoutModel/CleanoutRecord/CleanoutRecordSingleStation/CleanoutRecordDetail';
class CleanoutRecord extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    stationType: PropTypes.string,
    stationName: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    resetStore: PropTypes.func,
    theme: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentWillUnmount() {

  }

  render() {
    const { showPage, theme } = this.props;
    return (
      <div className={`${styles.cleanoutRecordBox} ${styles[theme]}`} >
        <div className={styles.cleanoutRecordContainer}>
          {showPage === 'multiple' ? <CleanoutRecordMain {...this.props} /> : ''}
          {showPage === 'single' ? <CleanoutRecordDetail {...this.props} /> : ''}
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {

  return {
    ...state.highAanlysisReducer.cleanoutRecordReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    theme: state.common.get('theme'),
  };
};
const mapDispatchToProps = (dispatch) => ({
  changeCleanoutRecordStore: payload => dispatch({ type: cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE_SAGA, payload }),
  resetStore: payload => dispatch({ type: cleanoutRecordAction.resetStore, payload }),
  //灰尘的两个图表
  getStationDust: payload => dispatch({ type: cleanoutRecordAction.getStationDust, payload }),
  getMatrixDust: payload => dispatch({ type: cleanoutRecordAction.getMatrixDust, payload }),
  //清洗模型的首页
  getMainList: payload => dispatch({ type: cleanoutRecordAction.getMainList, payload }),
  //清洗模型点击进入单电站清洗详情
  getDetailList: payload => dispatch({ type: cleanoutRecordAction.getDetailList, payload }),
  //加，编辑，获取，删除，清洗计划
  getAddCleanPlan: payload => dispatch({ type: cleanoutRecordAction.getAddCleanPlan, payload }),
  getEditCleanPlan: payload => dispatch({ type: cleanoutRecordAction.getEditCleanPlan, payload }),
  getCleanPlanDetail: payload => dispatch({ type: cleanoutRecordAction.getCleanPlanDetail, payload }),
  deleteCleanPlan: payload => dispatch({ type: cleanoutRecordAction.deleteCleanPlan, payload }),
  //加，编辑，获取，下雨清洗计划
  getAddRainPlan: payload => dispatch({ type: cleanoutRecordAction.getAddRainPlan, payload }),
  getEditRainPlan: payload => dispatch({ type: cleanoutRecordAction.getEditRainPlan, payload }),
  getRainPlanDetail: payload => dispatch({ type: cleanoutRecordAction.getRainPlanDetail, payload }),
  //清洗记录列表，增，编辑，获取，删记录
  getPlanRecordList: payload => dispatch({ type: cleanoutRecordAction.getPlanRecordList, payload }),
  getAddCleanRecord: payload => dispatch({ type: cleanoutRecordAction.getAddCleanRecord, payload }),
  editCleanRecord: payload => dispatch({ type: cleanoutRecordAction.editCleanRecord, payload }),
  getCleanRecordDetail: payload => dispatch({ type: cleanoutRecordAction.getCleanRecordDetail, payload }),
  deleteCleanRecord: payload => dispatch({ type: cleanoutRecordAction.deleteCleanRecord, payload }),
  //获取电站下得方针
  getMatrix: payload => dispatch({ type: cleanoutRecordAction.getMatrix, payload }),


});
export default connect(mapStateToProps, mapDispatchToProps)(CleanoutRecord);





