
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Modal, Button, Icon, Checkbox, Input, message } from 'antd';
import LostGenTable from './LostGenTable';
import LimitGenTable from './LimitGenTable';
import LostAddForm from './LostAddForm';
import LimitAddForm from './LimitAddForm';

class AbnormalReportModal extends Component {
  static propTypes = {
    stationType: PropTypes.number,
    abnormalInfo: PropTypes.object,
    deviceExistInfo: PropTypes.object,
    abnormalList: PropTypes.array,
    dayReportTotalInfoArr: PropTypes.array,
    stationDeviceTypes: PropTypes.array,
    dayReportConfig: PropTypes.array,
    lostGenTypes: PropTypes.array,
    abnormalModalshow: PropTypes.bool,
    hideAbnormalModal: PropTypes.func,
    findDeviceExist: PropTypes.func,
    totalInfoChange: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    getLostGenType: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      addLostFormShow: false,
      addLimitFormShow: false, // 限电损失添加form框。
      faultGenList: props.abnormalList.filter(e=>e.type === 1).map(e => ({ ...e })), // 选中电站故障损失
      limitGenList: props.abnormalList.filter(e=>e.type === 0).map(e => ({ ...e })), // 选中电站限电损失
      abnormalTextShow: props.abnormalInfo.errorInfo?true:false,
      abnormalText: props.abnormalInfo.errorInfo, // 发电信息-异常信息
    }
  }

  confirmAbnormal = () => { // 确认提交异常信息
    const {
      faultGenList, limitGenList, abnormalText, addLostFormShow, addLimitFormShow
    } = this.state;
    const {
      abnormalInfo, dayReportTotalInfoArr, totalInfoChange
    } = this.props;
    if (addLostFormShow || addLimitFormShow) {
      message.error('请先确认完成损失电量表单信息的填写!');
      return;
    }
    const faultTimeError = faultGenList.find(e => e.endTime && e.startTime && e.startTime > e.endTime);
    const limitTimeError = limitGenList.find(e => e.endTime && e.startTime && e.startTime > e.endTime);
    if (faultTimeError || limitTimeError) {
      message.error('结束时间必须大于开始时间');
      return;
    }
    const uploadParams = dayReportTotalInfoArr.map(info=>{
      if(info.dailyReport.stationCode === abnormalInfo.stationCode){
        const { dailyReport } = info;
        return {
          dailyReport: {...dailyReport, errorInfo: abnormalText},
          dailyDetailList: [...faultGenList, ...limitGenList],
        }
      }
      return info;
    })
    const faultListError = faultGenList.find(e=>{ // 保证损失电量，处理进展填写
      const processMiss = !e.process;
      if(processMiss){
        this.messageWarning('处理进展及问题未填写!');
      }
      return processMiss;
    })
    !faultListError && totalInfoChange(uploadParams, true); // 验证通过后方能保存
  }

  changeFaultList = (faultGenList, closeAddForm=false) => { // 修改损失电量信息
    const newState = {
      faultGenList: [...faultGenList.map(e => ({ ...e }))]
    };
    closeAddForm && (newState.addLostFormShow = false);
    this.setState({ ...newState });
  }

  toAddGenLost = () => { // 添加损失电量信息=>展示form添加框
    this.setState({
      addLostFormShow: true
    })
  }

  toAddGenLimit = () => { // 添加限电信息 =>展示限电form
    this.setState({
      addLimitFormShow: true
    })
  }

  changeLimitList = (limitGenList, closeAddForm=false) => { // 限电信息修改
    const newState = {
      limitGenList: [...limitGenList.map(e => ({ ...e }))]
    };
    closeAddForm && (newState.addLimitFormShow = false);
    this.setState({ ...newState });
  }

  checkAbnormal = (e) => {
    const abnormalTextShow = e.target.checked;
    let abnormalText = '';
    if(abnormalTextShow){
      const { faultGenList, limitGenList } = this.state;
      const faultShortInfo =  faultGenList.map(e=>{
        let { deviceName, startTime, endTime, reason, faultName } = e;
        startTime = startTime && startTime.format('YYYY-MM-DD HH:mm');
        endTime = endTime && endTime.format('YYYY-MM-DD HH:mm');
        const tmpTextArr = [deviceName, startTime, endTime && (`到${endTime}`), faultName, reason].filter(e=>e);
        return tmpTextArr.join(' ');
      })
      const limitShortInfo = limitGenList.map(e=>{
        let { deviceName, startTime, endTime, reason, limitPower } = e;
        startTime = startTime && startTime.format('YYYY-MM-DD HH:mm');
        endTime = endTime && endTime.format('YYYY-MM-DD HH:mm');
        const tmpTextArr = [deviceName, startTime, endTime && (`到${endTime}`), reason, limitPower].filter(e=>e);
        return tmpTextArr.join(' ');
      })
      abnormalText = `${faultShortInfo.join(';\n')};\n${limitShortInfo.join(';\n')}`;
    }
    this.setState({
      abnormalTextShow,
      abnormalText,
    })
  }

  reportAbnormalText = (e) => {
    this.setState({
      abnormalText: e.target.value,
    })
  }

  messageWarning = (text) => { // 信息错误展示
    message.warning(text,2);
  }

  render(){
    const { abnormalModalshow, stationDeviceTypes, abnormalInfo, hideAbnormalModal, findDeviceExist, deviceExistInfo, lostGenTypes, dayReportConfig, getStationDeviceTypes, getLostGenType, stationType} = this.props;
    const { addLostFormShow, faultGenList, limitGenList, addLimitFormShow, abnormalTextShow, abnormalText } = this.state;
    const { modelInverterPowerGen, modelInverterCapacity, stationCapacity, reportDate } = abnormalInfo;
    let defaultLimitLost, tmpRealityGen = 0; // 默认限电剩余损失电量, 
    if(modelInverterCapacity > 0){
      const tmpTheoryGen = modelInverterPowerGen / modelInverterCapacity * stationCapacity; // 理论发电量
      const unitConfig = dayReportConfig[0] || {}; // 电量单位
      const genCalcType = dayReportConfig[2] || {}; // 实际发电量的计算方式 - '1'逆变器，'2'上网电量
      if(genCalcType.stander === '1'){ // 逆变器计算实际发电量
        tmpRealityGen = abnormalInfo.yearGenInverter - abnormalInfo.yesterdayyearGenInverter || 0;
      }else if(genCalcType.stander === '2'){ // 上网电量计算实际发电量
        tmpRealityGen = abnormalInfo.yearGenInternet - abnormalInfo.yesterdayyearGenInternet || 0;
      }
      const genUnit = unitConfig.power === 'kWh'?1: 10000; // kWh和万kWh。
      const theryGen = tmpTheoryGen * genUnit;
      const realityGen = tmpRealityGen * genUnit;
      const faultLostPower = faultGenList.reduce((pre,cur) => { // 故障损失
        if(cur.lostPower || cur.lostPower === 0){
          return pre + parseFloat(cur.lostPower);
        }
        return pre;
      }, 0);
      const limitLostPower = limitGenList.reduce((pre,cur) => { // 限电损失
        if(cur.lostPower || cur.lostPower === 0){
          return pre + parseFloat(cur.lostPower);
        }
        return pre;
      }, 0);
      const tmpDefaultList = theryGen - realityGen - faultLostPower - limitLostPower;
      tmpDefaultList > 0 && (defaultLimitLost = tmpDefaultList.toFixed(2));
    }
    return (
      <Modal
          title={`添加异常-${abnormalInfo.stationName}`}
          visible={abnormalModalshow}
          onOk={this.confirmAbnormal}
          onCancel={hideAbnormalModal}
          width="calc(100vw - 229px)"
          okText="确认添加"
          wrapClassName={styles.addAbnormalModal}
          mask={false}
          maskClosable={false}
        >
        <div className={styles.addGenLostHeader} >
          <span>损失电量信息<Icon type="caret-right" theme="outlined" /></span>
          <Button onClick={this.toAddGenLost} disabled={addLostFormShow} icon="plus" className={styles.uploadGenLost} >添加</Button>
        </div>
        {(faultGenList && faultGenList.length > 0) ? <LostGenTable 
          faultGenList={faultGenList}
          stationDeviceTypes={stationDeviceTypes}
          abnormalInfo={abnormalInfo}
          reportDate={reportDate} 
          changeFaultList={this.changeFaultList} 
        />: null}
        {addLostFormShow && <LostAddForm
          stationType={stationType} 
          lostGenTypes={lostGenTypes}
          stationDeviceTypes={stationDeviceTypes}
          findDeviceExist={findDeviceExist} 
          faultGenList={faultGenList} 
          changeFaultList={this.changeFaultList}  
          stationCode={abnormalInfo.stationCode}
          deviceExistInfo={deviceExistInfo} 
          getStationDeviceTypes={getStationDeviceTypes}
          getLostGenType={getLostGenType}
        /> }
        <div className={styles.addLimitGenHeader} >
          <span>限电信息<Icon type="caret-right" theme="outlined" /></span>
          <Button disabled={addLimitFormShow} onClick={this.toAddGenLimit} icon="plus" className={styles.uploadGenLost}>添加</Button>
        </div>
        {(limitGenList && limitGenList.length > 0)? <LimitGenTable
          stationDeviceTypes={stationDeviceTypes}
          limitGenList={limitGenList} 
          abnormalInfo={abnormalInfo}
          reportDate={reportDate} 
          changeLimitList={this.changeLimitList} 
        /> :null}
        {addLimitFormShow && <LimitAddForm
          findDeviceExist={findDeviceExist}
          stationDeviceTypes={stationDeviceTypes}
          getStationDeviceTypes={getStationDeviceTypes} 
          limitGenList={limitGenList} 
          changeLimitList={this.changeLimitList}  
          stationCode={abnormalInfo.stationCode}
          deviceExistInfo={deviceExistInfo}
          defaultLimitLost={defaultLimitLost}
        />}
        <div className={styles.addPowerGenInfo} >
          <span>发电信息<Icon type="caret-right" theme="outlined" /></span>
          <div className={styles.addPowerGenInfoR} >
            <Checkbox checked={abnormalTextShow} onChange={this.checkAbnormal} >存在异常</Checkbox>
            {abnormalTextShow && <Input.TextArea className={styles.abnormalTextArea} onChange={this.reportAbnormalText} value={abnormalText} />}
          </div>
        </div>
      </Modal>
    )
  }
}

export default AbnormalReportModal;
