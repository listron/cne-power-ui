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
    loading: PropTypes.bool,
    onRelieveAlarm: PropTypes.func,
    onResetRelieveAlarm: PropTypes.func,
    getTicketInfo: PropTypes.func,
    getRelieveInfo: PropTypes.func,
    onTransferAlarm: PropTypes.func,
    onRelieveAlarm: PropTypes.func,
    defectTypes: PropTypes.object,
    ticketInfo: PropTypes.object,
    relieveInfo: PropTypes.object,
  }

  constructor(props){
    super(props);
    this.state = {
      pageSize: 10, 
      currentPage: 1,
      selectedRowKeys: [],
      showTransferTicketModal: false,
      showRelieveAlarmModal: false,
      showTransferPopover: false,
      showRelievePopover: false,
      showWarningTip: false,
      warningTipText: '',
    }
  }

  onChangePagination = ({ pageSize, currentPage }) => {
    this.setState({ pageSize, currentPage })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  onHandle = (value) => {
    if(value === 'ticket') {
      this.setState({
        showTransferTicketModal: true
      });
    }else if(value === 'relieve') {
      this.setState({
        showRelieveAlarmModal: true
      });
    } else if(value === 'resetRelieve') {
      this.setState({
        showWarningTip: true,
        warningTipText: ' 确定要取消解除吗'
      });
    }
  }
  
  onConfirmWarningTip = () => {
    const { selectedRowKeys } = this.state;
    this.setState({
      showWarningTip: false,
      warningTipText: ''
    });
    this.onResetRelieveAlarm({
      warningLogId: selectedRowKeys.join(',')
    });
  }

  onTransferChange(visible, operateId) {
    if(visible) {
      this.props.getTicketInfo({
        operateId
      });
    }
  }

  onRelieveChange(visible, operateId) {
    if(visible) {
      this.props.getRelieveInfo({
        operateId
      });
    }
  }

  initColumn = () => {
    const level = ['一级', '二级', '三级', '四级']; 
    const columns = [
      {
        title: '告警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
        render: (text, record, index)=> {
          return level[text+1]
        },
        sorter: (a,b) => a.warningLevel - b.warningLevel,
      },{
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName', 
        sorter: (a,b) => a.stationCode - b.stationCode,
      },{
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName', 
        sorter: (a,b) => a.stationCode - b.stationCode,
      },{
        title: '设备类型',
        dataIndex: 'deviceTypeName',
        key: 'deviceTypeName', 
        sorter: (a,b) => a.deviceTypeCode - b.deviceTypeCode,
      },{
        title: '告警类型',
        dataIndex: 'warningConfigName',
        key: 'warningConfigName',
      },{
        title: '告警描述',
        dataIndex: 'warningCheckDesc',
        key: 'warningCheckDesc', 
      },{
        title: '发生时间',
        dataIndex: 'timeOn',
        key: 'timeOn', 
        sorter:  (a,b) => moment(a.timeOn).isBefore(moment(b.timeOn)),
      },{
        title: '持续时间',
        dataIndex: 'durationTime',
        key: 'durationTime',
        render: (text, record) => {
          const minuteNum = parseInt(text);
          const milliseconds = minuteNum * 60 * 1000;
          const duration = moment.duration(milliseconds);
          const day = parseInt(minuteNum/(60*24)) > 99 ? 99 : parseInt(minuteNum/(60*24));
          const displayDay = (day < 10 && day!==0) ? "0" + day : day;
          const hour = duration.hours();
          const displayHour = hour < 10 ? "0" + hour : hour;
          const minute = duration.minutes();
          const displayMiute = minute < 10 ? "0" + minute : minute;
          return `${displayDay}天${displayHour}小时${displayMiute}分钟`;
        },
        sorter: (a,b) => moment(b.timeOn).isBefore(moment(a.timeOn)),
      },{
        title: '告警处理',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          if(record.isTransferWork === 0) {
            return (
              <Popover content={this.renderTransferPopover()}
              trigger="click"
              visible={this.state.showTransferPopover}
              onVisibleChange={(visible)=>this.onTransferChange(visible, record.operateId)}
              >
                <i className="iconfont icon-tranlist icon-action"></i>
              </Popover>
            );
          }
          if(record.isRelieveAlarm === 0) {
            return (
              <Popover content={this.renderRelievePopover()}
              trigger="click"
              visible={this.state.showRelievePopover}
              onVisibleChange={(visible)=>this.onRelieveChange(visible, record.operateId)}
              >
                <i className="iconfont icon-manual icon-action"></i>
              </Popover>
            );
          }
        }

      }
    ]
    return columns;
  }

  renderOperation() {
    const { selectedRowKeys } = this.state;
    const alarmList = this.props.realtimeAlarm.filter(alarm=>
      selectedRowKeys.some(key=>key===alarm.warningLogId));     
    return (
      <Select onChange={this.onHandle} value="操作" placeholder="操作" dropdownMatchSelectWidth={false} dropdownClassName={styles.handleDropdown}>
        <Option value="ticket" disabled={alarmList.some(alarm=>alarm.isTransferWork===0)}>转工单</Option>
        <Option value="relieve" disabled={alarmList.some(alarm=>(alarm.isTransferWork===0||alarm.isRelieveAlarm===0))}>手动解除</Option>
        <Option value="resetRelieve" disabled={alarmList.some(alarm=>(alarm.isRelieveAlarm===1))}>取消解除</Option>
      </Select>
    );
  }

  renderTransferModal() {
    return (
      <TransferAlarmModal
        onTransferAlarm={this.props.onTransferAlarm}
        defectTypes={this.props.defectTypes}
        selectedRowKeys={this.state.selectedRowKeys}
      />     
    );
  }

  renderRelieveModal() {
    return (
      <RelieveAlarmModal
        onRelieveAlarm={this.props.onRelieveAlarm}
        selectedRowKeys={this.state.selectedRowKeys}
      />     
    );
  }

  renderTransferPopover() {
    const ticketInfo = this.props.ticketInfo;
    return (
      <div className={styles.detailInfo}>
        <div className={styles.header}>
          <i className="iconfont icon-tranlist icon-action"></i>
          <span>已转工单</span>
          <Icon type="close" onClick={()=>this.setState({showTransferPopover: false})} />
        </div>
        <div className={styles.content}>
          <div className={styles.infoItem}>
            <span className={styles.label}>转工单人：</span>
            <span className={styles.value}>{ticketInfo.userFullName?ticketInfo.userFullName:ticketInfo.username}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>操作时间：</span>
            <span className={styles.value}>{ticketInfo.operateTime}</span>
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
        <Button><Link to={`/operation/ticket/${ticketInfo.defectId}`}>查看工单详情</Link></Button> 
      </div>
    );
  }

  renderRelievePopover() {
    const relieveInfo = this.props.relieveInfo;
    return (
      <div className={styles.detailInfo}>
        <div className={styles.header}>
          <i className="iconfont icon-icon-manual icon-action"></i>
          <span>手动解除</span>
          <Icon type="close" onClick={()=>this.setState({showTransferPopover: false})} />
        </div>
        <div className={styles.content}>
          <div className={styles.infoItem}>
            <span className={styles.label}>解除人：</span>
            <span className={styles.value}>{relieveInfo.userFullName?relieveInfo.userFullName:relieveInfo.username}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>操作时间：</span>
            <span className={styles.value}>{relieveInfo.operateTime}</span>
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
    const { realtimeAlarm, loading } = this.props;
    const { pageSize, currentPage, selectedRowKeys, showTransferTicketModal, showRelieveAlarmModal, showWarningTip, warningTipText } = this.state;
    const tableSource = realtimeAlarm.filter((e,i)=>{ // 手动分页
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return (i >= startIndex && i < endIndex);
    });
    const columns = this.initColumn();
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={styles.alarmTable}>
        {showWarningTip && <WarningTip onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <div className={styles.tableHeader}>
          {this.renderOperation()}
          <CommonPagination onPaginationChange={this.onChangePagination} total={realtimeAlarm.length} />
        </div>
        <Table
          loading={loading}
          rowKey={(record)=>{return record.warningLogId}} 
          dataSource={tableSource}
          rowSelection={rowSelection}
          columns={columns}
          pagination={false}
        />
        {showTransferTicketModal&&this.renderTransferModal()}
        {showRelieveAlarmModal&&this.renderRelieveModal()}
      </div>
    );
  }
  
}

export default RealTimeAlarmTable;