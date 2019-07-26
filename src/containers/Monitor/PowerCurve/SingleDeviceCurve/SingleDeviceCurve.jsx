import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './singleDeviceCurve.scss';
import { connect } from 'react-redux';
import { singleDeviceCurveAction } from './singleDeviceCurveAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import Header from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import SingleDeviceContainer from '../../../../components/Monitor/PowerCurve/SingleDevice/SingleDeviceContainer';

class AllDeviceCurve extends Component {
  static propTypes = {
    resetSingleDeviceCurve: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
  }

  componentWillUnmount() {
    this.props.resetSingleDeviceCurve();
  }
  render() {
    const breadCrumbData = {
      breadData: [
        {
          name: '功率曲线',
        },
      ],
    };
    return (
      <div className={styles.allDeviceCurve} >
        <Header {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.allDeviceCurveBox}>
          <SingleDeviceContainer {...this.props} />
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.monitor.singleDeviceCurveReducer.toJS(),
    stations: state.common.get('stations').toJS(),
  };
};
const mapDispatchToProps = (dispatch) => ({
  getDeviceInfo: payload => dispatch({ type: singleDeviceCurveAction.getDeviceInfo, payload }),
  changeSingleDeviceStore: payload => dispatch({ type: singleDeviceCurveAction.changeSingleDeviceStore, payload }),
  resetSingleDeviceCurve: payload => dispatch({ type: singleDeviceCurveAction.RESET_SINGLEDEVICECURVE, payload }),
  getSingleDeviceCurveData: payload => dispatch({ type: singleDeviceCurveAction.getSingleDeviceCurveData, payload }),
  getSingleDeviceCurveList: payload => dispatch({ type: singleDeviceCurveAction.getSingleDeviceCurveList, payload }),
  getRoseChart: payload => dispatch({ type: singleDeviceCurveAction.getRoseChart, payload }),
  getpowerspeedchart: payload => dispatch({ type: singleDeviceCurveAction.getpowerspeedchart, payload }),
  getpitchanglespeedchart: payload => dispatch({ type: singleDeviceCurveAction.getpitchanglespeedchart, payload }),
  getwinddistributionchart: payload => dispatch({ type: singleDeviceCurveAction.getwinddistributionchart, payload }),
  getsequencechart: payload => dispatch({ type: singleDeviceCurveAction.getsequencechart, payload }),
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile, payload: {
      ...payload,
      actionName: singleDeviceCurveAction.changeSingleDeviceStore,
    },
  }),
});
export default connect(mapStateToProps, mapDispatchToProps)(AllDeviceCurve);
