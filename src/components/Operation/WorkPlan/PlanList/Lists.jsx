
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Popconfirm, Table } from 'antd';
import CommonPagination from '@components/Common/CommonPagination';
import styles from './listSearch.scss';

class Lists extends PureComponent {

  static propTypes = {
    planParams: PropTypes.object,
    planListPageParams: PropTypes.object,
    planCount: PropTypes.number,
    planList: PropTypes.array,
    planListLoading: PropTypes.bool,
    changeStore: PropTypes.func,
    getWorkPlanList: PropTypes.func,
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
        render: (text = '') => (<div title={text} className={styles.inspectContentText}>{text || '--'}</div>),
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
        title: '计划天数',
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
        // className: styles.handle,
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

  toAddPlan = () => {
    this.props.changeStore({ planPageKey: 'detail' });
  }

  deletePlan = () => { // 删除一条计划
    console.log('删除一条');
  }

  deletePlans = () => { // 删除所有选中计划
    console.log('要删除所有选中计划');
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

  tableSortChange = (a, b, c, d) => {
    console.log(a, b, c, d);
  }

  planSelects = (selectedRowKeys) => { // 行选中
    this.setState({ selectedRowKeys });
  }

  render(){
    const { column, selectedRowKeys } = this.state;
    const { planListPageParams, planCount, planList, planListLoading } = this.props;
    const { pageNum, pageSize } = planListPageParams;
    return (
      <div className={styles.lists}>
        <div className={styles.listPageRow} >
          <span className={styles.listBtns}>
            <Button className={styles.addPlanBtn} type="add" onClick={this.toAddPlan} >
              <i>+</i>
              <span>添加计划</span>
            </Button>
            <Button onClick={this.deletePlans}>批量删除</Button>
          </span>
          <CommonPagination
            pageSize={pageSize}
            currentPage={pageNum}
            total={planCount}
            onPaginationChange={this.onPaginationChange}
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
          当前选中<span>{selectedRowKeys.length}</span>项
          <span>取消选择</span>
        </div>
      </div>
    );
  }
}

export default Lists;
