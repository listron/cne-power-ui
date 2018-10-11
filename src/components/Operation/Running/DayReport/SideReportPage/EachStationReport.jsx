
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Row, Col, Input } from 'antd';

class EachStationReport extends Component {
  static propTypes = {
    dayReportTotalInfoArr: PropTypes.array,
    stationInfo: PropTypes.object,
    totalReportInfoChange: PropTypes.func,
    addAbnormalInfo: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  valueChange = (param) => {
    const { stationInfo, totalReportInfoChange, dayReportTotalInfoArr} = this.props;
    const uploadParams = dayReportTotalInfoArr.map(info=>{
      if(info.dailyReport.stationCode === stationInfo.stationCode){
        const { dailyReport, dailyDetailList } = info;
        return {
          dailyReport: { ...dailyReport, ...param },
          dailyDetailList,
        }
      }
      return info
    })
    totalReportInfoChange(uploadParams)
  }

  addAbnormal= () => {
    const { stationInfo, dayReportTotalInfoArr, addAbnormalInfo } = this.props;
    const { stationCode } = stationInfo;
    const abnormalParams = dayReportTotalInfoArr.find(info=>stationCode === info.dailyReport.stationCode)
    abnormalParams && addAbnormalInfo(abnormalParams.dailyReport, abnormalParams.dailyDetailList);
  }

  removeStation = () => { //删除，放弃日报上传。
    const { stationInfo } = this.props;
    console.log('我要删掉这个电站上传咯！')
  }

  render(){
    const { stationInfo } = this.props;
    const stationCapacity = isNaN(parseInt(stationInfo.stationCapacity))?'--':stationInfo.stationCapacity;
    const eqpHour = isNaN(parseInt(stationInfo.eqpHour))?'--':stationInfo.eqpHour;
    return (
      <Row className={styles.eachStationReport}>
        <Col span={2}>{stationInfo.stationName}</Col>
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
        <Col span={2}>
          <span onClick={this.addAbnormal} >添加异常</span>
          <span>!!!</span>
        </Col>
        <Col span={2}>
          <span onClick={this.removeStation}>删除</span>
        </Col>
      </Row>
    )
  }
}

export default EachStationReport;
