import React from 'react';
import styles from './stationMain.scss';
import { stationStatusArray } from '../../../../../constants/stationBaseInfo';
import TableColumnTitle from '../../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../../utils/utilFunc';

const stationManageTableColumn = [{
  title: '区域',
  dataIndex: 'regionName',
  key: 'regionName',
  sorter: true,
  className: styles.regionName,
  render: (text) => <div className={styles.regionNameText} title={text}>{text || '--'}</div>,
},
{
  title: '装机容量(MW)',
  dataIndex: 'stationCapacity',
  key: 'stationCapacity',
  className: styles.stationCapacity,
  render: (text) => <div className={styles.stationCapacityText} title={text}>{numWithComma(text)}</div>,
}, {
  title: '发电单元数',
  dataIndex: 'stationUnitCount',
  key: 'stationUnitCount',
  className: styles.stationUnitCount,
  render: (text) => <div className={styles.stationUnitCountText} title={text}>{text || '--'}</div>,
}, {
  title: '是否接入',
  dataIndex: 'isConnected',
  key: 'isConnected',
  sorter: true,
  className: styles.isConnected,
  render: (text) => {
    return <div className={styles.isConnectedText}>{text ? '是' : '否'}</div>;
  },
}, {
  title: '电站状态',
  dataIndex: 'stationStatus',
  key: 'stationStatus',
  className: styles.stationStatus,
  render: (text, record) => {
    const { stationStatus } = record;
    const statusInfo = stationStatusArray.find(e => e.statusCode === stationStatus);
    const statusText = statusInfo && statusInfo.statusName || '--';
    return <div className={styles.stationStatusText}>{statusText}</div>;
  },
},
{
  title: '测点',
  dataIndex: 'pointStatus',
  key: 'pointStatus',
  className: styles.pointStatus,
  render: (text) => {
    return <div className={styles.pointStatusText}>{text && '已设置' || '未设置'}</div>;
  },
},
  // {
  //   title: '告警配置',
  //   dataIndex: 'alarmStatus',
  //   key: 'alarmStatus',
  //   sorter: true,
  //   render: (text, record, index) => {
  //     const { alarmStatus } = record;
  //     if (alarmStatus) {
  //       return <span>已设置</span>;
  //     }
  //     return <span className={styles.notSet}>未设置</span>;
  //   },
  // }

];

export default stationManageTableColumn;
