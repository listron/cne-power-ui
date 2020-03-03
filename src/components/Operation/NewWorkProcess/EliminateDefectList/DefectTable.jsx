import React, { Component } from 'react';
import CneTable from '@components/Common/Power/CneTable';
import styles from './listPage.scss';

export default class DefectTable extends Component {

  defectColumn = [
    {
      title: '电站名称',
      dataIndex: 'stationName',
      sorter: true,
      className: styles.stationName,
      render: (text) => (
        <div
          className={styles.stationNameText}
          title={text || ''}
        >{text || '--'}</div>
      ),
    }, {
      title: '工单描述',
      dataIndex: 'defectDesc',
      className: styles.defectDesc,
      render: (text) => (
        <div
          className={styles.defectDescText}
          title={text || ''}
        >{text || '--'}</div>
      ),
    }, {
      title: '事件数量',
      dataIndex: 'eventNum',
      className: styles.eventNum,
      sorter: true,
      render: (text) => (
        <div
          className={styles.eventNumText}
          title={text || ''}
        >{text || '--'}</div>
      ),
    }, {
      title: '工单创建时间',
      dataIndex: 'createTime',
      className: styles.createTime,
      sorter: true,
      render: (text) => (
        <div
          className={styles.createTimeText}
          title={text || ''}
        >{text || '--'}</div>
      ),
    }, {
      title: '执行人',
      dataIndex: 'handlers',
      className: styles.handlers,
      sorter: true,
      render: (text) => (
        <div
          className={styles.handlersText}
          title={text || ''}
        >{text || '--'}</div>
      ),
    }, {
      title: '状态',
      dataIndex: 'status',
      className: styles.status,
      sorter: true,
      render: (text) => (
        <div
          className={styles.statusText}
          title={text || ''}
        >{text || '--'}</div>
      ),
    }, {
      title: '操作',
      dataIndex: 'handle',
      className: styles.handle,
      sorter: true,
      render: (text, record) => (
        <div
          className={styles.handleText}
        >
          <span title="查看" onClick={() => this.onDetailSearch(record)}>查看</span>
        </div>
      ),
    },
  ]

  onDetailSearch =(record) => {
    console.log(record);
  }

  tableSortChange = (pagination, filter, sorter) => {
    const { field } = sorter || {};
    console.log(field);
    // 排序字段
    // const { sortField, sortMethod } = listParams || {};
    // let newField = sortField, newSort = 'desc';
    // if(!field || sortField === sortFieldMap[field]) {// 点击的是正在排序的列
      // newSort = sortMethod === 'desc' ? 'asc' : 'desc'; // 交换排序方式
    // }else{
      // newField = sortFieldMap[field];
    // }
  }

  render() {
    const defectListData = [
      {
        stationName: '电站1',
        defectDesc: '这是随手写的静态数据',
        eventNum: 12,
        createTime: '21天22小时08分',
        handlers: '张三, 李四, 王五, 赵六, 祝七, 黑八, 林九',
        status: '已结单',
      }, {
        stationName: '电站1',
        defectDesc: '这是随手写的静态数据',
        eventNum: 12,
        createTime: '21天22小时08分',
        handlers: '张三, 李四, 王五, 赵六, 祝七, 黑八, 林九',
        status: '已结单',
      }, {
        stationName: '电站1',
        defectDesc: '这是随手写的静态数据',
        eventNum: 12,
        createTime: '21天22小时08分',
        handlers: '张三, 李四, 王五, 赵六, 祝七, 黑八, 林九',
        status: '已结单',
      }, {
        stationName: '电站1',
        defectDesc: '这是随手写的静态数据',
        eventNum: 12,
        createTime: '21天22小时08分',
        handlers: '张三, 李四, 王五, 赵六, 祝七, 黑八, 林九',
        status: '已结单',
      }, {
        stationName: '电站1',
        defectDesc: '这是随手写的静态数据',
        eventNum: 12,
        createTime: '21天22小时08分',
        handlers: '张三, 李四, 王五, 赵六, 祝七, 黑八, 林九',
        status: '已结单',
      }, {
        stationName: '电站1',
        defectDesc: '这是随手写的静态数据',
        eventNum: 12,
        createTime: '21天22小时08分',
        handlers: '张三, 李四, 王五, 赵六, 祝七, 黑八, 林九',
        status: '已结单',
      }, {
        stationName: '电站1',
        defectDesc: '这是随手写的静态数据',
        eventNum: 12,
        createTime: '21天22小时08分',
        handlers: '张三, 李四, 王五, 赵六, 祝七, 黑八, 林九',
        status: '已结单',
      }, {
        stationName: '电站1',
        defectDesc: '这是随手写的静态数据',
        eventNum: 12,
        createTime: '21天22小时08分',
        handlers: '张三, 李四, 王五, 赵六, 祝七, 黑八, 林九',
        status: '已结单',
      }, {
        stationName: '电站1',
        defectDesc: '这是随手写的静态数据',
        eventNum: 12,
        createTime: '21天22小时08分',
        handlers: '张三, 李四, 王五, 赵六, 祝七, 黑八, 林九',
        status: '已结单',
      }, {
        stationName: '电站1',
        defectDesc: '这是随手写的静态数据',
        eventNum: 12,
        createTime: '21天22小时08分',
        handlers: '张三, 李四, 王五, 赵六, 祝七, 黑八, 林九',
        status: '已结单',
      }, {
        stationName: '电站1',
        defectDesc: '这是随手写的静态数据',
        eventNum: 12,
        createTime: '21天22小时08分',
        handlers: '张三, 李四, 王五, 赵六, 祝七, 黑八, 林九',
        status: '已结单',
      },
    ];
    const sortField = 'stationName';
    const sortMethod = 'descend';
    return (
      <div className={styles.eliminateDefectsList}>
        <CneTable
          sortField={sortField}
          sortMethod={sortMethod}
          onChange={this.tableSortChange}
          columns={this.defectColumn}
          className={styles.defectTable}
          dataSource={defectListData}
        />
      </div>
    );
  }
}
