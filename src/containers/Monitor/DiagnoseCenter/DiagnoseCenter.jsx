import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './diagnoseCenter.scss';
import { diagnoseCenterAction } from './diagnoseCenterReducer';
import DiagnoseHeaderTabs from '../../../components/Monitor/DiagnoseCenter/DiagnoseHeaderTabs';
import { connect } from 'react-redux';


class DiagnoseCenter extends Component {
  static propTypes = {
    getEventstatus: PropTypes.func,
  }

  componentDidMount(){
    this.props.getEventstatus();
  }

  render() {
    console.log(this.props);
    return (
      <div className={styles.diagnoseCenter} >
        <DiagnoseHeaderTabs {...this.props} />
        <div>顶部tabs</div>
        <div>中间统计</div>
        <div>筛选</div>
        <div>表格</div>
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
