import React, { Component } from "react";
import styles from './realTimeWarning.scss';
import CommonPagination from '../../../Common/CommonPagination';
import TransferWarningModal from './TransferWarningModal';
import WarningTip from '../../../Common/WarningTip';
import { Link } from 'react-router-dom';
import { Table, Select, Popover, Icon, Button } from 'antd';
import moment from 'moment';
const Option = Select.Option;

class RealTimeWarningTable extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      showTransferTicketModal: false,
      showRelieveAlarmModal: false,
      sortName: '',
      descend: false,
    }
  }
  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    this.props.changeRealtimeWarningStore({ currentPage, pageSize })
  }
  onHandle = (value) => {//转工单或手动解除的modal
    if (value === 'ticket') {
      this.setState({
        showTransferTicketModal: true
      });
    } else if (value === 'relieve') {
      this.setState({
        showRelieveAlarmModal: true
      });
    }
  }
  onSelectChange = (selectedRowKeys) => {//选择checkbox
    this.props.changeRealtimeWarningStore({ selectedRowKeys });
  }
  cancelRowSelect = () => {//取消选中
    this.props.changeRealtimeWarningStore({ selectedRowKeys: [] });
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
      },
    ]
    const { realtimeWarning, selectedRowKeys, pageSize, currentPage } = this.props;
    const { sortName, descend } = this.state;
    const { showTransferTicketModal, showRelieveAlarmModal, showWarningTip, warningTipText } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const nameSortArr = ['stationName', 'deviceName', 'deviceTypeName', 'warningConfigName']
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
          <Select onChange={this.onHandle} value="操作" placeholder="操作" dropdownMatchSelectWidth={false} dropdownClassName={styles.handleDropdown}>
            <Option value="ticket" disabled={selectedRowKeys.length === 0}><i className="iconfont icon-tranlist"></i>转工单</Option>
            <Option value="relieve" disabled={selectedRowKeys.length === 0}><i className="iconfont icon-manual"></i>手动解除</Option>
          </Select>
          <CommonPagination pageSize={pageSize} currentPage={currentPage} onPaginationChange={this.onPaginationChange} total={realtimeWarning.length} />
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
            onTransferAlarm={this.props.transferWarning}
            defectTypes={this.props.defectTypes}
            selectedRowKeys={this.props.selectedRowKeys}
          />
        }
      </div>
    )
  }
}
export default (RealTimeWarningTable)


