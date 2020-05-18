
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Popconfirm } from 'antd';
import CommonPagination from '@components/Common/CommonPagination';
import CneButton from '@components/Common/Power/CneButton';
import CneTable from '@components/Common/Power/CneTable';
import { handleRight } from '@utils/utilFunc';
import styles from './listSearch.scss';

class Lists extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,
    planParams: PropTypes.object,
    planListPageParams: PropTypes.object,
    planCount: PropTypes.number,
    planList: PropTypes.array,
    planListLoading: PropTypes.bool,
    changeStore: PropTypes.func,
    getWorkPlanList: PropTypes.func,
    deleteWorkPlan: PropTypes.func,
    getWorkPlanDetail: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
  };

  state = {
    selectedRowKeys: [],
    column: [
      {
        title: '计划类型',
        dataIndex: 'planTypeName',
        sorter: true,
        textAlign: 'center',
        className: styles.planTypeName,
      }, {
        title: '内容',
        dataIndex: 'inspectContent',
        sorter: true,
        textAlign: 'left',
        className: styles.inspectContent,
        render: (text = '', record) => {
          const { inspectTypeCode, inspectContent, planName } = record;
          const contentText = parseFloat(inspectTypeCode) === 100002 ? planName : inspectContent;
          return (
            <div title={contentText} className={styles.inspectContentText}>{contentText || '--'}</div>
          );
        },
      }, {
        title: '适用电站',
        dataIndex: 'stations', //  stationCode + stationName 对象数组
        className: styles.stations,
        textAlign: 'left',
        render: (text, record = {}) => {
          const { stations = [] } = record;
          const stationStr = stations.map(e => e.stationName).join(',');
          return (<div title={stationStr} className={styles.stationsText}>{stationStr || '--'}</div>);
        },
      }, {
        title: '首次下发时间',
        dataIndex: 'firstStartTime', // firstStartTime + firstStartWeek
        className: styles.firstStartTime,
        sorter: true,
        textAlign: 'center',
        render: (text, record) => {
          const { firstStartTime, firstStartWeek } = record;
          return <span>{firstStartTime || '--'} {firstStartWeek}</span>;
        },
      }, {
        title: '下次下发时间',
        dataIndex: 'nextSendTime', // nextSendTime + nextSendWeek
        className: styles.nextSendTime,
        sorter: true,
        textAlign: 'center',
        render: (text, record) => {
          const { nextSendTime, nextSendWeek } = record;
          return <span>{nextSendTime || '--'} {nextSendWeek}</span>;
        },
      }, {
        title: '执行天数',
        dataIndex: 'validPeriod',
        sorter: true,
        textAlign: 'right',
        className: styles.validPeriod,
      }, {
        title: '周期',
        dataIndex: 'cycleTypeName',
        sorter: true,
        textAlign: 'center',
        className: styles.cycleTypeName,
      }, {
        title: '启用状态',
        dataIndex: 'planStatus',
        sorter: true,
        textAlign: 'center',
        className: styles.planStatus,
        render: (text) => ['--', '启用', '停用'][text] || '--',
      }, {
        title: '操作',
        dataIndex: 'handle',
        className: styles.handle,
        textAlign: 'center',
        render: (text, record) => {
          const workPlanHandleRight = handleRight('operation_workStation_manage');
          return (
            <span className={styles.handleRow}>
              <span className="iconfont icon-look" onClick={() => this.toDetail(record)} title="查看" />
              {workPlanHandleRight && <span className="iconfont icon-edit" onClick={() => this.toEdit(record)} title="编辑" />}
              {workPlanHandleRight && <Popconfirm
                title="是否确认删除计划?"
                placement="topRight"
                onConfirm={() => this.deletePlan(record)}
                okText="确定"
                cancelText="取消"
              >
                <span className="iconfont icon-del" title="删除" />
              </Popconfirm>}
            </span>
          );
        },
      },
    ],
  }

  // orderFieldBase = ['', 'planTypeName', 'inspectContent', 'firstStartTime', 'nextSendTime', 'validPeriod', 'cycleTypeName', 'planStatus', 'lastHandleTime']

  toDetail = ({ planId }) => { // 查看详情
    this.props.getWorkPlanDetail({ planId });
  }

  toEdit = (record) => {
    const { stations, inspectTypeCode } = record || {};
    // 若是设备巡检, 请求对应的设备类型列表;
    if (parseFloat(inspectTypeCode) === 100002) {
      this.props.getStationDeviceTypes({
        stationCodes: stations.map(e => e.stationCode).join(','),
      });
    }
    this.props.changeStore({
      planPageKey: 'edit', // list列表页, edit编辑, add新增, detail详情
      planDetail: record,
    });
  }

  toAddPlan = () => this.props.changeStore({
    planPageKey: 'add', // list列表页, edit编辑, add新增, detail详情
    planDetail: {},
  })

  deletePlan = ({ planId }) => this.props.deleteWorkPlan({ planIds: [planId] }) // 删除一条计划

  deletePlans = () => { // 删除所有选中计划
    const { selectedRowKeys } = this.state;
    this.setState({ selectedRowKeys: [] });
    this.props.deleteWorkPlan({
      planIds: selectedRowKeys,
      deletePlansLoading: true,
    });
  }

  onPaginationChange = ({ currentPage, pageSize }) => { //分页器
    const { planParams, planListPageParams } = this.props;
    const newPageParams = {
      ...planListPageParams,
      pageNum: currentPage,
      pageSize: pageSize,
    };
    this.props.changeStore({ // 修改参数
      planListPageParams: newPageParams,
    });
    this.props.getWorkPlanList({ // 请求列表
      ...planParams,
      ...newPageParams,
    });
  }

  sortFieldMap = { // 表格排序字段 => api
    planTypeName: '1',
    inspectContent: '2',
    firstStartTime: '3',
    nextSendTime: '4',
    validPeriod: '5',
    cycleTypeName: '6',
    planStatus: '7',
    lastHandleTime: '8',
  };

  tableSortMap = { // api存储字段 => 表格排序字段
    1: 'planTypeName',
    2: 'inspectContent',
    3: 'firstStartTime',
    4: 'nextSendTime',
    5: 'validPeriod',
    6: 'cycleTypeName',
    7: 'planStatus',
    8: 'lastHandleTime',
  };

  sortMethodMap = {
    desc: 'descend',
    asc: 'ascend',
  }

  tableSortChange = (pagination, filter, sorter) => { // 排序
    const { field } = sorter || {};
    const { planParams, planListPageParams } = this.props;
    const { orderField, orderMethod } = planListPageParams || {};
    let newField = orderField, newSort = 'desc';
    if (!field || (orderField === this.sortFieldMap[field])) { // 点击的是正在排序的列
      newSort = orderMethod === 'desc' ? 'asc' : 'desc'; // 交换排序方式
    } else { // 切换列
      newField = this.sortFieldMap[field];
    }

    const newPageParams = {
      ...planListPageParams,
      orderField: newField,
      orderMethod: newSort,
    };
    this.props.changeStore({ // 修改参数
      planListPageParams: newPageParams,
    });
    this.props.getWorkPlanList({ // 请求列表
      ...planParams,
      ...newPageParams,
    });
  }

  planSelects = (selectedRowKeys) => this.setState({ selectedRowKeys }) // 行选中

  cancelSelects = () => this.setState({ selectedRowKeys: [] })

  render() {
    const { column, selectedRowKeys } = this.state;
    const { planListPageParams, planCount, planList, planListLoading, theme } = this.props;
    const { pageNum, pageSize, orderField, orderMethod } = planListPageParams;
    const workPlanHandleRight = handleRight('operation_workStation_manage');
    return (
      <div className={`${styles.lists} ${styles[theme]}`}>
        <div className={styles.listPageRow} >
          {workPlanHandleRight ? (
            <span className={styles.listBtns}>
              <CneButton className={styles.addPlanBtn} lengthMode="short" iconname="icon-newbuilt" onClick={this.toAddPlan} >添加计划</CneButton>
              {selectedRowKeys.length === 0 ? (
                <CneButton disabled={true}>批量删除</CneButton>
              ) : (
                  <Popconfirm
                    title="是否确认批量删除选中计划?"
                    onConfirm={() => this.deletePlans()}
                    okText="确定"
                    cancelText="取消"
                  >
                    <CneButton disabled={false}>批量删除</CneButton>
                  </Popconfirm>
                )}
            </span>
          ) : <span />}
          <CommonPagination
            className={styles.pagination}
            pageSize={pageSize}
            currentPage={pageNum}
            total={planCount}
            onPaginationChange={this.onPaginationChange}
            theme={theme}
          />
        </div>
        <div className={styles.tableWrap}>
          <CneTable
            dataSource={planList}
            columns={column}
            pagination={false}
            loading={planListLoading}
            className={styles.listsTable}
            onChange={this.tableSortChange}
            rowSelection={{
              selectedRowKeys,
              onChange: this.planSelects,
            }}
            sortField={this.tableSortMap[orderField]}
            sortMethod={this.sortMethodMap[orderMethod] || false}
            dataError={false}
            pagination={false}
            locale={{ emptyText: <img src="/img/nodata.png" /> }}
          />
          <div className={styles.tableFoot}>
            当前选中<span className={styles.selectedNum}>{selectedRowKeys.length}</span>项
          <span onClick={this.cancelSelects} className={styles.cancelSelects}>取消选择</span>
          </div>
        </div>

      </div>
    );
  }
}

export default Lists;
