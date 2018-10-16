
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Modal, Button, Icon, Checkbox, Input } from 'antd';
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
      faultGenList: props.abnormalList, // 选中电站故障损失。
      limitGenList: [], // 选中电站限电损失。
      abnormalTextShow: false,
      abnormalText: '', // 发电信息-异常信息
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
    // todo-此处需判断上传的必填信息是否均已填写！
    console.log(faultGenList)
    console.log(limitGenList)
    return 
    totalInfoChange(uploadParams, true);
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
      const { faultGenList } = this.state;
      const faultShortInfo =  faultGenList.map(e=>{
        let { deviceName, startTime, endTime, reason, faultName } = e;
        startTime = startTime && startTime.format('YYYY-MM-DD');
        endTime = endTime && endTime.format('YYYY-MM-DD');
        const tmpTextArr = [deviceName, startTime, endTime, reason, faultName].filter(e=>e);
        return tmpTextArr.join('+')
      })
      abnormalText = faultShortInfo.join(';\n');
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
        >
        <div className={styles.addGenLostHeader} >
          <span>损失电量信息<Icon type="caret-right" theme="outlined" /></span>
          <Button onClick={this.toAddGenLost} disabled={addLostFormShow} icon="plus" className={styles.uploadGenLost} >添加</Button>
        </div>
        <LostGenTable faultGenList={faultGenList} abnormalInfo={abnormalInfo} changeFaultList={this.changeFaultList} />
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
        <LimitGenTable limitGenList={limitGenList} abnormalInfo={abnormalInfo} changeLimitList={this.changeLimitList} />
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
            <Checkbox onChange={this.checkAbnormal} >存在异常</Checkbox>
            {abnormalTextShow && <Input.TextArea className={styles.abnormalTextArea} onChange={this.reportAbnormalText} value={abnormalText} />}
          </div>
        </div>
      </Modal>
    )
  }
}

export default AbnormalReportModal;
