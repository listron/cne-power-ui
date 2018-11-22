import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './alarmManage.scss';
import { alarmManageAction } from './PowerCurveAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import { stationManageAction } from '../StationManage/stationManageAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer'
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';

class PowerCurve extends Component {
  static propTypes = {
   
  }
  constructor(props) {
    super(props);
   
  }
  componentDidMount(){
    
  }

  componentWillUnmount(){
   
  }

  
  render() {
    return (
      <div className={styles.powerCurveContainer}>
        <CommonBreadcrumb  breadData={[{name: '功率曲线'}]} style={{ marginLeft: '38px',backgroundColor:'#fff' }} />
       
        功率曲线
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  // enterpriseId: Cookie.get('enterpriseId'),
  // ...state.system.alarmManage.toJS(),
  // stations: state.common.get('stations').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  // changeAlarmManageStore: payload => dispatch({type:alarmManageAction.CHANGE_ALARM_MANAGE_STORE_SAGA, payload}),
  // resetStore: () => dispatch({ type: alarmManageAction.resetStore }),
  // getStationDeviceTypes: params => dispatch({
  //   type: commonAction.getStationDeviceTypes,
  //   payload: {
  //     params, 
  //     deviceTypeAction: alarmManageAction.GET_ALARM_MANAGE_FETCH_SUCCESS,
  //     resultName: 'stationDeviceTypes'
  //   }
  // }),
  // getDeviceModel: params => dispatch({
  //   type: commonAction.getDeviceModel,
  //   payload: {
  //     params, 
  //     actionName: alarmManageAction.GET_ALARM_MANAGE_FETCH_SUCCESS,
  //     resultName: 'deviceModels'
  //   }
  // }),
});



export default connect(mapStateToProps, mapDispatchToProps)(PowerCurve);
