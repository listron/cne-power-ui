import React, { Component } from "react";
import { connect } from "react-redux";
import { Select, Table, Modal, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from "./newUnhandle.scss";
import FilterCondition from '../../../Common/FilterCondition/FilterCondition';
import CommonPagination from '../../../Common/CommonPagination';
import WarningTip from '../../../Common/WarningTip';
import IgnoreModal from './IgnoreModal';
import moment from 'moment';

const Option = Select.Option;
class Unhandle extends Component {
  static propTypes = {
    changeUnhandleStore: PropTypes.func,
    getUnhandleList: PropTypes.func,
    toorder: PropTypes.func,
    ignoreList: PropTypes.func,
    getForewarningDetail: PropTypes.func,
    getSequencechart: PropTypes.func,
    resetStore: PropTypes.func,
    getMatrixlist: PropTypes.func,
    stationCodes: PropTypes.array,
    belongMatrixs: PropTypes.array,
    inefficiencyStatus: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    unhandleList: PropTypes.array,
    warnDetail: PropTypes.object,
    Sequencechart: PropTypes.object,
    totalNum: PropTypes.number,
    stations: PropTypes.array,
    matrixList: PropTypes.array,
    ignoreReason: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      selectedRowKeys: [],//选择的数据
      showWarningTip: false, //是否可见
      warningTipText: '确认选中预警生成工单？',
      detailVisiable: false,
      ingoreVisible: false,// 忽略列表
    }

  }

  componentDidMount() { // 初始请求数据
  
  }

  onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变
    this.getUnhandleList({pageNum:currentPage,pageSize});
  }

  onShowDetail = (record) => {  // 查看详情
    const inefficiencyId = record.inefficiencyId;
    const deviceCode=record.deviceCode;
    const happenTime=record.happenTime;
    const startTime=moment.utc(moment(happenTime).subtract(1, 'days')).format();
    const endTime=moment.utc(happenTime).format();
    this.props.changeUnhandleStore({pageName:'detail',inefficiencyId,deviceCode})
    this.props.getForewarningDetail({ inefficiencyId })
    this.props.getSequencechart({deviceCode,startTime,endTime})
  }

  onSelectChange = (keys, record) => {  // 选择进行操作
    this.setState({
      selectedRowKeys: keys,
    });
  }

  getUnhandleList = (param) => { // 请求数据
    const { stationCodes, belongMatrixs, inefficiencyStatus, pageNum, pageSize, sortField, sortMethod } = this.props;
    this.props.getUnhandleList({
      stationCodes, belongMatrixs, inefficiencyStatus, pageNum, pageSize, sortField, sortMethod,...param,
    })
  }

  setDetailVisiable = (e) => {// 点击返回按钮
    this.setState(e)
  }

  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const initSorterField='lost_gen_percent'
    const sortField = sorter.field ? this.sortField(sorter.field) : initSorterField;
    let ascend = "";
    ascend = sorter.order === 'ascend' ? 'asc' : 'desc';   
    this.getUnhandleList({sortField, sortMethod: ascend });
  };

  sortField(sortField) { // 排序转换
    let result = "";
    switch (sortField) {
      case 'stationName': result = 'station_code'; break;
      case 'lostGenPercent': result = 'lost_gen_percent'; break;
      case 'happenTime': result = 'happen_time'; break;
      default: result = ""; break;
    }
    return result
  }

  filterCondition = (change) => { // 筛选条件
    this.getUnhandleList({...change});
    change.stationCodes  && this.props.getMatrixlist({ stationCodes: change.stationCodes })
  }

  selectChange = (wayChange) => { // 进行操作 转工单 忽略
    if (wayChange === 'transfer') {
      this.setState({ showWarningTip: true })
    }
    if (wayChange === 'ignore') {
      this.setState({ ingoreVisible: true })
    }
  }



  cancelWarningTip = () => { // 点击取消
    this.setState({ showWarningTip: false, selectedRowKeys: [] })
  }

  confirmWarningTip = () => { // 点击确定
    const { toorder } = this.props;
    const { selectedRowKeys } = this.state;
    this.setState({ showWarningTip: false, selectedRowKeys: [] })
    toorder({inefficiencyIds:selectedRowKeys})
  }

  addReason = (rest) => {  // 忽略原因
    const { ignoreList } = this.props;
    const { buttonStatus, ignoreReason, ignoreReasonCode } = rest;
    if (buttonStatus === 'sure') {
      ignoreList({ inefficiencyIds: this.state.selectedRowKeys, ignoreReason, ignoreReasonCode })
    }
    this.setState({ ingoreVisible: false })
  }

  render() {
    const { stations, pageSize, pageNum, totalNum, loading, unhandleList, matrixList, ignoreReason, } = this.props;
    const { selectedRowKeys, showWarningTip, warningTipText, ingoreVisible } = this.state;
    const columns = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
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
      },
      {
        title: '电量损失比',
        dataIndex: 'lostGenPercent',
        key: 'lostGenPercent',
        defaultSortOrder: 'descend',
        sorter: true,
      },
      {
        title: '详情及处理',
        className: styles.iconDetail,
        render: (text, record) => (
          <span>
            <i className="iconfont icon-todo" onClick={() => { this.onShowDetail(record) }} />
          </span>
        )
      }
    ]
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const dataSource = unhandleList.map((item, index) => ({ ...item, key: item.inefficiencyId,lostGenPercent: item.lostGenPercent + '%'}));
    return (
      <div className={styles.unhandleMain}>
      {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
      <FilterCondition
        option={['stationName', 'belongMatrixs']}
        stations={stations.filter(e => e.stationType === 1)}
        matrixList={matrixList}
        onChange={this.filterCondition}
      />
      <div className={styles.selectCondition}>
        <Select onChange={this.selectChange} placeholder="操作" value={'操作'} dropdownMatchSelectWidth={false} >
          <Option value="transfer" disabled={selectedRowKeys.length > 0 ? false : true} className={styles.option}><i className="iconfont icon-tranlist" />  转工单</Option>
          <Option value="ignore" disabled={selectedRowKeys.length > 0 ? false : true} className={styles.option}><i className="iconfont icon-neglect" />  忽略</Option>
        </Select>
        <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum}
          onPaginationChange={this.onPaginationChange} />
      </div>
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowSelection={rowSelection}
        onChange={this.tableChange}
        locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
      />
      <IgnoreModal ignoreReason={ignoreReason} onChange={this.addReason} ingoreVisible={ingoreVisible} />
    </div>
 
    )
  }
}

export default Unhandle