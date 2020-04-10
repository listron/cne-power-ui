import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './transfer.scss';
import FilterCondition from '../../../Common/FilterConditions/FilterCondition';
import CommonPagination from '../../../Common/CommonPagination';
import moment from 'moment';
import CneTable from '../../../Common/Power/CneTable';

class Transfer extends Component {
  static propTypes = {
    getTransferList: PropTypes.func,
    transferList: PropTypes.array,
    getMatrixlist: PropTypes.func,
    stationCodes: PropTypes.array,
    belongMatrixs: PropTypes.array,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    totalNum: PropTypes.number,
    stations: PropTypes.array,
    matrixList: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    theme: PropTypes.string,
    loading: PropTypes.bool,
  }
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() { // 初始请求数据
    const { stationCodes, getMatrixlist } = this.props;
    this.getTransferList();
    getMatrixlist({ stationCodes: stationCodes });
  }

  tableSortMap = { // api存储字段 => 表格排序字段
    'station_code': 'stationName',
    'happen_time': 'happenTime',
    'create_time': 'createTime',
  };

  sortMethodMap = {
    'desc': 'descend',
    'asc': 'ascend',
  }


  onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变
    this.getTransferList({ pageNum: currentPage, pageSize });
  }

  getTransferList = (param) => { // 请求数据
    const { stationCodes, belongMatrixs, startTime, endTime, pageNum, pageSize, sortField, sortMethod } = this.props;
    const initParam = { stationCodes, belongMatrixs, startTime, endTime, pageNum, pageSize, sortField, sortMethod };
    this.props.getTransferList({ ...initParam, ...param });
  }

  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const { sortField, sortMethod } = this.props;
    const { field } = sorter;
    let newSortField = sortField, newSortMethod = 'desc';
    if (!field || (this.sortField(field) === newSortField)) { // 点击的是正在排序的列
      newSortMethod = sortMethod === 'desc' ? 'asc' : 'desc'; // 交换排序方式
    } else { // 切换列
      newSortField = this.sortField(sorter.field);
    }
    this.getTransferList({ sortField: newSortField, sortMethod: newSortMethod });
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
    const { stations, pageSize, pageNum, totalNum, loading, transferList, matrixList, theme, sortField, sortMethod } = this.props;
    const columns = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
        className: styles.stationName,
        render: (text) => (<div title={text || '--'} className={styles.stationNameText} title={text}>{text || '--'}</div>),
      },
      {
        title: '所属方阵',
        dataIndex: 'belongMatrix',
        key: 'belongMatrix',
        className: styles.belongMatrix,
        render: (text) => (<div title={text || '--'} className={styles.belongMatrixText} title={text}>{text || '--'}</div>),
      },
      {
        title: '设备名称',
        dataIndex: 'parentDeviceName',
        key: 'parentDeviceName',
        className: styles.parentDeviceName,
        render: (text) => (<div title={text || '--'} className={styles.parentDeviceNameText} title={text}>{text || '--'}</div>),
      },
      {
        title: '电流偏低支路',
        dataIndex: 'deviceName',
        key: 'deviceName',
        className: styles.deviceName,
        render: (text) => (<div title={text || '--'} className={styles.deviceNameText} title={text}>{text || '--'}</div>),
      },
      {
        title: '预警时间',
        dataIndex: 'happenTime',
        key: 'happenTime',
        sorter: true,
        textAlign: 'center',
        className: styles.happenTime,
      },
      {
        title: '下发时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        textAlign: 'center',
        className: styles.createTime,
      },
      {
        title: '查看工单',
        className: styles.iconDetail,
        render: (text, record) => (
          <span className={styles.iconBox}>
            <Link to={`/operation/workProcess/view?page=defectDetail&defectId=${record.defectId}`} target="_blank">
              <i className="iconfont icon-tranlist icon-action" />
            </Link>
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
          <CneTable
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            loading={loading}
            sortField={this.tableSortMap[sortField]}
            sortMethod={this.sortMethodMap[sortMethod]}
            onChange={this.tableChange}
          />
        </div>
      </div>
    );
  }
}

export default Transfer;
