
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Row, Col, Input, Icon,message } from 'antd';
import { reportBasefun } from '../reportBaseFun';

class EachStationReport extends Component {
  static propTypes = {
    hasAbnormal: PropTypes.bool,
    dayReportTotalInfoArr: PropTypes.array,
    dayReportConfig: PropTypes.array,
    stationInfo: PropTypes.object,
    totalInfoChange: PropTypes.func,
    addAbnormalInfo: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  valueChange = (param) => {
    const { stationInfo, totalInfoChange, dayReportTotalInfoArr, dayReportConfig } = this.props;
    const unitConfig = dayReportConfig[0] || {}; // 电量单位
    const genCalcType = dayReportConfig[2] || {}; // 发电量的计算方式 - '1'逆变器，'2'上网电量
    const genUnit = unitConfig.power || 'kWh'; // kWh两位小数，万kWh四位小数。
    const paramName = Object.keys(param)[0]; // 填写项属性
    const paramValue = Object.values(param)[0]; // 填写值
    const tmpReportBaseInfo = reportBasefun(stationInfo.stationType, genUnit); // 指标数组
    const requireTargetObj = dayReportConfig[1] || {};
    const requireTargetArr = Object.keys(requireTargetObj); // 指标必填项

    const reportBaseInfo = tmpReportBaseInfo.find(e=>e.configName === paramName) || {};
    const maxPointLength = reportBaseInfo.pointLength; // 指定的最大小数点位数

    const requireError = requireTargetArr.includes(reportBaseInfo.configName) && !paramValue; // 必填项未填。
    const paramPointLength = paramValue.split('.')[1] ? paramValue.split('.')[1].length : 0;
    const dataFormatError = isNaN(paramValue) || paramPointLength > maxPointLength; // 数据格式错误;
    if(requireError){ // 必填值未填
      this.messageWarning(`请填写${stationInfo.stationName}${reportBaseInfo.configText}!`);
    }else if(dataFormatError){ // 数据格式错误
      this.messageWarning(
        `${stationInfo.stationName}${reportBaseInfo.configText}需填数字,且不超过${maxPointLength}位小数`
      );
    }
    
    const valueGenUnit = genUnit === 'kWh'?1:10000; // 发电量单位转换
    const { stationCapacity } = stationInfo;
    if(genCalcType.stander === '1' && paramName === 'yearGenInverter' && stationCapacity > 0){ // 逆变器发电量计算等效小时数
      const { yesterdayyearGenInverter } = stationInfo;
      const dayGen = (yesterdayyearGenInverter || yesterdayyearGenInverter === 0)?
        (paramValue-yesterdayyearGenInverter):paramValue;
      param.hour = (dayGen*valueGenUnit/1000/stationCapacity).toFixed(2);
    }else if(genCalcType.stander === '2' && paramName === 'yearGenInternet' && stationCapacity > 0){
      const { yesterdayyearGenInternet } = stationInfo;
      const dayGen = (yesterdayyearGenInternet || yesterdayyearGenInternet === 0)?
        (paramValue-yesterdayyearGenInternet):paramValue;
      param.hour = (dayGen*valueGenUnit/1000/stationCapacity).toFixed(2);
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

  removeStation = () => { //删除，放弃日报上报。
    const { stationInfo, totalInfoChange, dayReportTotalInfoArr } = this.props;
    const uploadParams = dayReportTotalInfoArr.filter(info=>info.dailyReport.stationCode !== stationInfo.stationCode);
    totalInfoChange(uploadParams);
  }

  messageWarning = (text) => {
    message.destroy();
    message.config({
      top: 400,
      duration: 2,
      maxCount: 1,
    });
    message.warning(text,2);
  }

  render(){
    const { stationInfo, hasAbnormal } = this.props;
    const stationCapacity = isNaN(stationInfo.stationCapacity)?'--':stationInfo.stationCapacity;
    const eqpHour = isNaN(stationInfo.hour)?'--':stationInfo.hour;
    return (
      <Row className={styles.eachStationReport}>
        <Col span={3}>{stationInfo.stationName}</Col>
        <Col span={2}>
          <Input placeholder="--" onChange={(e)=>this.valueChange({ resourceValue: e.target.value })} />
        </Col>
        <Col span={5}>
          <Row>
            <Col span={8}>
              <Input placeholder="--" onChange={(e)=>this.valueChange({ yearGenInverter: e.target.value })} />
            </Col>
            <Col span={8}>
              <Input placeholder="--" onChange={(e)=>this.valueChange({ yearGenIntegrated: e.target.value })} />
            </Col>
            <Col span={8}>
              <Input placeholder="--" onChange={(e)=>this.valueChange({ yearGenInternet: e.target.value })} />
            </Col>
          </Row>
        </Col>
        <Col span={2}>
          <span>{eqpHour}</span>
        </Col>
        <Col span={2}>
          <Input placeholder="--" onChange={(e)=>this.valueChange({ buyPower: e.target.value })} />
        </Col>
        <Col span={5}>
          <Row>
            <Col span={12}>
              <Input placeholder="--" onChange={(e)=>this.valueChange({ modelInverterCapacity: e.target.value })} />
            </Col>
            <Col span={12}>
              <Input placeholder="--" onChange={(e)=>this.valueChange({ modelInverterPowerGen: e.target.value })} />
            </Col>
          </Row>
        </Col>
        <Col span={2}>
          <span>{stationCapacity}</span>
        </Col>
        <Col span={2} className={styles.addAbnormal}>
          <span className={styles.abnormalText}>
            <span onClick={this.addAbnormal} >添加异常</span>
            {hasAbnormal && <span><i className="iconfont icon-alert_01" ></i></span>}
          </span>
        </Col>
        <Col span={1} className={styles.deleteStationReport} >
          <span onClick={this.removeStation} className={styles.removeStation}><Icon type="close-circle" theme="outlined" /></span>
        </Col>
      </Row>
    )
  }
}

export default EachStationReport;
