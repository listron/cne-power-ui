import React, { Component } from 'react';
import { Select, Table, Modal, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './unhandle.scss';
import FilterCondition from '../../../Common/FilterConditions/FilterCondition';
import CommonPagination from '../../../Common/CommonPagination';
import WarningTip from '../../../Common/WarningTip';
import IgnoreModal from './IgnoreModal';
import moment from 'moment';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma, handleRight } from '../../../../utils/utilFunc';
import CneTable from '../../../Common/Power/CneTable';

const Option = Select.Option;
class Unhandle extends Component {
  static propTypes = {
    changeUnhandleStore: PropTypes.func,
    getUnhandleList: PropTypes.func,
    toorder: PropTypes.func,
    ignoreList: PropTypes.func,
    getForewarningDetail: PropTypes.func,
    getSequencechart: PropTypes.func,
    getMatrixlist: PropTypes.func,
    stationCodes: PropTypes.array,
    belongMatrixs: PropTypes.array,
    inefficiencyStatus: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    unhandleList: PropTypes.array,
    totalNum: PropTypes.number,
    stations: PropTypes.array,
    matrixList: PropTypes.array,
    ignoreReason: PropTypes.array,
    theme: PropTypes.string,
    loading: PropTypes.bool,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedRowKeys: [], //选择的数据
      showWarningTip: false, //是否可见
      warningTipText: '确认选中预警生成工单？',
      ingoreVisible: false, // 忽略列表
    };
  }

  tableSortMap = { // api存储字段 => 表格排序字段
    'station_code': 'stationName',
    'lost_gen_percent': 'lostGenPercent',
    'happen_time': 'happenTime',
  };

  sortMethodMap = {
    'desc': 'descend',
    'asc': 'ascend',
  }


  onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变
    this.getUnhandleList({ pageNum: currentPage, pageSize });
  }

  onShowDetail = (record) => { // 查看详情
    const inefficiencyId = record.inefficiencyId;
    const deviceCode = record.deviceCode;
    const happenTime = record.happenTime;
    const startTime = moment.utc(moment(happenTime).subtract(1, 'days')).format();
    const endTime = moment.utc(happenTime).format();
    this.props.changeUnhandleStore({ pageName: 'detail', inefficiencyId, deviceCode });
    this.props.getForewarningDetail({ inefficiencyId });
    this.props.getSequencechart({ deviceCode, startTime, endTime });
  }

  onSelectChange = (keys, record) => { // 选择进行操作
    this.setState({
      selectedRowKeys: keys,
    });
  }

  getUnhandleList = (param) => { // 请求数据
    const { stationCodes, belongMatrixs, inefficiencyStatus, pageNum, pageSize, sortField, sortMethod } = this.props;
    this.props.getUnhandleList({
      stationCodes, belongMatrixs, inefficiencyStatus, pageNum, pageSize, sortField, sortMethod, ...param,
    });
  }

  setDetailVisiable = (e) => {// 点击返回按钮
    this.setState(e);
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
    this.getUnhandleList({ sortField: newSortField, sortMethod: newSortMethod });
  };

  sortField(sortField) { // 排序转换
    let result = '';
    switch (sortField) {
      case 'stationName': result = 'station_code'; break;
      case 'lostGenPercent': result = 'lost_gen_percent'; break;
      case 'happenTime': result = 'happen_time'; break;
      default: result = ''; break;
    }
    return result;
  }

  filterCondition = (change) => { // 筛选条件
    this.getUnhandleList({ ...change });
    this.props.getMatrixlist({ stationCodes: change.stationCodes });
  }



  selectChange = (wayChange) => { // 进行操作 转工单 忽略
    if (wayChange === 'transfer') {
      this.setState({ showWarningTip: true });
    }
    if (wayChange === 'ignore') {
      this.setState({ ingoreVisible: true });
    }
  }

  cancelWarningTip = () => { // 点击取消
    this.setState({ showWarningTip: false, selectedRowKeys: [] });
  }

  confirmWarningTip = () => { // 点击确定
    const { toorder } = this.props;
    const { selectedRowKeys } = this.state;
    this.setState({ showWarningTip: false, selectedRowKeys: [] });
    toorder({ inefficiencyIds: selectedRowKeys });
  }

  addReason = (rest) => { // 忽略原因
    const { ignoreList } = this.props;
    const { buttonStatus, ignoreReason, ignoreReasonCode, deadline, ignoreTime } = rest;
    if (buttonStatus === 'sure') {
      ignoreList({ inefficiencyIds: this.state.selectedRowKeys, ignoreReason, ignoreReasonCode, deadline, ignoreTime });
    }
    this.setState({ ingoreVisible: false });
  }

  render() {
    const { stations, pageSize, pageNum, totalNum, loading, unhandleList, matrixList, ignoreReason, theme, sortField, sortMethod } = this.props;
    const { selectedRowKeys, showWarningTip, warningTipText, ingoreVisible } = this.state;
    const unhandleOperation = handleRight('inefficientDetect_worklist');
    const columns = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
        className: styles.stationName,
        render: (text) => (<div title={text || '--'} className={styles.stationNameText} title={text}>{text || '--'}</div>),
      }, {
        title: '所属方阵',
        dataIndex: 'belongMatrix',
        key: 'belongMatrix',
        className: styles.belongMatrix,
        render: (text) => (<div title={text || '--'} className={styles.belongMatrixText} title={text}>{text || '--'}</div>),
      }, {
        title: '设备名称',
        dataIndex: 'parentDeviceName',
        key: 'parentDeviceName',
        className: styles.parentDeviceName,
        render: (text) => (<div title={text || '--'} className={styles.parentDeviceNameText} title={text}>{text || '--'}</div>),

      }, {
        title: '电流偏低支路',
        dataIndex: 'deviceName',
        key: 'deviceName',
        className: styles.deviceName,
        render: (text) => (<div title={text || '--'} className={styles.deviceNameText} title={text}>{text || '--'}</div>),
      }, {
        title: '预警时间',
        dataIndex: 'happenTime',
        key: 'happenTime',
        sorter: true,
        textAlign: 'center',
        className: styles.happenTime,
      }, {
        title: '电量损失比(%)',
        dataIndex: 'lostGenPercent',
        key: 'lostGenPercent',
        render(text) { return numWithComma(text); },
        sorter: true,
        textAlign: 'right',
        className: styles.lostGenPercent,
      }, {
        title: '详情及处理',
        className: styles.iconDetail,
        textAlign: 'center',
        render: (text, record) => (
          <i className={`iconfont icon-todo ${styles.icon}`} onClick={() => { this.onShowDetail(record); }} />
        ),
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const dataSource = unhandleList.map((item, index) => ({ ...item, key: item.inefficiencyId }));
    const initmatrixList = matrixList.map(e => ({ label: e, value: e }));
    return (
      <div className={styles.unhandleMain}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.filterCondition}>
          <FilterCondition
            theme={theme}
            onChange={this.filterCondition}
            option={[
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
        </div>
        <span ref={'select'} />
        <div className={styles.selectCondition}>
          {unhandleOperation ? <Select onChange={this.selectChange} placeholder="操作" value={'操作'} dropdownMatchSelectWidth={false}
            getPopupContainer={() => this.refs.select}>
            <Option value="transfer" disabled={selectedRowKeys.length > 0 ? false : true} className={styles.option}>
              <i className="iconfont icon-tranlist" />  转工单</Option>
            <Option value="ignore" disabled={selectedRowKeys.length > 0 ? false : true} className={styles.option}>
              <i className="iconfont icon-neglect" />  忽略</Option>
          </Select> : <div></div>}
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum}
            onPaginationChange={this.onPaginationChange} theme={theme} className={styles.pagination} />
        </div>
        <CneTable
          columns={columns}
          className={styles.wrap}
          dataSource={dataSource}
          pagination={false}
          rowSelection={rowSelection}
          loading={loading}
          sortField={this.tableSortMap[sortField]}
          sortMethod={this.sortMethodMap[sortMethod]}
          onChange={this.tableChange}
        />
        <IgnoreModal ignoreReason={ignoreReason} onChange={this.addReason} ingoreVisible={ingoreVisible} theme={theme} />
      </div>

    );
  }
}

export default Unhandle;
