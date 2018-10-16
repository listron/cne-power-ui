
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { DatePicker, Button, Alert, Icon } from 'antd';
import StationSelect from '../../../../Common/StationSelect';
import UploadReportList from './UploadReportList';
import moment from 'moment';
import { reportBasefun } from '../reportBaseFun';

class SideReportPage extends Component {
  static propTypes = {
    reportDay: PropTypes.string,
    sidePage: PropTypes.string,
    stations: PropTypes.array,
    reportStation: PropTypes.array,
    stationReportBaseData: PropTypes.array,
    reportDisableStation: PropTypes.array,
    dayReportConfig: PropTypes.array,
    toChangeDayReportStore: PropTypes.func,
    getReportUploadedStation: PropTypes.func,
    getStationBaseReport: PropTypes.func,
    showReportInputList: PropTypes.bool,
  }

  constructor(props){
    super(props);
    this.state = {
      reportDay: '',
      reportStation: [],
      dayReportTotalInfoArr: [], //用于上传日报的所有信息
      reportInfoErrorText: '',
      showReportError: false,
    }
  }

  componentDidMount(){ // 默认日期禁选电站列表。
    this.props.getReportUploadedStation({
      reportDay: moment().subtract(1,'day').format('YYYY-MM-DD'),
    })
  }

  componentWillReceiveProps(nextProps){
    const { stationReportBaseData } = this.props;
    const nextReportBaseData = nextProps.stationReportBaseData;
    if( nextReportBaseData.length > 0 && stationReportBaseData.length === 0){ // 得到初始化列表数据
      const dayReportTotalInfoArr = nextReportBaseData.map(e=>{
        let dailyReport = {...e};
        let dailyDetailList = e.dailyDetailList.map((fault,index)=>({
          ...fault,
          id: fault.defectId?fault.defectId:`lostAdd${index}`, // 若关联工单则使用，若非，由前端手动生成。=>上报前去掉。
          startTime: fault.startTime?moment(fault.startTime): null,
          endTime: fault.endTime?moment(fault.endTime): null,
          handle: false, // api返回的故障信息不可编辑
        })) || [];
        delete dailyReport.dailyDetailList;
        return {
          dailyReport, dailyDetailList
        }
      });
      this.setState({ dayReportTotalInfoArr })
    }
  }

  toReportList = () => { // 回日报列表页
    this.props.toChangeDayReportStore({
      showPage: 'list',
      reportDay: moment().subtract(1,'day').format('YYYY-MM-DD'),
      showReportInputList: false,
      reportStation: [],
    })
  }

  selectReportTime = (reportMoment,reportDay) => { // 存储选中日报时间并获取不可选电站列表
    reportDay && this.props.getReportUploadedStation({
      reportDay,
    })
  }

  toSelectCondition = () => { // 返回选择时间/电站
    this.props.toChangeDayReportStore({
      showReportInputList: false,
    })
  }

  stationSelected = (reportStation) => { // 存储选中的电站
    this.props.toChangeDayReportStore({
      reportStation
    })
  }

  toReportStations = () => { // 去填写各电站报表信息
    const { reportDay, reportStation } = this.props;
    this.props.getStationBaseReport({
      reportDay,
      reportStation,
    });
  }

  saveDayReport = () => { // 确认上报日报
    const { dayReportTotalInfoArr } = this.state;
    const { dayReportConfig } = this.props;
    const unitConfig = dayReportConfig[0] || {}; // 电量单位
    const requireTargetObj = dayReportConfig[1] || {}; 
    const tmpRequireTargetArr = Object.keys(requireTargetObj); // 指标必填信息数组(有多余信息)
    const genUnit = unitConfig.power || 'kWh'; // kWh两位小数，万kWh四位小数。
    const currentStationType = dayReportTotalInfoArr[0].dailyReport.stationType;
    const tmpReportBaseInfo = reportBasefun(currentStationType, genUnit); // 指标数组

    console.log(dayReportTotalInfoArr)
    let errorText = '';
    const totalInfoError = dayReportTotalInfoArr.find(info=>{ // 寻找错误数据并提取错误信息
      const eachStationInfo = info.dailyReport;
      const eachInfoError = tmpReportBaseInfo.find(config => { 
        const configRequired = tmpRequireTargetArr.includes(config.configName); // 必填数据项
        const requiredValue = eachStationInfo[config.configName];
        const maxPointLength = config.pointLength; // 指定的最大小数点位数
        const paramPointLength = (requiredValue && requiredValue.split('.')[1]) ? requiredValue.split('.')[1].length : 0;
        const dataFormatError = isNaN(requiredValue) || (maxPointLength && paramPointLength > maxPointLength); // 数据格式错误;
        if(configRequired && !requiredValue && requiredValue !== 0){ // 必填项未填
          errorText = `${eachStationInfo.stationName}${config.configText}未填写!`;
          return true;
        }else if(dataFormatError){ // 填写数据不规范
          errorText = `${eachStationInfo.stationName}${config.configText}请填写数字,不超过${maxPointLength}位小数!`;
          return true;
        }
        return false;
      })
      return eachInfoError
    })
    if(totalInfoError){ // 数据错误存在，提示
      this.setState({ 
        reportInfoErrorText: errorText,
        showReportError: true,
      })
    }else{ // 数据无误，调整数据结构并提交
      console.log('数据正确无误!')
    //to check 接口返回装机容量为stationCapacity，文档要求上传为realCapacity；
      const uploadInfo = dayReportTotalInfoArr.map(e=>{
        let { dailyReport, dailyDetailList } = e;
        delete dailyReport.warning;
        delete dailyReport.stationType;
        const newDailyDetailList = dailyDetailList.map(eachLost=>{
          const lostInfo = {
            deviceName: eachLost.deviceName,
            startTime: eachLost.startTime.format('YYYY-MM-DD HH:mm'),
            endTime: eachLost.endTime && eachLost.endTime.format('YYYY-MM-DD HH:mm'),
            reason: eachLost.reason,
            lostPower: eachLost.lostPower,
            process: eachLost.process,
            type: eachLost.type,
          }
          eachLost.id > 0 && (lostInfo.id = eachLost);
          return lostInfo;
        })
        return { dailyReport, dailyDetailList: newDailyDetailList};
      })
      this.props.
    }
  }

  totalReportInfoChange = (dayReportTotalInfoArr) => { // 用于上报的所有电站日报数据。
    this.setState({ dayReportTotalInfoArr });
  }

  disabledDate = (start) => {
    return start && start > moment();
  }

  render(){
    const { reportDay, stations, reportStation, showReportInputList, reportDisableStation } = this.props;
    const canReport = reportDay && reportStation && reportStation.length > 0;
    const { dayReportTotalInfoArr } = this.state;
    return (
      <div className={styles.sideReportPage} id="sideReportPage" >
        <div className={styles.sideReportTitle} >
          <span className={styles.sideReportTitleTip} >上报日报</span>
          <div className={styles.sideReportTitleRight} >
            {showReportInputList && <Button onClick={this.toSelectCondition} className={styles.dayReportPrev} >上一步</Button>}
            {showReportInputList && <Button onClick={this.saveDayReport} className={styles.saveDayReport} >保存</Button>}
            <Icon type="arrow-left" className={styles.backIcon}  onClick={this.toReportList} />
          </div>
        </div>
        {!showReportInputList && <div className={styles.sideReportContent}>
          <div className={styles.selectTime} >
            <span><i>*</i>日报时间</span>
            <DatePicker onChange={this.selectReportTime} value={moment(reportDay)} disabledDate={this.disabledDate} />
          </div>
          <div className={styles.selectStation} >
            <span><i>*</i>电站选择</span>
            <StationSelect 
              value={reportStation}
              data={stations}
              multiple={true}
              disabledStation={reportDisableStation}
              onChange={this.stationSelected}
            />
            <Button onClick={this.toReportStations} disabled={!canReport} className={canReport ? styles.dayReportNext : styles.dayReportNextDisabled} >下一步</Button>
          </div>
        </div>}
        {showReportInputList && <UploadReportList
          {...this.props} 
          totalReportInfoChange={this.totalReportInfoChange}
          dayReportTotalInfoArr={dayReportTotalInfoArr} 
        />}
      </div>
    )
  }
}

export default SideReportPage;
