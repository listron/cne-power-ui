import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './powerCurve.scss';
import { powerCurveAction } from './powerCurveAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import PowerCurves from '../../../../components/System/Station/PowerCurve/PowerCurve';

import Footer from '../../../../components/Common/Footer';
import PropTypes from 'prop-types';

class PowerCurve extends Component {
  static propTypes = {
    resetStore:PropTypes.func,
  }
  constructor(props) {
    super(props);

 }

 componentWillUnmount() {
  this.props.resetStore()
}


  render() {
    return (
      <div className={styles.powerCurveContainer}>
        <PowerCurves {...this.props} />
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  ...state.system.powerCurve.toJS(),
  stations: state.common.get('stations').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changePowerCurveStore: payload => dispatch({type:powerCurveAction.changePowerCurveStoreSaga, payload}),
  getPowerList: payload => dispatch({type:powerCurveAction.getPowerList, payload}),
  getPowercurveDetail: payload => dispatch({type:powerCurveAction.getPowercurveDetail, payload}),
  downloadCurveExcel: payload => dispatch({type:powerCurveAction.downloadCurveExcel, payload}),
  downloadStandardCurveExcel: payload => dispatch({type:powerCurveAction.downloadStandardCurveExcel, payload}),
  importCurveExcel: payload => dispatch({type:powerCurveAction.importCurveExcel, payload}),
  resetStore: () => dispatch({ type: powerCurveAction.resetStore }),
  getStationDeviceTypes: params => dispatch({
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: powerCurveAction.powerCurveFetchSuccess,
      resultName: 'stationDeviceTypes'
    }
  }),
  getDeviceModel: params => dispatch({
    type: commonAction.getDeviceModel,
    payload: {
      params,
      actionName: powerCurveAction.powerCurveFetchSuccess,
      resultName: 'deviceModels'
    }
  }),
});



export default connect(mapStateToProps, mapDispatchToProps)(PowerCurve);
