import React from 'react';
import styles from './stationMain.scss';
import { stationStatusArray }  from '../../../../../constants/stationBaseInfo';
import TableColumnTitle from '../../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../../utils/utilFunc';

const stationManageTableColumn = [{
    title: '区域',
    dataIndex: 'regionName',
    key: 'regionName',
    sorter: true,
  },{
    title: '覆盖类型',
    dataIndex: 'coverType',
    key: 'coverType',
  },{
    title: <TableColumnTitle title="装机容量" unit="MW" />,
    dataIndex: 'stationCapacity',
    key: 'stationCapacity',
    render(text){ return numWithComma(text); },
    sorter: true,
  },{
    title: '发电单元数',
    dataIndex: 'stationUnitCount',
    key: 'stationUnitCount',
    sorter: true,
  },{
    title: '是否接入',
    dataIndex: 'isConnected',
    key: 'isConnected',
    sorter: true,
    render: (text, record, index) => {
      const { isConnected } = record; 
      return <span className={styles.contact}>{isConnected?'是':'否'}</span>
    }
  },{
    title: '电站状态',
    dataIndex: 'stationStatus',
    key: 'stationStatus',
    // sorter: true,
    render: (text, record, index) => {
      const { stationStatus } = record; 
      const statusInfo = stationStatusArray.find(e=>e.statusCode === stationStatus);
      const statusText = statusInfo && statusInfo.statusName || '--'
      return <span className={styles.contact}>{statusText}</span>
    }
  },{
    title: '测点',
    dataIndex: 'pointStatus',
    key: 'pointStatus',
    sorter: true,
    render: (text, record, index) => {
      const { pointStatus } = record; 
      if(pointStatus){
        return <span>已设置</span>
      }else{
        return <span className={styles.notSet}>未设置</span>
      }
    }
  },{
    title: '告警配置',
    dataIndex: 'alarmStatus',
    key: 'alarmStatus',
    sorter: true,
    render: (text, record, index) => {
      const { alarmStatus } = record; 
      if(alarmStatus){
        return <span>已设置</span>
      }else{
        return <span className={styles.notSet}>未设置</span>
      }
    }
  }
];

export default stationManageTableColumn;