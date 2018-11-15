import React, {Component} from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Select,Switch  } from 'antd';
import moment from 'moment';
import styles from './performanceAnalysis.scss';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
// import PlanCompletionRate from '../../../../components/StatisticalAnalysis/StationAnalysis/CommonGraph/PlanCompletionRate'; 
import {performanceAnalysisAction} from "./performanceAnalysisAction";
import { commonAction } from '../../../alphaRedux/commonAction';
import StationSelect from "../../../../components/Common/StationSelect";
// import TimeSelect from '../../../../components/Common/TimeSelect/TimeSelectIndex';
const {Option} = Select;

class PerformanceAnalysis extends Component{

  
  constructor(props){
    super(props);
    this.state = {
      selectStation:[]
    }
  }
  //选择时间
  onChangeDuration = (value) => {
    let startTime,endTime;
    if(value === 'today') {
      startTime = moment().hour(0).minute(0).second(0).utc().format();
      endTime = moment().utc().format();
    } else if(value === 'yesterday') {
      startTime = moment().subtract(1, 'days').hour(0).minute(0).second(0).utc().format();
      endTime = moment().subtract(1, 'days').hour(23).minute(59).second(59).utc().format();
    } else if(value === 'last7') {
      startTime = moment().subtract(7, 'days').hour(0).minute(0).second(0).utc().format();
      endTime = moment().utc().format();
    } else if(value === 'last30') {
      startTime = moment().subtract(30, 'days').hour(0).minute(0).second(0).utc().format();
      endTime = moment().utc().format();
    }
  }


  //选择电站
  stationSelected = (rest) => {
    const stationCodes = rest.map((item, index) => {
      return item.stationCode
    });
    this.setState({
      selectStation:rest,
      stationCodes: stationCodes
    });
  };
  

  //选择设备类型
  selectDeviceType = (value) => {
    const {getStationDeviceModel,stationCode} = this.props;
    getStationDeviceModel({
      stationCode,
      deviceTypeCode:value
    })
  }
  //选择设备型号
  selectDeviceModel = (value) => {
    const {stationCode,deviceModeCode,deviceTypeCode,getStationDevicePoints} = this.props;
    getStationDevicePoints({
      stationCode,
      deviceModeCode,
      deviceTypeCode,
    })
  }


  render(){
    const {stationCode,stations,deviceTypeCode,stationDeviceTypes,deviceModeCode,deviceModels} = this.props;
    const {selectStation} = this.state;
    

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
     {/*   <TimeSelect onChange={(time)=>console.log(time)} /> */}
        <div className={styles.PerformanceAnalysisContainer}>
          <div className={styles.PerformanceAnalysisMain}>
            <div className={styles.performanceSearch}>
              <div className={styles.conditionalQuery}>
                <span className={styles.searchText}>条件查询</span>
                <StationSelect data={stations} holderText="请选择电站名称" value={selectStation} onChange={this.stationSelected} className={styles.switch} />
                <Select className={styles.duration} style={{ width: 120 }} onChange={this.onChangeDuration}>
                  <Option value="today">今天</Option>
                  <Option value="yesterday">昨天</Option>
                  <Option value="last7">最近7天</Option>
                  <Option value="last30">最近30天</Option>
                  <Option value="other">其他时间段</Option>
                </Select>
                <Switch defaultChecked className={styles.switch}/>
                <span className={styles.switchText}>对比同期</span>
              </div>
              <div className={styles.equipmentSelection}>
                <span className={styles.equipmentText}>设备选择</span> 
                <Select placeholder="请选择设备类型" onChange={this.selectDeviceType} value={deviceTypeCode} >
                  <Option key={null} value={null}>{'逆变器'}</Option>
                  {stationDeviceTypes.map(e=>{
                    if(!e){ return null; }
                    return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
                  })}
                </Select>
               {/* <Select className={styles.modelSelect} onChange={this.selectDeviceModel} value={deviceModeCode} placeholder="请选择设备型号">
                <Option key={null} value={null}>{'全部设备型号'}</Option>
                {deviceModels.map(e=>{
                  if(!e){ return null; }
                  return <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>
                })}
               </Select> */}
                
              </div>
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
    stations:state.common.get('stations').toJS(),
    stationDeviceTypes:state.common.get('stationDeviceTypes').toJS(),
  })

const mapDispatchToProps = (dispatch) => ({
  getEquipmentSelection:payload => dispatch({type:performanceAnalysisAction.getEquipmentSelection,payload}),
  getStationDeviceType:payload => dispatch({type:commonAction.getStationDeviceType,payload}),

})

export default connect(mapStateToProps, mapDispatchToProps) (PerformanceAnalysis);