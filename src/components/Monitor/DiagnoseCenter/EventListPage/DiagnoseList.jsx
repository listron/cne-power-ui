import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import CneTable from '@components/Common/Power/CneTable';
import { Table } from 'antd';
import CommonPagination from '@components/Common/CommonPagination';
import styles from './eventListPage.scss';

class DiagnoseList extends Component {
  static propTypes = {
    pageKey: PropTypes.string,
    listPage: PropTypes.object,
    totalNum: PropTypes.number,
    diagnoseListData: PropTypes.array,
  }

  createColumn = () => {
    const { pageKey } = this.props;
    const eventNameTitle = {
      alarm: '告警事件',
      diagnose: '诊断事件',
      data: '数据事件',
    };
    return [{
      dataIndex: 'eventName',
      title: eventNameTitle[pageKey] || '--',
      sorter: true,
      render: (text, record) => {
        return text;
      },
    }, {
      dataIndex: 'warningLevel',
      title: '事件级别',
      sorter: true,
    }, {
      dataIndex: 'pointValueDesc',
      title: '告警描述',
      sorter: true,
    }, {
      dataIndex: 'deviceTypeName',
      title: '设备类型',
      sorter: true,
    }, {
      dataIndex: 'deviceName',
      title: '设备名称',
      sorter: true,
    }, {
      dataIndex: 'stationName',
      title: '电站名称',
      sorter: true,
    }, {
      dataIndex: 'beginTime',
      title: '发生时间',
      sorter: true,
    }, {
      dataIndex: 'warningDuration',
      title: '持续时长',
      sorter: true,
    }, {
      dataIndex: 'warningFrequency',
      title: '发生频次',
      sorter: true,
    }, {
      dataIndex: 'statusName',
      title: '事件状态',
      sorter: true,
    }, {
      dataIndex: '',
      title: '操作',
      render: () => {
        return (
          <span>
            <span>分析</span>
            <span>查看</span>
          </span>
        );
      },
    }];
  }

  selectRows = (selectedRowKeys) => {
    console.log(selectedRowKeys);
  }

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
          <CommonPagination
            pageSize={pageSize}
            currentPage={pageNum}
            total={totalNum}
            onPaginationChange={this.onPaginationChange}
          />
        </div>
        <Table
          columns={this.createColumn()}
          dataSource={diagnoseListData}
          pagination={false}
          rowSelection={{
            selectedRowKeys: [],
            onChange: this.selectRows,
          }}
          footer={null}
        />
      </div>
    );
  }
}

export default DiagnoseList;
