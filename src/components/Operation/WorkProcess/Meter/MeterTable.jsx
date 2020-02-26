import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';
import moment from 'moment';
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
    operatorValue: PropTypes.array,
    selectedStation: PropTypes.array,
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
    const { field } = sorter || {};
    // 排序字段
    const sortFieldMap = {
        stationName: 'station_name',
        settleMonth: 'settle_month',
        createTime: 'create_time',
        keepLength: 'keep_length',
        stateName: 'sort',
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
      sortField: !field ? this.props.sortField : field,
      sortMethod: newSort === 'asc' ? 'ascend' : 'descend',
    });
    // 请求抄表列表
    getMeterList({
      ...listParams,
      sortField: newField,
      sortMethod: newSort,
    });
  };

  onShowDetail = (record) => { // 展示详情
    const { docketId } = record;
    const {
      history,
      selectedStation,
      listParams,
      sortField,
      sortMethod,
      searchStatus,
      operatorValue,
    } = this.props;
    const { pathname } = history.location;
    // 下钻到详情页时保留当前查询参数，返回查询当前页面
    const params = {
      selectedStation,
      listParams,
      sortField,
      sortMethod,
      searchStatus,
      operatorValue,
    };
    history.push(`${pathname}?page=meterDetail&meterId=${docketId}&params=${JSON.stringify(params)}`);
  };

  /**
   * 格式化分钟转为天、时、分
   * @param {number} minutes
   */
  formatMinutes = (minutes) => {

    const day = parseInt(minutes / 1440, 0);

    const hour = day > 0

      ? Math.floor((minutes - day * 1440) / 60)

      : Math.floor(minutes / 60);

    const minute = hour > 0

      ? Math.floor(minutes - day * 1440 - hour * 60)

      : minutes;

    let time = '';

    if (day > 0) time += day.toString().padStart(2, '0') + '天';

    if (hour > 0) time += hour.toString().padStart(2, '0') + '小时';

    if (hour > 0 && minute > 0) time += minute.toString().padStart(2, '0') + '分钟';

    return time;
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
        render: (text) => (<div title={text} >{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '- -'}</div>),
      }, {
        title: '持续时间',
        align: 'center',
        dataIndex: 'keepLength',
        sorter: true,
        className: styles.keepLength,
        render: (text) => (<div title={text}>{text ? this.formatMinutes(Number(text)) : '- -'}</div>),
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
        render: (text, record) => {
          const { endTime, planEndTime } = record;
          // 当前时间
          const currentTime = Math.round(new Date().getTime() / 1000);
          /**
           * 1）状态=已结单，实际完成时间(endTime)＞要求完成时间(planEndTime)，记为超时
           * 2）状态≠已结单，当前时间(本地时间)＞要求完成时间(planEndTime)，记为超时
           * 3）直接显示文本
           * */
          // 1)状态=已结单
          if(endTime && planEndTime && endTime > planEndTime) {
            return (
              <div className={styles.stateNameBox} title={text}>
                <div>{text || '- -'}</div>
                <i className={'iconfont icon-chaoshi'} />
              </div>
            );
          }
          // 2)状态≠已结单
          if(!endTime && planEndTime && currentTime > planEndTime) {
            return (
              <div className={styles.stateNameBox} title={text}>
                <div>{text || '- -'}</div>
                <i className={'iconfont icon-chaoshi'} />
              </div>
            );
          }
          return (
            <div className={styles.stateNameBox} title={text}>
              <div>{text || '- -'}</div>
            </div>
          );
        },
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
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" alt="" /> }}
        />
      </div>
    );
  }
}
