
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Row, Col, Input, Icon } from 'antd';
import { reportBasefun } from '../reportBaseFun';

class EachStationReport extends Component {
  static propTypes = {
    dayReportTotalInfoArr: PropTypes.array,
    dayReportConfig: PropTypes.array,
    stationInfo: PropTypes.object,
    totalInfoChange: PropTypes.func,
    addAbnormalInfo: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      showDataError: false, 
      dataErrorText: '',
      errorInputArr: [],
    }
  }

  valueChange = (param) => {
    const { stationInfo, totalInfoChange, dayReportTotalInfoArr, dayReportConfig} = this.props;
    console.log(stationInfo)
    const requireTargetObj = dayReportConfig[1] || {};
    const requireTargetArr = Object.keys(requireTargetObj); // 必填项
    const unitConfig = dayReportConfig[0] || {}; // 电量单位
    const genUnit = unitConfig.power || 'kWh'; // kWh两位小数，万kWh四位小数。
    const paramName = Object.keys(param)[0];
    const paramValue = Object.values(param)[0];
    console.log(paramValue)
    console.log(isNaN(paramValue))
    if(requireTargetArr.includes(paramName)){ // change项为必填
      !paramValue && this.reportInforErrorShow('此项必填！！！！')
    }
    if(isNaN(paramValue)){ // 数据不合规范
      this.reportInforErrorShow('请填写数字!')
    }
    const uploadParams = dayReportTotalInfoArr.map(info=>{
      if(info.dailyReport.stationCode === stationInfo.stationCode){
        const { dailyReport, dailyDetailList } = info;
        return {
          dailyReport: { ...dailyReport, ...param },
          dailyDetailList,
        }
      }
      return info;
    })
    totalInfoChange(uploadParams);
  }

  addAbnormal= () => {
    const { stationInfo, dayReportTotalInfoArr, addAbnormalInfo } = this.props;
    const { stationCode } = stationInfo;
    const abnormalParams = dayReportTotalInfoArr.find(info=>stationCode === info.dailyReport.stationCode)
    abnormalParams && addAbnormalInfo(abnormalParams.dailyReport, abnormalParams.dailyDetailList);
  }

  removeStation = () => { //删除，放弃日报上传。
    const { stationInfo, totalInfoChange, dayReportTotalInfoArr } = this.props;
    const uploadParams = dayReportTotalInfoArr.filter(info=>info.dailyReport.stationCode !== stationInfo.stationCode);
    totalInfoChange(uploadParams);
  }

  reportInforErrorShow = (dataErrorText) => { // 错误信息展示2s
    this.setState({
      showDataError: true,
      dataErrorText
    });
    setTimeout(()=>{this.setState({
      showDataError: false,
    })},2000)
  }

  render(){
    const { stationInfo } = this.props;
    const { showDataError, dataErrorText } = this.state;
    const stationCapacity = isNaN(parseInt(stationInfo.stationCapacity))?'--':stationInfo.stationCapacity;
    const eqpHour = isNaN(parseInt(stationInfo.eqpHour))?'--':stationInfo.eqpHour;
    return (
      <Row className={styles.eachStationReport}>
        <Col span={3}>{stationInfo.stationName}</Col>
        <Col span={2}>
          <Input placeholder="--" onChange={(e)=>this.valueChange({ resourceValue: e.target.value })} />
        </Col>
        <Col span={2}>
          <Input placeholder="--" onChange={(e)=>this.valueChange({ yearGenInverter: e.target.value })} />
        </Col>
        <Col span={2}>
          <Input placeholder="--" onChange={(e)=>this.valueChange({ yearGenIntegrated: e.target.value })} />
        </Col>
        <Col span={2}>
          <Input placeholder="--" onChange={(e)=>this.valueChange({ yearGenInternet: e.target.value })} />
        </Col>
        <Col span={2}>
          <span>{eqpHour}</span>
        </Col>
        <Col span={2}>
          <Input placeholder="--" onChange={(e)=>this.valueChange({ buyPower: e.target.value })} />
        </Col>
        <Col span={2}>
          <Input placeholder="--" onChange={(e)=>this.valueChange({ modelInverterCapacity: e.target.value })} />
        </Col>
        <Col span={2}>
          <Input placeholder="--" onChange={(e)=>this.valueChange({ modelInverterPowerGen: e.target.value })} />
        </Col>
        <Col span={2}>
          <span>{stationCapacity}</span>
        </Col>
        <Col span={2} className={styles.addAbnormal}>
          <span onClick={this.addAbnormal} >添加异常</span>
          <span><i className="iconfont icon-alert_01" ></i></span>
        </Col>
        <Col span={1} className={styles.deleteStationReport} >
          <span onClick={this.removeStation}><Icon type="close-circle" theme="outlined" /></span>
        </Col>
        {showDataError && <span>{dataErrorText}</span>}
      </Row>
    )
  }
}

export default EachStationReport;
