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
      dataIndex: 'docketDesc',
      className: styles.docketDesc,
      render: (text) => (
        <div
          className={styles.docketDescText}
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
      title: '持续时间',
      dataIndex: 'keepLength',
      className: styles.keepLength,
      sorter: true,
      render: (text) => (
        <div
          className={styles.keepLengthText}
          title={text || ''}
        >{text || '--'}</div>
      ),
    }, {
      title: '执行人',
      dataIndex: 'operName',
      className: styles.operName,
      render: (text) => (
        <div
          className={styles.operNameText}
          title={text || ''}
        >{text || '--'}</div>
      ),
    }, {
      title: '状态',
      dataIndex: 'status',
      className: styles.status,
      sorter: true,
      render: (text, record) => {
        const { stateName, isCoordinate, isOverTime } = record;
        return (
          <div
            className={styles.statusContent}
            title={stateName || ''}
          >
            <span>{stateName || '--'}</span>
            {!!isCoordinate && <span
              className={`iconfont icon-xietiao ${styles.coordinateIcon}`}
              style={{right: (!!isCoordinate && !!isOverTime) ? '26px' : '5px'}}
              title="协调"
            />}
            {!!isOverTime && <span
              className={`iconfont icon-chaoshi ${styles.overtimeIcon}`}
              title="超时"
            />}
          </div>
        );
      },
    }, {
      title: '操作',
      dataIndex: 'handle',
      className: styles.handle,
      render: (text, record) => (
          <span
            className={`iconfont icon-viewplan ${styles.handleIcon}`}
            title="查看"
            onClick={() => this.onDetailSearch(record)}
          />
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

  defectMockListData = [
    {
      stationName: '电站1',
      docketDesc: '这是随手写的静态数据',
      eventNum: 12,
      keepLength: '21天22小时08分',
      createTime: '2019-07-12 14:00',
      operName: '张三, 李四, 王五, 赵六, 祝七, 黑八, 林九',
      stateName: '已结单',
      isCoordinate: 1,
      isOverTime: 1,
    }, {
      stationName: '电站1',
      docketDesc: '这是随手写的静态数据',
      eventNum: 12,
      keepLength: '21天22小时08分',
      createTime: '2019-09-20 00:00',
      operName: '张三, 李四, 王五, 赵六, 祝七, 黑八, 林九',
      stateName: '执行中',
      isCoordinate: 1,
      isOverTime: 1,
    },
  ]

  render() {
    const { defectMockListData } = this;
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
          dataSource={defectMockListData}
        />
      </div>
    );
  }
}
