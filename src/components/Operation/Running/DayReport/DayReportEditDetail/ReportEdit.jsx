
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Input, Icon, message } from 'antd';
import ResourceElecInfo from './ResourceElecInfo';
import LostAddForm from '../SideReportPage/LostAddForm';
import LimitAddForm from '../SideReportPage/LimitAddForm';
import LostGenTable from '../SideReportPage/LostGenTable';
import LimitGenTable from '../SideReportPage/LimitGenTable';
import WarningTip from '../../../../Common/WarningTip';
import moment from 'moment';
import styles from './reportDetail.scss';
import { reportEditFun } from '../reportBaseFun';

class ReportEdit extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    lostGenTypes: PropTypes.array,
    deviceExistInfo: PropTypes.object,
    selectedDayReportDetail: PropTypes.object,
    dayReportConfig: PropTypes.array,
    onSidePageChange: PropTypes.func,
    toChangeDayReportStore: PropTypes.func,
    findDeviceExist: PropTypes.func,
    dayReportUpdate: PropTypes.func,
    getLostGenType: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      addLostFormShow: false,
      addLimitFormShow: false,
      abnormalTextShow: props.selectedDayReportDetail.errorInfo?true:false,
      updateDayReportDetail: props.selectedDayReportDetail,
      showBackWarningTip: false,
      warningTipText: '',
      errorInfo: props.selectedDayReportDetail.errorInfo,
    }
  }

  componentDidMount(){
    this.props.getLostGenType({
      stationType: this.props.selectedDayReportDetail.stationType, 
      defectType: -1, 
      type: 0,
    })
  }

  componentWillReceiveProps(nextProps){
    const newShowPage = nextProps.showPage;
    const { showPage } = this.props;
    if(showPage === 'edit' && newShowPage === 'detail'){ // 编辑请求成功
      this.props.onSidePageChange({ sidePage : 'detail'});
    }
  }

  showDetaiTip = () => { // 提示框
    this.setState({
      showBackWarningTip: true,
      warningTipText: '确认放弃编辑?',
    })
  }

  cancelDetaiTip = () => { // 取消返回列表
    this.setState({
      showBackWarningTip: false,
      warningTipText: '',
    })
  }

  backToDetail = () => { // 返回详情
    this.props.onSidePageChange({ sidePage : 'detail'});
    this.props.toChangeDayReportStore({
      showPage: 'detail'
    })
  }

  toAddGenLost = () => { // 新增损失
    this.setState({
      addLostFormShow: true
    })
  }

  toAddGenLimit = () => { // 新增限电
    this.setState({
      addLimitFormShow: true
    })
  }

  checkAbnormal = (e) => { // 发电信息-存在异常
    const abnormalTextShow = e.target.checked;
    let abnormalText = '';
    const { updateDayReportDetail } = this.state;
    if(abnormalTextShow){
      const { faultList, limitList } = updateDayReportDetail;
      const faultShortInfo =  faultList.map(e=>{
        let { deviceName, startTime, endTime, reason, faultName } = e;
        startTime = startTime && moment(startTime).format('YYYY-MM-DD');
        endTime = endTime && moment(endTime).format('YYYY-MM-DD');
        const tmpTextArr = [deviceName, startTime, endTime&&(`到${endTime}`), reason, faultName].filter(e=>e);
        return tmpTextArr.join(' ');
      })
      const limitShortInfo = limitList.map(e=>{
        let { deviceName, startTime, endTime, reason, limitPower } = e;
        startTime = startTime && moment(startTime).format('YYYY-MM-DD');
        endTime = endTime && moment(endTime).format('YYYY-MM-DD');
        const tmpTextArr = [deviceName, startTime, endTime&&(`到${endTime}`), reason, limitPower].filter(e=>e);
        return tmpTextArr.join(' ');
      })
      abnormalText = `${faultShortInfo.join(';\n')};\n${limitShortInfo.join(';\n')}`;
    }
    this.setState({
      abnormalTextShow,
      updateDayReportDetail: {
        ...updateDayReportDetail,
        errorInfo: abnormalText,
      }
    })
  }

  reportAbnormalText = (e) => {
    const { updateDayReportDetail } = this.state;
    this.setState({
      updateDayReportDetail:{ 
        ...updateDayReportDetail,
        errorInfo: e.target.value
      },
    })
  } 

  updateReport = () => { // 确认上传更新后的日报详情
    const { updateDayReportDetail } = this.state;
    const { dayReportConfig } = this.props;
    let { faultList, limitList } = updateDayReportDetail;

    const unitConfig = dayReportConfig[0] || {}; // 电量单位
    const requireTargetObj = dayReportConfig[1] || {}; 
    const tmpRequireTargetArr = Object.keys(requireTargetObj); // 指标必填信息数组(有多余信息)
    const genUnit = unitConfig.power || 'kWh'; // kWh两位小数，万kWh四位小数。
    const currentStationType = updateDayReportDetail.stationType;
    const tmpReportBaseInfo = reportEditFun(currentStationType, genUnit); // 指标数组

    let errorText = '';
    tmpReportBaseInfo.find(config => { 
      const configRequired = tmpRequireTargetArr.includes(config.configName); // 必填数据项
      const requiredValue = updateDayReportDetail[config.configName];
      const maxPointLength = config.pointLength; // 指定的最大小数点位数
      const decimalData = requiredValue && `${requiredValue}`.split('.')[1];
      const paramPointLength = decimalData ? decimalData.length : 0;
      const dataFormatError = (requiredValue && isNaN(requiredValue)) || paramPointLength > maxPointLength; // 数据格式错误;
      if(configRequired && !requiredValue && requiredValue !== 0){ // 必填项未填
        errorText = `${updateDayReportDetail.stationName}${config.configText}未填写!`;
        return true;
      }else if(dataFormatError){ // 填写数据不规范
        errorText = `${updateDayReportDetail.stationName}${config.configText}请填写数字,不超过${maxPointLength}位小数!`;
        return true;
      }
      return false;
    })
    faultList.find(e=>{
      !e.process && (errorText = '损失电量进展未填写!');
      !e.lostPower && (errorText = '损失电量未填写!');
      return !e.process || !e.lostPower;
    })
    limitList.find(e=>{
      !e.lostPower && (errorText = '限电损失电量未填写!');
      return !e.lostPower;
    })
    if(errorText){ // 数据错误存在，提示
      this.messageWarning(errorText);
    }else{ // 无错误，提交信息。
      const newFaultList = faultList?faultList.map(e=>{
        if(e.rememberRemove && e.id > 0 ){//  删除的数据是后台传过来的故障损失=>单独通知后台删除某条(id)数据
          return {id: e.id};
        }
        e.id > 0? null: delete e.id;
        delete e.stationCode;
        delete e.handle;
        delete e.reportDate;
        return { 
          ...e,
          startTime: e.startTime?moment(e.startTime).format('YYYY-MM-DD HH:mm'): null,
          endTime: e.endTime?moment(e.endTime).format('YYYY-MM-DD HH:mm'): null,
        };
      }): [];
      const newLimitList = limitList?limitList.map(e=>{
        if(e.rememberRemove && e.id > 0 ){ // 删除的数据是后台传过来的限电=>单独通知后台删除某条(id)数据
          return {id: e.id};
        }
        e.id > 0? null: delete e.id;
        delete e.handle;
        delete e.handle;
        delete e.reportDate;
        return {
          ...e,
          startTime: e.startTime?moment(e.startTime).format('YYYY-MM-DD HH:mm'): null,
          endTime: e.endTime?moment(e.endTime).format('YYYY-MM-DD HH:mm'): null,
        };
      }): [];
      const reportInfo = {
        stationCode: updateDayReportDetail.stationCode,
        reportDate: moment(updateDayReportDetail.reportDate).format('YYYY-MM-DD'),
        reportId: updateDayReportDetail.reportId,
        realCapacity: updateDayReportDetail.realCapacity,
        machineCount: updateDayReportDetail.machineCount,
        resourceValue: updateDayReportDetail.resourceValue,
        yearGenInverter: updateDayReportDetail.yearGenInverter,
        yearGenIntegrated: updateDayReportDetail.yearGenIntegrated,
        yearGenInternet: updateDayReportDetail.yearGenInternet,
        genInternet: updateDayReportDetail.genInternet,
        genInverter: updateDayReportDetail.genInverter,
        genIntegrated: updateDayReportDetail.genIntegrated,
        equivalentHours: updateDayReportDetail.equivalentHours,
        modelInverterCapacity: updateDayReportDetail.modelInverterCapacity,
        modelInverterPowerGen: updateDayReportDetail.modelInverterPowerGen,
        dailyBuyPower: updateDayReportDetail.dailyBuyPower,
        buyPower: updateDayReportDetail.buyPower,
        errorInfo: updateDayReportDetail.errorInfo,
        faultList: newFaultList,
        limitList: newLimitList,
      }
      this.props.dayReportUpdate(reportInfo)
    }
  }

  messageWarning = (dataErrorText) => { // 信息错误展示
    message.destroy();
    message.config({
      top: 400,
      duration: 2,
      maxCount: 1,
    });
    message.warning(dataErrorText,2);
  }

  changeReportDetail = (updateDayReportDetail) => { // 更变详情
    this.setState({ updateDayReportDetail });
  }

  faultListInfoChange = (faultList, closeAddForm = false) => { // 损失电量信息编辑
    let { updateDayReportDetail } = this.state;
    updateDayReportDetail.faultList = faultList;
    let newState = {...updateDayReportDetail};
    closeAddForm && (newState.addLostFormShow = false);
    this.setState({...newState})
  }

  limitListInfoChange = (limitList, closeLimitForm = false) => { // 限电信息编辑
    let { updateDayReportDetail } = this.state;
    updateDayReportDetail.limitList = limitList;
    let newState = {...updateDayReportDetail};
    closeLimitForm && (newState.addLimitFormShow = false);
    this.setState({ ...newState });
  }

  render(){
    const { updateDayReportDetail, addLostFormShow, addLimitFormShow, abnormalTextShow, showBackWarningTip, warningTipText } = this.state;
    const { findDeviceExist, deviceExistInfo, dayReportConfig, lostGenTypes } = this.props;
    const {faultList, limitList, stationCode, errorInfo} = updateDayReportDetail;
    return (
      <div className={styles.reportEdit} >
        <div className={styles.reportDetailTitle} >
          <span className={styles.reportDetailTitleTip}>日报编辑</span>
          <div className={styles.reportDetailTitleRight}>
            <Button onClick={this.updateReport} className={styles.reportEdit}>保存</Button>
            <Icon type="arrow-left" className={styles.backIcon}  onClick={this.showDetaiTip} />
          </div>
        </div>
        <ResourceElecInfo 
          changeReportDetail={this.changeReportDetail} 
          updateDayReportDetail={updateDayReportDetail}
          dayReportConfig={dayReportConfig}
        />
        <div className={styles.lostElecInfo} >
          <span className={styles.reportSubTitle}>损失电量信息<Icon type="caret-right" theme="outlined"  /></span>
          <Button onClick={this.toAddGenLost} disabled={addLostFormShow} icon="plus" className={styles.uploadGenLost}>添加</Button>
        </div>
        {faultList.length > 0?<div className={styles.lostGenTableBox} >
          <LostGenTable 
            faultGenList={faultList.map(
              e=>({...e,
                startTime: e.startTime?moment(e.startTime):null, 
                endTime: e.endTime?moment(e.endTime):null
              })
            )}
            rememberRemove={true}
            changeFaultList={this.faultListInfoChange} 
          />
        </div>: null}
        {addLostFormShow && <LostAddForm
          findDeviceExist={findDeviceExist}
          lostGenTypes={lostGenTypes}
          faultGenList={faultList}
          changeFaultList={this.faultListInfoChange}
          stationCode={stationCode}
          deviceExistInfo={deviceExistInfo}
        />}
        <div className={styles.lostElecInfo} >
          <span className={styles.reportSubTitle}>限电信息<Icon type="caret-right" theme="outlined" /></span>
          <Button disabled={addLimitFormShow} onClick={this.toAddGenLimit}  icon="plus" className={styles.uploadGenLost}>添加</Button>
        </div>
        {limitList.length > 0 ?<div className={styles.lostGenTableBox} >
          <LimitGenTable 
            limitGenList={limitList.map(
              e=>({...e,
                startTime: e.startTime?moment(e.startTime): null, 
                endTime: e.endTime?moment(e.endTime):null,
              })
            )}
            rememberRemove={true}
            changeLimitList={this.limitListInfoChange}
          />
        </div>:null}
        {addLimitFormShow && <LimitAddForm
          findDeviceExist={findDeviceExist} 
          limitGenList={limitList} 
          changeLimitList={this.limitListInfoChange}  
          stationCode={stationCode}
          deviceExistInfo={deviceExistInfo}
        />}
        <div className={styles.addPowerGenInfo}  >
          <span className={styles.reportSubTitle}>发电信息<Icon type="caret-right" theme="outlined" /></span>
          <div className={styles.addPowerGenInfoR} >
            <Checkbox checked={abnormalTextShow} onChange={this.checkAbnormal}>存在异常</Checkbox>
            {abnormalTextShow && <Input.TextArea className={styles.abnormalTextArea}  onChange={this.reportAbnormalText} value={errorInfo} />}
          </div>
        </div>
        {showBackWarningTip && <WarningTip onOK={this.backToDetail} onCancel={this.cancelDetaiTip} value={warningTipText} />}
      </div>
    )
  }
}

export default ReportEdit;
