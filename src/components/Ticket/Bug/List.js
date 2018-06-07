import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Radio, Button } from 'antd';
import styles from './list.scss';
import Immutable from 'immutable';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class List extends Component {
  static propTypes = {
    onChangeTab: PropTypes.func,
    onChangePage: PropTypes.func,
    onAdd: PropTypes.func,
    onSubmit: PropTypes.func,
    onDelete: PropTypes.func,
    onSend: PropTypes.func,
    onReject: PropTypes.func,
    onClose: PropTypes.func,
    onOk: PropTypes.func,
    onNotOk: PropTypes.func,
    tickets: PropTypes.object,
    currentPage: PropTypes.number
  }

  static defaultProps = {
    tickets: Immutable.fromJS([]),
    currentPage: 1,
    currentSelectedStatus: null
  }

  constructor(props) {
    super(props);
    this.state = {
      tab: "5",
      selectedRowKeys: []
    };
    this.onChangeType = this.onChangeType.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDelete = this. onDelete.bind(this);
    this.onSend = this.onSend.bind(this);
    this.onReject = this.onReject.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOk = this.onOk.bind(this);
    this.onNotOk = this.onNotOk.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  onChangeTab(e) {
    this.setState({
      tab: e.target.value
    });
    this.props.onChangeTab(parseInt(e.target.value));
  }

  onSelectChange(record, selected, selectedRows) {
    let status = this.state.currentSelectedStatus;
    let selectedRowKeys = this.state.selectedRowKeys;
    if(selected) {
      if(selectedRowKeys.length > 0) {
        if(record.defectStatus === selectedRowKeys[0].defectStatus) {
          selectedRowKeys.push(record.defectId);
        }
      } else {
        selectedRowKeys.push(record.defectId);
        status = record.defectStatus;
      }
    } else {
      var index = selectedRowKeys.findIndex((item)=> {
        return item.defectId === record.defectId;
      });
      selectedRowKeys.splice(index, 1);
      if(selectedRowKeys.length === 0) {
        status = null;
      }
    }
    this.setState({
      selectedRowKeys: selectedRowKeys,
      currentSelectedStatus: status
    });
  }

  render() {
    let tickets = this.props.tickets;
    let waitSubmitNum = tickets.filter((item) => {return item.get("defectStatus") === 0});
    let waitReviewNum = tickets.filter((item) => {return item.get("defectStatus") === 1});
    let inProcessNum = tickets.filter((item) => {return item.get("defectStatus") === 2});
    let waitCheckNum = tickets.filter((item) => {return item.get("defectStatus") === 3});

    const columns = [{
      title: '缺陷级别',
      dataIndex: 'defectLevel',
      key: 'defectLevel',
      render: (value,record,index)=> {
        switch(value) {
          case 1:
            return "一级";
          case 2:
            return "二级";
          case 3:
            return "三级";
          case 4:
            return "四级";
        }
      }
    }, {
      title: '电站名称',
      dataIndex: 'stationName',
      key: 'stationName',
    }, {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
    }, {
      title: '缺陷类型',
      dataIndex: 'number',
      key: 'number',
    }, {
      title: '缺陷描述',
      dataIndex: 'defectDescribe',
      key: 'defectDescribe',
    }, {
      title: '发生时间',
      dataIndex: 'startTime',
      key: 'startTime',
    }, {
      title: '截止时间',
      dataIndex: 'startTime',
      key: 'deadLine'
    }, {
      title: '处理进度',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: '查看',
      render:(text, record) => {
        return (
          <span></span>
        );
      }
    }];

    const pagination = {
      total: tickets.size,
      showQuickJumper: true,
      current: this.props.currentPage,
      onChange: (current) => {
        this.props.onChangePage(current);
      }
    };
    const {selectedRowKeys} = this.state;

    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelectChange,
      getCheckboxProps: (record) => ({
        disabled: record.defectStatus === 2 || record.defectStatus === 4,
      })
    };
  
    return (
      <div calssName={styles.bugTicket}>
        <div calssName={styles.action}>
          <div>
            <RadioGroup onChange={this.onChangeTab} defaultValue="5" value={this.state.tab}>
              <RadioButton value="5">全部</RadioButton>
              <RadioButton value="0">{`待提交${waitSubmitNum}`}</RadioButton>
              <RadioButton value="1">{`待审核${waitReviewNum}`}</RadioButton>
              <RadioButton value="2">{`执行中${inProcessNum}`}</RadioButton>
              <RadioButton value="3">{`待验收${waitCheckNum}`}</RadioButton>
            </RadioGroup>
          </div>
          <div>
            <Button onClick={this.onAdd}>
              <span className="iconfont icon-add" /> 
              新建
            </Button>
            {
              this.state.currentSelectedStatus === 0 &&
                <div>
                  <Button onClick={this.onSubmit}>提交</Button>
                  <Button onClick={this.onDelete}>提交</Button>
                </div>
            }
            {
              this.state.currentSelectedStatus === 1 &&
                <div>
                  <Button onClick={this.onSend}>下发</Button>
                  <Button onClick={this.onReject}>驳回</Button>
                  <Button onClick={this.onClose}>关闭</Button>
                </div>
            }
            {
              this.state.currentSelectedStatus === 3 &&
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
          dataSource={tickets.toJS()} 
          columns={columns} 
          pagination={pagination} 
        />
      </div>
    );
  }

}

export default List;