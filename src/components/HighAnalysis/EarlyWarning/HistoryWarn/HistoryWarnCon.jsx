import React, { Component } from "react";
import styles from "./historyWarnCon.scss";
import { Select, Table } from 'antd';
import FilterCondition from '../../../Common/FilterCondition/FilterCondition';
import CommonPagination from '../../../Common/CommonPagination';
import moment from 'moment';

const Option = Select.Option;

class HistoryWarnCon extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount(){ //获取数据
    const { stationCodes,getHistoryWarnMatrixList } = this.props;
    console.log(this.props);
    this.getHistoryWarnList();
    getHistoryWarnMatrixList({stationCodes:stationCodes})
  }

  onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变
    this.getHistoryWarnList({ pageNum: currentPage, pageSize, });
  }

  getHistoryWarnList = (param) => { //请求数据
    const { stationCodes,belongMatrixs,inefficiencyStatus,createTimeStart,createTimeEnd,pageNum,pageSize,sortField,sortMethod
    } = this.props;
    let initParam = { stationCodes,belongMatrixs,inefficiencyStatus,createTimeStart,createTimeEnd,pageNum,pageSize,sortField,sortMethod
    };
    this.props.getHistoryWarnList({ ...initParam, ...param })
  }

  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const initSorterField='lost_gen_percent'
    const sortField = sorter.field ? this.sortField(sorter.field) : initSorterField;
    let ascend = "";
    ascend = sorter.order === 'ascend' ? 'asc' : 'desc';
    this.getHistoryWarnList({ sortField, sortMethod: ascend });
  }

  sortField(sortField) {
    let result = "";
    switch (sortField) {
      case 'stationName': result = 'station_code'; break;
      case 'happenTime': result = 'happen_time'; break;
      case 'lostGenPercent': result = 'lost_gen_percent'; break;
      default: result = ""; break;
    }
    return result
  }

  filterCondition = (change) => { // 筛选条件
    const { stationCodes,belongMatrixs,inefficiencyStatus,createTimeStart,createTimeEnd,pageNum,pageSize,sortField,sortMethod } = this.props;
    const param = { stationCodes, belongMatrixs, inefficiencyStatus, createTimeStart, createTimeEnd, pageNum, pageSize, sortField, sortMethod }
    this.props.getHistoryWarnList({ ...param, ...change });
    change.stationCodes && this.props.getHistoryWarnMatrixList({ stationCodes: change.stationCodes })
  }
  
  render() {
    const {stations,matrixList,loading,historyWarnList,pageSize,totalNum,pageNum,} = this.props;
    const columns=[
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
        defaultSortOrder: 'descend',
        // render: text => (text || text === 0) ? text : '--'
      },
      {
        title: '所属方阵',
        dataIndex: 'belongMatrix',
        key: 'belongMatrix',
        render: text => (text || text === 0) ? text : '--'
      },
      {
        title: '设备名称',
        dataIndex: 'parentDeviceName',
        key: 'parentDeviceName',
        render: text => (text || text === 0) ? text : '--'
      },
      {
        title: '电流偏低支路',
        dataIndex: 'deviceName',
        key: 'deviceName',
        render: text => (text || text === 0) ? text : '--'
      },
      {
        title: '发生时间',
        dataIndex: 'happenTime',
        key: 'happenTime',
        sorter: true,
        // render: text => (text || text === 0) ? text : '--'
      },
      {
        title: '电量损失比',
        dataIndex: 'lostGenPercent',
        key: 'lostGenPercent',
        sorter: true,
        // render: text => (text || text === 0) ? text : '--'
      },
      {
        title: '查看',
        className: styles.iconDetail,
        render: (text, record) => (
          <span>
            <i className="iconfont icon-look" onClick={() => {
              this.onShowDetail
              (record)
            }} />
          </span>
        )
      }
    ]
    const dataSource = historyWarnList.map((item, index) => ({ ...item, key: index, happenTime: moment(item.happenTime).format('YYYY-MM-DD'), createTime: moment(item.createTime).format('YYYY-MM-DD') }));

    return (
      <div className={styles.historyWarnMain}>

        <FilterCondition
          option={['time', 'stationName', 'belongMatrixs']}
          stations={stations}
          matrixList={matrixList}
          onChange={this.filterCondition}
        />
 
       <div className={styles.selectCondition}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>

        <Table 
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        onChange={this.tableChange}
        locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
      )
    }
} 
export default HistoryWarnCon;
