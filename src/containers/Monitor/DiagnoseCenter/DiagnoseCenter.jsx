import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './diagnoseCenter.scss';
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
    return (
      <div className={styles.diagnoseCenter} >
        诊断中心
      </div>
    );
  }
}

const mapStateToProps = (state) => {};
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DiagnoseCenter);
