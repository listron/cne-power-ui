import React, { Component } from "react";
import styles from './handleRemove.scss';
import CommonPagination from '../../../Common/CommonPagination';
import WarningTip from '../../../Common/WarningTip';
import TransferWarningModal from '../RealTimeWarning/TransferWarningModal';
import { Link } from 'react-router-dom';
import { Table, Select, Popover, Icon, Button, } from 'antd';
import moment from 'moment';
const Option = Select.Option;

class HandleRemoveTable extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      showTransferTicketModal: false,
      showWarningTip: false,
      warningTipText:'',
    }
  }
  onConfirmWarningTip = () => {
    const { selectedRowKeys } = this.props;
    this.setState({
      showWarningTip: false,
      warningTipText: ''
    });
    this.props.cancleHandleRemove({
      warningLogId: selectedRowKeys
    });
  }

  onCancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip: false
    });
  }
  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    const { changeHandleRemoveStore,onChangeFilter,   } = this.props;
    changeHandleRemoveStore({ pageNum:currentPage, pageSize })
    onChangeFilter({pageNum:currentPage, pageSize})
  }
  onHandle = (value) => {//转工单或手动解除的modal
    if (value === 'ticket') {
      this.setState({
        showTransferTicketModal: true
      });
    } else if (value === 'cancleRemove') {
      this.setState({
        showWarningTip: true,
        warningTipText: ' 确定要取消解除么'
      });
    }
  }
  onSelectChange = (selectedRowKeys) => {//选择checkbox
    this.props.changeHandleRemoveStore({ selectedRowKeys });
  }
  cancelRowSelect = () => {//取消选中
    this.props.changeHandleRemoveStore({ selectedRowKeys: [] });
  }
 

  tableChange = (pagination, filters, sorter) => {
    const { changeHandleRemoveStore,onChangeFilter, } = this.props;
    const { field, order } = sorter;
    const sortInfo = {
      warningLevel: '1',
      stationName: '2',
      deviceName: '3',
      timeOn: '5',
      durationTime: '9',
    };
     const orderField = sortInfo[field] ? sortInfo[field] : '';
    const orderCommand = order ? (sorter.order === 'ascend' ? '1' : '2') : '';
    changeHandleRemoveStore({ orderField, orderCommand })
    onChangeFilter({
        orderField, orderCommand
    })
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
      },
    ]
    const { handleRemoveList, selectedRowKeys, pageSize, pageNum, loading } = this.props;
    const { showTransferTicketModal,showWarningTip  } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
   
    return (
      <div className={styles.realTimeWarningTable}>
      {showWarningTip && <WarningTip
        style={{ marginTop: '350px', width: '210px', height: '88px' }}
        onCancel={this.onCancelWarningTip}
        hiddenCancel={false}
        onOK={this.onConfirmWarningTip}
        value={warningTipText} />}
        <div className={styles.tableHeader}>
          <Select onChange={this.onHandle} value="操作" placeholder="操作" dropdownMatchSelectWidth={false} dropdownClassName={styles.handleDropdown}>
            <Option value="ticket" disabled={selectedRowKeys.length === 0}><i className="iconfont icon-tranlist"></i>转工单</Option>
            <Option value="cancleRemove" disabled={selectedRowKeys.length === 0}><i className="iconfont icon-manual"></i>取消手动解除</Option>
          </Select>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} total={handleRemoveList.length} />
        </div>
        <Table
          dataSource={handleRemoveList}
          rowKey={record => record.warningLogId}
          rowSelection={rowSelection}
          columns={columns}
          pagination={false}
          onChange={this.tableChange}
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
        />
        {handleRemoveList.length > 0 && <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedRowKeys.length}</span>项</span>
          {selectedRowKeys.length > 0 && <span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>}
        </div>}

        {showTransferTicketModal &&
          <TransferWarningModal
            onCancel={() => this.setState({ showTransferTicketModal: false })}
            onTransferAlarm={this.props.getHandleRemoveTransfer}
            defectTypes={this.props.defectTypes}
            selectedRowKeys={this.props.selectedRowKeys}
          />
        }
        
      </div>
    )
  }
}
export default (HandleRemoveTable)


