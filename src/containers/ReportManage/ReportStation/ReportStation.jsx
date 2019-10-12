import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './reportStation.scss';
import PropTypes from 'prop-types';
import ReportStationBox from '../../../components/ReportManage/ReportStationBox/ReportStationBox';
import CommonBreadcrumb from '../../../components/Common/CommonBreadcrumb';
import Footer from '../../../components/Common/Footer';
import { reportStationAction } from './reportStationAction';

class ReportStation extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context);
  }
  componentWillUnmount() {
    this.props.resetStore();
  }
  render() {

    return (
      <div className={styles.reportstation} >
        <CommonBreadcrumb breadData={[{ name: '电站报表' }]} style={{ marginLeft: '38px' }} />
        <div className={styles.reportbox}>
          <ReportStationBox {...this.props} />
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.reportManageReducer.reportStationReducer.toJS(),
    stations: state.common.get('stations').toJS(),

  };
};
const mapDispatchToProps = (dispatch) => ({
  changeStore: payload => dispatch({ type: reportStationAction.changeStore, payload }),
  resetStore: payload => dispatch({ type: reportStationAction.resetStore, payload }),
  getReportStationList: payload => dispatch({ type: reportStationAction.getReportStationList, payload }),
  exportReportStationList: payload => dispatch({ type: reportStationAction.exportReportStationList, payload }),


});
export default connect(mapStateToProps, mapDispatchToProps)(ReportStation);
