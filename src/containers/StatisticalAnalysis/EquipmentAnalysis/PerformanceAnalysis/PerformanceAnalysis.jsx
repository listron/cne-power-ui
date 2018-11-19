import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { commonAction } from '../../../alphaRedux/commonAction';
import styles from './performanceAnalysis.scss';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import PerformanceAnalysisFilter from '../../../../components/StatisticalAnalysis/EquipmentAnalysis/PerformanceAnalysis/PerformanceAnalysisFilter';
import Footer from '../../../../components/Common/Footer';
// import PlanCompletionRate from '../../../../components/StatisticalAnalysis/StationAnalysis/CommonGraph/PlanCompletionRate'; 
import { performanceAnalysisAction } from "./performanceAnalysisAction";
import { Tabs } from 'antd';

// import TimeSelect from '../../../../components/Common/TimeSelect/TimeSelectIndex';


class PerformanceAnalysis extends Component {
  static propTypes = {
    
    changePerformanceAnalysisStore: PropTypes.func,
    targetTabs:PropTypes.string,
  }
  constructor(props) {
    super(props); 
  }
  componentDidMount(){
    const prams={
      stationCode:360,
      startDate:'2017',
      endDate:'2018',
      deviceTypeCode:'206'
    }
    this.props.getPerformance({...prams})
    this.props.getFault({...prams})
    this.props.getPerformanceContrast({...prams})
    this.props.getFaultContrast({...prams})


  }
  queryData=(activeKey)=>{
   
    this.props.changePerformanceAnalysisStore({targetTabs:activeKey})
  }
  render() {
  
    const TabPane = Tabs.TabPane;
    const breadCrumbData = {
      breadData: [
        {
          name: '性能分析'
        }
      ]
    }

    return (
      <div className={styles.PerformanceAnalysisContainerBox}>
        <CommonBreadcrumb {...breadCrumbData} style={{ marginLeft: '38px' }}></CommonBreadcrumb>
        {/*   <TimeSelect onChange={(time)=>console.log(time)} /> */}
        <div className={styles.PerformanceAnalysisContainer}>
          <div className={styles.PerformanceAnalysisMain}>
          <PerformanceAnalysisFilter {...this.props} />
          <div className={styles.targetTabs}>
          <Tabs activeKey={this.props.targetTabs} onChange={this.queryData} animated={false} >
          <TabPane tab="发电性能" key="1">发电性能</TabPane>
          <TabPane tab="故障情况" key="2">故障情况</TabPane>       
        </Tabs>
        </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.statisticalAnalysisReducer.performanceAnalysisReducer.toJS(),
  stations: state.common.get('stations').toJS(),
  stationDeviceTypes: state.common.get('stationDeviceTypes').toJS(),
})

const mapDispatchToProps = (dispatch) => ({
  changePerformanceAnalysisStore: payload => dispatch({ type: performanceAnalysisAction.CHANGE_PERFORMANCEANALYSIS_STORE, payload }),
  getEquipmentSelection: payload => dispatch({ type: performanceAnalysisAction.getEquipmentSelection, payload }),
  getEleLineCode: payload => dispatch({ type: performanceAnalysisAction.getEleLineCode, payload }),
  getPerformance: payload => dispatch({ type: performanceAnalysisAction.getPerformance, payload }),
  getFault: payload => dispatch({ type: performanceAnalysisAction.getFault, payload }),
  getPerformanceContrast: payload => dispatch({ type: performanceAnalysisAction.getPerformanceContrast, payload }),
  getFaultContrast: payload => dispatch({ type: performanceAnalysisAction.getFaultContrast, payload }),
  getStationDeviceType: payload => dispatch({ type: commonAction.getStationDeviceType, payload }),

})

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceAnalysis);