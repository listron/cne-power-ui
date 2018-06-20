import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Radio, Icon } from 'antd';
import { getStatus } from '../../../../../constants/ticket';
import styles from './style.scss';
import Immutable from 'immutable';
import CreateForm from '../CreateForm';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class List extends Component {  
  static propTypes={
    list: PropTypes.object,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    getInspectionList: PropTypes.func,
    loading: PropTypes.bool,
    status: PropTypes.string,
    onChangeStatus: PropTypes.func,
    inspectStatusStatistics: PropTypes.any,
    onChangeSort: PropTypes.func,
    onShowDetail: PropTypes.func,
  }

  static defaultProps={
    list: Immutable.fromJS([]),
    pageNum: 1,
  }

  constructor(props){
    super(props);
    this.state={
      selectedRowKeys: [],
      currentSelectedStatus: null,
    }
    this.onChangeTab = this.onChangeTab.bind(this);
    this.onChangeTable = this.onChangeTable.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onCreateForm = this.onCreateForm.bind(this);
    this.onChangeSort = this.onChangeSort.bind(this);
  }

  onCreateForm(){
    this.setState({
      visible: true,
    })
  }

  onCreate(e){
    const form = this.formRef.props.form;
    form.validateFields((err,value) => {
      if(err){
        return;
      }
      form.resetFields();
      this.setState({ visible: false })
    })
  }

  onCancel(e){
    this.setState({
      visible: false,
    })
  }
  
  onChangeTab(e){
    this.props.onChangeStatus(e.target.value);
  }

  onChangeTable(pagination, filter, sorter){
    let pageNum = pagination.current - 1;
    let pageSize = pagination.pageSize;
    let params = {
      "stationType": "2",
      "status": this.props.status,
      "pageNum": pageNum,
      "pageSize": pageSize,
      "sort": this.onChangeSort(pageNum, sorter),
    }
    this.props.getInspectionList(params);
  }

  onChangeSort(pageNum, sorter){
    var sortField = 0;
    var sortMode = sorter.order === "ascend" ? 0 : 1;
    switch (sorter.columnKey){
      case "inspectName":
        sortField = 0;
        break;
      case "stationName":
        sortField = 1;
        break;
      case "startTime":
        sortField = 2;
        break;
      case "deadline":
        sortField = 3;
        break;
      case "inspectStatus":
        sortField = 4;
        break;
    }
    var sortRule = sortField + "," +sortMode;
    return sortRule;
  }

  render(){
    let list = this.props.list;
    let statistics = this.props.inspectStatusStatistics;
    let inProcessNum = statistics.get("executeNum");
    let waitCheckNum = statistics.get("checkNum");   
    const pagination={
      total: this.props.total,
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.props.pageNum,
      pageSize: this.props.pageSize,
    } 
    const columns = [{
      title: '巡检名称',
      dataIndex: 'inspectName',
      key: 'inspectName',
      sorter: true,
    },{
      title: '电站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      sorter: true,
    },{
      title: '巡检描述',
      dataIndex: 'deviceTypeName',
      key: 'deviceTypeName',
    },{
      title: '创建时间',
      dataIndex: 'startTime',
      key: 'startTime',
      sorter: true,
    },{
      title: '截止时间',
      dataIndex: 'deadline',
      key: 'deadline',
      sorter: true,
    },{
      title: '处理进度',
      dataIndex: 'inspectStatus',
      key: 'inspectStatus',
      sorter: true,
      render: (value, record, index) => (
        <div>
          <span>{getStatus(value)}</span>
          <div>
            { record.isOvertime === 0 ? <span>超时</span> : null }
            { record.isOvertime === 0 ? <span>超时</span> : null }
          </div>
        </div>
      ),
    },{
      title: '查看',
      render: (text, record) => (
        <span><Icon type="eye-o" onClick={() => {this.props.onShowDetail(record.inspectId)}} /></span>
      ),
    }]
    const {selectedRowKeys} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        var status = this.state.currentSelectedStatus;
        if(selectedRowKeys.length > 0){
          const newArray = [...new Set(selectedRows.map(e => e.inspectStatus))];
          status = newArray.length < 2 ? newArray[0] : 0;
        }else{
          status = null;
        }
        this.setState({
          selectedRowKeys: selectedRowKeys,
          currentSelectedStatus: status,
        });
        
      },
    }

    return(
      <div className={styles.bugTicket}>
        <div className={styles.action}>
          <div>
            <RadioGroup onChange={this.onChangeTab} default="2" value={this.props.status} >
              <RadioButton value="5">全部</RadioButton>
              <RadioButton value="2">{`执行中${inProcessNum}`}</RadioButton>
              <RadioButton value="3">{`待验收${waitCheckNum}`}</RadioButton>
            </RadioGroup>
          </div>
          <div className={styles.add}>
            <Button onClick={this.onCreateForm}><Icon type="plus" />新建</Button>
            <CreateForm 
              visible={this.state.visible}
              onCreate={this.onCreate}
              onCancel={this.onCancel}
              wrappedComponentRef={this.saveFormRef}
            />
            {
              this.state.currentSelectedStatus === "3" && 
                <div>
                  <Button onClick={this.onConfirm}>确认</Button>
                </div>
            }
          </div>
        </div>
        <Table 
          rowKey={(record) => { return record.inspectId }}
          dataSource={list.toJS()}
          columns= {columns}
          rowSelection={rowSelection}
          onChange={this.onChangeTable}
          loading={this.props.loading}
          pagination= {pagination}
        />
      </div>
    )
  }
}

export default List;