import React, { Component } from 'react';
import styles from './realTimeWarning.scss';
import CommonPagination from '../../../Common/CommonPagination';
import TransferWarningModal from './TransferWarningModal';
import HandleRemoveModal from './HandleRemoveModal';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Table, Select, Popover, Icon, Button } from 'antd';
import moment from 'moment';
const Option = Select.Option;

class RealTimeWarningTable extends Component {
  static propTypes = {
    selectedTransfer: PropTypes.array,
    defectTypes: PropTypes.array,
    changeRealtimeWarningStore: PropTypes.func,
    transferWarning: PropTypes.func,
    HandleRemoveWarning: PropTypes.func,
    realtimeWarning: PropTypes.array,
    selectedRowKeys: PropTypes.array,
    getLostGenType: PropTypes.func,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showTransferTicketModal: false,
      showHandleRemoveModal: false,
      sortName: '',
      descend: false,
    };
  }
  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    this.props.changeRealtimeWarningStore({ currentPage, pageSize });
  }
  onHandle = (value) => {//转工单或手动解除的modal
    if (value === 'ticket') { // 暂时批量转工单去掉
      this.setState({
        showTransferTicketModal: true,
      });
    } else if (value === 'relieve') {
      this.setState({
        showHandleRemoveModal: true,
      });
    }
  }
  onSelectChange = (selectedRowKeys) => {//选择checkbox
    // console.log('selectedRowKeys',selectedRowKeys)
    this.props.changeRealtimeWarningStore({ selectedRowKeys });
  }

  onShowDetail = (record) => {
    this.setState({
      showTransferTicketModal: true,
    });
    this.props.changeRealtimeWarningStore({ selectedTransfer: [record] });
  }

  cancelRowSelect = () => {//取消选中
    this.props.changeRealtimeWarningStore({ selectedRowKeys: [] });
  }

  tableChange = (pagination, filters, sorter) => {
    this.setState({
      sortName: sorter.field,
      descend: sorter.order === 'descend',
    });
    // this.props.changeRealtimeWarningStore({
    //   sortName: sorter.field,
    // });
  }



  render() {
    const level = ['一级', '二级', '三级', '四级'];
    const columns = [
      {
        title: '告警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
        render: (text, record, index) => {
          return level[text - 1];
        },
        sorter: true,
      }, {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
      }, {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        sorter: true,
        render: (text, record) => {
          const deviceTypeCodes = ['202', '304', '302', '201', '206', '203', '101'];
          const isClick = deviceTypeCodes.includes(`${record.deviceTypeCode}`);
          if (isClick) {
            return (
              <div className={styles.deviceName}>
                <Link to={`/hidden/monitorDevice/${record.stationCode}/${record.deviceTypeCode}/${record.deviceFullCode}`} className={styles.underlin} >{text}</Link>
              </div>
            );
          }
          return text;

        },
      }, {
        title: '设备类型',
        dataIndex: 'deviceTypeName',
        key: 'deviceTypeName',
        sorter: true,
      }, {
        title: '告警描述',
        dataIndex: 'warningCheckDesc',
        key: 'warningCheckDesc',
        render: (text, record) => {
          return <div className={styles.alarmDesc} title={text}>{text}</div>;
        },
      }, {
        title: '发生时间',
        dataIndex: 'timeOn',
        key: 'timeOn',
        render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm'),
        sorter: true,
      }, {
        title: '持续时间',
        dataIndex: 'durationTime',
        key: 'durationTime',
        sorter: true,
      }, {
        title: '操作',
        className: styles.iconDetail,
        render: (text, record) => (
          <div>
            <span>
              <i className="iconfont icon-tranlist icon-action" onClick={() => { this.onShowDetail(record); }} />
            </span>
          </div>
        ),
      },
    ];
    const { realtimeWarning, selectedRowKeys, pageSize, currentPage, loading, selectedTransfer, getLostGenType, defectTypes, transferWarning, theme } = this.props;
    const { sortName, descend, showTransferTicketModal, showHandleRemoveModal } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const nameSortArr = ['stationName', 'deviceName', 'deviceTypeName', 'warningCheckDesc'];//同种排序
    const tableSource = realtimeWarning.map((e, i) => ({
      ...e,
      key: i,
    })).sort((a, b) => { // 手动排序
      const sortType = descend ? -1 : 1;
      if (sortName === 'warningLevel') {
        return sortType * (a.warningLevel - b.warningLevel);
      } else if (nameSortArr.includes(sortName)) {
        return sortType * a[sortName].localeCompare(b[sortName], 'zh');
      } else if (sortName === 'timeOn') {
        return sortType * (moment(a.timeOn) - moment(b.timeOn));
      } else if (sortName === 'durationTime') {
        return sortType * (moment(b.timeOn) - moment(a.timeOn));
      }
      return a.key - b.key;

    }).filter((e, i) => { // 筛选页面
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return (i >= startIndex && i < endIndex);
    });
    return (
      <div className={styles.realTimeWarningTable}>
        <span ref={'select'} />
        <div className={styles.tableHeader}>
          <Select onChange={this.onHandle}
            value="操作"
            getPopupContainer={() => this.refs.select}
            placeholder="操作" dropdownMatchSelectWidth={false} dropdownClassName={styles.handleDropdown}>
            {/* <Option value="ticket" disabled={selectedRowKeys.length === 0}><i className="iconfont icon-tranlist"></i>转工单</Option>  */}
            <Option value="relieve" disabled={selectedRowKeys.length === 0}><i className="iconfont icon-manual"></i>手动解除</Option>
          </Select>
          <CommonPagination pageSize={pageSize} currentPage={currentPage} onPaginationChange={this.onPaginationChange} total={realtimeWarning.length} theme={this.props.theme} />
        </div>
        <Table
          dataSource={tableSource}
          rowKey={record => record.warningLogId}
          rowSelection={rowSelection}
          columns={columns}
          pagination={false}
          onChange={this.tableChange}
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
        />
        {realtimeWarning.length > 0 && <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedRowKeys.length}</span>项</span>
          {selectedRowKeys.length > 0 && <span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>}
        </div>}

        {showTransferTicketModal &&
          <TransferWarningModal
            onCancel={() => this.setState({ showTransferTicketModal: false })}
            onTransferAlarm={transferWarning}
            defectTypes={defectTypes}
            selectedTransfer={selectedTransfer}
            getLostGenType={getLostGenType}
            theme={theme}
          />
        }
        {showHandleRemoveModal &&
          <HandleRemoveModal
            onCancel={() => this.setState({ showHandleRemoveModal: false })}
            HandleRemoveWarning={this.props.HandleRemoveWarning}
            selectedRowKeys={selectedRowKeys}
            theme={theme}
          />
        }
      </div>
    );
  }
}
export default (RealTimeWarningTable);


