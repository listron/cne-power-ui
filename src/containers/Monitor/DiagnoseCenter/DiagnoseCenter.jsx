import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './diagnoseCenter.scss';
import { diagnoseCenterAction } from './diagnoseCenterReducer';
import DiagnoseHeaderTabs from '../../../components/Monitor/DiagnoseCenter/EventListPage/DiagnoseHeaderTabs';
import DiagnoseLevelSummry from '../../../components/Monitor/DiagnoseCenter/EventListPage/DiagnoseLevelSummry';
import Footer from '@components/Common/Footer';
import { connect } from 'react-redux';


class DiagnoseCenter extends Component {
  static propTypes = {
    showAnalysisPage: PropTypes.bool,
    getEventstatus: PropTypes.func,
    getEventtypes: PropTypes.func,
    getDiagnoseList: PropTypes.func,
  }

  state = {
    sideTranslateX: 'translateX(100%)',
  }

  componentDidMount(){
    this.props.getEventstatus();
    this.props.getEventtypes({ eventType: 1 });
    this.props.getEventtypes({ eventType: 2 });
    this.props.getEventtypes({ eventType: 3 });
    this.props.getDiagnoseList({});
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

  render() {
    const { sideTranslateX } = this.state;
    return (
      <div className={styles.diagnoseCenter} >
        <div className={styles.diagnoseListPage}>
          <DiagnoseHeaderTabs {...this.props} />
          <div className={styles.listPageContent}>
            <DiagnoseLevelSummry {...this.props} />
            {/* <DiagnoseFilter {...this.props} /> */}
            <div>筛选</div>
            <div>表格</div>
            <button onClick={() => this.props.changeStore({ showAnalysisPage: true })}>侧边栏展示</button>
          </div>
          <Footer className={styles.footer} />
        </div>
        <div className={styles.diagnoseSidePage} style={{ transform: sideTranslateX }}>
          <div>侧边页面顶部</div>
          <div>侧边分析页面基本描述</div>
          <div>侧边图表信息展示</div>
          <button onClick={() => this.props.changeStore({ showAnalysisPage: false })}>返回主页面</button>
          <Footer className={styles.footer} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  stations: state.common.stations,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(DiagnoseCenter);
