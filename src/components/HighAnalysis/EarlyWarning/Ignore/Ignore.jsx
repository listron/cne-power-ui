import React, { Component } from 'react';
import { Select, Table } from 'antd';
import PropTypes from 'prop-types';
import styles from './ignore.scss';
import FilterCondition from '../../../Common/FilterConditions/FilterCondition';
import CommonPagination from '../../../Common/CommonPagination';
import WarningTip from '../../../Common/WarningTip';
import CneTable from '../../../Common/Power/CneTable';
import moment from 'moment';


const Option = Select.Option;
class Ignore extends Component {
  static propTypes = {
    getIgnoreList: PropTypes.func,
    ignoreList: PropTypes.array,
    getUnignore: PropTypes.func,
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
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedRowKeys: [], //选择的数据
      showWarningTip: false, //是否可见
      warningTipText: '取消忽略已选中的预警?',
    };
  }

  componentDidMount() { // 初始请求数据
    const { getMatrixlist, stationCodes } = this.props;
    this.getIgnoreList();
    getMatrixlist({ stationCodes: stationCodes });
  }


  tableSortMap = { // api存储字段 => 表格排序字段
    'station_code': 'stationName',
    'ignore_time': 'ignoreTime',
    'deadline': 'ignoreEndTime',
  };

  sortMethodMap = {
    'desc': 'descend',
    'asc': 'ascend',
  }


  onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变
    this.getIgnoreList({ pageNum: currentPage, pageSize });
  }

  onSelectChange = (keys, record) => { // 选择进行操作
    this.setState({ selectedRowKeys: keys });
  }

  getIgnoreList = (param) => { // 请求数据
    const { stationCodes, belongMatrixs, startTime, endTime, pageNum, pageSize, sortField, sortMethod } = this.props;
    this.props.getIgnoreList({
      stationCodes, belongMatrixs, startTime, endTime, pageNum, pageSize, sortField, sortMethod, ...param,
    });
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
    this.getIgnoreList({ sortField: newSortField, sortMethod: newSortMethod });
  };

  sortField(sortField) {
    let result = '';
    switch (sortField) {
      case 'stationName': result = 'station_code'; break;
      case 'ignoreTime': result = 'ignore_time'; break;
      case 'ignoreEndTime': result = 'deadline'; break;
      default: result = ''; break;
    }
    return result;
  }

  filterCondition = (value) => { // 筛选条件
    const { stationCodes, rangeTimes, belongMatrixs } = value;
    const [startTime = '', endTime = ''] = rangeTimes;
    this.getIgnoreList({ stationCodes, belongMatrixs, startTime, endTime });
    this.props.getMatrixlist({ stationCodes });
  }

  selectChange = (wayChange) => { // 进行操作 转工单 忽略
    if (wayChange === 'cancleIgnore') {
      this.setState({ showWarningTip: true });
    }
    if (wayChange === 'ReRequest') {
      this.getIgnoreList();
    }
  }



  cancelWarningTip = () => { // 点击取消
    this.setState({ showWarningTip: false, selectedRowKeys: [] });
  }

  confirmWarningTip = () => { // 点击确定
    this.setState({ showWarningTip: false, selectedRowKeys: [] });
    const { selectedRowKeys } = this.state;
    this.props.getUnignore({ inefficiencyIds: selectedRowKeys });
  }



  render() {
    const { stations, pageSize, pageNum, totalNum, loading, ignoreList, matrixList, theme, sortField, sortMethod } = this.props;
    const { selectedRowKeys, showWarningTip, warningTipText, detailVisiable } = this.state;
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
        title: '忽略时间',
        dataIndex: 'ignoreTime',
        key: 'ignoreTime',
        sorter: true,
        textAlign: 'center',
        className: styles.ignoreTime,
      },
      {
        title: '忽略截止时间',
        dataIndex: 'ignoreEndTime',
        key: 'ignoreEndTime',
        sorter: true,
        textAlign: 'center',
        render: text => text ? text : '--',
        className: styles.ignoreEndTime,
      },
      {
        title: '忽略原因',
        dataIndex: 'ignoreReason',
        key: 'ignoreReason',
        className: styles.ignoreReason,
        render: (text) => (<div title={text || '--'} className={styles.ignoreReasonText} title={text}>{text || '--'}</div>),
      },
      {
        title: '操作人',
        dataIndex: 'username',
        key: 'username',
        className: styles.username,
        render: (text) => (<div title={text || '--'} className={styles.usernameText} title={text}>{text || '--'}</div>),
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const dataSource = ignoreList.map((item, index) => ({ ...item, key: item.inefficiencyId, ignoreTime: moment(item.ignoreTime).format('YYYY-MM-DD') }));
    const initmatrixList = matrixList.map(e => ({ label: e, value: e }));
    return (
      <div className={`${styles.ignoreBox} ${styles[theme]}`} >
        <div className={styles.ignoreMain}>
          {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
          <FilterCondition
            theme={theme}
            onChange={this.filterCondition}
            className={styles.filterWrap}
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
            <span ref={'select'} />
            <div className={styles.selectCondition}>
              <Select onChange={this.selectChange} placeholder="操作" value={'操作'} dropdownMatchSelectWidth={false} getPopupContainer={() => this.refs.select}>
                <Option value="cancleIgnore" disabled={selectedRowKeys.length > 0 ? false : true}>取消忽略</Option>
                <Option value="ReRequest" >更新列表</Option>
              </Select>
              <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum}
                onPaginationChange={this.onPaginationChange} theme={theme} className={styles.pagination} />
            </div>
            <CneTable
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              className={styles.tableWrap}
              rowSelection={rowSelection}
              loading={loading}
              sortField={this.tableSortMap[sortField]}
              sortMethod={this.sortMethodMap[sortMethod]}
              onChange={this.tableChange}
            />
          </div>

        </div>

      </div>
    );
  }
}

export default Ignore;
