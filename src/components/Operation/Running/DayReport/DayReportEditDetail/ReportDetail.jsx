
import React from 'react';
import { Button, Table, Icon } from 'antd';
import styles from './reportDetail.scss';
import moment from 'moment';

const loseColumn = [
  {
    title: '设备名称',
    dataIndex: 'deviceName',
  },{
    title: '损失电量类型',
    dataIndex: 'faultName',
  },{
    title: '原因说明',
    dataIndex: 'reason',
  },{
    title: '发生时间',
    dataIndex: 'startTime',
  },{
    title: '结束时间',
    dataIndex: 'endTime',
  },{
    title: '处理进展及问题',
    dataIndex: 'process',
  },{
    title: '日损失电量',
    dataIndex: 'lostPower',
  }
]
const limitColumn = [
  {
    title: '设备名称',
    dataIndex: 'deviceName',
  },{
    title: '限功率',
    dataIndex: 'limitPower',
  },{
    title: '原因说明',
    dataIndex: 'reason',
  },{
    title: '发生时间',
    dataIndex: 'startTime',
  },{
    title: '结束时间',
    dataIndex: 'endTime',
  },{
    title: '日损失电量',
    dataIndex: 'lostPower',
  }
]

const ReportDetail = ({ selectedDayReportDetail, toChangeDayReportStore , dayReportConfig, onSidePageChange }) => {
  const faultList = selectedDayReportDetail.faultList || [];
  const limitList = selectedDayReportDetail.limitList || [];
  const configUtil = dayReportConfig[0] || {};
  const radiationUnit = configUtil.radiation || '';
  const speedUnit = configUtil.speed || '';
  const genUnit = configUtil.power || '';
  const { stationType } = selectedDayReportDetail;

  const toReportList = () => {
    toChangeDayReportStore({
      showPage: 'list',
      selectedDayReportDetail: {},
    })
  }

  const toEditDetail = () => {
    onSidePageChange({ sidePage : 'edit'});
    toChangeDayReportStore({
      showPage: 'edit'
    });
  }
  const sourceInfoArr = [
    {name: '天气', value: 'weather', unit: ''},
    {name: '温度', value: 'temperature', unit: ''},
    {name: '电站名称', value: 'stationName', unit: ''},
    {name: '实际容量', value: 'realCapacity', unit: 'MW'},
    {name: '装机台数', value: 'machineCount', unit: '台'},
    {
      name: stationType>0? '日辐射总量(斜面)': '平均风速',
      value: 'resourceValue', 
      unit: stationType>0? radiationUnit: speedUnit,
    },
    {name: '日发电量(逆变器)', value: 'genInverter', unit: genUnit},
    {name: '日发电量(集电线路)', value: 'genIntegrated', unit: genUnit},
    {name: '日发电量(上网电量)', value: 'genInternet', unit: genUnit},
    {name: '日购网电量', value: 'dailyBuyPower', unit: genUnit},
    {name: '等效小时数', value: 'equivalentHours', unit: 'h'},
    {name: '样本逆变器容量', value: 'modelInverterCapacity', unit: 'MW'},
    {name: '样本逆变器发电量', value: 'modelInverterPowerGen', unit: genUnit},
  ]
  let { reportDate, createTimer, updateTimer } = selectedDayReportDetail;
  reportDate = reportDate? moment(reportDate).format('YYYY-MM-DD'): '--';
  createTimer = createTimer? moment(createTimer).format('YYYY-MM-DD HH:mm'): '--';
  updateTimer = updateTimer? moment(updateTimer).format('YYYY-MM-DD HH:mm'): '--';
  const { errorInfo } = selectedDayReportDetail
  return (
  <div className={styles.reportDetail} >
    <div className={styles.reportDetailTitle} >
      <span className={styles.reportDetailTitleTip}>日报详情</span>
      <div className={styles.reportDetailTitleRight}>
        <Button onClick={toEditDetail}  className={styles.reportEdit}>编辑</Button>
        <Icon type="arrow-left" className={styles.backIcon}  onClick={toReportList} />
      </div>
    </div>
    <div className={styles.resourceInfo} >
      <h4 className={styles.reportSubTitle} >资源电量信息<Icon type="caret-right" theme="outlined" /></h4>
      <div className={styles.resourceInfoCon}>
        <span className={styles.eachResourceInfo} >
          <span className={styles.eachResourceInfoName} >日报日期</span>
          <span className={styles.eachResourceInfoValue} >{reportDate}</span>
        </span>
        {sourceInfoArr.map(e=>{
          let targetValue = selectedDayReportDetail[e.value];
          const stationValue = (targetValue || targetValue === 0)?targetValue: '--';
          return (<span key={e.name} className={styles.eachResourceInfo} >
            <span className={styles.eachResourceInfoName} >{e.name}</span>
            <span className={styles.eachResourceInfoValue} >{stationValue}</span>
            <span className={styles.eachResourceInfoUnit} >{e.unit}</span>
          </span>)
        })}
      </div>
    </div>
    <div className={styles.lostInfo} >
      <h4 className={styles.reportSubTitle} >损失电量信息<Icon type="caret-right" theme="outlined" /></h4>
      {faultList.length === 0 ? <span className={styles.noListData}>无</span>:<Table 
        columns={loseColumn} 
        dataSource={faultList.map((e,i)=>({
          ...e,
          key: i,
          startTime: e.startTime?moment(e.startTime).format('YYYY-MM-DD'):'--',
          endTime: e.endTime?moment(e.endTime).format('YYYY-MM-DD'):'--',
        }))}
        pagination={false}
        className={styles.lostInfoTable}
      />}
    </div>
    <div className={styles.limitInfo} >
      <h4 className={styles.reportSubTitle} >限电信息<Icon type="caret-right" theme="outlined" /></h4>
      {limitList.length === 0 ? <span className={styles.noListData}>无</span>:<Table 
        columns={limitColumn} 
        dataSource={limitList.map((e,i)=>({
          ...e,
          key: i,
          startTime: e.startTime?moment(e.startTime).format('YYYY-MM-DD'):'--',
          endTime: e.endTime?moment(e.endTime).format('YYYY-MM-DD'):'--',
        }))}
        pagination={false}
        className={styles.limitInfoTable}
      />}
    </div>
    <div className={styles.powerGenInfo} >
      <h4 className={styles.reportSubTitle} >发电信息<Icon type="caret-right" theme="outlined" /></h4>
      <span className={styles.powerGenInfoCon}>{errorInfo?errorInfo:'正常'}</span>
    </div>
    <div className={styles.operateInfo} >
      <h4 className={styles.reportSubTitle} >操作信息<Icon type="caret-right" theme="outlined" /></h4>
      <div className={styles.operateInfoCon}>
        <span>
          <span className={styles.operateInfoName}>上传人</span>
          <span>{selectedDayReportDetail.userFullName || '--'}</span>
        </span>
        <span>
          <span className={styles.operateInfoName}>上传时间</span>
          <span>{createTimer}</span>
        </span>
        <span>
          <span className={styles.operateInfoName}>最新更新时间</span>
          <span>{updateTimer}</span>
        </span>
      </div>
    </div>
  </div>)
}

export default ReportDetail;
