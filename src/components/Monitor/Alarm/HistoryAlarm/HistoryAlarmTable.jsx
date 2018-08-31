import React, { Component } from 'react';
import CommonPagination from '../../../Common/CommonPagination';
import styles from './historyAlarm.scss';
import PropTypes from 'prop-types';
import { Table, Popover, Icon, Button } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

class HostoryAlarmTable extends Component {
  static propTypes = {
    historyAlarm: PropTypes.array,
    loading: PropTypes.bool,
    getTicketInfo: PropTypes.func,
    getRelieveInfo: PropTypes.func,
    ticketInfo: PropTypes.object,
    relieveInfo: PropTypes.object,
    changeAlarmStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      pageSize: 10, 
      currentPage: 1,
      showTransferPopover: [],
      showRelievePopover: [],
      showAutoRelievePopover: [],
    }
  }

  onChangePagination = ({ pageSize, currentPage }) => {
    this.setState({ pageSize, currentPage })
  }

  onTransferChange(visible, operateId, i) {
    if(visible) {
      this.props.getTicketInfo({
        operateId
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
    if(visible) {
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

  onAutoRelieveChange(visible, i) {
    let showAutoRelievePopover = this.state.showAutoRelievePopover;
    showAutoRelievePopover[i] = visible;
    this.setState({
      showAutoRelievePopover 
    });
  }

  getDuration(startTime, endTime) {
    const milliseconds = moment(endTime).valueOf() - moment(startTime).valueOf();
    const minuteNum = milliseconds/1000/60;
    const duration = moment.duration(milliseconds);
    const day = parseInt(minuteNum/(60*24)) > 99 ? 99 : parseInt(minuteNum/(60*24));
    const displayDay = (day < 10 && day!==0) ? "0" + day : day;
    const hour = duration.hours();
    const displayHour = hour < 10 ? "0" + hour : hour;
    const minute = duration.minutes();
    const displayMiute = minute < 10 ? "0" + minute : minute;
    return `${displayDay}天${displayHour}小时${displayMiute}分钟`;
  }

  initColumn = () => {
    const level = ['一级', '二级', '三级', '四级']; 
    const columns = [
      {
        title: '告警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
        render: (text, record, index)=> {
          return level[text-1]
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
        render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm'),
        sorter:  (a,b) => moment(a.timeOn).isBefore(moment(b.timeOn)),
      },{
        title: '结束时间',
        dataIndex: 'timeOff',
        key: 'timeOff',
        render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm'),
        sorter:  (a,b) => moment(a.timeOff).isBefore(moment(b.timeOff)),
      },{
        title: '告警处理',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record, index) => {
          if(record.isTransferWork === 0) {
            return (
              <Popover content={this.renderTransferPopover(index)}
              trigger="click"
              visible={this.state.showTransferPopover[index]}
              onVisibleChange={(visible)=>this.onTransferChange(visible, record.operateId, index)}
              >
                <i className="iconfont icon-tranlist icon-action"></i>
              </Popover>
            );
          }
          if(record.isRelieveAlarm === 0) {
            return (
              <Popover content={this.renderRelievePopover(index)}
              trigger="click"
              visible={this.state.showRelievePopover[index]}
              onVisibleChange={(visible)=>this.onRelieveChange(visible, record.operateId, index)}
              >
                <i className="iconfont icon-manual icon-action"></i>
              </Popover>
            );
          }
          return (
            <Popover
              visible={this.state.showAutoRelievePopover[index]}
              onVisibleChange={(visible)=>this.onAutoRelieveChange(visible, index)}
              content={this.renderAutoRelievePopover(record, index)} 
              trigger="click">
              <i className="iconfont icon-lifted icon-action"></i>
            </Popover>
          );
        }

      }
    ]
    return columns;
  }

  renderOperation() {
    return <div></div>;
  }

  renderTransferPopover(i) {
    const ticketInfo = this.props.ticketInfo;
    return (
      <div className={styles.detailInfo}>
        <div className={styles.header}>
          <i className="iconfont icon-tranlist icon-action"></i>
          <span>已转工单</span>
          <Icon type="close" onClick={()=>{
            let showTransferPopover = this.state.showTransferPopover;
            showTransferPopover[i] = false;
            this.setState({showTransferPopover});
          }} />
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

  renderRelievePopover(i) {
    const relieveInfo = this.props.relieveInfo;
    return (
      <div className={styles.detailInfo}>
        <div className={styles.header}>
          <i className="iconfont icon-icon-manual icon-action"></i>
          <span>手动解除</span>
          <Icon type="close" onClick={()=>{
            let showRelievePopover = this.state.showRelievePopover;
            showRelievePopover[i] = false;
            this.setState({showRelievePopover});
          }} />
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

  renderAutoRelievePopover(record, i) {
    return (
      <div className={styles.detailInfo}>
        <div className={styles.header}>
          <i className="iconfont icon-icon-lifted icon-action"></i>
          <span>自动解除</span>
          <Icon type="close" onClick={()=>{
            let showAutoRelievePopover = this.state.showAutoRelievePopover;
            showAutoRelievePopover[i] = false;
            this.setState({
              showAutoRelievePopover
            });            
          }} />
        </div>
        <div className={styles.content}>
          <div className={styles.infoItem}>
            <span className={styles.label}>持续时间：</span>
            <span className={styles.value}>{this.getDuration(record.timeOn, record.timeOff)}</span>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { historyAlarm, loading } = this.props;
    const { pageSize, currentPage } = this.state;
    const tableSource = historyAlarm.filter((e,i)=>{ // 手动分页
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return (i >= startIndex && i < endIndex);
    });
    const columns = this.initColumn();
    return (
      <div className={styles.alarmTable}>
        <div className={styles.tableHeader}>
          {this.renderOperation()}
          <CommonPagination onPaginationChange={this.onChangePagination} total={historyAlarm.length} />
        </div>
        <Table
          loading={loading}
          rowKey={(record)=>{return record.warningLogId}} 
          dataSource={tableSource}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default HostoryAlarmTable;