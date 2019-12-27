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
  render: (text) => <div className={styles.regionNameText} title={text}>{numWithComma(text)}</div>,
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
    return <span className={styles.isConnectedText}>{text ? '是' : '否'}</span>
  }
}, {
  title: '电站状态',
  dataIndex: 'stationStatus',
  key: 'stationStatus',
  className: styles.stationStatus,
  render: (text, record) => {
    const { stationStatus } = record;
    const statusInfo = stationStatusArray.find(e => e.statusCode === stationStatus);
    const statusText = statusInfo && statusInfo.statusName || '--';
    return <span className={styles.stationStatus}>{statusText}</span>
  }
},
{
  title: '测点',
  dataIndex: 'pointStatus',
  key: 'pointStatus',
  className: styles.pointStatus,
  render: (text) => {
    return <span className={styles.pointStatusText}>{text && '已设置' || '未设置'}</span>
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
{
  title: '遥信诊断',
  dataIndex: 'eventYxStatus',
  key: 'eventYxStatus',
  className: styles.eventStatus,
  render: (text, record, index) => {
    const { pointStatus, stationType } = record;
    const title = pointStatus && '已设置' || '未设置';
    return (<div className={styles.eventStatusText}>
      <i className={`iconfont ${pointStatus && 'icon-look' || 'icon-goset'}`} title={title} />
    </div>)
  },
},
{
  title: '遥测诊断',
  dataIndex: 'eventYcStatus',
  key: 'eventYcStatus',
  className: styles.eventStatus,
  render: (text, record, index) => {
    const { pointStatus, stationType } = record;
    const title = pointStatus && '已设置' || '未设置';
    return (<div className={`${styles.eventStatusText} ${styles.disabled}`}>
      <i className={`iconfont ${pointStatus && 'icon-look' || 'icon-goset'}`} title={title} />
    </div>)
  },
},
{
  title: '数据质量诊断',
  dataIndex: 'eventDataStatus',
  key: 'eventDataStatus',
  className: styles.eventDataStatus,
  render: (text, record, index) => {
    const { pointStatus, stationType } = record;
    const title = pointStatus && '已设置' || '未设置';
    return (<div className={styles.eventDataStatusText}>
      <i className={`iconfont ${pointStatus && 'icon-look' || 'icon-goset'}`} title={title} />
    </div>)
  },
},
];

export default stationManageTableColumn;