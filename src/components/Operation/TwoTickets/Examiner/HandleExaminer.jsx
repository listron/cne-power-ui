import React, { Component } from 'react';
// import { Table } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import FilterCondition from '../../../Common/FilterConditions/FilterCondition';
import CommonPagination from '../../../Common/CommonPagination';
import CneTable from '@components/Common/Power/CneTable';
import { handleRight } from '@utils/utilFunc';
import styles from './examinerComp.scss';

class HandleExaminer extends Component { // 这个页面其实没啥用···只是为了防止工作票和操作票后期列表异化。

  static propTypes = {
    listLoading: PropTypes.bool,
    stations: PropTypes.array,
    settingList: PropTypes.array,
    settableNodes: PropTypes.array,
    total: PropTypes.number,
    tableParams: PropTypes.object,
    getSettingList: PropTypes.func,
    changeStore: PropTypes.func,
    getSettedInfo: PropTypes.func,
    getSettableUsers: PropTypes.func,
  }

  onPaginationChange = ({ currentPage, pageSize }) => {
    const { changeStore, tableParams, getSettingList } = this.props;
    const newParam = {
      ...tableParams,
      pageNum: currentPage,
      pageSize,
    };
    changeStore({ tableParams: newParam });
    getSettingList({ ...newParam });
  }

  sortFieldMap = { // 表格排序字段 => api
    stationName: 'station_name',
    state: 'state',
    createTime: 'create_time',
  };

  tableSortMap = { // api存储字段 => 表格排序字段
    station_name: 'stationName',
    state: 'state',
    create_time: 'createTime',
  };

  sortMethodMap = {
    desc: 'descend',
    asc: 'ascend',
  }

  tableChange = (pagination, filter, sorter) => {
    const { field } = sorter || {};
    const { tableParams, getSettingList, changeStore } = this.props;
    const { sortField, sortMethod } = tableParams || {};
    let newField = sortField, newSort = 'desc';
    if (!field || (sortField === this.sortFieldMap[field])) { // 点击的是正在排序的列
      newSort = sortMethod === 'desc' ? 'asc' : 'desc'; // 交换排序方式
    } else { // 切换列
      newField = this.sortFieldMap[field];
    }
    const newParam = {
      ...tableParams,
      sortField: newField,
      sortMethod: newSort,
    };
    changeStore({ tableParams: newParam });
    getSettingList({ ...newParam });
  }

  checkStations = ({ stationCodes }) => { // 电站选择
    const { tableParams, changeStore, getSettingList } = this.props;
    const newParams = {
      ...tableParams,
      stationCodes,
      pageNum: 1, // 回到第一页。
    };
    changeStore({ tableParams: newParams });
    getSettingList(newParams);
  }

  workTicketColumn = () => ([ // 表头生成
    {
      title: '电站名称',
      dataIndex: 'stationName',
      sorter: true,
      className: styles.stationName,
      render: text => <div className={styles.stationNameText}>{text || '--'}</div>,
    }, {
      title: '设置时间',
      dataIndex: 'createTime',
      render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--',
      sorter: true,
      textAlign: 'center',
      className: styles.createTime,
    }, {
      title: '状态',
      dataIndex: 'state',
      render: (text) => text > 0 ? <span className={styles.setted}>已设置</span> : <span className={styles.notSet}>未设置</span>,
      sorter: true,
      textAlign: 'center',
      className: styles.state,
    }, {
      title: '操作',
      dataIndex: 'handle',
      align: 'center',
      className: styles.handle,
      render: (text, record) => {
        const { state } = record;
        const editRight = handleRight('twoTicket_config_edit');
        return (
          <div className={styles.handler}>
            <span
              className={`iconfont icon-edit ${editRight ? styles.iconShow : styles.iconHide}`}
              onClick={() => {
                state > 0 ? this.showEdit(record) : this.showCreate(record);
              }}
            />
            <span
              className={`iconfont icon-look ${state > 0 ? styles.iconShow : styles.iconHide}`}
              onClick={() => this.showDetail(record)}
            />
          </div>
        );
      },
    },
  ])

  showEdit = (modalRecord) => { // 展示编辑弹框
    const { settableNodes, getSettedInfo, getSettableUsers } = this.props;
    const { distributionId, stationCode } = modalRecord;
    getSettableUsers({ settableNodes, stationCode });
    getSettedInfo({ distributionId, modalType: 'editModalShow' });
    this.props.changeStore({ modalRecord });
  }

  showCreate = (modalRecord) => { // 展示新设置弹框
    const { distributionId, stationCode } = modalRecord;
    const { settableNodes, getSettableUsers } = this.props;
    getSettableUsers({ settableNodes, stationCode });
    this.props.changeStore({ editModalShow: true, handleDistributionId: distributionId, modalRecord });
  }

  showDetail = (modalRecord) => { // 展示详情弹框
    const { distributionId } = modalRecord;
    this.props.getSettedInfo({ distributionId, modalType: 'detailModalShow' });
    this.props.changeStore({ modalRecord });
  }

  render() {
    const { stations, listLoading, settingList, total, tableParams } = this.props;
    const { pageNum, pageSize, sortField, sortMethod } = tableParams;
    return (
      <div className={styles.workExaminer}>
        <FilterCondition
          onChange={this.checkStations}
          option={[
            {
              name: '电站名称',
              type: 'stationName',
              typeName: 'stationCodes',
              data: stations,
            },
          ]}
        />
        <div className={styles.paginationRow}>
          <CommonPagination
            total={total}
            pageSize={pageSize}
            currentPage={pageNum}
            onPaginationChange={this.onPaginationChange}
          />
        </div>
        <CneTable
          className={styles.examinerTable}
          loading={listLoading}
          onChange={this.tableChange}
          sortField={this.tableSortMap[sortField]}
          sortMethod={this.sortMethodMap[sortMethod] || false}
          columns={this.workTicketColumn()}
          dataSource={settingList.map(e => ({ key: e.stationCode, ...e }))}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          dataError={false}
        />
      </div>
    );
  }
}

export default HandleExaminer;
