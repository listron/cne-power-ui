import React from 'react';
import styles from './stationMain.scss';

const stationManageTableColumn = [{
    title: '区域',
    dataIndex: 'area',
    key: 'area',
    sorter: true,
  },{
    title: '覆盖类型',
    dataIndex: 'copyType',
    key: 'copyType',
  },{
    title: '并网类型',
    dataIndex: 'connectionType',
    key: 'connectionType',
  },{
    title: '装机容量',
    dataIndex: 'capacity',
    key: 'capacity',
    sorter: true,
  },{
    title: '发电单元数',
    dataIndex: 'series',
    key: 'series',
    sorter: true,
  },{
    title: '电站接入',
    dataIndex: 'contact',
    key: 'contact',
    sorter: true,
    render: (text, record, index) => (<span className={styles.contact}>{record.contact}</span>)
  },{
    title: '测点',
    dataIndex: 'point',
    key: 'point',
    sorter: true,
    render: (text, record, index) => (<span className={styles.point}>{record.point}</span>)
  },{
    title: '告警配置',
    dataIndex: 'alarm',
    key: 'alarm',
    sorter: true,
    render: (text, record, index) => (<span className={styles.alarm}>{record.alarm}</span>)
  }
];

export default stationManageTableColumn;