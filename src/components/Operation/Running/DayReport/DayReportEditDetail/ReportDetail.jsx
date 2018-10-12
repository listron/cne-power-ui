
import React from 'react';
import { Button, Table } from 'antd';

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

const ReportDetail = ({ selectedDayReportDetail, toChangeDayReportStore }) => {
  const faultList = selectedDayReportDetail.faultList || [];
  const limitList = selectedDayReportDetail.limitList || [];

  const toReportList = () => {
    toChangeDayReportStore({
      showPage: 'list',
      selectedDayReportDetail: {},
    })
  }

  const toEditDetail = () => {
    toChangeDayReportStore({
      showPage: 'edit'
    })
  }
  const { stationType } = selectedDayReportDetail;
  const sourceInfoArr = [ // todo 单位问题待完善。是否需要根据api进行动态配置？
    {name: '日报日期', value: 'reportDate', unit: ''},
    {name: '天气', value: 'weather', unit: ''},
    {name: '温度', value: 'temperature', unit: '℃'},
    {name: '电站名称', value: 'stationName', unit: ''},
    {name: '实际容量', value: 'realCapacity', unit: ''},
    {name: '装机台数', value: 'machineCount', unit: '台'},
    {name: stationType>0?'日辐射总量(斜面)':'平均风速', value: 'resourceValue', unit: stationType>0?'kWh':'m/s'},
    {name: '日发电量(逆变器)', value: 'genInverter', unit: ''},
    {name: '日发电量(集电线路)', value: 'genIntegrated', unit: ''},
    {name: '日发电量(上网电量)', value: 'genInternet', unit: ''},
    {name: '日购网电量', value: 'buyPower', unit: ''},
    {name: '等效小时数', value: 'equivalentHours', unit: ''},
    {name: '样本逆变器容量', value: 'modelInverterCapacity', unit: ''},
    {name: '样本逆变器发电量', value: 'modelInverterPowerGen', unit: ''},
  ]

  return (<div>
    <div>
      <span>日报详情</span>
      <Button onClick={toEditDetail}>编辑--注意，编辑应该在这里。</Button>
      <span onClick={toReportList}>返回</span>
    </div>
    <div>
      <h4>资源电量信息</h4>
      <div>
        {sourceInfoArr.map(e=>{
          const targetValue = selectedDayReportDetail[e.value];
          const stationValue = targetValue || targetValue === 0 || '--';
          return (<span key={e.name}>
            <span>{e.name}</span>
            <span>{stationValue}</span>
            <span>{e.unit}</span>
          </span>)
        })}
      </div>
    </div>
    <div>
      <h4>损失电量信息</h4>
      <Table 
        columns={loseColumn} 
        dataSource={faultList.map((e,i)=>({...e,key: i}))}
        pagination={false}
      />
    </div>
    <div>
      <h4>限电信息</h4>
      <Table 
        columns={limitColumn} 
        dataSource={limitList.map((e,i)=>({...e,key: i}))}
        pagination={false}
      />
    </div>
    <div>
      <h4>发电信息</h4>
      <p>{selectedDayReportDetail.errorInfo}</p>
    </div>
    <div>
      <h4>操作信息</h4>
      <div>
        <span>
          <span>上传人</span>
          <span>{selectedDayReportDetail.userFullName || '--'}</span>
        </span>
        <span>
          <span>上传时间</span>
          <span>{selectedDayReportDetail.createTimer || '--'}</span>
        </span>
        <span>
          <span>最新更新时间</span>
          <span>{selectedDayReportDetail.updateTimer || '--'}</span>
        </span>
      </div>
    </div>
  </div>)
}

export default ReportDetail;
