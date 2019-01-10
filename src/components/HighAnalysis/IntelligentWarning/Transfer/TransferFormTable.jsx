import React, { Component } from "react";
import styles from './transferForm.scss';
import CommonPagination from '../../../Common/CommonPagination';

import { Link } from 'react-router-dom';
import { Table, Select, Popover, Icon, Button } from 'antd';
import moment from 'moment';

class TransferFormTable extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      
      showTransferPopover: [],
    }
  }
 
  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    // this.props.changeRealtimeWarningStore({ currentPage, pageSize })
  }
  
  onTransferChange(visible,workOrderId,index) { // 切换需求
    this.setState((state) => {
      return state.showTransferPopover[index] = visible
    })
    this.props.getTransferInfo({workOrderId})
  }
 
  onSelectChange = (selectedRowKeys) => {//选择checkbox
    // this.props.changeRealtimeWarningStore({ selectedRowKeys });
  }
 
 
  getDetail = (defectId,index) => { // 查看工单详情
    this.props.changeTransferFormStore({pageName:'detail',defectId})
    this.setState((state) => {
      return state.showTransferPopover[index] = false
    })
  }
  
  tableChange = (pagination, filters, sorter) => {
    // this.setState({
    //   sortName: sorter.field,
    //   descend: sorter.order === 'descend'
    // });
    // this.props.changeRealtimeWarningStore({
    //   sortName: sorter.field,
    // });
  }
 
  renderTransferPopover(index,record) { // 转到工单页面的气泡
    const {ticketInfo}=this.props;
    return (
      <div className={styles.detailInfo}>
        <div className={styles.header}>
          <div className={styles.title}>
            <i className="iconfont icon-tranlist icon-action"></i>
            <span className={styles.titleText}>已转工单</span>
          </div>
          <Icon type="close" onClick={() => {
            let showTransferPopover = this.state.showTransferPopover;
            showTransferPopover[index] = false;
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
        <Button className={styles.ticketButton} onClick={()=>{this.getDetail(record.workOrderId,index)}}>
          查看工单详情
        </Button>
      </div>
    );
  }

  render() {
    const level = ['一级', '二级', '三级', '四级'];
    const columns = [
      {
        title: '预警级别',
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
        sorter: true,
        render: (text, record) => {
          if (record.deviceTypeCode === 206) {
            return (
              <div className={styles.deviceName}>
                <Link to={`/hidden/monitorDevice/${record.stationCode}/${record.deviceTypeCode}/${record.deviceFullCode}`} className={styles.underlin} >{text}</Link>
              </div>
            );
          } else if (record.deviceTypeCode === 304) {
            return (
              <div className={styles.deviceName}>
                <Link to={`/hidden/monitorDevice/${record.stationCode}/${record.deviceTypeCode}/${record.deviceFullCode}`} className={styles.underlin} >{text}</Link>
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
        title: '预警描述',
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
      },{
        title: '预警处理',
        key: 'warningRemove',
        render: (text, record, index) => {
          // if (record.isTransferWork === 0) {
            return (
              <Popover
                content={this.renderTransferPopover(index, record)}
                trigger="click"
                visible={this.state.showTransferPopover[index]}
                onVisibleChange={(visible) => this.onTransferChange(visible,record.workOrderId, index)}
                arrowPointAtCenter
              >
                <div className={this.state.showTransferPopover[index] ? styles.selected : null}><i className="iconfont icon-tranlist icon-action"></i></div>
              </Popover>
            );
          }
        // }
      }
    ]
    const { transferFormList, selectedRowKeys, pageSize, currentPage, loading } = this.props;
    const { sortName, descend } = this.state;
    const { showTransferTicketModal, showHandleRemoveModal,  } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const nameSortArr = ['stationName', 'deviceName', 'deviceTypeName', 'warningCheckDesc'];//同种排序
    const tableSource = transferFormList.map((e, i) => ({
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
    return (
      <div className={styles.realTimeWarningTable}>
        <div className={styles.tableHeader}>
         
          <CommonPagination pageSize={pageSize} currentPage={currentPage} onPaginationChange={this.onPaginationChange} total={transferFormList.length} />
        </div>
        <Table
          dataSource={tableSource}
          rowKey={record => record.warningLogId}
        
          columns={columns}
          pagination={false}
          onChange={this.tableChange}
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
        />
        

       
      </div>
    )
  }
}
export default (TransferFormTable)


