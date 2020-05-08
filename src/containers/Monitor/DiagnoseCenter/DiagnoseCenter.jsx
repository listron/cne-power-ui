import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './diagnoseCenter.scss';
import { diagnoseCenterAction } from './diagnoseCenterReducer';
import { commonAction } from '@containers/alphaRedux/commonAction';
import DiagnoseHeaderTabs from '../../../components/Monitor/DiagnoseCenter/EventListPage/DiagnoseHeaderTabs';
import DiagnoseLevelSummry from '../../../components/Monitor/DiagnoseCenter/EventListPage/DiagnoseLevelSummry';
import DiagnoseFilter from '../../../components/Monitor/DiagnoseCenter/EventListPage/DiagnoseFilter';
import DiagnoseList from '../../../components/Monitor/DiagnoseCenter/EventListPage/DiagnoseList';
import EventAnalysisPage from '../../../components/Monitor/DiagnoseCenter/EventAnalysisPage/EventAnalysisPage';
import EamRegisterDetail from '../../../components/Monitor/DiagnoseCenter/EamRegisterDetail/EamRegisterDetail';
import Footer from '@components/Common/Footer';
import searchUtil from '@utils/searchUtil';
import { connect } from 'react-redux';


class DiagnoseCenter extends Component {
  static propTypes = {
    showAnalysisPage: PropTypes.bool,
    showEamPage: PropTypes.bool,
    history: PropTypes.object,
    getEventstatus: PropTypes.func,
    getEventtypes: PropTypes.func,
    circlingQueryList: PropTypes.func,
    stopCircleQueryList: PropTypes.func,
    getEventsAnalysis: PropTypes.func,
    reset: PropTypes.func,
    changeStore: PropTypes.func,
    getDiagnoseList: PropTypes.func,
  }
  constructor(props){
    super(props);
    const { history } = props;
    const { location } = history || {};
    const { search } = location || {};
    const pathInfo = searchUtil(search).parse() || {}; // 路径解析
    let sideTranslateX = 'translateX(100%)';
    if (pathInfo.diagWarningId){
      sideTranslateX = 'translateX(0%)';
    }
    this.state = { sideTranslateX };
  }

  componentDidMount(){
    const { history } = this.props;
    const { location } = history;
    const { search } = location;
    const pathInfo = searchUtil(search).parse() || {}; // 路径解析
    if (pathInfo.diagWarningId) { // 由外界手动控制直接进入分析页
      this.pathToAnalysis({ ...pathInfo, fromPath: true });
    } else { // 默认
      this.props.circlingQueryList({}); // 以默认参数启动告警中心数据请求;
    }
    this.props.getEventstatus();
    this.props.getEventtypes({ eventType: 1 });
    this.props.getEventtypes({ eventType: 2 });
    this.props.getEventtypes({ eventType: 3 });
  }

  componentWillReceiveProps(nextProps){
    const { showAnalysisPage } = nextProps;
    const preAnalysis = this.props.showAnalysisPage;
    if (!preAnalysis && showAnalysisPage ) { // 主页到侧边页
      this.setState({ sideTranslateX: 'translateX(0%)' });
    }
    if (preAnalysis && !showAnalysisPage) { // 侧边页回主页
      this.setState({ sideTranslateX: 'translateX(100%)' });
    }
  }

  componentWillUnmount(){
    this.props.stopCircleQueryList(); // 停止定时请求
    this.props.reset();
  }

  pathToAnalysis = (pathInfo = {}) => {
    this.props.changeStore({
      fromOutside: pathInfo.fromOutside === 'eam', // 从eam系统外部跳入 => 若是, 应屏蔽内部所有可跳转内容
      showAnalysisPage: true,
      analysisPageLoading: true,
    });
    this.setState({ sideTranslateX: 'translateX(100%)' });
    // { diagWarningId, deviceFullcode }
    this.props.getEventsAnalysis({ ...pathInfo });
  }

  render() {
    const { sideTranslateX } = this.state;
    const { showEamPage } = this.props;
    return (
      <React.Fragment>
        {showEamPage ? <EamRegisterDetail {...this.props} /> : <div className={styles.diagnoseCenter} >
          <div className={styles.diagnoseListPage}>
            <DiagnoseHeaderTabs {...this.props} />
            <div className={styles.listPageContent}>
              <DiagnoseLevelSummry {...this.props} />
              <DiagnoseFilter {...this.props} />
              <DiagnoseList {...this.props} />
            </div>
            <Footer className={styles.footer} />
          </div>
          <div className={styles.diagnoseSidePage} style={{ transform: sideTranslateX }}>
            <EventAnalysisPage {...this.props} />
            <Footer className={styles.footer} />
          </div>
        </div>}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  stations: state.common.get('stations').toJS(),
  deviceTypes: state.common.get('deviceTypes').toJS(),
  stationDeviceTypes: [],
  ...state.monitor.diagnoseCenter,
});
const mapDispatchToProps = (dispatch) => ({
  reset: () => dispatch({ type: diagnoseCenterAction.reset }),
  changeStore: payload => dispatch({ type: diagnoseCenterAction.changeStore, payload }),
  getEventstatus: () => dispatch({ type: diagnoseCenterAction.getEventstatus }),
  getEventtypes: payload => dispatch({ type: diagnoseCenterAction.getEventtypes, payload }),
  getDiagnoseList: payload => dispatch({ type: diagnoseCenterAction.getDiagnoseList, payload }),
  circlingQueryList: payload => dispatch({ type: diagnoseCenterAction.circlingQueryList, payload }),
  stopCircleQueryList: payload => dispatch({ type: diagnoseCenterAction.stopCircleQueryList, payload }),
  getEventsAnalysis: payload => dispatch({ type: diagnoseCenterAction.getEventsAnalysis, payload }),
  getLinkageList: payload => dispatch({ type: diagnoseCenterAction.getLinkageList, payload }),
  getEamDiagList: payload => dispatch({ type: diagnoseCenterAction.getEamDiagList, payload }),
  getEamFaultDetails: payload => dispatch({ type: diagnoseCenterAction.getEamFaultDetails, payload }),
  getEamDefectDetails: payload => dispatch({ type: diagnoseCenterAction.getEamDefectDetails, payload }),
  getEamRegisterWaring: payload => dispatch({ type: diagnoseCenterAction.getEamRegisterWaring, payload }),
  getStationDeviceTypes: params => dispatch({
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: diagnoseCenterAction.fetchSuccess,
      resultName: 'stationDeviceTypes', //不能用deviceTypes， 因为deviceTypes 在站不限的时候用
    },
  }),
  editEventsStatus: payload => dispatch({ type: diagnoseCenterAction.editEventsStatus, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DiagnoseCenter);
