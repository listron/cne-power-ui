
import React from 'react';
import { Button, Table, Icon } from 'antd';
import styles from './reportDetail.scss';
import PropTypes from 'prop-types';
import moment from 'moment';
import TableColumnTitle from '../../../../Common/TableColumnTitle';
import { dataFormat } from '../../../../../utils/utilFunc';
import { handleRight } from '@utils/utilFunc';

const loseColumn = [
  {
    title: '设备类型',
    dataIndex: 'deviceTypeName',
    className: 'deviceTypeName',
    render: (text, record) => (
      <span title={text} >{text}</span>
    ),
  }, {
    title: '设备名称',
    dataIndex: 'deviceName',
    className: 'deviceName',
    render: (text, record) => (
      <span title={text}>{text}</span>
    ),
  }, {
    title: '损失电量类型',
    dataIndex: 'faultName',
    className: 'faultName',
    render: (text, record) => (
      <span title={text} >{text}</span>
    ),
  }, {
    title: '原因说明',
    dataIndex: 'reason',
    className: 'reason',
    render: (text, record) => (
      <span title={text}>{text}</span>
    ),
  }, {
    title: '发生时间',
    dataIndex: 'startTime',
    className: 'startTime',
  }, {
    title: '结束时间',
    dataIndex: 'endTime',
    className: 'endTime',
  }, {
    title: '处理进展及问题',
    dataIndex: 'process',
    className: 'process',
    render: (text, record) => (
      <span title={text}>{text}</span>
    ),
  }, {
    title: () => <TableColumnTitle title="日损失电量" unit="kWh" />,
    dataIndex: 'lostPower',
    className: 'lostPower',
    render: (text, record) => (
      <span title={text}>{dataFormat(text)}</span>
    ),
  },
];
const limitColumn = [
  {
    title: '设备类型',
    dataIndex: 'deviceTypeName',
    className: 'deviceTypeName',
    render: (text, record) => (
      <span title={text}>{text}</span>
    ),
  }, {
    title: '设备名称',
    dataIndex: 'deviceName',
    className: 'deviceName',
    render: (text, record) => (
      <span title={text}>{text}</span>
    ),
  }, {
    title: '限功率(%)',
    dataIndex: 'limitPower',
    className: 'limitPower',
    render: (text, record) => (
      <span title={text}>{text}</span>
    ),
  }, {
    title: '原因说明',
    dataIndex: 'reason',
    className: 'reason',
    render: (text, record) => (
      <span title={text}>{text}</span>
    ),
  }, {
    title: '发生时间',
    dataIndex: 'startTime',
    className: 'startTime',
    render: (text, record) => (
      <span title={text}>{text}</span>
    ),
  }, {
    title: '结束时间',
    dataIndex: 'endTime',
    className: 'endTime',
    render: (text, record) => (
      <span title={text}>{text}</span>
    ),
  }, {
    title: () => <TableColumnTitle title="日损失电量" unit="kWh" />,
    dataIndex: 'lostPower',
    className: 'lostPower',
    render: (text, record) => (
      <span title={text}>{dataFormat(text)}</span>
    ),
  },
];

const ReportDetail = ({ selectedDayReportDetail, toChangeDayReportStore, dayReportConfig, onSidePageChange }) => {
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
    });
  };

  const toEditDetail = () => {
    onSidePageChange({ sidePage: 'edit' });
    toChangeDayReportStore({
      showPage: 'edit',
    });
  };
  // const sourceInfoArr = [
  //   // {name: '天气', value: 'weather', unit: ''},
  //   // {name: '温度', value: 'temperature', unit: ''},
  //   // {name: '电站名称', value: 'stationName', unit: ''},
  //   // {name: '实际容量', value: 'realCapacity', unit: 'MW'},
  //   // {name: '装机台数', value: 'machineCount', unit: '台'},
  //   {
  //     name: stationType>0? '日累计总量': '日均风速',
  //     value: 'resourceValue', 
  //     unit: stationType>0? radiationUnit: speedUnit,
  //   }, {
  //     name: `日发电量(${stationType>0?'逆变器':'风机机组'})`,
  //     value: 'genInverter', 
  //     unit: genUnit
  //   },
  //   {name: '日发电量(集电线路)', value: 'genIntegrated', unit: genUnit},
  //   {name: '日发电量(上网电量)', value: 'genInternet', unit: genUnit},
  //   {name: '日购网电量', value: 'dailyBuyPower', unit: genUnit},
  //   {name: '等效小时数', value: 'equivalentHours', unit: 'h'},
  //   {name: `${stationType>0?'样板逆变器':'样板风机'}容量`, value: 'modelInverterCapacity', unit: 'MW'},
  //   {name: `${stationType>0?'样板逆变器':'样板风机'}发电量`, value: 'modelInverterPowerGen', unit: genUnit},
  // ]
  const totalInfo = [
    {
      name: stationType > 0 ? '日累计辐射' : '日均风速',
      value: 'resourceValue',
      unit: stationType > 0 ? radiationUnit : speedUnit,
    },
    { name: '日等效小时数', value: 'equivalentHours', unit: 'h' },
    { name: '日故障损失电量', value: 'faultLost', unit: genUnit },
    { name: '日限电损失电量', value: 'limitLost', unit: genUnit },
  ];
  const inverterInfo = [
    { name: '日发电量', value: 'genInverter', unit: genUnit },
    { name: '年发电量', value: 'yearGenInverter', unit: genUnit },
    { name: '样板机容量', value: 'modelInverterCapacity', unit: 'MW' },
    { name: '样板机日发电量', value: 'modelInverterPowerGen', unit: genUnit },
  ];
  const integrateInfo = [
    { name: '日发电量', value: 'genIntegrated', unit: genUnit },
    { name: '年发电量', value: 'yearGenIntegrated', unit: genUnit },
  ];
  const netInfo = [
    { name: '日发电量', value: 'genInternet', unit: genUnit },
    { name: '年发电量', value: 'yearGenInternet', unit: genUnit },
    { name: '日购网电量', value: 'dailyBuyPower', unit: genUnit },
    { name: '年购网电量', value: 'buyPower', unit: genUnit },
  ];
  let { createTime, updateTime } = selectedDayReportDetail;
  // reportDate = reportDate? moment(reportDate).format('YYYY-MM-DD'): '--';
  createTime = createTime ? moment(createTime).format('YYYY-MM-DD HH:mm') : '--';
  updateTime = updateTime ? moment(updateTime).format('YYYY-MM-DD HH:mm') : '--';
  const { errorInfo } = selectedDayReportDetail;
  const errorArray = errorInfo && errorInfo.split(';').filter(e => !!e) || [];
  const reportRight = handleRight('daily_report');
  return (
    <div className={styles.reportDetail} >
      <div className={styles.reportDetailTitle} >
        <div className={styles.reportDetailTitleTip}>
          <span className={styles.mainTitle}>日报详情</span>
          <span className={styles.titleInfo}>{selectedDayReportDetail.stationName || '--'}</span>
          <span className={styles.titleInfo}>{selectedDayReportDetail.reportDate || '--'}</span>
          <span className={styles.titleInfo}>实际容量 {selectedDayReportDetail.realCapacity || '--'}MW</span>
          <span className={styles.titleInfo}>装机台数 {selectedDayReportDetail.machineCount || '--'}台</span>
          <span className={styles.weather}>天气 {selectedDayReportDetail.weather || '--'}</span>
          <span className={styles.titleInfo}>温度 {selectedDayReportDetail.temperature || '--'}</span>
        </div>
        <div className={styles.reportDetailTitleRight}>
          {reportRight && <Button onClick={toEditDetail} className={styles.reportEdit}>编辑</Button>}
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} onClick={toReportList} />
        </div>
      </div>
      <div className={styles.totalInfo}>
        <div className={styles.tooltip}>综合信息<Icon type="caret-right" theme="outlined" /></div>
        <div className={styles.infoDetail}>
          {totalInfo.map(e => (
            <span className={styles.eachInfo} key={e.name}>
              <span className={styles.name}>{e.name}</span>
              <span className={styles.value}>{dataFormat(selectedDayReportDetail[e.value])}</span>
              <span>{e.unit}</span>
            </span>
          ))}
        </div>
      </div>
      <div className={styles.totalInfo}>
        <div className={styles.tooltip}>{stationType > 0 ? '逆变器' : '风电机组'}信息<Icon type="caret-right" theme="outlined" /></div>
        <div className={styles.infoDetail}>
          {inverterInfo.map(e => (
            <span className={styles.eachInfo} key={e.name}>
              <span className={styles.name}>{e.name}</span>
              <span>{dataFormat(selectedDayReportDetail[e.value])}</span>
              <span>{e.unit}</span>
            </span>
          ))}
        </div>
      </div>
      <div className={styles.totalInfo}>
        <div className={styles.tooltip}>集电线路信息<Icon type="caret-right" theme="outlined" /></div>
        <div className={styles.infoDetail}>
          {integrateInfo.map(e => (
            <span className={styles.eachInfo} key={e.name}>
              <span className={styles.name}>{e.name}</span>
              <span>{dataFormat(selectedDayReportDetail[e.value])}</span>
              <span>{e.unit}</span>
            </span>
          ))}
        </div>
      </div>
      <div className={styles.totalInfo}>
        <div className={styles.tooltip}>关口表信息<Icon type="caret-right" theme="outlined" /></div>
        <div className={styles.infoDetail}>
          {netInfo.map(e => (
            <span className={styles.eachInfo} key={e.name}>
              <span className={styles.name}>{e.name}</span>
              <span>{dataFormat(selectedDayReportDetail[e.value])}</span>
              <span>{e.unit}</span>
            </span>
          ))}
        </div>
      </div>
      <div className={styles.lostInfo} >
        <h4 className={styles.reportSubTitle} >损失电量信息<Icon type="caret-right" theme="outlined" /></h4>
        {faultList.length === 0 ? <span className={styles.noListData}>无</span> : <Table
          columns={loseColumn}
          dataSource={faultList.map((e, i) => ({
            ...e,
            key: i,
            startTime: e.startTime ? moment(e.startTime).format('YYYY-MM-DD HH:mm') : '--',
            endTime: e.endTime ? moment(e.endTime).format('YYYY-MM-DD HH:mm') : '--',
          }))}
          pagination={false}
          className={styles.lostInfoTable}
        />}
      </div>
      <div className={styles.limitInfo} >
        <h4 className={styles.reportSubTitle} >限电信息<Icon type="caret-right" theme="outlined" /></h4>
        {limitList.length === 0 ? <span className={styles.noListData}>无</span> : <Table
          columns={limitColumn}
          dataSource={limitList.map((e, i) => ({
            ...e,
            key: i,
            startTime: e.startTime ? moment(e.startTime).format('YYYY-MM-DD HH:mm') : '--',
            endTime: e.endTime ? moment(e.endTime).format('YYYY-MM-DD HH:mm') : '--',
          }))}
          pagination={false}
          className={styles.limitInfoTable}
        />}
      </div>
      <div className={styles.powerGenInfo} >
        <h4 className={styles.reportSubTitle} >发电信息<Icon type="caret-right" theme="outlined" /></h4>
        <div className={styles.powerGenInfoCon}>
          {errorArray.length > 0 ? errorArray.map((e, i) => <div key={i}>{e}</div>) : '正常'}
        </div>
      </div>
      <div className={styles.operateInfo} >
        <h4 className={styles.reportSubTitle} >操作信息<Icon type="caret-right" theme="outlined" /></h4>
        <div className={styles.operateInfoCon}>
          <span>
            <span className={styles.operateInfoName}>上传人</span>
            <span>{selectedDayReportDetail.userFullName || selectedDayReportDetail.userName || '--'}</span>
          </span>
          <span>
            <span className={styles.operateInfoName}>上传时间</span>
            <span>{createTime}</span>
          </span>
          <span>
            <span className={styles.operateInfoName}>最新更新时间</span>
            <span>{updateTime}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

ReportDetail.propTypes = {
  selectedDayReportDetail: PropTypes.object,
  toChangeDayReportStore: PropTypes.func,
  dayReportConfig: PropTypes.array,
  onSidePageChange: PropTypes.func,
};

export default ReportDetail;
