import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from './singleDeviceCurve.scss';
import { connect } from "react-redux";
import { singleDeviceCurveAction } from './singleDeviceCurveAction';
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
    ...state.monitor.singleDeviceCurveReducer.toJS(),
    stations: state.common.get('stations').toJS(),
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeSingleDeviceStore: payload => dispatch({ type: singleDeviceCurveAction.changeSingleDeviceStore, payload }),
 
  getSingleDeviceCurveData:payload => dispatch({ type: singleDeviceCurveAction.getSingleDeviceCurveData, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(AllDeviceCurve)