
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Input, Icon, message } from 'antd';
import { valueCheck } from '../reportBaseFun';
import moment from 'moment';

const InputContent = ({ keyWord, dataCheck, valueChange, genData = {} }) => {
  return (
    <Input placeholder="--"
      value={genData[keyWord]}
      onBlur={e => dataCheck(keyWord)}
      onChange={e => valueChange({
        [keyWord]: e.target.value && e.target.value.trim()
      })}
    />
  )
}

class EachStationReport extends Component {
  static propTypes = {
    hasAbnormal: PropTypes.bool,
    dayReportTotalInfoArr: PropTypes.array,
    dayReportConfig: PropTypes.array,
    stationInfo: PropTypes.object,
    totalInfoChange: PropTypes.func,
    addAbnormalInfo: PropTypes.func,
  }

  dataCheck = (keyWord) => { // input脱焦时，检查该脱焦数据
    const { stationInfo, totalInfoChange, dayReportTotalInfoArr, dayReportConfig } = this.props;
    const toCheckedInfo = dayReportTotalInfoArr.find(e => e.dailyReport.stationCode === stationInfo.stationCode); //找到要所在电站数据
    const { dailyReport } = toCheckedInfo;
    const { reportDate } = stationInfo;
    const checkResult = valueCheck(stationInfo, dailyReport, dayReportConfig, keyWord);
    if (!checkResult.result) { // 数据检查. 展示校验结果。
      message.warn(checkResult.message);
    }
    const currentArr = ['yearGenInverter', 'yearGenIntegrated', 'yearGenInternet', 'buyPower'];
    const yesterArr = ['yesterdayyearGenInverter', 'yesterdayyearGenIntegrated', 'yesterdayyearGenInternet', 'yesterdayyearBuyPower'];
    const dayValueKey = ['genInverter', 'genIntegrated', 'genInternet', 'dailyBuyPower'];
    if (currentArr.includes(keyWord)) { // 需检测昨日数据并相减填入自动计算数据。
      const startOfYear = moment(reportDate).startOf('year').isSame(moment(reportDate), 'day');
      const keyIndex = currentArr.findIndex(e => e === keyWord);
      const currentValue = dailyReport[keyWord];
      const yesterValue = dailyReport[yesterArr[keyIndex]];
      if ((!yesterValue && yesterValue !== 0 && !startOfYear) || (!currentValue && currentValue !== 0) || isNaN(currentValue)) {
        return;
      } else if (currentValue < yesterValue && !startOfYear) { // 数据不合理
        return;
      } else { // 填写年数据符合。
        const unitConfig = dayReportConfig[0] || {};
        const numDemical = unitConfig.power === 'kWh' ? 2 : 4;
        let dayValue;
        if (startOfYear) { // 1月1日
          dayValue = parseFloat(currentValue).toFixed(numDemical);
        } else {
          dayValue = (currentValue - yesterValue).toFixed(numDemical);
        }
        const uploadParams = dayReportTotalInfoArr.map(info=>{
          if(info.dailyReport.stationCode === stationInfo.stationCode){
            const { dailyDetailList } = info;
            dailyReport[dayValueKey[keyIndex]] = `${dayValue}`;
            return {
              dailyReport,
              dailyDetailList,
            }
          }
          return info;
        })
        totalInfoChange(uploadParams);
      }
    }
  }

  valueChange = (param) => { // 直接替换数据。
    const { stationInfo, totalInfoChange, dayReportTotalInfoArr } = this.props;
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

  render(){
    const { stationInfo, hasAbnormal, dayReportTotalInfoArr } = this.props;
    const genData = dayReportTotalInfoArr.find(e => e.dailyReport.stationCode === stationInfo.stationCode).dailyReport;
    return (
      <div className={styles.eachStationReport}>
        <div className={styles.stationName} title={stationInfo.stationName}>{stationInfo.stationName}</div>
        <div className={styles.resource}>
          <InputContent genData={genData} keyWord="resourceValue" dataCheck={this.dataCheck} valueChange={this.valueChange} />
        </div>
        <div className={styles.genParts}>
          <InputContent genData={genData} keyWord="yearGenInverter" dataCheck={this.dataCheck} valueChange={this.valueChange} />
          <InputContent genData={genData} keyWord="genInverter" dataCheck={this.dataCheck} valueChange={this.valueChange} />
        </div>
        <div className={styles.genParts}>
          <InputContent genData={genData} keyWord="yearGenIntegrated" dataCheck={this.dataCheck} valueChange={this.valueChange} />
          <InputContent genData={genData} keyWord="genIntegrated" dataCheck={this.dataCheck} valueChange={this.valueChange} />
        </div>
        <div className={styles.genParts}>
          <InputContent genData={genData} keyWord="yearGenInternet" dataCheck={this.dataCheck} valueChange={this.valueChange} />
          <InputContent genData={genData} keyWord="genInternet" dataCheck={this.dataCheck} valueChange={this.valueChange} />
        </div>
        <div className={styles.genParts}>
          <InputContent genData={genData} keyWord="buyPower" dataCheck={this.dataCheck} valueChange={this.valueChange} />
          <InputContent genData={genData} keyWord="dailyBuyPower" dataCheck={this.dataCheck} valueChange={this.valueChange} />
        </div>
        <div className={styles.modelParts}>
          <InputContent genData={genData} keyWord="modelInverterCapacity" dataCheck={this.dataCheck} valueChange={this.valueChange} />
          <InputContent genData={genData} keyWord="modelInverterPowerGen" dataCheck={this.dataCheck} valueChange={this.valueChange} />
        </div>
        <div className={styles.handle}>
          <span onClick={this.addAbnormal} className={styles.left}>
            <span className={styles.text}>添加异常</span>
            {hasAbnormal && <i className="iconfont icon-alert_01" />}
          </span>
          <span><i
              className={`${styles.removeStation} iconfont icon-del`}
              onClick={this.removeStation}
            /></span>
          {/* <Icon onClick={this.removeStation} className={styles.removeStation} type="close-circle" theme="outlined" /> */}
        </div>
      </div>
    )
  }
}

export default EachStationReport;
