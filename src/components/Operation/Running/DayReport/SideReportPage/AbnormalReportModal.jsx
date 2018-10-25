
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
    abnormalInfo: PropTypes.object,
    deviceExistInfo: PropTypes.object,
    abnormalList: PropTypes.array,
    dayReportTotalInfoArr: PropTypes.array,
    lostGenTypes: PropTypes.array,
    abnormalModalshow: PropTypes.bool,
    hideAbnormalModal: PropTypes.func,
    findDeviceExist: PropTypes.func,
    totalInfoChange: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      addLostFormShow: false,
      addLimitFormShow: false, // 限电损失添加form框。
      faultGenList: props.abnormalList.filter(e=>e.type === 1), // 选中电站故障损失
      limitGenList: props.abnormalList.filter(e=>e.type === 0), // 选中电站限电损失
      abnormalTextShow: props.abnormalInfo.errorInfo?true:false,
      abnormalText: props.abnormalInfo.errorInfo, // 发电信息-异常信息
    }
  }

  confirmAbnormal = () => { // 确认提交异常信息
    const {faultGenList, limitGenList, abnormalText} = this.state;
    const { abnormalInfo, dayReportTotalInfoArr, totalInfoChange } = this.props;
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
      const lostPowerMiss = !e.lostPower;
      if(lostPowerMiss){
        this.messageWarning('损失电量未填写!');
      }else if(processMiss){
        this.messageWarning('处理进展及问题未填写!');
      }
      return lostPowerMiss || processMiss;
    })
    const limitListError = limitGenList.find(e=>{ // 保证已填写限电损失电量
      const limitPowerMiss = !e.lostPower;
      if(limitPowerMiss){
        this.messageWarning('限电损失电量未填写!');
      }
      return limitPowerMiss;
    });
    !faultListError && !limitListError && totalInfoChange(uploadParams, true); // 验证通过后方能保存
  }

  changeFaultList = (faultGenList, closeAddForm=false) => { // 修改损失电量信息
    const newState = {faultGenList};
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
    const newState = {limitGenList};
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
        const tmpTextArr = [deviceName, startTime, endTime, reason, faultName].filter(e=>e);
        return tmpTextArr.join('+');
      })
      const limitShortInfo = limitGenList.map(e=>{
        let { deviceName, startTime, endTime, reason, limitPower } = e;
        startTime = startTime && startTime.format('YYYY-MM-DD HH:mm');
        endTime = endTime && endTime.format('YYYY-MM-DD HH:mm');
        const tmpTextArr = [deviceName, startTime, endTime, reason, limitPower].filter(e=>e);
        return tmpTextArr.join('+');
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
    message.destroy();
    message.config({
      top: 400,
      duration: 2,
      maxCount: 1,
    });
    message.warning(text,2);
  }

  render(){
    const { abnormalModalshow, abnormalInfo, hideAbnormalModal, findDeviceExist, deviceExistInfo, lostGenTypes} = this.props;
    const { addLostFormShow, faultGenList, limitGenList, addLimitFormShow, abnormalTextShow, abnormalText } = this.state;
    return (
      <Modal
          title={`添加异常-${abnormalInfo.stationName}`}
          visible={abnormalModalshow}
          onOk={this.confirmAbnormal}
          onCancel={hideAbnormalModal}
          width="calc(100vw - 229px)"
          okText="保存"
          wrapClassName={styles.addAbnormalModal}
          mask={false}
        >
        <div className={styles.addGenLostHeader} >
          <span>损失电量信息<Icon type="caret-right" theme="outlined" /></span>
          <Button onClick={this.toAddGenLost} disabled={addLostFormShow} icon="plus" className={styles.uploadGenLost} >添加</Button>
        </div>
        {(faultGenList && faultGenList.length > 0) ? <LostGenTable 
          faultGenList={faultGenList} 
          abnormalInfo={abnormalInfo} 
          changeFaultList={this.changeFaultList} 
        />: null}
        {addLostFormShow && <LostAddForm 
          lostGenTypes={lostGenTypes}
          findDeviceExist={findDeviceExist} 
          faultGenList={faultGenList} 
          changeFaultList={this.changeFaultList}  
          stationCode={abnormalInfo.stationCode}
          deviceExistInfo={deviceExistInfo} 
        /> }
        <div className={styles.addLimitGenHeader} >
          <span>限电信息<Icon type="caret-right" theme="outlined" /></span>
          <Button disabled={addLimitFormShow} onClick={this.toAddGenLimit} icon="plus" className={styles.uploadGenLost}  >添加</Button>
        </div>
        {(limitGenList && limitGenList.length > 0)? <LimitGenTable 
          limitGenList={limitGenList} 
          abnormalInfo={abnormalInfo} 
          changeLimitList={this.changeLimitList} 
        /> :null}
        {addLimitFormShow && <LimitAddForm
          findDeviceExist={findDeviceExist} 
          limitGenList={limitGenList} 
          changeLimitList={this.changeLimitList}  
          stationCode={abnormalInfo.stationCode}
          deviceExistInfo={deviceExistInfo}
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
