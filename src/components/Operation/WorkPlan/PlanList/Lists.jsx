
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Popconfirm, Table } from 'antd';
import CommonPagination from '@components/Common/CommonPagination';
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
      }, {
        title: '内容',
        dataIndex: 'inspectContent',
        sorter: true,
        render: (text = '', record) => {
          const { inspectTypeCode, inspectContent, planName } = record;
          const contentText = parseFloat(inspectTypeCode) === 100002 ? planName: inspectContent;
          return (
            <div title={contentText} className={styles.inspectContentText}>{contentText || '--'}</div>
          );
        },
      }, {
        title: '适用电站',
        dataIndex: 'stations', //  stationCode + stationName 对象数组
        render: (text, record = {}) => {
          const { stations = [] } = record;
          const stationStr = stations.map(e => e.stationName).join(',');
          return (<div title={stationStr} className={styles.stationsText}>{stationStr || '--'}</div>);
        },
      }, {
        title: '首次下发时间',
        dataIndex: 'firstStartTime', // firstStartTime + firstStartWeek
        sorter: true,
        render: (text, record) => {
          const { firstStartTime, firstStartWeek } = record;
          return <span>{firstStartTime || '--'} {firstStartWeek}</span>;
        },
      }, {
        title: '下次下发时间',
        dataIndex: 'nextSendTime', // nextSendTime + nextSendWeek
        sorter: true,
        render: (text, record) => {
          const { nextSendTime, nextSendWeek } = record;
          return <span>{nextSendTime || '--'} {nextSendWeek}</span>;
        },
      }, {
        title: '执行天数',
        dataIndex: 'validPeriod',
        sorter: true,
      }, {
        title: '周期',
        dataIndex: 'cycleTypeName',
        sorter: true,
      }, {
        title: '启用状态',
        dataIndex: 'planStatus',
        sorter: true,
        render: (text) => ['--', '启用', '停用'][text] || '--',
      }, {
        title: '操作',
        dataIndex: 'handle',
        render: (text, record) => {
          return (
            <span className={styles.handleRow}>
              <span className="iconfont icon-look" onClick={() => this.toDetail(record)} />
              <span className="iconfont icon-edit" onClick={() => this.toEdit(record)} />
              <Popconfirm
                title="是否确认删除计划?"
                onConfirm={() => this.deletePlan(record)}
                okText="确定"
                cancelText="取消"
              >
                <span className="iconfont icon-del" />
              </Popconfirm>
            </span>
          );
        },
      },
    ],
  }

  orderFieldBase = ['', 'planTypeName', 'inspectContent', 'firstStartTime', 'nextSendTime', 'validPeriod', 'cycleTypeName', 'planStatus', 'lastHandleTime']

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

  tableSortChange = (pagination, filter, { field, order }) => { // 排序
    let orderField = 3, orderMethod = 'asc';
    if (field) {
      orderField = this.orderFieldBase.indexOf(field);
      orderMethod = order === 'ascend' ? 'asc' : 'desc';
    }
    const { planParams, planListPageParams } = this.props;
    const newPageParams = {
      ...planListPageParams,
      orderField,
      orderMethod,
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

  render(){
    const { column, selectedRowKeys } = this.state;
    const { planListPageParams, planCount, planList, planListLoading, theme } = this.props;
    const { pageNum, pageSize } = planListPageParams;
    return (
      <div className={`${styles.lists} ${styles[theme]}`}>
        <div className={styles.listPageRow} >
          <span className={styles.listBtns}>
            <Button className={styles.addPlanBtn} type="add" onClick={this.toAddPlan} >
              <i>+</i>
              <span>添加计划</span>
            </Button>
            <Popconfirm
                title="是否确认批量删除选中计划?"
                onConfirm={() => this.deletePlans()}
                okText="确定"
                cancelText="取消"
              >
                <Button>批量删除</Button>
              </Popconfirm>
          </span>
          <CommonPagination
            pageSize={pageSize}
            currentPage={pageNum}
            total={planCount}
            onPaginationChange={this.onPaginationChange}
            theme={theme}
          />
        </div>
        <Table
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
          />
        <div className={styles.tableFoot}>
          当前选中<span className={styles.selectedNum}>{selectedRowKeys.length}</span>项
          <span onClick={this.cancelSelects} className={styles.cancelSelects}>取消选择</span>
        </div>
      </div>
    );
  }
}

export default Lists;
