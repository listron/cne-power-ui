import React from 'react';
import { dataFormats } from '@utils/utilFunc';
import moment from 'moment';
import styles from './eventListPage.scss';

// 告警事件筛选条件: 电站名称, 设备类型，发生时间， 告警事件， 事件状态， 归档按钮
// 诊断事件筛选条件: 电站名称，设备类型，发生时间， 诊断事件， 事件状态， 归档按钮
// 数据事件筛选条件: 电站名称，设备类型，发生时间， 数据事件， 时间状态， 归档按钮

// 告警事件表头： 告警事件，事件级别，告警描述，设备类型，设备名称，电站名称，发生时间，持续时长，发生频次，事件状态，操作
// 诊断事件表头： 诊断事件，事件级别，设备类型，设备名称，电站名称，发生时间，持续时长，事件状态，操作 => 比上少一个告警描述， 一个发生频次
// 数据事件表头： 数据事件，事件级别，测点描述，设备类型，设备名称，电站名称，发生时间，持续时长，事件状态，操作 => 告警描述变为测点描述，少一个发生频次

// 告警事件归档表头：归档状态标识，告警事件，事件级别，告警描述，设备类型，设备名称，电站名称，发生时间，持续时长，发生频次，操作
// 诊断事件归档表头: 归档状态标识，诊断事件，事件级别，设备类型，设备名称，电站名称，发生时间，持续时长，操作 => 少一个发生频次， 一个告警描述;
// 数据事件归档表头: 归档状态标识，数据事件，事件级别，测点描述，设备类型，设备名称，电站名称，发生时间，持续时长，操作 => 少一个发生频次;

// diagWarningId	string	事件Id
// eventCode	string	标准事件编码
// eventName	string	标准事件名称
// statusCode	int	事件状态编码
// statusName	string	事件状态名称
// warningLevel	int	事件级别
// pointCode	string	测点编码
// pointValueDesc	string	信号/事件描述
// deviceTypeCode	int	设备类型编码
// deviceTypeName	string	设备类型名称
// stationCode	int	电站编码
// stationName	string	电站名称
// deviceFullcode	string	设备全编码
// deviceName	string	设备名称
// beginTime	string	发生时间
// warningDuration	float	持续时长
// warningFrequency	int	发生频次

// listParams -> finished: 1归档事件, 0非归档事件
// 是否归档, 生成两个表头: 归档需要状态图标, 不需要事件状态列; 非归档不需要状态图标列, 需要事件状态列;
const columnFilter = (totalColumn, finished) => totalColumn.filter(e => (e.dataIndex !== (finished > 0 ? 'statusName' : 'statusCode')));

const eventLevelArray = ['--', '一级', '二级', '三级', '四级'];

const statusIcon = (record) => {
  const { statusName } = record;
  const statusClassNames = [{
    name: '已完成',
    value: `iconfont icon-ywancheng ${styles.done}`, // 已完成
  }, {
    name: '已忽略',
    value: `iconfont icon-yhulue ${styles.ignore}`, // 已忽略
  }];
  const statusStyleInfo = statusClassNames.find(e => e.name === statusName) || {};
  return (
    <span className={statusStyleInfo.value || ''} />
  );
};

export const createAlarmColumn = (finished, ...handlers) => { // 生成告警事件表头 finishStatus 是否归档; handlers 交互事件
  const totalColumn = [
    {
      dataIndex: 'statusCode',
      title: '',
      className: styles.finishIcon,
      render: (text, record) => statusIcon(record),
    }, {
      dataIndex: 'eventName',
      title: '告警事件',
      sorter: true,
      className: styles.eventName,
      render: (text = '--') => (<div title={text} className={styles.eventNameText}>{text}</div>),
    }, {
      dataIndex: 'warningLevel',
      title: '事件级别',
      sorter: true,
      className: styles.warningLevel,
      render: (text = '--') => (<div title={eventLevelArray[text] || '--'} className={styles.warningLevelText}>{eventLevelArray[text] || '--'}</div>),
    }, {
      dataIndex: 'pointValueDesc',
      title: '告警描述',
      className: styles.pointValueDesc,
      render: (text = '--') => (<div title={text} className={styles.pointValueDescText}>{text}</div>),
    }, {
      dataIndex: 'deviceTypeName',
      title: '设备类型',
      sorter: true,
      className: styles.deviceTypeName,
      render: (text = '--') => (<div title={text} className={styles.deviceTypeNameText}>{text}</div>),
    }, {
      dataIndex: 'deviceName',
      title: '设备名称',
      sorter: true,
      className: styles.deviceName,
      render: (text = '--') => (<div title={text} className={styles.deviceNameText}>{text}</div>),
    }, {
      dataIndex: 'stationName',
      title: '电站名称',
      // sorter: true,
      className: styles.stationName,
      render: (text = '--') => (<div title={text} className={styles.stationNameText}>{text}</div>),
    }, {
      dataIndex: 'beginTime',
      title: '发生时间',
      sorter: true,
      className: styles.beginTime,
      render: (text) => (
        <div
          title={text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'}
          className={styles.beginTimeText}
        >{text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'}</div>
      ),
    }, {
      dataIndex: 'warningDuration',
      title: '持续时长',
      sorter: true,
      className: styles.warningDuration,
      render: (text = '--') => (
        <div
          title={dataFormats(text, '--', 2, true)}
          className={styles.warningDurationText}
        >{dataFormats(text, '--', 2, true)}h</div>
      ),
    }, {
      dataIndex: 'warningFrequency',
      title: '发生频次',
      sorter: true,
      className: styles.warningFrequency,
      render: (text = '--') => (<div title={text} className={styles.warningFrequencyText}>{text}</div>),
    }, {
      dataIndex: 'statusName',
      title: '事件状态',
      sorter: true,
      className: styles.statusName,
      render: (text = '--') => (<div title={text} className={styles.statusNameText}>{text}</div>),
    }, {
      dataIndex: 'handle',
      title: '操作',
      className: styles.handleStyle,
      render: (text, record) => (
        <div>
          <span className={styles.handleAnalysis} onClick={() => handlers[0](record)}>分析</span>
        </div>
      ),
    },
  ];
  // 是否归档, 生成两个表头: 归档需要状态图标, 不需要事件状态列; 非归档不需要状态图标列, 需要事件状态列;
  return columnFilter(totalColumn, finished);
};

export const createDiagnoseColumn = (finished, ...handlers) => { // 诊断事件表头 finishStatus 是否归档; handlers 交互事件
  const totalColumn = [
    {
      dataIndex: 'statusCode',
      title: '',
      className: styles.finishIcon,
      render: (text, record) => statusIcon(record),
    }, {
      dataIndex: 'eventName',
      title: '诊断事件',
      sorter: true,
      className: styles.eventName,
      render: (text = '--') => (<div title={text} className={styles.eventNameText}>{text}</div>),
    }, {
      dataIndex: 'warningLevel',
      title: '事件级别',
      sorter: true,
      className: styles.warningLevel,
      render: (text = '--') => (<div title={eventLevelArray[text] || '--'} className={styles.warningLevelText}>{eventLevelArray[text] || '--'}</div>),
    }, {
      dataIndex: 'deviceTypeName',
      title: '设备类型',
      sorter: true,
      className: styles.deviceTypeName,
      render: (text = '--') => (<div title={text} className={styles.deviceTypeNameText}>{text}</div>),
    }, {
      dataIndex: 'deviceName',
      title: '设备名称',
      sorter: true,
      className: styles.deviceName,
      render: (text = '--') => (<div title={text} className={styles.deviceNameText}>{text}</div>),
    }, {
      dataIndex: 'stationName',
      title: '电站名称',
      sorter: true,
      className: styles.stationName,
      render: (text = '--') => (<div title={text} className={styles.stationNameText}>{text}</div>),
    }, {
      dataIndex: 'beginTime',
      title: '发生时间',
      sorter: true,
      className: styles.beginTime,
      render: (text) => (
        <div
          title={text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'}
          className={styles.beginTimeText}
        >{text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'}</div>
      ),
    }, {
      dataIndex: 'warningDuration',
      title: '持续时长',
      sorter: true,
      className: styles.warningDuration,
      render: (text = '--') => (
        <div
          title={dataFormats(text, '--', 2, true)}
          className={styles.warningDurationText}
        >{dataFormats(text, '--', 2, true)}h</div>
      ),
    }, {
      dataIndex: 'statusName',
      title: '事件状态',
      sorter: true,
      className: styles.statusName,
      render: (text = '--') => (<div title={text} className={styles.statusNameText}>{text}</div>),
    }, {
      dataIndex: 'handle',
      title: '操作',
      className: styles.handleStyle,
      render: (text, record) => (
        <div>
          <span className={styles.handleAnalysis} onClick={() => handlers[0](record)}>分析</span>
        </div>
      ),
    },
  ];
  return columnFilter(totalColumn, finished);
};

export const createDataColumn = (finished, ...handlers) => { //数据事件表头 finishStatus 是否归档; handlers 交互事件
  const totalColumn = [
    {
      dataIndex: 'statusCode',
      title: '',
      className: styles.finishIcon,
      render: (text, record) => statusIcon(record),
    }, {
      dataIndex: 'eventName',
      title: '数据事件',
      sorter: true,
      className: styles.eventName,
      render: (text = '--') => (<div title={text} className={styles.eventNameText}>{text}</div>),
    }, {
      dataIndex: 'warningLevel',
      title: '事件级别',
      sorter: true,
      className: styles.warningLevel,
      render: (text = '--') => (<div title={eventLevelArray[text] || '--'} className={styles.warningLevelText}>{eventLevelArray[text] || '--'}</div>),
    }, {
      dataIndex: 'pointValueDesc',
      title: '测点描述',
      className: styles.pointValueDesc,
      render: (text = '--') => (<div title={text} className={styles.pointValueDescText}>{text}</div>),
    }, {
      dataIndex: 'deviceTypeName',
      title: '设备类型',
      sorter: true,
      className: styles.deviceTypeName,
      render: (text = '--') => (<div title={text} className={styles.deviceTypeNameText}>{text}</div>),
    }, {
      dataIndex: 'deviceName',
      title: '设备名称',
      sorter: true,
      className: styles.deviceName,
      render: (text = '--') => (<div title={text} className={styles.deviceNameText}>{text}</div>),
    }, {
      dataIndex: 'stationName',
      title: '电站名称',
      sorter: true,
      className: styles.stationName,
      render: (text = '--') => (<div title={text} className={styles.stationNameText}>{text}</div>),
    }, {
      dataIndex: 'beginTime',
      title: '发生时间',
      sorter: true,
      className: styles.beginTime,
      render: (text = '--') => (
        <div
          title={text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'}
          className={styles.beginTimeText}
        >{text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'}</div>
      ),
    }, {
      dataIndex: 'warningDuration',
      title: '持续时长',
      sorter: true,
      className: styles.warningDuration,
      render: (text = '--') => (
        <div
          title={dataFormats(text, '--', 2, true)}
          className={styles.warningDurationText}
        >{dataFormats(text, '--', 2, true)}h</div>
      ),
    }, {
      dataIndex: 'statusName',
      title: '事件状态',
      sorter: true,
      className: styles.statusName,
      render: (text = '--') => (<div title={text} className={styles.statusNameText}>{text}</div>),
    }, {
      dataIndex: 'handle',
      title: '操作',
      className: styles.handleStyle,
      render: (text, record) => (
        <div>
          <span className={styles.handleAnalysis} onClick={() => handlers[0](record)}>分析</span>
        </div>
      ),
    },
  ];
  return columnFilter(totalColumn, finished);
};






