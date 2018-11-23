import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './powerCurve.scss';
import { powerCurveAction } from './powerCurveAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import PowerCurves from '../../../../components/System/Station/PowerCurve/PowerCurve';

import Footer from '../../../../components/Common/Footer';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';

class PowerCurve extends Component {
  static propTypes = {
   
  }
  constructor(props) {
    super(props);
   
  }
  componentDidMount(){
    const {getPowerList,sortField,sortMethod,pageNum,pageSize,stationCode,deviceModeCode}=this.props
    getPowerList({
      stationCode,
      deviceModeCode,
      sortField,
      sortMethod,
      pageNum,
      pageSize,
     })
  }

  componentWillUnmount(){
   
  }

  
  render() {
    return (
      <div className={styles.powerCurveContainer}>
        <CommonBreadcrumb  breadData={[{name: '功率曲线'}]} style={{ marginLeft: '38px',backgroundColor:'#fff' }} />
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
