import React, { Component } from 'react';
import { Select, Table, Modal, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './ignore.scss';
import FilterCondition from '../../../Common/FilterCondition/FilterCondition';
import CommonPagination from '../../../Common/CommonPagination';
import WarningTip from '../../../Common/WarningTip';
import moment from 'moment';

const Option = Select.Option;
class Ignore extends Component {
  static propTypes = {
    changeIgnoreStore: PropTypes.func,
    getIgnoreList: PropTypes.func,
    toorder: PropTypes.func,
    ignoreList: PropTypes.array,
    getUnignore: PropTypes.func,
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
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
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

  onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变  
    this.getIgnoreList({ pageNum: currentPage, pageSize });
  }

  onSelectChange = (keys, record) => { // 选择进行操作
    this.setState({ selectedRowKeys: keys });
  }

  getIgnoreList = (param) => { // 请求数据
    const { stationCodes, belongMatrixs, createTimeStart, createTimeEnd, pageNum, pageSize, sortField, sortMethod } = this.props;
    this.props.getIgnoreList({
      stationCodes, belongMatrixs, createTimeStart, createTimeEnd, pageNum, pageSize, sortField, sortMethod, ...param,
    });
  }


  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const initSorterField = 'ignore_time';
    let ascend = '';
    const sortField = sorter.field ? this.sortField(sorter.field) : initSorterField;
    ascend = sorter.order === 'ascend' ? 'asc' : 'desc';
    this.getIgnoreList({ sortField, sortMethod: ascend });
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

  filterCondition = (change) => { // 筛选条件
    this.getIgnoreList(change);
    change.stationCodes && this.props.getMatrixlist({ stationCodes: change.stationCodes });
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
    const { stations, pageSize, pageNum, totalNum, loading, ignoreList, matrixList, theme } = this.props;
    const { selectedRowKeys, showWarningTip, warningTipText, detailVisiable } = this.state;
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
        render: text => (text) ? text : '--',
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
        title: '忽略时间',
        dataIndex: 'ignoreTime',
        key: 'ignoreTime',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        title: '忽略截止时间',
        dataIndex: 'ignoreEndTime',
        key: 'ignoreEndTime',
        sorter: true,
        render: text => text ? text : '--',
      },
      {
        title: '忽略原因',
        dataIndex: 'ignoreReason',
        key: 'ignoreReason',
        render: text => text ? text : '--',
      },
      {
        title: '操作人',
        dataIndex: 'username',
        key: 'username',
        render: text => text ? text : '--',
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const dataSource = ignoreList.map((item, index) => ({ ...item, key: item.inefficiencyId, ignoreTime: moment(item.ignoreTime).format('YYYY-MM-DD') }));
    return (
      <div className={`${styles.ignoreBox} ${styles[theme]}`} >
        <div className={styles.ignoreMain}>
          {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
          <FilterCondition
            option={['time', 'stationName', 'belongMatrixs']}
            stations={stations.filter(e => e.stationType === 1)}
            matrixList={matrixList}
            onChange={this.filterCondition}
            theme={theme}
          />
          <div className={styles.wrap}>
            <span ref={'select'} />
            <div className={styles.selectCondition}>
              <Select onChange={this.selectChange} placeholder="操作" value={'操作'} dropdownMatchSelectWidth={false} getPopupContainer={() => this.refs.select}>
                <Option value="cancleIgnore" disabled={selectedRowKeys.length > 0 ? false : true}>取消忽略</Option>
                <Option value="ReRequest" >更新列表</Option>
              </Select>
              <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum}
                onPaginationChange={this.onPaginationChange} theme={theme} />
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
          </div>

        </div>

      </div>
    );
  }
}

export default Ignore;
