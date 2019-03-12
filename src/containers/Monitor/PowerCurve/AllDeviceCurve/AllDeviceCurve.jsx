import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from './allDeviceCurve.scss';
import { connect } from "react-redux";
import { Tabs } from 'antd';
import { allDeviceCurveAction } from './allDeviceCurveAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import Header from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import AllDeviceCurveBox from '../../../../components/Monitor/PowerCurve/AllDevice/AllDeviceCurve';
const TabPane = Tabs.TabPane;
class AllDeviceCurve extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  componentWillUnmount(){
    this.props.resetAllDeviceCurve()
  }
  queryTargetData = (activeKey) => {
    this.props.changeAllDeviceStore({ stationTypeTabs: activeKey, deviceShowType: 'graph', });
   
  }
  render() {
    const {stationTypeTabs,stationTypeCount} = this.props;
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
        {stationTypeCount === 'multiple' &&
        <Tabs type="card" activeKey={stationTypeTabs} onChange={this.queryTargetData} tabBarGutter={0} >
          <TabPane tab="风电" key="0"><AllDeviceCurveBox {...this.props} /></TabPane>
          <TabPane tab="光伏" key="1"><AllDeviceCurveBox {...this.props} /></TabPane>
        </Tabs> 
      }
      {stationTypeCount === 'wind' && <AllDeviceCurveBox {...this.props} /> }
      {stationTypeCount === 'pv'&& <AllDeviceCurveBox {...this.props} />}
      {stationTypeCount === 'none'&&""}
        
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
    stationTypeCount: state.common.get('stationTypeCount'),
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeAllDeviceStore: payload => dispatch({ type: allDeviceCurveAction.changeAllDeviceStore, payload }),
  getDeviceModel: params => dispatch({
    type: commonAction.getDeviceModel,
    payload: {
      params, 
      actionName: allDeviceCurveAction.changeAllDeviceStore,
      resultName: 'windDeviceMode'
    }
  }),
  getAllDeviceCurveData:payload => dispatch({ type: allDeviceCurveAction.getAllDeviceCurveData, payload }),
  getPowerdeviceList:payload => dispatch({ type: allDeviceCurveAction.getPowerdeviceList, payload }),
  exportPowerdevice:payload => dispatch({ type: allDeviceCurveAction.exportPowerdevice, payload }),
  resetAllDeviceCurve:payload => dispatch({ type: allDeviceCurveAction.RESET_ALLDEVICECURVE, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(AllDeviceCurve)