import React from 'react';
import styles from './stationMain.scss';

const stationManageTableColumn = [{
    title: '区域',
    dataIndex: 'area',
    key: 'area',
    sorter: true,
  },{
    title: '覆盖类型',
    dataIndex: 'coverType',
    key: 'coverType',
  },{
    title: '并网类型',
    dataIndex: 'connectionType',
    key: 'connectionType',
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
    title: '电站接入',
    dataIndex: 'stationStatus',
    key: 'stationStatus',
    sorter: true,
    render: (text, record, index) => {
      const { stationStatus } = record; 
      if(stationStatus){
        return <span className={styles.contact}>通讯正常</span>
      }else{
        return <span className={styles.contact}>未接入</span>
      }
    }
  },{
    title: '测点',
    dataIndex: 'pointStatus',
    key: 'pointStatus',
    sorter: true,
    render: (text, record, index) => {
      const { pointStatus } = record; 
      if(pointStatus){
        return <span className={styles.point}>已设置</span>
      }else{
        return <span className={styles.point}>未设置</span>
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
        return <span className={styles.alarm}>已设置</span>
      }else{
        return <span className={styles.alarm}>未设置</span>
      }
    }
  }
];

export default stationManageTableColumn;