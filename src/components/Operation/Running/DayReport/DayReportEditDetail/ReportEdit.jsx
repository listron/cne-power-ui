
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Input, Icon } from 'antd';
import ResourceElecInfo from './ResourceElecInfo';
import LostAddForm from '../SideReportPage/LostAddForm';
import LimitAddForm from '../SideReportPage/LimitAddForm';
import LostGenTable from '../SideReportPage/LostGenTable';
import LimitGenTable from '../SideReportPage/LimitGenTable';
import moment from 'moment';
import styles from './reportDetail.scss';

class ReportEdit extends Component {
  static propTypes = {
    deviceExistInfo: PropTypes.object,
    selectedDayReportDetail: PropTypes.object,
    onSidePageChange: PropTypes.func,
    toChangeDayReportStore: PropTypes.func,
    findDeviceExist: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      addLostFormShow: false,
      addLimitFormShow: false,
      abnormalTextShow: false,
      updateDayReportDetail: props.selectedDayReportDetail,
    }
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
    console.log(updateDayReportDetail);
    if(abnormalTextShow){
      const { faultList } = updateDayReportDetail;
      const faultShortInfo =  faultList.map(e=>{
        let { deviceName, startTime, endTime, reason, faultName } = e;
        // startTime = startTime && startTime.format('YYYY-MM-DD');
        // endTime = endTime && endTime.format('YYYY-MM-DD');
        const tmpTextArr = [deviceName, startTime, endTime, reason, faultName].filter(e=>e);
        return tmpTextArr.join('+')
      })
      abnormalText = faultShortInfo.join(';\n');
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
    console.log('保存编辑页面相关功能!!');
    console.log(this.state.updateDayReportDetail);
  }

  changeReportDetail = (updateDayReportDetail) => { // 更变详情
    console.log(updateDayReportDetail)
    this.setState({ updateDayReportDetail })
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
    const { updateDayReportDetail, addLostFormShow, addLimitFormShow, abnormalTextShow } = this.state;
    const { findDeviceExist, deviceExistInfo } = this.props;
    return (
      <div className={styles.reportEdit} >
        <div className={styles.reportDetailTitle} >
          <span className={styles.reportDetailTitleTip}>日报编辑</span>
          <div className={styles.reportDetailTitleRight}>
            <Button onClick={this.updateReport} className={styles.reportEdit}>保存</Button>
            <Icon type="arrow-left" className={styles.backIcon}  onClick={this.backToDetail} />
          </div>
        </div>
        <ResourceElecInfo changeReportDetail={this.changeReportDetail} updateDayReportDetail={updateDayReportDetail} />
        <div className={styles.lostElecInfo} >
          <span className={styles.reportSubTitle}>损失电量信息<Icon type="caret-right" theme="outlined"  /></span>
          <Button onClick={this.toAddGenLost} disabled={addLostFormShow} icon="plus" className={styles.uploadGenLost}>添加</Button>
        </div>
        <div className={styles.lostGenTableBox} >
          <LostGenTable 
            faultGenList={updateDayReportDetail.faultList.map(
              e=>({...e,startTime: moment(e.startTime), endTime: moment(e.endTime)})
            )}
            changeFaultList={this.faultListInfoChange} 
          />
        </div>
        {addLostFormShow && <LostAddForm
          findDeviceExist={findDeviceExist}
          faultGenList={updateDayReportDetail.faultList}
          changeFaultList={this.faultListInfoChange}
          stationCode={updateDayReportDetail.stationCode}
          deviceExistInfo={deviceExistInfo}
        />}
        <div className={styles.lostElecInfo} >
          <span className={styles.reportSubTitle}>限电信息<Icon type="caret-right" theme="outlined" /></span>
          <Button disabled={addLimitFormShow} onClick={this.toAddGenLimit}  icon="plus" className={styles.uploadGenLost}>添加</Button>
        </div>
        <div className={styles.lostGenTableBox} >
          <LimitGenTable 
            limitGenList={updateDayReportDetail.limitList.map(
              e=>({...e,startTime: moment(e.startTime), endTime: moment(e.endTime)})
            )}
            changeLimitList={this.limitListInfoChange}
          />
        </div>
        {addLimitFormShow && <LimitAddForm
          findDeviceExist={findDeviceExist} 
          limitGenList={updateDayReportDetail.limitList} 
          changeLimitList={this.limitListInfoChange}  
          stationCode={updateDayReportDetail.stationCode}
          deviceExistInfo={deviceExistInfo}
        />}
        <div className={styles.addPowerGenInfo}  >
          <span className={styles.reportSubTitle}>发电信息<Icon type="caret-right" theme="outlined" /></span>
          <div className={styles.addPowerGenInfoR} >
            <Checkbox onChange={this.checkAbnormal}>存在异常</Checkbox>
            {abnormalTextShow && <Input.TextArea className={styles.abnormalTextArea}  onChange={this.reportAbnormalText} value={updateDayReportDetail.errorInfo} />}
          </div>
          
        </div>
      </div>
    )
  }
}

export default ReportEdit;
