
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { DatePicker, Button, Icon, message, Popconfirm } from 'antd';
import StationSelect from '../../../../Common/StationSelect';
import UploadReportList from './UploadReportList';
import moment from 'moment';
import { reportBasefun, allReportCheck } from '../reportBaseFun';
import WarningTip from '../../../../Common/WarningTip';

class SideReportPage extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    showPage: PropTypes.string,
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
    uploadDayReport: PropTypes.func,
    showReportInputList: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      reportDay: '',
      reportStation: [],
      dayReportTotalInfoArr: [], //用于上传日报的所有信息
      warningKey: null, // 返回的提示框 => null, 'lastStep', 'backList'
      warningTipText: '', // 提示框文字
    };
  }

  componentDidMount() { // 默认日期禁选电站列表。
    const { stationReportBaseData, showReportInputList } = this.props;
    showReportInputList && this.setOriginState(stationReportBaseData);
    message.destroy();
    message.config({
      top: 400,
      duration: 2,
      maxCount: 1,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { showReportInputList } = this.props;
    const nextReportBaseData = nextProps.stationReportBaseData;
    const nextShowList = nextProps.showReportInputList;
    !showReportInputList && nextShowList && this.setOriginState(nextReportBaseData);
  }

  setOriginState = data => { // 远端数据存为本地state待填充处理。
    const dayReportTotalInfoArr = data.map(e => {
      const dailyReport = { ...e };
      const dailyDetailList = e.dailyDetailList.map((fault, index) => ({
        ...fault,
        id: `${index}`, // 用于确定数据是从前端生成还是后台给予，上报前去掉。
        startTime: fault.startTime ? moment(fault.startTime) : null,
        endTime: fault.endTime ? moment(fault.endTime) : null,
        handle: false, // api返回的故障信息不可编辑
      })) || [];
      delete dailyReport.dailyDetailList;
      return {
        dailyReport, dailyDetailList,
      };
    });
    this.setState({ dayReportTotalInfoArr });
  }

  cancelWarningTip = () => { // 取消返回列表
    this.setState({
      warningKey: null,
      warningTipText: '',
    });
  }

  giveupReport = () => { // 放弃上报 => 上一步或返回列表。
    const { warningKey } = this.state;
    this.setState({
      warningKey: null, // 返回的提示框 => null, 'lastStep', 'backList'
      warningTipText: '', // 提示框文字
    });
    if (warningKey === 'lastStep') { // 上一步
      this.props.toChangeDayReportStore({
        showReportInputList: false,
      });
    } else if (warningKey === 'backList') { // 返回列表
      this.props.toChangeDayReportStore({
        showPage: 'list',
        reportDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        showReportInputList: false,
        reportStation: [],
      });
    }
  }

  selectReportTime = (reportMoment, reportDay) => { // 存储选中日报时间并获取不可选电站列表
    reportDay && this.props.getReportUploadedStation({
      reportDay,
    });
  }

  backList = () => { // 点击返回列表
    this.dataCheck('backList');
  }

  toSelectCondition = () => { // 点击返回选择时间/电站选择页
    this.dataCheck('lastStep');
  }

  dataCheck = (warningKey) => { // 检查数据并提醒用户保存 => 放弃保存后退出本页
    const { dayReportTotalInfoArr } = this.state;
    const configInfoArr = reportBasefun();
    const uploadInfoExist = dayReportTotalInfoArr.find(eachInfo => {
      const eachStationInfo = eachInfo.dailyReport;
      return configInfoArr.find(config => eachStationInfo[config.configName]);
    });
    const hasAbnormal = dayReportTotalInfoArr.some(e => e.dailyDetailList && e.dailyDetailList.length > 0);
    if (hasAbnormal || uploadInfoExist) { // 已有数据添加 或 异常数据记录
      let warningTipText = '';
      hasAbnormal && !uploadInfoExist && (warningTipText = '损失数据未保存,确认放弃?');
      hasAbnormal && uploadInfoExist && (warningTipText = '损失和发电信息未保存,确认放弃?');
      !hasAbnormal && uploadInfoExist && (warningTipText = '发电信息未保存,确认放弃?');
      this.setState({ // 提醒用户是否确认返回列表
        warningKey,
        warningTipText,
      });
    } else if (warningKey === 'lastStep') { // 上一步触发
      this.props.toChangeDayReportStore({
        showReportInputList: false,
      });
    } else if (warningKey === 'backList') { // 放弃日报上传
      this.props.toChangeDayReportStore({ // 返回列表页
        showPage: 'list',
        reportDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        showReportInputList: false,
        reportStation: [],
      });
    }
  }

  stationSelected = (reportStation) => { // 存储选中的电站
    this.props.toChangeDayReportStore({
      reportStation,
    });
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
    const { dayReportConfig, loading } = this.props;
    if (loading) { return; }
    const totalInfoError = dayReportTotalInfoArr.find(info => { // 依次检测每个电站数据是否有不合格数据。
      const stationCheckResult = allReportCheck(info.dailyReport, dayReportConfig);
      if (!stationCheckResult.result) { // 有不合格数据
        message.warn(stationCheckResult.message);
        return true;
      }
    });
    if (totalInfoError) {
      return;
    }
    const uploadInfo = dayReportTotalInfoArr.map(e => {
      const { dailyReport, dailyDetailList } = e;
      delete dailyReport.warning;
      dailyReport.realCapacity = dailyReport.stationCapacity;
      dailyReport.equivalentHours = dailyReport.hour;
      delete dailyReport.stationCapacity; // 基础信息字段调整
      delete dailyReport.hour;
      delete dailyReport.yesterdayyearGenIntegrated;
      delete dailyReport.yesterdayyearGenInternet;
      delete dailyReport.yesterdayyearGenInverter;
      const newDailyDetailList = dailyDetailList.map(eachLost => {
        const lostInfo = {
          defectId: eachLost.defectId,
          deviceName: eachLost.deviceName,
          deviceCode: eachLost.deviceCode,
          startTime: eachLost.startTime.format('YYYY-MM-DD HH:mm'),
          endTime: eachLost.endTime && eachLost.endTime.format('YYYY-MM-DD HH:mm'),
          reason: eachLost.reason,
          lostPower: eachLost.lostPower,
          limitPower: eachLost.limitPower,
          process: eachLost.process,
          faultId: eachLost.faultId,
          faultName: eachLost.faultName,
          deviceTypeCode: eachLost.deviceTypeCode,
          deviceTypeName: eachLost.deviceTypeName,
          deviceId: eachLost.deviceId,
          type: eachLost.type,
        };
        return lostInfo;
      });
      return { dailyReport, dailyDetailList: newDailyDetailList };
    });
    this.props.uploadDayReport({ allStationDailyDetailList: uploadInfo });

  }

  totalReportInfoChange = (dayReportTotalInfoArr) => { // 用于上报的所有电站日报数据。
    this.setState({ dayReportTotalInfoArr });
  }

  disabledDate = (start) => {
    return start && start > moment();
  }

  render() {
    const { loading, reportDay, stations, reportStation, showReportInputList, reportDisableStation, showPage } = this.props;
    const canReport = reportDay && reportStation && reportStation.length > 0;
    const { dayReportTotalInfoArr, warningKey, warningTipText } = this.state;
    return (
      <div className={styles.sideReportPage} >
        <div className={styles.sideReportTitle} >
          <span className={styles.sideReportTitleTip} >上报日报</span>
          <div className={styles.sideReportTitleRight} >
            {showReportInputList && <Button onClick={this.toSelectCondition} className={styles.dayReportPrev} >上一步</Button>}
            {showReportInputList && <Popconfirm
              placement="leftTop"
              overlayClassName={styles.confirmBox}
              title="你确定要提交?"
              onConfirm={this.saveDayReport}
              okText="确定"
              cancelText="取消">
              <Button
                className={styles.saveDayReport}
                loading={loading}
              >提交</Button>
            </Popconfirm>}
            <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.backList} />
          </div>
        </div>
        {!showReportInputList && <div className={styles.sideReportContent}>
          <div className={styles.selectTime} >
            <span><i>*</i>日报时间</span>
            <DatePicker
              onChange={this.selectReportTime}
              value={moment(reportDay)}
              disabledDate={this.disabledDate}
              disabled={showPage === 'list'}
            />
          </div>
          <div className={styles.selectStation}>
            <span><i>*</i>电站选择</span>
            <StationSelect
              disabled={showPage === 'list'}
              value={reportStation}
              data={stations.filter(e => !reportDisableStation.includes(e.stationCode))}
              onChange={this.stationSelected}
              oneStyleOnly={true}
            />
            <Button onClick={this.toReportStations} disabled={!canReport} className={canReport ? styles.dayReportNext : styles.dayReportNextDisabled} >下一步</Button>
          </div>
        </div>}
        {showReportInputList && <UploadReportList
          {...this.props}
          totalReportInfoChange={this.totalReportInfoChange}
          dayReportTotalInfoArr={dayReportTotalInfoArr}
        />}
        {warningKey && <WarningTip
          style={{ width: '240px', height: '88px' }}
          onOK={this.giveupReport}
          onCancel={this.cancelWarningTip}
          value={warningTipText}
        />}
      </div>
    );
  }
}

export default SideReportPage;
