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
    return eventNameCreator[pageKey](
      finished, this.analysisEvent, this.toDefect,
    );
  }

  analysisEvent = (record) => { // √7. 分析点击 => 停止当前定时请求, 单独开启分析页面;
    const eventCode = record.eventCode;
    const { pageKey } = this.props;
    const interval = (pageKey === 'alarm' || eventCode === 'NB1035') ? 2 : 1;
    this.props.stopCircleQueryList(); // 停止当前页面定时请求
    // 告警事件和诊断事件的零电流-数据时间间隔5s interval = 2, 其他默认十分钟数据interval = 1;
    this.props.getEventsAnalysis({ ...record, interval });
  }

  toDefect = (record) => {
    const { diagWarningId, stationCode } = record || {};
    window.open(`#/operation/workProcess/newView?page=defectDetail&isFinish=3&eventId=[${diagWarningId}]&stationCode=${stationCode}`);
  }

  onRowSelect = (selectedKeys, rows) => {
    const { diagnoseListData, selectedRows } = this.props;
    const newRowInfo = selectedRows.filter(e => {
      return !diagnoseListData.find(m => m.diagWarningId === e.diagWarningId);
    });
    this.props.changeStore({ selectedRows: [...newRowInfo, ...rows] });
  }

  onSelectedHandle = (value) => {
    const { selectedRows } = this.props;
    const handleKeys = ['ignore', 'delete'];
    const diagWarningIds = selectedRows.map(e => e.diagWarningId);
    if (value === 'handout') {
      const { stationCode } = selectedRows[0] || {};
      window.open(`#/operation/workProcess/newView?page=defectDetail&isFinish=3&eventId=[${diagWarningIds.join(',')}]&stationCode=${stationCode}`);
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

  handleCreator = (selectedRows) => {
    // { "statusName":"待确认" "statusCode":2 },
    // { "statusName":"未处理" "statusCode":1 },
    // { "statusName":"已忽略", "statusCode":7 },
    // { "statusName":"已派发", "statusCode":3 }
    if (!selectedRows || selectedRows.length === 0) { // 数据不存在, 全部禁用
      return {
        handoutDisable: true,
        ignoreDisable: true,
        deleteDisable: true,
        selectDisable: true,
      };
    }
    // 已派发3, 可跳转至消缺工单
    const selectCodesSet = new Set(selectedRows.map(e => e.stationCode));
    const handoutDisable = selectCodesSet.size > 1 || selectedRows.some(e => ![1, 2].includes(e.statusCode)); // 未处理, 待确认且选中的属于同一个电站 可派发操作;
    const ignoreDisable = selectedRows.some(e => ![1, 2].includes(e.statusCode)); // 未处理1, 待确认2 可忽略操作
    const deleteDisable = selectedRows.some(e => ![1, 2, 7].includes(e.statusCode)); // 未处理1, 待确认2, 已忽略7 可删除操作
    const selectDisable = handoutDisable && ignoreDisable && deleteDisable;
    return {
      handoutDisable,
      ignoreDisable,
      deleteDisable,
      selectDisable,
    };
  }

  render() {
    const { listPage, listParams, totalNum, diagnoseListData, diagnoseListLoading, diagnoseListError, selectedRows } = this.props;
    const { pageNum, pageSize, sortField, sortMethod } = listPage || {};
    const { finished } = listParams;
    const {
      handoutDisable,
      ignoreDisable,
      deleteDisable,
      selectDisable,
    } = this.handleCreator(selectedRows);
    return (
      <div className={styles.diagnoseList} >
        <div className={styles.pagination}>
          <Select
            disabled={selectDisable}
            style={{width: '94px'}}
            value="操作"
            onChange={this.onSelectedHandle}
          >
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
