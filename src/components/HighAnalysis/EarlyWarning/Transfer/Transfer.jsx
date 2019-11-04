import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select, Table, Modal, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './transfer.scss';
import FilterCondition from '../../../Common/FilterConditions/FilterCondition';
import CommonPagination from '../../../Common/CommonPagination';
import WarningTip from '../../../Common/WarningTip';
import moment from 'moment';

const Option = Select.Option;
class Transfer extends Component {
  static propTypes = {
    changeTransferStore: PropTypes.func,
    getTransferList: PropTypes.func,
    transferList: PropTypes.array,
    resetStore: PropTypes.func,
    getMatrixlist: PropTypes.func,
    stationCodes: PropTypes.array,
    belongMatrixs: PropTypes.array,
    inefficiencyStatus: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    totalNum: PropTypes.number,
    stations: PropTypes.array,
    matrixList: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() { // 初始请求数据
    const { stationCodes, getMatrixlist } = this.props;
    this.getTransferList();
    getMatrixlist({ stationCodes: stationCodes });
  }

  onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变
    this.getTransferList({ pageNum: currentPage, pageSize });
  }


  onShowDetail = (record) => {
    const defectId = record.defectId;
    this.props.changeTransferStore({ pageName: 'detail', defectId });

  }

  getTransferList = (param) => { // 请求数据
    const { stationCodes, belongMatrixs, startTime, endTime, pageNum, pageSize, sortField, sortMethod } = this.props;
    const initParam = { stationCodes, belongMatrixs, startTime, endTime, pageNum, pageSize, sortField, sortMethod };
    this.props.getTransferList({ ...initParam, ...param });
  }


  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const initSorterField = 'create_time';
    let ascend = '';
    const sortField = sorter.field ? this.sortField(sorter.field) : initSorterField;
    ascend = sorter.order === 'ascend' ? 'asc' : 'desc';
    this.getTransferList({ sortField, sortMethod: ascend });
  };

  sortField(sortField) {
    let result = '';
    switch (sortField) {
      case 'stationName': result = 'station_code'; break;
      case 'happenTime': result = 'happen_time'; break;
      case 'createTime': result = 'create_time'; break;
      default: result = ''; break;
    }
    return result;
  }

  filterCondition = (value) => { // 筛选条件
    const { stationCodes, rangeTimes, belongMatrixs } = value;
    const [startTime = '', endTime = ''] = rangeTimes;
    const { pageNum, pageSize, sortField, sortMethod } = this.props;
    const param = { pageNum, pageSize, sortField, sortMethod };
    this.props.getTransferList({ ...param, stationCodes, belongMatrixs, startTime, endTime });
    this.props.getMatrixlist({ stationCodes });
  }



  render() {
    const { stations, pageSize, pageNum, totalNum, loading, transferList, matrixList, theme } = this.props;
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
        render: text => text ? text : '--',
      },
      {
        title: '设备名称',
        dataIndex: 'parentDeviceName',
        key: 'parentDeviceName',
        render: text => text ? text : '--',
      },
      {
        title: '电流偏低支路',
        dataIndex: 'deviceName',
        key: 'deviceName',
        render: text => text ? text : '--',
      },
      {
        title: '预警时间',
        dataIndex: 'happenTime',
        key: 'happenTime',
        sorter: true,
      },
      {
        title: '下发时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        title: '查看工单',
        className: styles.iconDetail,
        render: (text, record) => (
          <span className={styles.iconBox}>
            <i className="iconfont icon-tranlist icon-action" onClick={() => { this.onShowDetail(record); }} />
          </span>

        ),
      },
    ];
    const dataSource = transferList.map((item, index) => ({ ...item, key: item.defectId, happenTime: moment(item.happenTime).format('YYYY-MM-DD'), createTime: moment(item.createTime).format('YYYY-MM-DD') }));
    const initmatrixList = matrixList.map(e => ({ label: e, value: e }));
    return (
      <div className={`${styles.transferMain} ${styles[theme]}`}>
        <FilterCondition
          theme={theme}
          onChange={this.filterCondition}
          option={[
            {
              name: '预警时间',
              type: 'time',
              typeName: 'rangeTimes',
            },
            {
              name: '电站名称',
              type: 'stationName',
              typeName: 'stationCodes',
              data: stations.filter(e => e.stationType === 1),
            },
            {
              name: '所属方阵',
              type: 'multipleType',
              typeName: 'belongMatrixs',
              data: initmatrixList,
            },
          ]}
        />
        <div className={styles.wrap}>
          <div className={styles.selectCondition}>
            <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum}
              onPaginationChange={this.onPaginationChange} theme={theme} />
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
      </div>
    );
  }
}

export default Transfer;
