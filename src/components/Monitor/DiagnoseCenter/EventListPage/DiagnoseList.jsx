import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CneTable from '@components/Common/Power/CneTable';
// import { Table /*, Select */ } from 'antd';
import CommonPagination from '@components/Common/CommonPagination';
import { createAlarmColumn, createDiagnoseColumn, createDataColumn } from './listColumns';
import styles from './eventListPage.scss';
// const { Option } = Select;

class DiagnoseList extends Component {
  static propTypes = {
    pageKey: PropTypes.string,
    diagnoseListLoading: PropTypes.bool,
    listParams: PropTypes.object,
    listPage: PropTypes.object,
    totalNum: PropTypes.number,
    diagnoseListData: PropTypes.array,
    getEventsAnalysis: PropTypes.func,
    stopCircleQueryList: PropTypes.func,
    changeStore: PropTypes.func,
    getDiagnoseList: PropTypes.func,
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

  analysisEvent = (record) => {
    this.props.getEventsAnalysis(record);
  }

  // selectRows = (selectedRowKeys) => { // todo 工单系统改造完成后, 操作功能添加
  //   console.log(selectedRowKeys);
  // }

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
    const { field, order } = sorter;
    const { listParams, listPage } = this.props;
    let sortField= 'eventStatus', sortMethod = 'desc'; // 默认排序
    if (field) { // 某指定排序
      sortMethod = order === 'ascend' ? 'asc' : 'desc';
      const sortFieldMap = {
        eventName: 'eventCode',
        warningLevel: 'eventLevel',
        deviceTypeName: 'deviceTypeName',
        deviceName: 'deviceName',
        beginTime: 'beginTime',
        warningDuration: 'duration',
        warningFrequency: 'frequency',
        statusName: 'eventStatus',
      };
      sortField = sortFieldMap[field];
      const newListPage = { ...listPage, sortField, sortMethod };
      this.props.changeStore({ listPage: newListPage });
      this.props.getDiagnoseList({ ...listParams, ...newListPage });
    }
  }

  render() {
    const { listPage, totalNum, diagnoseListData, diagnoseListLoading } = this.props;
    const { pageNum, pageSize } = listPage || {};

    return (
      <div className={styles.diagnoseList} >
        <div className={styles.pagination}>
          {/* <Select style={{width: '94px'}} value="handle" onChange={(value) => { console.log(value); }}>
            <Option value="handle">操作</Option>
            <Option value="handout">派发</Option>
            <Option value="cancel">撤销</Option>
            <Option value="ignore">忽略</Option>
          </Select> */}
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
          // rowSelection={{
          //   selectedRowKeys: [],
          //   onChange: this.selectRows,
          // }}
          className={styles.diagnoseTable}
          onChange={this.tableChange}
        />
      </div>
    );
  }
}

export default DiagnoseList;
