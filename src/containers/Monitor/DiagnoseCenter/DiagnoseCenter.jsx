import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './diagnoseCenter.scss';
import { diagnoseCenterAction } from './diagnoseCenterReducer';
import DiagnoseHeaderTabs from '../../../components/Monitor/DiagnoseCenter/EventListPage/DiagnoseHeaderTabs';
import DiagnoseLevelSummry from '../../../components/Monitor/DiagnoseCenter/EventListPage/DiagnoseLevelSummry';
import DiagnoseFilter from '../../../components/Monitor/DiagnoseCenter/EventListPage/DiagnoseFilter';
import DiagnoseList from '../../../components/Monitor/DiagnoseCenter/EventListPage/DiagnoseList';
import EventAnalysisPage from '../../../components/Monitor/DiagnoseCenter/EventAnalysisPage/EventAnalysisPage';
import Footer from '@components/Common/Footer';
import { connect } from 'react-redux';


class DiagnoseCenter extends Component {
  static propTypes = {
    showAnalysisPage: PropTypes.bool,
    getEventstatus: PropTypes.func,
    getEventtypes: PropTypes.func,
    getDiagnoseList: PropTypes.func,
    reset: PropTypes.func,
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

  componentWillUnmount(){
    this.props.reset();
  }

  render() {
    const { sideTranslateX } = this.state;
    return (
      <div className={styles.diagnoseCenter} >
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  stations: state.common.get('stations').toJS(),
  deviceTypes: state.common.get('deviceTypes').toJS(),
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
