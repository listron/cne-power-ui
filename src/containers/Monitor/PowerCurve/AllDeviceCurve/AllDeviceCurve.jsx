import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from './allDeviceCurve.scss';
import { connect } from "react-redux";
import { allDeviceCurveAction } from './allDeviceCurveAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import Header from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import AllDeviceCurveBox from '../../../../components/Monitor/PowerCurve/AllDevice/AllDeviceCurve';

class AllDeviceCurve extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const breadCrumbData = {
      breadData: [
        {
          name: '功率曲线',
        }
      ],
    };
    return (
      <div className={styles.allDeviceCurve} >
        <Header {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.allDeviceCurveBox}>
          <AllDeviceCurveBox {...this.props} />
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.monitor.allDeviceCurveReducer.toJS(),
    stations: state.common.get('stations').toJS(),
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeAllDeviceStore: payload => dispatch({ type: allDeviceCurveAction.changeAllDeviceStore, payload }),
  getStationDeviceTypes: params => dispatch({
    type: commonAction.getStationDeviceTypes,
    payload: {
      params, 
      deviceTypeAction: allDeviceCurveAction.GET_ALLDEVICECURVE_SUCCESS,
      resultName: 'stationDeviceTypes'
    }
  }),
  getAllDeviceCurveData:payload => dispatch({ type: allDeviceCurveAction.getAllDeviceCurveData, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(AllDeviceCurve)