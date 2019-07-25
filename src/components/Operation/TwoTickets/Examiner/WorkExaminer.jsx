import React, { Component } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import FilterCondition from '../../../Common/FilterCondition/FilterCondition';
import CommonPagination from '../../../Common/CommonPagination';
import styles from './examinerComp.scss';

class WorkExaminer extends Component {

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

  tableChange = (pagination, filter, sorter) => {
    const { field, order } = sorter;
    const { tableParams, getSettingList, changeStore } = this.props;
    const sortTemplete = {
      stationName: 'station_name',
      state: 'state',
      createTime: 'create_time',
    };
    const sortField = field ? sortTemplete[field] : '';
    const sortMethod = order ? sortTemplete[order] : '';
    const newParam = {
      ...tableParams,
      sortField,
      sortMethod,
    };
    changeStore({ tableParams: newParam });
    getSettingList({ ...newParam });
  }

  checkStations = ({ stationCodes }) => { // 电站选择
    const { tableParams, changeStore, getSettingList } = this.props;
    const newParams = {
      tableParams,
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
    }, {
      title: '设置时间',
      dataIndex: 'createTime',
      render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--',
      sorter: true,
    }, {
      title: '状态',
      dataIndex: 'state',
      render: (text) => text > 0 ? <span className={styles.setted}>已设置</span> : <span className={styles.notSet}>未设置</span>,
      sorter: true,
    }, {
      title: '操作',
      dataIndex: 'handle',
      render: (text, record) => {
        const { state, distributionId } = record;
        return (
          <div className={styles.handler}>
            <span
              className="iconfont icon-edit"
              onClick={() => {
                state > 0 ? this.showEdit(record) : this.showCreate(record);
              }}
            />
            {state > 0 && <span
              className="iconfont icon-look"
              onClick={() => this.showDetail(distributionId)}
            />}
          </div>
        );
      },
    },
  ])

  showEdit = (record) => { // 展示编辑弹框
    const { settableNodes, getSettedInfo, getSettableUsers } = this.props;
    const { distributionId, stationCode } = record;
    getSettableUsers({ settableNodes, stationCode });
    getSettedInfo({ distributionId, modalType: 'editModalShow' });
  }

  showCreate = (record, handleDistributionId) => { // 展示新设置弹框
    const { settableNodes, changeStore, getSettableUsers } = this.props;
    const { distributionId, stationCode } = record;
    getSettableUsers({ settableNodes, stationCode });
    changeStore({ editModalShow: true, handleDistributionId: distributionId });
  }

  showDetail = (distributionId) => { // 展示详情弹框
    this.props.getSettedInfo({ distributionId, modalType: 'detailModalShow' });
  }

  render(){
    const { stations, listLoading, settingList, total, tableParams } = this.props;
    const { pageNum, pageSize } = tableParams;
    return (
      <div className={styles.workExaminer}>
        <FilterCondition
          option={['stationName']}
          stations={stations}
          onChange={this.checkStations}
        />
        <div className={styles.paginationRow}>
          <CommonPagination
            total={total}
            pageSize={pageSize}
            currentPage={pageNum}
            onPaginationChange={this.onPaginationChange}
          />
        </div>
        <Table
          loading={listLoading}
          onChange={this.tableChange}
          columns={this.workTicketColumn()}
          dataSource={settingList.map(e => ({ key: e.stationCode, ...e }))}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
    );
  }
}

export default WorkExaminer;
