import React, { Component } from "react";
import styles from "./historyWarnCon.scss";
import { Table, Modal, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import FilterCondition from '../../../Common/FilterCondition/FilterCondition';
import CommonPagination from '../../../Common/CommonPagination';
import { SequenceChart } from '../CommonChart/SequenceChart';
import moment from 'moment';


class HistoryWarnCon extends Component {
  static propTypes = {
    inefficiencyStatus: PropTypes.number,// 历史预警 后台默认的
    stationCodes: PropTypes.array, // 选中的电站
    belongMatrixs: PropTypes.array,//所属方阵
    stations: PropTypes.array,//所属方阵
    createTimeStart: PropTypes.string, // 查询时段起点
    createTimeEnd: PropTypes.string,//查询时段结点
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    sortField: PropTypes.string,// 排序字段
    sortMethod: PropTypes.string, //排序方式 desc/asc
    totalNum: PropTypes.number,
    historyWarnList: PropTypes.array, //  历史预警列表
    matrixList: PropTypes.array, // 电站方阵列表
    getHistoryWarnMatrixList: PropTypes.func,
    getHistoryWarnList: PropTypes.func,
    getSequencechart: PropTypes.func,
    sequenceChartList: PropTypes.array,
    nowSequenceChartList: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      record: {}
    }
  }

  componentDidMount() { //获取数据
    const { stationCodes, getHistoryWarnMatrixList } = this.props;
    this.getHistoryWarnList();
    getHistoryWarnMatrixList({ stationCodes: stationCodes })
  }

  onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变
    this.getHistoryWarnList({ pageNum: currentPage, pageSize, });
  }

  onShowDetail = (record) => { // 查看详情
    this.setState({ visible: true, record })
    const deviceCode = record.deviceCode;
    const happenTime = record.happenTime;
    const startTime = moment.utc(moment(happenTime).subtract(1, 'days')).format();
    const endTime = moment.utc(happenTime).format();
    const lastDay = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const nowStartTime = moment.utc(lastDay + ' 00:00:00').format();
    const nowEndTimd = moment.utc(lastDay + ' 23:59:59').format();
    this.props.getSequencechart({ params: { deviceCode, startTime, endTime }, resultName: 'sequenceChartList' })
    this.props.getSequencechart({ params: { deviceCode, nowStartTime, nowEndTimd }, resultName: 'nowSequenceChartList' })
  }

  getHistoryWarnList = (param) => { //请求数据
    const { stationCodes, belongMatrixs, inefficiencyStatus, createTimeStart, createTimeEnd, pageNum, pageSize, sortField, sortMethod
    } = this.props;
    let initParam = {
      stationCodes, belongMatrixs, inefficiencyStatus, createTimeStart, createTimeEnd, pageNum, pageSize, sortField, sortMethod
    };
    this.props.getHistoryWarnList({ ...initParam, ...param })
  }

  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const initSorterField = 'lost_gen_percent'
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
    const { stationCodes, belongMatrixs, inefficiencyStatus, createTimeStart, createTimeEnd, pageNum, pageSize, sortField, sortMethod } = this.props;
    const param = { stationCodes, belongMatrixs, inefficiencyStatus, createTimeStart, createTimeEnd, pageNum, pageSize, sortField, sortMethod }
    this.props.getHistoryWarnList({ ...param, ...change });
    change.stationCodes && this.props.getHistoryWarnMatrixList({ stationCodes: change.stationCodes })
  }

  handleCancel = () => { // 点击关闭按钮时
    this.setState({ visible: false })
  }
 
  timeChange=(value)=>{ // 选择时间查看日期
    const {record}=this.state;
    const deviceCode = record.deviceCode;
    const selectTime=moment(value).format('YYYY-MM-DD')
    const nowStartTime = moment.utc(selectTime + ' 00:00:00').format();
    const nowEndTimd = moment.utc(selectTime + ' 23:59:59').format();
    this.props.getSequencechart({ params: { deviceCode, nowStartTime, nowEndTimd }, resultName: 'nowSequenceChartList' })
  }

  disabledDate=(current)=>{ // 只能选截止今天的日期
    return current && current > moment().endOf('day');
  }


  render() {
    const { stations, matrixList, loading, historyWarnList, pageSize, totalNum, pageNum, sequenceChartList, nowSequenceChartList } = this.props;
    const { record } = this.state;
    const columns = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
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
        defaultSortOrder: 'descend',
      },
      {
        title: '电量损失比',
        dataIndex: 'lostGenPercent',
        key: 'lostGenPercent',
        sorter: true,
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
    const dataSource = historyWarnList.map((item, index) => ({ ...item, key: index, happenTime: moment(item.happenTime).format('YYYY-MM-DD') }));

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

        <Modal
          centered={true}
          footer={null}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          wrapClassName={styles.charts}
          width={1200}
        >
          <div className={styles.modalTitle}>{record.stationName}-{record.deviceName}</div>
          <div className={styles.chartCont} >
            <SequenceChart idName={'sequenceChart'} sequenceChartList={sequenceChartList} currentDeviceName={record.deviceName} title={'预警发生时间:'+ moment(record.happenTime).format('YYYY/MM/DD')} />
            <div className={styles.dataPciker}>
              <DatePicker defaultValue={moment(record.happenTime, 'YYYY/MM/DD')} format={'YYYY/MM/DD'} disabled={true}
              />
            </div>
          </div>
          <div className={styles.chartCont} >
            <SequenceChart idName={'nowSequenceChart'} sequenceChartList={nowSequenceChartList} currentDeviceName={record.deviceName} />
            <div className={styles.dataPciker} >
              <DatePicker defaultValue={moment(moment().subtract(1, 'days'), 'YYYY/MM/DD')} format={'YYYY/MM/DD'}
              onChange={this.timeChange} disabledDate={this.disabledDate}
              />
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
export default HistoryWarnCon;