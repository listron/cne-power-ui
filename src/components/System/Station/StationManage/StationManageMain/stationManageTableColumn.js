import React from 'react';
import styles from './stationMain.scss';

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
    title: '装机容量',
    dataIndex: 'stationCapacity',
    key: 'stationCapacity',
    sorter: true,
  },{
    title: '发电单元数',
    dataIndex: 'series',
    key: 'series',
    sorter: true,
  },{
    title: '是否接入',
    dataIndex: 'connected',
    key: 'connected',
    sorter: true,
    render: (text, record, index) => {
      const { stationStatus } = record; 
      return <span className={styles.contact}>{stationStatus?'是':'否'}</span>
    }
  },{
    title: '电站状态',
    dataIndex: 'stationStatus',
    key: 'stationStatus',
    sorter: true,
    render: (text, record, index) => {
      // const { stationStatus } = record; 
      return <span className={styles.contact}>{['通讯正常','信息中断','未接入'][index%3]}无字段</span>
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