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
    render: (text, record, index) => (<span className={styles.contact}>{record.stationStatus}</span>)
  },{
    title: '测点',
    dataIndex: 'pointStatus',
    key: 'pointStatus',
    sorter: true,
    render: (text, record, index) => (<span className={styles.point}>{record.pointStatus}</span>)
  },{
    title: '告警配置',
    dataIndex: 'alarmStatus',
    key: 'alarmStatus',
    sorter: true,
    render: (text, record, index) => (<span className={styles.alarm}>{record.alarmStatus}</span>)
  }
];

export default stationManageTableColumn;