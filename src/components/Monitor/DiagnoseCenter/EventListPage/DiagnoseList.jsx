import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, message } from 'antd';
import CneTable from '@components/Common/Power/CneTable';
import CneTips from '@components/Common/Power/CneTips';
import moment from 'moment';
import CommonPagination from '@components/Common/CommonPagination';
import { createAlarmColumn, createDiagnoseColumn, createDataColumn } from './listColumns';
import IgnoreModal from './IgnoreModal';
import styles from './eventListPage.scss';
import Cookie from 'js-cookie';

const { Option } = Select;

class DiagnoseList extends Component {
  static propTypes = {
    pageKey: PropTypes.string,
    statusChangeText: PropTypes.string,
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
    getLinkageList: PropTypes.func,
    getEamRegisterWaring: PropTypes.func,
    history: PropTypes.object,
  }

  state = {
    tipType: 0, // 0无弹框; 1忽略; 2删除
    deleteRecords: null,
    needIgoreModal: false, // 诊断事件, 忽略操作时，需要弹出额外输入框进行信息输入；
  }

  sortFieldMap = { // 表格排序字段 => api
    eventName: 'eventCode',
    warningLevel: 'eventLevel',
    deviceTypeName: 'deviceTypeName',
    deviceName: 'deviceName',
    beginTime: 'beginTime',
    updateTime: 'updateTime',
    warningDuration: 'duration',
    // warningFrequency: 'frequency',
    warningFrequencyRate: 'frequencyRate',
    statusName: 'eventStatus',
    stationName: 'stationName',
  };

  tableSortMap = { // api存储字段 => 表格排序字段
    eventCode: 'eventName',
    eventLevel: 'warningLevel',
    deviceTypeName: 'deviceTypeName',
    deviceName: 'deviceName',
    beginTime: 'beginTime',
    duration: 'warningDuration',
    // frequency: 'warningFrequency',
    updateTime: 'updateTime',
    frequencyRate: 'warningFrequencyRate',
    alarmFrequency: 'alarmFrequency',
    eventStatus: 'statusName',
    stationName: 'stationName',
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
      finished,
      this.analysisEvent,
      this.toDefect,
      this.toDelete,
      this.lookFunc,
      this.resendFunc,
    );
  }

  analysisEvent = (record) => { // √7. 分析点击 => 停止当前定时请求, 单独开启分析页面;
    const eventCode = record.eventCode;
    const { pageKey } = this.props;
    const interval = (pageKey === 'alarm' || eventCode === 'NB1035') ? 2 : 1;
    const diagWarningId = record.diagWarningId;
    this.props.stopCircleQueryList(); // 停止当前页面定时请求
    // 告警事件和诊断事件的零电流-数据时间间隔5s interval = 2, 其他默认十分钟数据interval = 1;
    this.props.changeStore({
      oldAnalysisEvent: record,
      interval,
      linkagePage: pageKey,
      diagWarningId,
      showAnalysisPage: true,
      analysisPageLoading: true,
    });
    this.props.getEventsAnalysis({ ...record, interval, analysisPageLoading: true });
    this.props.getLinkageList({diagWarningId});
  }

  toDefect = (record) => {
    const { workOrderId } = record || {};
    window.open(`#/operation/newWorkProcess/newView?page=defectDetail&docketId=${workOrderId}`);
  }

  toDelete = (deleteRecord) => {
    this.setState({ deleteRecords: [deleteRecord], tipType: 2 });
  }

  // EAM重发
  resendFunc = () => {
    console.log('EAM重发');
  };

  // EAM查看
  lookFunc = (data) => {
    const { eventName, pointValueDesc, deviceTypeName, deviceName, stationName, diagWarningId, type } = data;
    const { history } = this.props;
    // 展示信息
    const params = {
      eventName,
      eventDesc: pointValueDesc,
      deviceTypeName,
      deviceName,
      stationName,
    };
    // type：1位故障详情，2位缺陷详情
    history.push(`/monitor/EamDetail?params=${JSON.stringify(params)}&waringId=${diagWarningId}&type=${type}`);
  };

  cancelTip = () => this.setState({ deleteRecords: null, tipType: 0 })

  confirmTip = () => {
    const { deleteRecords, tipType } = this.state;
    const diagWarningIds = deleteRecords.map(e => e.diagWarningId);
    this.props.editEventsStatus({ diagWarningIds, type: tipType });
    this.setState({ deleteRecords: null, tipType: 0 });
  }

  onRowSelect = (selectedKeys, rows) => {
    const { diagnoseListData, selectedRows } = this.props;
    this.props.stopCircleQueryList(); // 停止当前页面定时请求
    const newRowInfo = selectedRows.filter(e => {
      return !diagnoseListData.find(m => m.diagWarningId === e.diagWarningId);
    });
    this.props.changeStore({ selectedRows: [...newRowInfo, ...rows] });
  }

  onSelectedHandle = (value) => {
    const { selectedRows, getEamRegisterWaring, listParams, listPage, getDiagnoseList } = this.props;
    const handleKeys = ['ignore', 'delete'];
    const enterpriseCode = Cookie.get('enterpriseCode');
    const diagWarningIds = selectedRows.map(e => e.diagWarningId);
    if (value === 'handout') {
      // 判断是否是协和新能源
      if(enterpriseCode === '1010') {
        // 只能选择一个
        if(diagWarningIds.length > 1){
          message.error('仅支持单条组串低效事件推送至EAM');
        }
        if(diagWarningIds.length <= 1){
          const { deviceFullcode, warningLevel, diagWarningId, pointValueDesc, beginTime } = selectedRows[0];
          // 派发
          getEamRegisterWaring({
            deviceFullcode,
            level: warningLevel,
            waringId: diagWarningId,
            detail: pointValueDesc,
            detectedTime: moment(beginTime).format('YYYY-MM-DD HH:mm:ss'),
            func: () => {
              // 清空已选
              this.handleCreator([]);
              // 请求当前列表
              getDiagnoseList({...listParams, ...listPage});
            },
          });
        }
      }
      if(enterpriseCode !== '1010') {
        const { stationCode } = selectedRows[0] || {};
        window.open(`#/operation/newWorkProcess/newView?page=defectDetail&isFinish=3&eventId=[${diagWarningIds.join(',')}]&stationCode=${stationCode}`);
      }
    }
    const showIgoreModal = selectedRows.every(info => ['NB1235', 'NB1236', 'NB1237', 'NB1238', 'NB1239'].includes(info.eventCode));
    if (showIgoreModal) {// 诊断事件: 五种组串, 选中后忽略需要添加额外弹框信息;
      this.setState({
        deleteRecords: selectedRows,
        needIgoreModal: true,
      });
    } else if (handleKeys.includes(value)) { // 其他的删除忽略操作~ 一股脑撸。
      this.setState({
        deleteRecords: selectedRows,
        tipType: handleKeys.indexOf(value) + 1,
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
    const selectCodesSet = new Set(selectedRows.map(e => e.stationCode)); // 筛选属于同设备的
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

  confirmStatusChange = () => {
    this.props.changeStore({ statusChangeText: '' });
    this.props.getDiagnoseList({}); // 基于当前请求, 刷新数据
  }

  onModalIgnore = (ignoreInfo) => { // 特别的诊断事件-指定组串(5种)-忽略操作
    this.props.editEventsStatus(ignoreInfo);
    this.setState({ deleteRecords: null, needIgoreModal: false });
  }

  onModalCancel = () => this.setState({ deleteRecords: null, needIgoreModal: false })

  render() {
    const { tipType, needIgoreModal, deleteRecords } = this.state;
    const { listPage, listParams, totalNum, diagnoseListData, diagnoseListLoading, diagnoseListError, selectedRows, statusChangeText, pageKey } = this.props;
    const { pageNum, pageSize, sortField, sortMethod } = listPage || {};
    const { finished } = listParams;
    const {
      handoutDisable,
      ignoreDisable,
      deleteDisable,
      selectDisable,
    } = this.handleCreator(selectedRows);
    const enterpriseCode = Cookie.get('enterpriseCode');
    return (
      <div className={styles.diagnoseList} >
        <div className={styles.pagination}>
          <Select
            disabled={selectDisable}
            style={{width: '94px'}}
            value="操作"
            onChange={this.onSelectedHandle}
            dropdownClassName={styles.handleSelects}
          >
            {(enterpriseCode === '1010' && pageKey === 'alarm') ? '' : (
              <Option disabled={handoutDisable} value="handout">
                <span className="iconfont icon-paifa" />派发
              </Option>
            )}
            <Option disabled={ignoreDisable} value="ignore">
              <span className="iconfont icon-hulue" />忽略
            </Option>
            <Option disabled={deleteDisable} value="delete">
              <span className="iconfont icon-closeall" />删除
            </Option>
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
            getCheckboxProps: record => ({
              // 首先判断是否是协和新能源和当前诊断事件页
              // 不等于组串低效的禁止选择
              // 有EAM查看的禁止选择
              disabled: (enterpriseCode === '1010' && pageKey === 'diagnose') ? (record.eventName !== '组串低效' && record.eamStatus !== 1) : false,
              name: record.eventName,
            }),
          }}
        />
        {tipType !== 0 && <CneTips
          visible
          onCancel={this.cancelTip}
          confirmText="确认"
          onConfirm={this.confirmTip}
          tipText={['确认忽略该事件?', '确认删除该事件?'][tipType - 1]}
          width={260}
        />}
        {statusChangeText && <CneTips
          visible
          confirmText="确认"
          mode="warning"
          onConfirm={this.confirmStatusChange}
          tipText={statusChangeText}
          width={260}
        />}
        {needIgoreModal && <IgnoreModal
          records={deleteRecords}
          onModalIgnore={this.onModalIgnore}
          onModalCancel={this.onModalCancel}
        />}
      </div>
    );
  }
}

export default DiagnoseList;
