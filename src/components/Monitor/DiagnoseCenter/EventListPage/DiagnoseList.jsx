import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import CneTable from '@components/Common/Power/CneTable';
import CommonPagination from '@components/Common/CommonPagination';
import { createAlarmColumn, createDiagnoseColumn, createDataColumn } from './listColumns';
import styles from './eventListPage.scss';

const { Option } = Select;

class DiagnoseList extends Component {
  static propTypes = {
    pageKey: PropTypes.string,
    diagnoseListLoading: PropTypes.bool,
    diagnoseListError: PropTypes.bool,
    listParams: PropTypes.object,
    listPage: PropTypes.object,
    totalNum: PropTypes.number,
    diagnoseListData: PropTypes.array,
    selectedRows: PropTypes.array,
    getEventsAnalysis: PropTypes.func,
    stopCircleQueryList: PropTypes.func,
    changeStore: PropTypes.func,
    getDiagnoseList: PropTypes.func,
    editEventsStatus: PropTypes.func,
  }

  sortFieldMap = { // 表格排序字段 => api
    eventName: 'eventCode',
    warningLevel: 'eventLevel',
    deviceTypeName: 'deviceTypeName',
    deviceName: 'deviceName',
    beginTime: 'beginTime',
    warningDuration: 'duration',
    warningFrequency: 'frequency',
    statusName: 'eventStatus',
    stationName:'stationName',
  };

  tableSortMap = { // api存储字段 => 表格排序字段
    eventCode: 'eventName',
    eventLevel: 'warningLevel',
    deviceTypeName: 'deviceTypeName',
    deviceName: 'deviceName',
    beginTime: 'beginTime',
    duration: 'warningDuration',
    frequency: 'warningFrequency',
    eventStatus: 'statusName',
    stationName:'stationName',
  };

  sortMethodMap = {
    desc: 'descend',
    asc: 'ascend',
  }

  createColumn = () => {
    const { pageKey, listParams } = this.props;
    const { finished } = listParams;
    const eventNameCreator = {
      alarm: createAlarmColumn,
      diagnose: createDiagnoseColumn,
      data: createDataColumn,
    };
    return eventNameCreator[pageKey](finished, this.analysisEvent);
  }

  analysisEvent = (record) => { // √7. 分析点击 => 停止当前定时请求, 单独开启分析页面;
    const eventCode = record.eventCode;
    const { pageKey } = this.props;
    const interval = (pageKey === 'alarm' || eventCode === 'NB1035') ? 2 : 1;
    this.props.stopCircleQueryList(); // 停止当前页面定时请求
    // 告警事件和诊断事件的零电流-数据时间间隔5s interval = 2, 其他默认十分钟数据interval = 1;
    this.props.getEventsAnalysis({ ...record, interval });
  }

  onRowSelect = (selectedKeys, selectedRows) => {
    this.props.changeStore({ selectedRows });
  }

  onSelectedHandle = (value) => {
    const { selectedRows } = this.props;
    const handleKeys = ['ignore', 'delete'];
    const diagWarningIds = selectedRows.map(e => e.diagWarningId);
    if (value === 'handout') {
      console.log('需要跳转, 跳转路径等待更新');
    }
    if (handleKeys.includes(value)) {
      this.props.editEventsStatus({
        diagWarningIds, // string[]
        type: handleKeys.indexOf(value) + 1, // 1忽略 2删除
      });
    }
  }

  onPaginationChange = ({ currentPage, pageSize }) => { // 分页排序点击 => 重新请求列表, 停止当前定时请求
    this.props.stopCircleQueryList(); // 停止当前页面定时请求
    const { listParams, listPage } = this.props;
    const newListPage = {
      ...listPage,
      pageNum: currentPage,
      pageSize,
    };
    this.props.changeStore({ listPage: newListPage });
    this.props.getDiagnoseList({ ...listParams, ...newListPage });
  }

  tableChange = (pagination, filter, sorter) => {// 分页排序点击 => 重新请求列表, 停止当前定时请求
    this.props.stopCircleQueryList(); // 停止当前页面定时请求
    const { field } = sorter || {};
    const { listParams, listPage } = this.props;
    const { sortField, sortMethod } = listPage || {};
    let newField = sortField, newSort = 'desc';
    if (!field || (sortField === this.sortFieldMap[field])) { // 点击的是正在排序的列
      newSort = sortMethod === 'desc' ? 'asc' : 'desc'; // 交换排序方式
    } else { // 切换列
      newField = this.sortFieldMap[field];
    }
    const newListPage = {
      ...listPage,
      sortField: newField,
      sortMethod: newSort,
    };
    this.props.changeStore({ listPage: newListPage, selectedRows: [] });
    this.props.getDiagnoseList({ ...listParams, ...newListPage });
  }

  render() {
    const { listPage, listParams, totalNum, diagnoseListData, diagnoseListLoading, diagnoseListError, selectedRows } = this.props;
    const { pageNum, pageSize, sortField, sortMethod } = listPage || {};
    const { finished } = listParams;
    // 基于 选中项判定哪些可用
      // { "statusName":"待领取" "statusCode":3 },
      // { "statusName":"待确认" "statusCode":2 },
      // { "statusName":"待验收",  "statusCode":5 },
      // { "statusName":"未处理" "statusCode":1 },
      // { "statusName":"已忽略", "statusCode":7 },
      // { "statusName":"已结单", "statusCode":6 },
      // { "statusName":"执行中", "statusCode":4 }
    // 昂，遍历了三次，垃圾代码····优化下，遍历一次就够了亲。
    const handoutDisable = selectedRows.some(e => ![1, 2].includes(e.statusCode)); // 未处理, 未确认 可以进行派发操作;
    const ignoreDisable = selectedRows.some(e => ![3, 4, 5].includes(e.statusCode)); // 待领取, 执行中, 待验收 可进行忽略操作
    const deleteDisable = selectedRows.some(e => ![1, 2, 7].includes(e.statusCode)); // 未处理, 未确认, 已忽略 可进行忽略操作
    const selectDisable = selectedRows.length === 0 || (handoutDisable && ignoreDisable && deleteDisable);
    return (
      <div className={styles.diagnoseList} >
        <div className={styles.pagination}>
          <Select disabled={selectDisable} style={{width: '94px'}} value="操作" onChange={this.onSelectedHandle}>
            <Option disabled={handoutDisable} value="handout">派发</Option>
            <Option disabled={ignoreDisable} value="ignore">忽略</Option>
            <Option disabled={deleteDisable} value="delete">删除</Option>
          </Select>
          <span />
          <CommonPagination
            pageSize={pageSize}
            currentPage={pageNum}
            total={totalNum}
            onPaginationChange={this.onPaginationChange}
          />
        </div>
        <CneTable
          columns={this.createColumn()}
          dataSource={diagnoseListData}
          loading={diagnoseListLoading}
          dataError={diagnoseListError}
          sortField={this.tableSortMap[sortField]}
          sortMethod={this.sortMethodMap[sortMethod] || false}
          className={styles.diagnoseTable}
          onChange={this.tableChange}
          rowSelection={ !!finished ? null : {
            selectedRowKeys: selectedRows.map(e => e.diagWarningId),
            onChange: this.onRowSelect,
          }}
        />
      </div>
    );
  }
}

export default DiagnoseList;
