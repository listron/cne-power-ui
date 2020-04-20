import React from 'react';
import styles from './stationMain.scss';
import { stationStatusArray } from '../../../../../constants/stationBaseInfo';
import { numWithComma } from '../../../../../utils/utilFunc';

const stationManageTableColumn = [{
  title: '区域',
  dataIndex: 'regionName',
  key: 'regionName',
  sorter: true,
  textAlign: 'left',
  width: '7.85%',
  render: (text) => <div className={styles.regionNameText} title={text}>{text || '--'}</div>,
},
{
  title: '装机容量(MW)',
  dataIndex: 'stationCapacity',
  key: 'stationCapacity',
  textAlign: 'right',
  width: '9%',
  render: (text) => numWithComma(text),
}, {
  title: '发电单元数',
  dataIndex: 'stationUnitCount',
  key: 'stationUnitCount',
  textAlign: 'right',
  width: '7.85%',
  render: (text) => text || '--',
}, {
  title: '是否接入',
  dataIndex: 'isConnected',
  key: 'isConnected',
  sorter: true,
  textAlign: 'center',
  width: '7.85%',
  render: (text) => text ? '是' : '否',
}, {
  title: '电站状态',
  dataIndex: 'stationStatus',
  key: 'stationStatus',
  textAlign: 'center',
  width: '7.85%',
  render: (text, record) => {
    const { stationStatus } = record;
    const statusInfo = stationStatusArray.find(e => e.statusCode === stationStatus);
    const statusText = statusInfo && statusInfo.statusName || '--';
    return statusText;
  },
},
{
  title: '测点',
  dataIndex: 'pointStatus',
  key: 'pointStatus',
  textAlign: 'center',
  width: '7.85%',
  render: (text) => text ? '已设置' : '未设置',
},
];

export default stationManageTableColumn;
