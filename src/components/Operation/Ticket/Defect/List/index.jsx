import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Radio, Button, Icon, Modal } from 'antd';
import {getLevel, getStatus} from '../../../../../constants/ticket';
import styles from './style.scss';
import Immutable from 'immutable';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

class List extends Component {
  static propTypes = {
    onChangeStatus: PropTypes.func,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    onShowDetail: PropTypes.func,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    onSend: PropTypes.func,
    onReject: PropTypes.func,
    onClose: PropTypes.func,
    onOk: PropTypes.func,
    onNotOk: PropTypes.func,
    list: PropTypes.object,
    currentPage: PropTypes.number,
    currentPageSize: PropTypes.number,
    total: PropTypes.number,
    defectStatusStatistics: PropTypes.object,
    isFetching: PropTypes.bool,
    status: PropTypes.string
  }

  static defaultProps = {
    list: Immutable.fromJS([]),
    currentPage: 1
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      currentSelectedStatus: null
    };
    this.onChangeTab = this.onChangeTab.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onDelete = this. onDelete.bind(this);
    this.onSend = this.onSend.bind(this);
    this.onReject = this.onReject.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOk = this.onOk.bind(this);
    this.onNotOk = this.onNotOk.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onChangeTable = this.onChangeTable.bind(this);
  }

  onChangeTab(e) {
    this.setState({
      selectedRowKeys: []
    });
    this.props.onChangeStatus(e.target.value);
  }

  onAdd() {
    this.props.onAdd();
  }

  onDelete() {
    confirm({
      title: '确认删除此缺陷',
      onOk() {
        this.props.onDelete(this.state.selectedRowKeys);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  onSend() {

  }

  onReject() {

  }

  onClose() {

  }

  onOk() {

  }

  onNotOk() {

  }

  onSelectChange(selectedRowKeys, selectedRows) {
    let status = this.getSelectedRowsStatus(selectedRows);
    this.setState({
      selectedRowKeys: selectedRowKeys,
      currentSelectedStatus: status
    });
  }

  onChangeTable(pagination, filters, sorter) {

  }

  getSelectedRowsStatus(selectedRows) {
    let map = {};
    let status;
    for(var i = 0; i < selectedRows.length; i++) {
      if(!map[selectedRows[i].defectStatus]) {
        map[selectedRows[i].defectStatus] = 1;
      } else {
        map[selectedRows[i].defectStatus] += 1;
      }
    }
    let values = [];
    for(var k in map) {
      values.push(map[k]);
      status = k;
    }
    if(values.length === 1) {
      return status;
    } else {
      return null;
    }
  }

  render() {
    let list = this.props.list;
    let defectStatusStatistics = this.props.defectStatusStatistics;
    let waitSubmitNum = defectStatusStatistics.get("submitNum");
    let waitReviewNum = defectStatusStatistics.get("examineNum");
    let inProcessNum = defectStatusStatistics.get("executeNum");
    let waitCheckNum = defectStatusStatistics.get("checkNum");

    const columns = [{
      title: '缺陷级别',
      dataIndex: 'defectLevel',
      key: 'defectLevel',
      sorter: true,
      render: (value,record,index)=> (
        <span>{getLevel(value)}</span>
      )
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
    }, {
      title: '缺陷类型',
      dataIndex: 'defectTypeName',
      key: 'defectTypeName',
      sorter: true,
    }, {
      title: '缺陷描述',
      dataIndex: 'defectDescribe',
      key: 'defectDescribe',
      sorter: true,
    }, {
      title: '发生时间',
      dataIndex: 'startTime',
      key: 'startTime',
      sorter: true,
    }, {
      title: '完成时间',
      dataIndex: 'finishTime',
      key: 'finishTime',
      sorter: true,
    }, {
      title: '处理进度',
      dataIndex: 'defectStatus',
      key: 'defectStatus',
      render: (value,record,index) => (
        <div>
          <span>{getStatus(value)}</span>
          <div>
            {record.is_overtime === 0? <span>超时</span> : null}
            {record.is_overtime === 0? <span>协调</span> : null}
          </div>
        </div>
      ),
    }, {
      title: '查看',
      render:(text, record) => (
        <span>
          <Icon type="eye-o" onClick={this.props.onShowDetail(record.defectId)} />
        </span>
      )
    }];

    const pagination = {
      total: this.props.total,
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.props.currentPage,
      pageSize: this.props.currentPageSize,
      onShowSizeChange: (current, pageSize) => {
        this.props.onChangePageSize(pageSize);
      },
      onChange: (current) => {
        this.props.onChangePage(current);
      }
    };
    const {selectedRowKeys} = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
  
    return (
      <div className={styles.bugTicket}>
        <div className={styles.action}>
          <div>
            <RadioGroup onChange={this.onChangeTab} defaultValue="5" value={this.props.status}>
              <RadioButton value="5">全部</RadioButton>
              <RadioButton value="0">{`待提交${waitSubmitNum}`}</RadioButton>
              <RadioButton value="1">{`待审核${waitReviewNum}`}</RadioButton>
              <RadioButton value="2">{`执行中${inProcessNum}`}</RadioButton>
              <RadioButton value="3">{`待验收${waitCheckNum}`}</RadioButton>
            </RadioGroup>
          </div>
          <div className={styles.buttonArea}>
            <Button onClick={this.onAdd}>
              {/* <span className="iconfont icon-add" />  */}
              <Icon type="plus" />
              新建
            </Button>
            {
              this.state.currentSelectedStatus === "0" &&
                <div>
                  <Button onClick={this.onDelete}>删除</Button>
                </div>
            }
            {
              this.state.currentSelectedStatus === "1" &&
                <div>
                  <Button onClick={this.onSend}>下发</Button>
                  <Button onClick={this.onReject}>驳回</Button>
                  <Button onClick={this.onClose}>关闭</Button>
                </div>
            }
            {
              this.state.currentSelectedStatus === "3" &&
                <div>
                  <Button onClick={this.onOk}>合格</Button>
                  <Button onClick={this.onNotOk}>不合格</Button>
                </div>
            }
          </div>
        </div>
        <Table 
          rowKey={(record)=>{return record.defectId}} 
          rowSelection={rowSelection} 
          dataSource={list.toJS()} 
          columns={columns} 
          pagination={pagination} 
          loading={this.props.isFetching}
          onChange={this.onChangeTable}
        />
      </div>
    );
  }

}

export default List;