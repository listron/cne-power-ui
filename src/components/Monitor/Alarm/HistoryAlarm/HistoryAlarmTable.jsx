import React, { Component } from 'react';
import CommonPagination from '../../../Common/CommonPagination';
import styles from './historyAlarm.scss';
import PropTypes from 'prop-types';
import { Table, Popover, Icon, Button } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

class HostoryAlarmTable extends Component {
  static propTypes = {
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
    historyAlarm: PropTypes.array,
    loading: PropTypes.bool,
    getTicketInfo: PropTypes.func,
    getRelieveInfo: PropTypes.func,
    ticketInfo: PropTypes.object,
    relieveInfo: PropTypes.object,
    changeAlarmStore: PropTypes.func,
    onPaginationChange: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      showTransferPopover: [],
      showRelievePopover: [],
      showAutoRelievePopover: [],
      sortName: '',
      descend: false,
    }
  }

  onChangeTable = (pagination, filters, sorter) => {
    this.setState({ 
      sortName: sorter.field,
      descend : sorter.order === 'descend'
    });
  }

  onTransferChange(visible, workOrderId, i) {
    if(visible) {
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

  createTableSource(data) {
    const { sortName, descend } = this.state;
    const { pageSize, currentPage } = this.props;
    const nameSortArr = ['stationName', 'deviceTypeName','deviceName', 'warningConfigName']
    const tableSource = data.map((e, i) => ({
      ...e,
      key: i,
    })).sort((a, b) => { // 手动排序
      const sortType = descend ? -1: 1;
      if(sortName === 'warningLevel'){
        return sortType * (a.warningLevel - b.warningLevel);
      }else if(nameSortArr.includes(sortName)){
        return sortType * a[sortName].localeCompare(b[sortName], 'zh');
      }else if(sortName === 'timeOn' || sortName === 'timeOff'){
        return sortType * (moment(a.timeOn) - moment(b.timeOn));
      }else if(sortName === 'operation'){
        return sortType * (parseInt(b.warningStatus) - parseInt(a.warningStatus));
      }else {
        return a.key - b.key;
      }
    }).filter((e,i)=>{ // 筛选页面
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
    const columns = [
      {
        title: '告警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
        sorter: true,
        render: (text, record, index)=> {
          return level[text-1]
        },
      },{
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
      },{
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        sorter: true,
        render: (text, record) => {
          if(record.deviceTypeCode === 206) {
            return (
              <div className={styles.deviceName}>
                <Link to={`/hidden/monitorDevice/${record.stationCode}/${record.deviceTypeCode}/${record.deviceFullCode}`} >{text}</Link>
              </div>
            );
          } else if(record.deviceTypeCode === 304) {
            return (
              <div className={styles.deviceName}>
                <Link to={`/hidden/monitorDevice/${record.stationCode}/${record.deviceTypeCode}/${record.deviceFullCode}`} >{text}</Link>
              </div>
            );
          } else {
            return text;
          }
        }
      },{
        title: '设备类型',
        dataIndex: 'deviceTypeName',
        key: 'deviceTypeName',
        sorter: true,
      },{
        title: '告警类型',
        dataIndex: 'warningConfigName',
        key: 'warningConfigName',
        sorter: true,
      },{
        title: '告警描述',
        dataIndex: 'warningCheckDesc',
        key: 'warningCheckDesc',
        render: (text, record) => {
          return <div className={styles.alarmDesc} title={text}>{text}</div>
        } 
      },{
        title: '发生时间',
        dataIndex: 'timeOn',
        key: 'timeOn',
        sorter: true,
        render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm'),
      },{
        title: '结束时间',
        dataIndex: 'timeOff',
        key: 'timeOff',
        sorter: true,
        render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm'),
      },{
        title: '告警处理',
        dataIndex: 'operation',
        key: 'operation',
        sorter: true,
        render: (text, record, index) => {
          if(record.isTransferWork === 0) {
            return (
              <Popover content={this.renderTransferPopover(index)}
              trigger="click"
              visible={this.state.showTransferPopover[index]}
              onVisibleChange={(visible)=>this.onTransferChange(visible, record.workOrderId, index)}
              >
                <div className={this.state.showTransferPopover[index]?styles.selected:null}><i className="iconfont icon-tranlist icon-action"></i></div>
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
                <div className={this.state.showRelievePopover[index]?styles.selected:null}><i className="iconfont icon-manual icon-action"></i></div>
              </Popover>
            );
          }
          return (
            <Popover
              visible={this.state.showAutoRelievePopover[index]}
              onVisibleChange={(visible)=>this.onAutoRelieveChange(visible, index)}
              content={this.renderAutoRelievePopover(record, index)} 
              trigger="click">
              <div className={this.state.showAutoRelievePopover[index]?styles.selected:null}><i className="iconfont icon-lifted icon-action"></i></div>
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
          <div className={styles.title}>
            <i className="iconfont icon-tranlist icon-action"></i>
            <span className={styles.titleText}>已转工单</span>
          </div>
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
            <span className={styles.value}>{moment(ticketInfo.operateTime).format('YYYY-MM-DD HH:mm')}</span>
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
        <Button className={styles.ticketButton}><Link to={`/operation/ticket/${ticketInfo.defectId}`}>查看工单详情</Link></Button> 
      </div>
    );
  }

  renderRelievePopover(i) {
    const relieveInfo = this.props.relieveInfo;
    return (
      <div className={styles.detailInfo}>
        <div className={styles.header}>
          <div className={styles.title}>
            <i className="iconfont icon-manual icon-action"></i>
            <span className={styles.titleText}>手动解除</span>
          </div>
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
            <span className={styles.value}>{moment(relieveInfo.operateTime).format('YYYY-MM-DD HH:mm')}</span>
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
          <div className={styles.title}>
            <i className="iconfont icon-lifted icon-action"></i>
            <span className={styles.titleText}>自动解除</span>
          </div>
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
    const { historyAlarm, loading, onPaginationChange, pageSize, currentPage } = this.props;
    const tableSource = this.createTableSource(historyAlarm);
    const columns = this.initColumn();
    return (
      <div className={styles.alarmTable}>
        <div className={styles.tableHeader}>
          {this.renderOperation()}
          <CommonPagination pageSize={pageSize} currentPage={currentPage} onPaginationChange={onPaginationChange} total={historyAlarm.length} />
        </div>
        <Table
          loading={loading}
          dataSource={tableSource}
          columns={columns}
          pagination={false}
          onChange={this.onChangeTable}
          locale={{emptyText:<div className={styles.noData}><img src="/img/nodata.png" style={{width: 223,height:164}} /></div>}}
        />
      </div>
    );
  }
}

export default HostoryAlarmTable;