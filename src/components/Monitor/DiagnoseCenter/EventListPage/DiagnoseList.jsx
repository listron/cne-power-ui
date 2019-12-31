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
    listParams: PropTypes.object,
    listPage: PropTypes.object,
    totalNum: PropTypes.number,
    diagnoseListData: PropTypes.array,
    getEventsAnalysis: PropTypes.func,
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

  onPaginationChange = ({ currentPage, pageSize }) => {
    console.log({ currentPage, pageSize });
    // const { listParams } = this.props;
    // this.props.getDefectList({ ...listParams, pageNum: currentPage, pageSize });
  }

  tableChange = (pagination, filter, sorter) => { // 表格排序&&表格重新请求数据
    console.log(pagination, filter, sorter);
    // const { listParams } = this.props;
    // const { order } = sorter;
    // const sortMethod = order === 'ascend' ? 'asc' : 'desc';
    // const sortField = this.getSortMethod[sorter.field] || 'create_time';
    // this.props.getDefectList({ ...listParams, sortMethod, sortField, pageNum: 1 });
  }

  render() {
    const { listPage, totalNum, diagnoseListData } = this.props;
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
