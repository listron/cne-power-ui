import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './diagnoseCenter.scss';
import { diagnoseCenterAction } from './diagnoseCenterReducer';
import { connect } from 'react-redux';


class DiagnoseCenter extends Component {
  static propTypes = {
    // startTime: PropTypes.string,
    // deviceShowType: PropTypes.string,
    // endTime: PropTypes.string,
    // stationCode: PropTypes.number,
    // changeAllDeviceStore: PropTypes.func,
    // getDeviceModel: PropTypes.func,
    // getAllDeviceCurveData: PropTypes.func,
    // getPowerdeviceList: PropTypes.func,
    // resetAllDeviceCurve: PropTypes.func,
  }

  render() {
    console.log(this.props);
    return (
      <div className={styles.diagnoseCenter} >
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
});

export default connect(mapStateToProps, mapDispatchToProps)(DiagnoseCenter);
