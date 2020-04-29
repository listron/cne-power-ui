import React from 'react';
import { dataFormats } from '@utils/utilFunc';
import moment from 'moment';
import styles from './eventListPage.scss';
import { Link } from 'react-router-dom';
import {stringify} from 'qs';

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
// updateTime string 更新时间
// warningDuration	float	持续时长
// warningFrequency	int	发生频次
// warningFrequencyRate string 频次

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
      render: (text, record) => {
        const {deviceTypeCode, pointCode, deviceFullcode, stationCode, diagWarningId} = record;
        const paramData={deviceTypeCode, pointCode, deviceFullcode, stationCode, diagWarningId, source: 'diagnoseCenter'};
        const searchStr = stringify(paramData);
        return (
          <Link to={{ pathname: '/system/station/alarmEvent',
                      search: `?${searchStr}`,
                      state: paramData }}
                target= "_blank"
                key={record.diagWarningId}>
            <div
              title={text}
              className={`${styles.eventNameText} ${styles.eventNameTextHover}`}
            >{text || '--'}</div>
          </Link>
        );
      },
    }, {
      dataIndex: 'warningLevel',
      title: '事件级别',
      sorter: true,
      className: styles.warningLevel,
      render: (text) => (<div title={eventLevelArray[text] || '--'} className={styles.warningLevelText}>{eventLevelArray[text] || '--'}</div>),
    }, {
      dataIndex: 'pointValueDesc',
      title: '告警描述',
      className: styles.pointValueDesc,
      render: (text) => (<div title={text || '--'} className={styles.pointValueDescText}>{text || '--'}</div>),
    }, {
      dataIndex: 'deviceTypeName',
      title: '设备类型',
      sorter: true,
      className: styles.deviceTypeName,
      render: (text) => (<div title={text || '--'} className={styles.deviceTypeNameText}>{text || '--'}</div>),
    }, {
      dataIndex: 'deviceName',
      title: '设备名称',
      sorter: true,
      className: styles.deviceName,
      render: (text) => (<div title={text || '--'} className={styles.deviceNameText}>{text || '--'}</div>),
    }, {
      dataIndex: 'stationName',
      title: '电站名称',
      sorter: true,
      className: styles.stationName,
      render: (text) => (<div title={text || '--'} className={styles.stationNameText}>{text || '--'}</div>),
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
    },
    // {
    //   dataIndex: 'warningDuration',
    //   title: '持续时长(h)',
    //   // sorter: true,
    //   className: styles.warningDuration,
    //   render: (text) => (
    //     <div
    //       title={dataFormats(text, '--', 2, true)}
    //       className={styles.warningDurationText}
    //     >{dataFormats(text, '--', 2, true)}</div>
    //   ),
    // },
    // {
    //   dataIndex: 'warningFrequency',
    //   title: '发生频次',
    //   sorter: true,
    //   className: styles.warningFrequency,
    //   render: (text) => (<div title={text || '--'} className={styles.warningFrequencyText}>{text || '--'}</div>),
    // },
    {
      dataIndex: 'updateTime',
      title: '更新时间',
      sorter: true,
      className: styles.updateTime,
      render: (text) => (
        <div
        title={text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'}
        className={styles.updateTimeText}
      >{text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'}</div>
      ),
    }, {
      dataIndex: 'warningFrequencyRate',
      title: '频次',
      sorter: true,
      className: styles.warningFrequencyRate,
      render: (text) => (<div title={dataFormats(text, '--', 2, true)} className={styles.warningFrequencyRateText}>{dataFormats(text, '--', 2, true)}</div>),
    },
    {
      dataIndex: 'statusName',
      title: '事件状态',
      sorter: true,
      className: styles.statusName,
      render: (text) => (<div title={text || '--'} className={styles.statusNameText}>{text || '--'}</div>),
    }, {
      dataIndex: 'handle',
      title: '操作',
      className: styles.handleStyle,
      render: (text, record) => (
        <div className={styles.handlers}>
          <i
            title="分析"
            className={`iconfont icon-fenx ${styles.handleAnalysis}`}
            onClick={() => handlers[0] && handlers[0](record)}
          />
          {record.statusCode === 3 && <i
            title="查看"
            className={`iconfont icon-kangd ${styles.toDefect}`}
            onClick={() => handlers[1] && handlers[1](record)}
          />}
          {record.statusCode === 7 && <i
            title="删除"
            className={`iconfont icon-del ${styles.handleDelete}`}
            onClick={() => handlers[2] && handlers[2](record)}
          />}
          <i
            title="EAM重发"
            className={`iconfont icon-cfeam ${styles.handleAnalysis}`}
            onClick={() => handlers[3] && handlers[3](record)}
          />
          <i
            title="EAM查看"
            className={`iconfont icon-keam ${styles.handleAnalysis}`}
            onClick={() => handlers[4] && handlers[4](record)}
          />
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
      render: (text) => (<div title={text || '--'} className={styles.eventNameText}>{text || '--'}</div>),
    }, {
      dataIndex: 'warningLevel',
      title: '事件级别',
      sorter: true,
      className: styles.warningLevel,
      render: (text) => (<div title={eventLevelArray[text] || '--'} className={styles.warningLevelText}>{eventLevelArray[text] || '--'}</div>),
    }, {
      dataIndex: 'deviceTypeName',
      title: '设备类型',
      sorter: true,
      className: styles.deviceTypeName,
      render: (text) => (<div title={text || '--'} className={styles.deviceTypeNameText}>{text || '--'}</div>),
    }, {
      dataIndex: 'deviceName',
      title: '设备名称',
      sorter: true,
      className: styles.deviceName,
      render: (text) => (<div title={text || '--'} className={styles.deviceNameText}>{text || '--'}</div>),
    }, {
      dataIndex: 'stationName',
      title: '电站名称',
      sorter: true,
      className: styles.stationName,
      render: (text) => (<div title={text || '--'} className={styles.stationNameText}>{text || '--'}</div>),
    }, {
      dataIndex: 'beginTime',
      title: '发生日期',
      sorter: true,
      className: styles.beginTime,
      render: (text) => (
        <div
          title={text ? moment(text).format('YYYY-MM-DD') : '--'}
          className={styles.beginTimeText}
        >{text ? moment(text).format('YYYY-MM-DD') : '--'}</div>
      ),
    // }, {
    //   dataIndex: 'warningDuration',
    //   title: '持续时长(h)',
    //   // sorter: true,
    //   className: styles.warningDuration,
    //   render: (text) => (
    //     <div
    //       title={dataFormats(text, '--', 2, true)}
    //       className={styles.warningDurationText}
    //     >{dataFormats(text, '--', 2, true)}</div>
    //   ),
    }, {
      dataIndex: 'updateTime',
      title: '更新日期',
      sorter: true,
      className: styles.updateTime,
      render: (text) => (
        <div
        title={text ? moment(text).format('YYYY-MM-DD') : '--'}
        className={styles.updateTimeText}
      >{text ? moment(text).format('YYYY-MM-DD') : '--'}</div>
      ),
    }, {
      dataIndex: 'warningFrequencyRate',
      title: '诊断频次',
      sorter: true,
      className: styles.warningFrequencyRate,
      render: (text) => (<div title={dataFormats(text, '--', 2, true)} className={styles.warningFrequencyRateText}>{dataFormats(text, '--', 2, true)}</div>),
    }, {
      dataIndex: 'statusName',
      title: '事件状态',
      sorter: true,
      className: styles.statusName,
      render: (text) => (<div title={text || '--'} className={styles.statusNameText}>{text || '--'}</div>),
    }, {
      dataIndex: 'handle',
      title: '操作',
      className: styles.handleStyle,
      render: (text, record) => (
        <div className={styles.handlers}>
          <i
            title="分析"
            className={`iconfont icon-fenx ${styles.handleAnalysis}`}
            onClick={() => handlers[0] && handlers[0](record)}
          />
          {record.statusCode === 3 && <i
            title="查看"
            className={`iconfont icon-kangd ${styles.toDefect}`}
            onClick={() => handlers[1] && handlers[1](record)}
          />}
          {record.statusCode === 7 && <i
            title="删除"
            className={`iconfont icon-del ${styles.handleDelete}`}
            onClick={() => handlers[2] && handlers[2](record)}
          />}
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
      render: (text) => (<div title={text || '--'} className={styles.eventNameText}>{text || '--'}</div>),
    }, {
      dataIndex: 'warningLevel',
      title: '事件级别',
      sorter: true,
      className: styles.warningLevel,
      render: (text) => (<div title={eventLevelArray[text] || '--'} className={styles.warningLevelText}>{eventLevelArray[text] || '--'}</div>),
    }, {
      dataIndex: 'pointValueDesc',
      title: '测点描述',
      className: styles.pointValueDesc,
      render: (text) => (<div title={text || '--'} className={styles.pointValueDescText}>{text || '--'}</div>),
    }, {
      dataIndex: 'deviceTypeName',
      title: '设备类型',
      sorter: true,
      className: styles.deviceTypeName,
      render: (text) => (<div title={text || '--'} className={styles.deviceTypeNameText}>{text || '--'}</div>),
    }, {
      dataIndex: 'deviceName',
      title: '设备名称',
      sorter: true,
      className: styles.deviceName,
      render: (text) => (<div title={text || '--'} className={styles.deviceNameText}>{text || '--'}</div>),
    }, {
      dataIndex: 'stationName',
      title: '电站名称',
      sorter: true,
      className: styles.stationName,
      render: (text) => (<div title={text || '--'} className={styles.stationNameText}>{text || '--'}</div>),
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
      title: '持续时长(h)',
      //sorter: true,
      className: styles.warningDuration,
      render: (text) => (
        <div
          title={dataFormats(text, '--', 2, true)}
          className={styles.warningDurationText}
        >{dataFormats(text, '--', 2, true)}</div>
      ),
    }, {
      dataIndex: 'statusName',
      title: '事件状态',
      sorter: true,
      className: styles.statusName,
      render: (text) => (<div title={text || '--'} className={styles.statusNameText}>{text || '--'}</div>),
    }, {
      dataIndex: 'handle',
      title: '操作',
      className: styles.handleStyle,
      render: (text, record) => (
        <div className={styles.handlers}>
          <i
            title="分析"
            className={`iconfont icon-fenx ${styles.handleAnalysis}`}
            onClick={() => handlers[0] && handlers[0](record)}
          />
          {record.statusCode === 3 && <i
            title="查看"
            className={`iconfont icon-kangd ${styles.toDefect}`}
            onClick={() => handlers[1] && handlers[1](record)}
          />}
          {record.statusCode === 7 && <i
            title="删除"
            className={`iconfont icon-del ${styles.handleDelete}`}
            onClick={() => handlers[2] && handlers[2](record)}
          />}
        </div>
      ),
    },
  ];
  return columnFilter(totalColumn, finished);
};






