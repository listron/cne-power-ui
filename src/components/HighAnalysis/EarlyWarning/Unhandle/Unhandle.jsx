import React, { Component } from "react";
import { connect } from "react-redux";
import { Select, Table } from 'antd';
import PropTypes from 'prop-types';
import styles from "./Unhandle.scss";
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import FilterCondition from '../../../Common/FilterCondition/FilterCondition';
import CommonPagination from '../../../Common/CommonPagination';
import WarningTip from '../../../Common/WarningTip';
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
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      selectedRowKeys: [],//选择的数据
      showWarningTip:false, //是否可见
      warningTipText:'确认选中预警生成工单？'
    }

  }

  componentDidMount() {
    const { stationCodes, belongMatrixs, inefficiencyStatus, pageNum, pageSize, sortField, sortMethod, getUnhandleList } = this.props;
    getUnhandleList({ stationCodes, belongMatrixs, inefficiencyStatus, pageNum, pageSize, sortField, sortMethod })
  }

  onPaginationChange = () => {

  }

  onShowDetail = (record) => {

  }

  tableChange = () => {

  }

  filterCondition = (change) => {
    console.log('change', change)
  }

  selectChange = (wayChange) => {
    console.log('wayChange', wayChange)
    if(wayChange==='transfer'){
      this.setState({showWarningTip:true})
    }
  }

  onSelectChange = (keys, record) => {
    this.setState({
      selectedRowKeys: keys,
      // downloadData: record,
    });
    console.log('selectedRowKeys', keys)
  }

  cancelWarningTip=()=>{ // 点击取消

  }

  confirmWarningTip=()=>{ // 点击确定

  }

  render() {
    const { stations, pageSize, pageNum, totalNum, loading, unhandleList } = this.props;
    const { selectedRowKeys,showWarningTip,warningTipText } = this.state
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
        sorter: true,
      },
      {
        title: '设备名称',
        dataIndex: 'parentDeviceName',
        key: 'parentDeviceName',
        sorter: true,
      },
      {
        title: '电流偏低支路',
        dataIndex: 'deviceName',
        key: 'deviceName',
        sorter: true,
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
        sorter: true,
      },
      {
        title: '详情及处理',
        className: styles.look,
        render: (text, record) => (
          <span>
            <i className="iconfont icon-look" onClick={() => { this.onShowDetail(record) }} />
          </span>
        )
      }
    ]
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const dataSource = unhandleList.map((item, index) => ({ ...item, key: item.inefficiencyId }));
    return (
      <div className={styles.UnhandleBox} >
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <FilterCondition
          option={['stationName', 'belongMatrixs']}
          stations={stations}
          onChange={this.filterCondition}
        />
        <div className={styles.selectCondition}>
          <Select onChange={this.selectChange} placeholder="操作" value={'操作'} dropdownMatchSelectWidth={false} >
            <Option value="transfer" disabled={selectedRowKeys.length > 0 ? false : true}><i className="iconfont icon-tranlist" />转工单</Option>
            <Option value="ignore" disabled={selectedRowKeys.length > 0 ? false : true}><i className="iconfont icon-log" />忽略</Option>
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

      </div>
    )
  }
}

export default Unhandle