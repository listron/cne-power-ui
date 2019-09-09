import React, { Component } from 'react';
import styles from './historyWarnCon.scss';
import { Table, Modal, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import FilterCondition from '../../../Common/FilterConditions/FilterCondition';
import CommonPagination from '../../../Common/CommonPagination';
import { SequenceChart } from '../CommonChart/SequenceChart';
import moment from 'moment';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../utils/utilFunc';

class HistoryWarnCon extends Component {
  static propTypes = {
    inefficiencyStatus: PropTypes.number, // 历史预警 后台默认的
    stationCodes: PropTypes.array, // 选中的电站
    belongMatrixs: PropTypes.array, //所属方阵
    stations: PropTypes.array, //所属方阵
    createTimeStart: PropTypes.string, // 查询时段起点
    createTimeEnd: PropTypes.string, //查询时段结点
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    sortField: PropTypes.string, // 排序字段
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
    super(props);
    this.state = {
      visible: false,
      record: {},
    };
  }

  componentDidMount() { //获取数据
    const { stationCodes, getHistoryWarnMatrixList } = this.props;
    this.getHistoryWarnList();
    getHistoryWarnMatrixList({ stationCodes: stationCodes });
  }

  onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变
    this.getHistoryWarnList({ pageNum: currentPage, pageSize });
  }

  onShowDetail = (record) => { // 查看详情
    this.setState({ visible: true, record });
    const deviceCode = record.deviceCode;
    const happenTime = record.happenTime;
    const startTime = moment.utc(moment(happenTime).subtract(1, 'days')).format();
    const endTime = moment.utc(happenTime).format();
    const lastDay = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const nowStartTime = moment.utc(lastDay + ' 00:00:00').format();
    const nowEndTimd = moment.utc(lastDay + ' 23:59:59').format();
    this.props.getSequencechart({ params: { deviceCode, startTime, endTime }, resultName: 'sequenceChartList' });
    this.props.getSequencechart({ params: { deviceCode, startTime: nowStartTime, endTime: nowEndTimd }, resultName: 'nowSequenceChartList' });
  }

  getHistoryWarnList = (param) => { //请求数据
    const { stationCodes, belongMatrixs, inefficiencyStatus, createTimeStart, createTimeEnd, pageNum, pageSize, sortField, sortMethod,
    } = this.props;
    const initParam = {
      stationCodes, belongMatrixs, inefficiencyStatus, createTimeStart, createTimeEnd, pageNum, pageSize, sortField, sortMethod,
    };
    this.props.getHistoryWarnList({ ...initParam, ...param });
  }

  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const initSorterField = 'lost_gen_percent';
    const sortField = sorter.field ? this.sortField(sorter.field) : initSorterField;
    let ascend = '';
    ascend = sorter.order === 'ascend' ? 'asc' : 'desc';
    this.getHistoryWarnList({ sortField, sortMethod: ascend });
  }

  sortField(sortField) {
    let result = '';
    switch (sortField) {
      case 'stationName': result = 'station_code'; break;
      case 'happenTime': result = 'happen_time'; break;
      case 'lostGenPercent': result = 'lost_gen_percent'; break;
      default: result = ''; break;
    }
    return result;
  }

  filterCondition = (value) => { // 筛选条件
    const { inefficiencyStatus, pageNum, pageSize, sortField, sortMethod } = this.props;
    const param = { inefficiencyStatus, pageNum, pageSize, sortField, sortMethod };
    const { stationCodes, rangeTimes, belongMatrixs } = value;
    const [startTime = '', endTime = ''] = rangeTimes;
    this.props.getHistoryWarnList({ ...param, stationCodes, belongMatrixs, startTime, endTime });
    this.props.getHistoryWarnMatrixList({ stationCodes: stationCodes });
  }

  handleCancel = () => { // 点击关闭按钮时
    this.setState({ visible: false });
  }

  timeChange = (value) => { // 选择时间查看日期
    const { record } = this.state;
    const deviceCode = record.deviceCode;
    const selectTime = moment(value).format('YYYY-MM-DD');
    const nowStartTime = moment.utc(selectTime + ' 00:00:00').format();
    const nowEndTimd = moment.utc(selectTime + ' 23:59:59').format();
    this.props.getSequencechart({ params: { deviceCode, startTime: nowStartTime, endTime: nowEndTimd }, resultName: 'nowSequenceChartList' });
  }

  disabledDate = (current) => { // 只能选截止今天的日期
    return current && current > moment().endOf('day');
  }

  render() {
    const { stations, matrixList, loading, historyWarnList, pageSize, totalNum, pageNum, sequenceChartList, nowSequenceChartList, theme } = this.props;
    const { record } = this.state;
    const columns = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
      }, {
        title: '所属方阵',
        dataIndex: 'belongMatrix',
        key: 'belongMatrix',
        render: text => text ? text : '--',
      }, {
        title: '设备名称',
        dataIndex: 'parentDeviceName',
        key: 'parentDeviceName',
        render: text => text ? text : '--',
      }, {
        title: '电流偏低支路',
        dataIndex: 'deviceName',
        key: 'deviceName',
        render: text => text ? text : '--',
      }, {
        title: '发生时间',
        dataIndex: 'happenTime',
        key: 'happenTime',
        sorter: true,
        defaultSortOrder: 'descend',
      }, {
        title: () => <TableColumnTitle title="电量损失比" unit="%" />,
        dataIndex: 'lostGenPercent',
        key: 'lostGenPercent',
        render(text) { return numWithComma(text); },
        sorter: true,
      }, {
        title: '查看',
        className: styles.iconDetail,
        render: (text, record) => (
          <span>
            <i className="iconfont icon-look" onClick={() => this.onShowDetail(record)} />
          </span>
        ),
      },
    ];
    const dataSource = historyWarnList.map((item, index) => ({
      ...item,
      key: index,
      happenTime: moment(item.happenTime).format('YYYY-MM-DD'),
    }));
    const initmatrixList = matrixList.map(e => ({ label: e, value: e }));
    return (
      <div className={`${styles.historyWarnMain} ${styles[theme]}`}>
        <FilterCondition
          theme={theme}
          onChange={this.filterCondition}
          option={[
            {
              name: ' 发生时间',
              type: 'time',
              belong: 'timeSelect',
              typeName: 'rangeTimes',
            },
            {
              name: '电站名称',
              type: 'stationName',
              belong: 'multipleSelect',
              typeName: 'stationCodes',
              data: stations,
            },
            {
              name: '所属方阵',
              type: 'multipleType',
              belong: 'multipleSelect',
              typeName: 'belongMatrixs',
              rules: ['label', 'value'],
              data: initmatrixList,
            },

          ]}
        />
        <div className={styles.wrap}>
          <div className={styles.selectCondition}>
            <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} theme={theme} />
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
        <span ref="modal" />
        <Modal
          centered={true}
          footer={null}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          wrapClassName={styles.charts}
          width={1200}
          getContainer={() => this.refs.modal}
        >
          <div className={styles.modalTitle}>{record.stationName}-{record.deviceName}</div>
          <div className={styles.chartCont} >
            <SequenceChart idName={'sequenceChart'} sequenceChartList={sequenceChartList} currentDeviceName={record.deviceName} title={'预警发生时间:' + moment(record.happenTime).format('YYYY/MM/DD')} theme={theme} />
            <div className={styles.dataPciker}>
              <DatePicker defaultValue={moment(record.happenTime, 'YYYY/MM/DD')} format={'YYYY/MM/DD'} disabled={true}
                getCalendarContainer={() => this.refs.modal}
              />
            </div>
          </div>
          <div className={styles.chartCont} >
            <SequenceChart idName={'nowSequenceChart'} sequenceChartList={nowSequenceChartList} currentDeviceName={record.deviceName} theme={theme} />
            <div className={styles.dataPciker} >
              <DatePicker defaultValue={moment(moment().subtract(1, 'days'), 'YYYY/MM/DD')} format={'YYYY/MM/DD'}
                onChange={this.timeChange} disabledDate={this.disabledDate} getCalendarContainer={() => this.refs.modal}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
export default HistoryWarnCon;
