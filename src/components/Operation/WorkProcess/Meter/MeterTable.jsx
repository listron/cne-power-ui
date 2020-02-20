import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';
import CommonPagination from '@components/Common/CommonPagination';
import CneTable from '@components/Common/Power/CneTable';
import styles from './meter.scss';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class MeterTable extends React.Component {
  static propTypes = {
    listParams: PropTypes.object,
    history: PropTypes.object,
    theme: PropTypes.string,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    meterData: PropTypes.object,
    searchStatus: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    getMeterList: PropTypes.func,
    changeStore: PropTypes.func,
  };

  onChangeStatus = e => {
    const { getMeterList, changeStore, listParams } = this.props;
    changeStore({
      searchStatus: e.target.value,
    });
    // 查询抄表列表
    getMeterList({
      ...listParams,
      stateId: e.target.value === '' ? null : e.target.value,
    });
  };

  onPaginationChange = ({ currentPage, pageSize }) => {
    const { getMeterList, listParams } = this.props;
    // 查询抄表列表
    getMeterList({
      ...listParams,
      pageNum: currentPage,
      pageSize,
    });
  };

  tableChange = (pagination, filter, sorter) => { // 排序触发重新请求设备列表
    const { getMeterList, listParams, changeStore } = this.props;
    console.log(sorter, 'sorter');
    const { field } = sorter || {};
    // 排序字段
    const sortFieldMap = {
        stationName: 'station_name',
        settleMonth: 'settle_month',
        createTime: 'create_time',
        keepLength: 'keep_length',
        stateName: 'state_name',
    };
    const { sortField, sortMethod } = listParams || {};
    let newField = sortField, newSort = 'desc';
    if(!field || sortField === sortFieldMap[field]) {// 点击的是正在排序的列
      newSort = sortMethod === 'desc' ? 'asc' : 'desc'; // 交换排序方式
    }else{
      newField = sortFieldMap[field];
    }
    // 手动改变表格排序字段
    changeStore({
      sortField: newField,
      sortMethod: newSort,
    });
    // 请求抄表列表
    getMeterList({
      ...listParams,
      sortField: newField,
      sortMethod: newSort,
    });
    console.log(newField, '2345678', newSort);
  };

  onShowDetail = (record) => { // 展示详情
    const { type } = record;
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}?page=meterDetail&meterId=${type}`);
  };

  render() {
    const {
      listParams: {
        pageSize,
        pageNum,
      },
      theme,
      sortMethod,
      sortField,
      searchStatus,
      meterData: {
        tableData: {
          pageCount,
          dataList,
        },
        stateAndTotalList,
      },
    } = this.props;
    const pointListColumn = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        sorter: true,
        className: styles.stationName,
        render: (text) => (<div className={styles.stationNameText} title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '结算月份',
        align: 'center',
        dataIndex: 'settleMonth',
        className: styles.settleMonth,
        render: (text) => (<div title={text} >{text || '- -'}</div>),
        sorter: true,
      }, {
        title: '工单创建时间',
        align: 'center',
        dataIndex: 'createTime',
        sorter: true,
        className: styles.createTime,
        render: (text) => (<div title={text} >{text || '- -'}</div>),
      }, {
        title: '持续时间',
        align: 'center',
        dataIndex: 'keepLength',
        sorter: true,
        className: styles.keepLength,
        render: (text) => (<div title={text}>{text || '- -'}</div>),
      },
      {
        title: '执行人',
        dataIndex: 'operName',
        className: styles.operName,
        render: (text) => (<div className={styles.operNameText} title={text}>{text || '- -'}</div>),
      }, {
        title: '状态',
        align: 'center',
        dataIndex: 'stateName',
        className: styles.stateName,
        sorter: true,
        render: (text, record) => (<div title={text}>{text || '- -'}</div>),
      }, {
        title: '操作',
        align: 'center',
        className: styles.meterDetails,
        render: (text, record) => {
          return <span title="查看" className={styles.iconLookBtn} onClick={() => { this.onShowDetail(record);}}><i className={'iconfont icon-look'} /></span>;
        },
      },
    ];
    return (
      <div className={styles.searchTable}>
        <div className={`${styles.searchStatus}`}>
          <RadioGroup onChange={this.onChangeStatus} value={searchStatus}>
            <RadioButton value="">全部</RadioButton>
            {stateAndTotalList.map(cur => {
              return (
                <RadioButton key={cur.stateId} value={cur.stateId}>{`${cur.stateName} ${cur.total}`}</RadioButton>
              );
            })}
          </RadioGroup>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={Number(pageCount)} onPaginationChange={this.onPaginationChange} theme={theme} />
        </div>
        <CneTable
          sortField={sortField}
          sortMethod={sortMethod}
          onChange={this.tableChange}
          columns={pointListColumn}
          className={styles.tableStyles}
          dataSource={dataList}
          rowKey={(record, index) => index || 'key'}
          scroll={{ y: 462 }}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png"  alt=""/> }}
        />
      </div>
    );
  }
}
