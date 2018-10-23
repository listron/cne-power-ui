import React, {Component} from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Select,Switch  } from 'antd';
import styles from './performanceAnalysis.scss';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
// import PlanCompletionRate from '../../../../components/StatisticalAnalysis/StationAnalysis/CommonGraph/PlanCompletionRate'; 
import {performanceAnalysisAction} from "./performanceAnalysisAction";

class PerformanceAnalysis extends Component{

  
  constructor(props){
    super(props);
  }

  render(){
    console.log(this.props);
    const {stationCode} = this.props;
    const breadCrumbData = {
        breadData:[
          {
            name:'性能分析'
          }
        ]
    }
    
    return(
      <div className={styles.PerformanceAnalysisContainerBox}> 
        <CommonBreadcrumb {...breadCrumbData} style={{marginLeft:'38px'}}></CommonBreadcrumb>
        <div className={styles.PerformanceAnalysisContainer}>
          <div className={styles.PerformanceAnalysisMain}>
            <div className={styles.performanceSearch}>
              <div className={styles.conditionalQuery}>
                <span className={styles.searchText}>条件查询</span>
                <Select defaultValue="电站名-区域" style={{ width: 200 }} />
                <Select  className={styles.duration} style={{ width: 120 }}>
                  <Option value="today">今天</Option>
                  <Option value="yesterday">昨天</Option>
                  <Option value="last7">最近7天</Option>
                  <Option value="last30">最近30天</Option>
                  <Option value="other">其他时间段</Option>
                </Select>
                <Switch defaultChecked className={styles.switch}/>
                <span className={styles.switchText}>对比周期</span>
              </div>
              <div className={styles.equipmentSelection}>
                <span className={styles.equipmentText}>设备选择</span> 
                <Select defaultValue="逆变器" style={{ width: 200,marginRight:10 }} /> 
                <Select defaultValue="请选择设备型号" style={{ width: 200,marginRight:10 }} /> 
                <Select defaultValue="请选择集电线路" style={{ width: 200,marginRight:10 }} /> 
              </div>
            </div>
            <div className={styles.chart}>
              {/* <PlanCompletionRate /> */}
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
    stations:state.common.get('stations'),
  })

const mapDispatchToProps = (dispatch) => ({
  getConversionEfficiency:payload => dispatch({type:performanceAnalysisAction.getConversionEfficiency,payload}),
})

export default connect(mapStateToProps, mapDispatchToProps) (PerformanceAnalysis);