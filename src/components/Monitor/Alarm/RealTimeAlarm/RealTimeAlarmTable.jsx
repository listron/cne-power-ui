import React, { Component } from 'react';
import CommonPagination from '../../../Common/CommonPagination';
import WarningTip from '../../../Common/WarningTip';
import TransferAlarmModal from './TransferAlarmModal';
import RelieveAlarmModal from './RelieveAlarmModal';
import styles from './realTimeAlarm.scss';
import PropTypes from 'prop-types';
import { Table, Select, Popover, Icon, Button } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
const Option = Select.Option;

class RealTimeAlarmTable extends Component {
  static propTypes = {
    realtimeAlarm: PropTypes.array,
    selectedRowKeys: PropTypes.array,
    onRelieveAlarm: PropTypes.func,
    onResetRelieveAlarm: PropTypes.func,
    getTicketInfo: PropTypes.func,
    getRelieveInfo: PropTypes.func,
    onTransferAlarm: PropTypes.func,
    onRelieveAlarm: PropTypes.func,
    defectTypes: PropTypes.object,
    ticketInfo: PropTypes.object,
    relieveInfo: PropTypes.object,
    alarmStatus: PropTypes.number,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
    changeAlarmStore: PropTypes.func,
    onPaginationChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showTransferTicketModal: false,
      showRelieveAlarmModal: false,
      showTransferPopover: [],
      showRelievePopover: [],
      showWarningTip: false,
      warningTipText: '',
      sortName: '',
      descend: false,
    }
  }

  onChangeTable = (pagination, filters, sorter) => {
    this.setState({
      sortName: sorter.field,
      descend: sorter.order === 'descend'
    });
    this.props.changeAlarmStore({
      sortName: sorter.field,
    });
  }

  onSelectChange = (selectedRowKeys) => {
    this.props.changeAlarmStore({ selectedRowKeys });
  }

  onHandle = (value) => {
    if (value === 'ticket') {
      this.setState({
        showTransferTicketModal: true
      });
    } else if (value === 'relieve') {
      this.setState({
        showRelieveAlarmModal: true
      });
    } else if (value === 'resetRelieve') {
      this.setState({
        showWarningTip: true,
        warningTipText: ' 确定要取消解除么'
      });
    }
  }

  onConfirmWarningTip = () => {
    const { selectedRowKeys } = this.props;
    this.setState({
      showWarningTip: false,
      warningTipText: ''
    });
    this.props.onResetRelieveAlarm({
      warningLogId: selectedRowKeys
    });
  }

  onCancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip: false
    });
  }

  onTransferChange(visible, workOrderId, i) {
    if (visible) {
      this.props.getTicketInfo({
        workOrderId
      });
    } else {
      this.props.changeAlarmStore({
        ticketInfo: {}
      });
    }
    let showTransferPopover = this.state.showTransferPopover;
    showTransferPopover[i] = visible;
    this.setState({
      showTransferPopover
    });
  }

  onRelieveChange(visible, operateId, i) {
    if (visible) {
      this.props.getRelieveInfo({
        operateId
      });
    } else {
      this.props.changeAlarmStore({
        relieveInfo: {}
      });
    }
    let showRelievePopover = this.state.showRelievePopover;
    showRelievePopover[i] = visible;
    this.setState({
      showRelievePopover
    });
  }

  cancelRowSelect = () => {
    this.props.changeAlarmStore({ selectedRowKeys: [] });
  }

  createTableSource(data) {
    const { sortName, descend } = this.state;
    const { pageSize, currentPage } = this.props;
    const nameSortArr = ['stationName', 'deviceTypeName', 'warningConfigName']
    const tableSource = data.map((e, i) => ({
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
      } else {
        return a.key - b.key;
      }
    }).filter((e, i) => { // 筛选页面
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return (i >= startIndex && i < endIndex);
    });
    // const { inverterList } = this.props;
    // const initDeviceList = inverterList.deviceList || [];
    // const totalNum = initDeviceList.length || 0;
    // const maxPage = Math.ceil(totalNum / pageSize);
    // if(totalNum === 0){ // 总数为0时，展示0页
    //   currentPage = 0;
    // }else if(maxPage < currentPage){ // 当前页已超出
    //   currentPage = maxPage;
    // }
    return tableSource;
  }

  initColumn = () => {
    const level = ['一级', '二级', '三级', '四级'];
    const { alarmStatus } = this.props;
    const columns = [
      {
        title: '告警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
        render: (text, record, index) => {
          return level[text - 1]
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
        render: (text, record) => {
          if (record.deviceTypeCode === 206) {
            return (
              <div className={styles.deviceName}>
                <Link to={`/hidden/monitorDevice/${record.stationCode}/${record.deviceTypeCode}/${record.deviceFullCode}`} >{text}</Link>
              </div>
            );
          } else if (record.deviceTypeCode === 304) {
            return (
              <div className={styles.deviceName}>
                <Link to={`/hidden/monitorDevice/${record.stationCode}/${record.deviceTypeCode}/${record.deviceFullCode}`} >{text}</Link>
              </div>
            );
          } else {
            return text;
          }
        }
      }, {
        title: '设备类型',
        dataIndex: 'deviceTypeName',
        key: 'deviceTypeName',
        sorter: true,
      }, {
        title: '告警类型',
        dataIndex: 'warningConfigName',
        key: 'warningConfigName',
        sorter: true,
      }, {
        title: '告警描述',
        dataIndex: 'warningCheckDesc',
        key: 'warningCheckDesc',
        render: (text, record) => {
          return <div className={styles.alarmDesc} title={text}>{text}</div>
        }
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
        title: '告警处理',
        dataIndex: 'operation',
        key: 'operation',
        colSpan: alarmStatus === 1 ? 0 : null,
        render: (text, record, index) => {
          if (record.isTransferWork === 0) {
            return (
              <Popover content={this.renderTransferPopover(index)}
                trigger="click"
                visible={this.state.showTransferPopover[index]}
                onVisibleChange={(visible) => this.onTransferChange(visible, record.workOrderId, index)}
              >
                <div className={this.state.showTransferPopover[index] ? styles.selected : null}><i className="iconfont icon-tranlist icon-action"></i></div>
              </Popover>
            );
          }
          if (record.isRelieveAlarm === 0) {
            return (
              <Popover content={this.renderRelievePopover(index)}
                trigger="click"
                className={this.state.showRelievePopover[index] ? styles.selected : null}
                visible={this.state.showRelievePopover[index]}
                onVisibleChange={(visible) => this.onRelieveChange(visible, record.operateId, index)}
              >
                <div className={this.state.showRelievePopover[index] ? styles.selected : null}><i className="iconfont icon-manual icon-action"></i></div>
              </Popover>
            );
          }
        }

      }
    ]
    return columns;
  }

  renderOperation() {
    const alarmStatus = this.props.alarmStatus;
    if (alarmStatus === 3) {
      return <div></div>;
    }
    const selectedRowKeys = this.props.selectedRowKeys;
    const rightHandler = localStorage.getItem('rightHandler');
    const removeAlarmRight = rightHandler && rightHandler.split(',').includes('alarm_remove');
    const toChangeWorkListRight = rightHandler && rightHandler.split(',').includes('alarm_worklist');
    if (alarmStatus === 1 && !removeAlarmRight && !toChangeWorkListRight) { return null; }
    return (
      <Select onChange={this.onHandle} value="操作" placeholder="操作" dropdownMatchSelectWidth={false} dropdownClassName={styles.handleDropdown}>
        {toChangeWorkListRight && <Option value="ticket" disabled={selectedRowKeys.length === 0}><i className="iconfont icon-tranlist"></i>转工单</Option>}
        {alarmStatus === 1 && removeAlarmRight && <Option value="relieve" disabled={selectedRowKeys.length === 0}><i className="iconfont icon-manual"></i>手动解除</Option>}
        {alarmStatus === 2 && removeAlarmRight && <Option value="resetRelieve" disabled={selectedRowKeys.length === 0}><i className="iconfont icon-lifted"></i>取消解除</Option>}
      </Select>
    );
  }

  renderTransferModal() {
    return (
      <TransferAlarmModal
        onCancel={() => this.setState({ showTransferTicketModal: false })}
        onTransferAlarm={this.props.onTransferAlarm}
        defectTypes={this.props.defectTypes}
        selectedRowKeys={this.props.selectedRowKeys}
      />
    );
  }

  renderRelieveModal() {
    return (
      <RelieveAlarmModal
        onCancel={() => this.setState({ showRelieveAlarmModal: false })}
        onRelieveAlarm={this.props.onRelieveAlarm}
        selectedRowKeys={this.props.selectedRowKeys}
      />
    );
  }

  renderTransferPopover(i) {
    const ticketInfo = this.props.ticketInfo;
    //console.log(this.props.ticketInfo);
    //  console.log(ticketInfo.operateTime);
    //   console.log(moment(moment.utc(ticketInfo.operateTime).toDate()).local().format('YYYY-MM-DD HH:mm'));

    return (
      <div className={styles.detailInfo}>
        <div className={styles.header}>
          <div className={styles.title}>
            <i className="iconfont icon-tranlist icon-action"></i>
            <span className={styles.titleText}>已转工单</span>
          </div>
          <Icon type="close" onClick={() => {
            let showTransferPopover = this.state.showTransferPopover;
            showTransferPopover[i] = false;
            this.setState({ showTransferPopover });
          }} />
        </div>
        <div className={styles.content}>
          <div className={styles.infoItem}>
            <span className={styles.label}>转工单人：</span>
            <span className={styles.value}>{ticketInfo.userFullName ? ticketInfo.userFullName : ticketInfo.username}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>操作时间：</span>
            <span className={styles.value}>{moment.utc(ticketInfo.operateTime).format('YYYY-MM-DD HH:mm')}</span>
            {/* 后期改成utc格式的时间 */}
            {/* <span className={styles.value}>{moment(moment.utc(ticketInfo.operateTime).toDate()).local().format('YYYY-MM-DD HH:mm')}</span> */}
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>缺陷类型：</span>
            <span className={styles.value}>{ticketInfo.defectTypeName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>缺陷描述：</span>
            <span className={styles.value}>{ticketInfo.defectDescribe}</span>
          </div>
        </div>
        <Button className={styles.ticketButton}>
        <Link to={`/operation/ticket/defect/${ticketInfo.defectId}`}>
        查看工单详情</Link>
        </Button>
      </div>
    );
  }

  renderRelievePopover(i) {
    const relieveInfo = this.props.relieveInfo;
    //  
    return (
      <div className={styles.detailInfo}>
        <div className={styles.header}>
          <div className={styles.title}>
            <i className="iconfont icon-manual icon-action"></i>
            <span className={styles.titleText}>手动解除</span>
          </div>
          <Icon type="close" onClick={() => {
            let showRelievePopover = this.state.showRelievePopover;
            showRelievePopover[i] = false;
            this.setState({ showRelievePopover });
          }} />
        </div>
        <div className={styles.content}>
          <div className={styles.infoItem}>
            <span className={styles.label}>解除人：</span>
            <span className={styles.value}>{relieveInfo.userFullName ? relieveInfo.userFullName : relieveInfo.username}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>操作时间：</span>
            <span className={styles.value}>{moment(relieveInfo.operateTime).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>出现次数：</span>
            <span className={styles.value}>{relieveInfo.warningCount}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>解除原因：</span>
            <span className={styles.value}>{relieveInfo.operateReason}</span>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { realtimeAlarm, selectedRowKeys, alarmStatus, onPaginationChange, pageSize, currentPage } = this.props;
    const { showTransferTicketModal, showRelieveAlarmModal, showWarningTip, warningTipText } = this.state;
    const tableSource = this.createTableSource(realtimeAlarm);
    const columns = this.initColumn();
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={styles.alarmTable}>
        {showWarningTip && <WarningTip
          style={{ marginTop: '350px', width: '210px', height: '88px' }}
          onCancel={this.onCancelWarningTip}
          hiddenCancel={false}
          onOK={this.onConfirmWarningTip}
          value={warningTipText} />}
        <div className={styles.tableHeader}>
          {this.renderOperation()}
          <CommonPagination pageSize={pageSize} currentPage={currentPage} onPaginationChange={onPaginationChange} total={realtimeAlarm.length} />
        </div>
        <Table
          dataSource={tableSource}
          rowKey={record => record.warningLogId}
          rowSelection={alarmStatus === 3 ? null : rowSelection}
          columns={columns}
          pagination={false}
          onChange={this.onChangeTable}
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
        />
        {alarmStatus !== 3 && realtimeAlarm.length > 0 && <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedRowKeys.length}</span>项</span>
          {selectedRowKeys.length > 0 && <span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>}
        </div>}
        {showTransferTicketModal && this.renderTransferModal()}
        {showRelieveAlarmModal && this.renderRelieveModal()}
      </div>
    );
  }
}

export default RealTimeAlarmTable;