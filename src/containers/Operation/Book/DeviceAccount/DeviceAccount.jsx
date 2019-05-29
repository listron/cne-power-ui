import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./deviceAccount.scss";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { deviceAccountAction } from './deviceAccountAction';
import { commonAction } from '../../../../containers/alphaRedux/commonAction';
import Footer from '../../../../components/Common/Footer';
import DeviceAccountBox from '../../../../components/Operation/Book/DeviceAccount/DeviceAccountBox';


class DeviceAccount extends Component {
  static propTypes = {
    resetPowerReportStore: PropTypes.func,
    getRegionStationDevice: PropTypes.func,
    getStationDevicemode: PropTypes.func,
    getRegionStation: PropTypes.func,
    getRegion: PropTypes.func,
    changePowerReportStore: PropTypes.func,
    stationTypeCount: PropTypes.string,
    selectStationType: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
  
  }
  componentWillUnmount() {
    
  }
  
  render() {
    const { } = this.props;
    const breadCrumbData = {
      breadData: [
        {
          name: '设备台账',
        }
      ],
    };
    return (
      <div className={styles.containerDiv}>
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.containerBg}>
          <div className={styles.container}>
           
            <DeviceAccountBox />
             
          

          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.monitor.powerReportReducer.toJS(),
    stations: state.common.get('stations').toJS(),
   

  }
}
const mapDispatchToProps = (dispatch) => ({
  changePowerReportStore: payload => dispatch({ type: deviceAccountAction.changePowerReportStore, payload }),
 

})
export default connect(mapStateToProps, mapDispatchToProps)(DeviceAccount)
