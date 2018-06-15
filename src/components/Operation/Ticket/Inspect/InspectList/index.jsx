import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Radio, Icon } from 'antd';
import { getStatus } from '../../../../../constants/ticket';
import styles from './style.scss';
import Immutable from 'immutable';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class InspectionList extends Component {  
  static propTypes={
    list: PropTypes.object,
    pageNum: PropTypes.number,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    getInspectionList: PropTypes.func,
    loading: PropTypes.bool,
    onChangeStatus: PropTypes.func,
    inspectStatusStatistics: PropTypes.any,
  }

  static defaultProps={
    list: Immutable.fromJS([]),
    pageNum: 1,
    currentSelectedStatus: 5,
  }

  constructor(props){
    super(props);
    this.state={
      tab: "5",
      selectedRowKeys: [],
      currentSelectedStatus: 5,      
    }
    this.onChangeTab = this.onChangeTab.bind(this);
    this.onChangeTable = this.onChangeTable.bind(this);
  }

  onChangeTab(e){
    this.setState({
      tab: e.target.value,
    })
    this.props.onChangeStatus(parseInt(e.target.value));
  }

  onChangeTable(pagination, filter, sorter){

  }

  render(){
    let list = this.props.list;
    console.log(list.toJS());
    let inspectStatusStatistics = this.props.inspectStatusStatistics;
    console.log(inspectStatusStatistics);
    console.log(inspectStatusStatistics.toJS());
    console.log("--------");
    let inProcessNum =0// statusStatistics.get("executeNum");
    let waitCheckNum =0 //statusStatistics.get("checkNum");   
    const pagination={
      total: list.size,
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.props.pageNum,
      onShowSizeChange: (current, pagesize) => {
        this.props.onChangePageSize(pagesize);
      },
      onChange: (current) => {
        this.props.onChangePage(current);
      }
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
      dataIndex: 'deadLine',
      key: 'deadLine',
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
        <span><Icon type="eye-o" /></span>
      )
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
            <RadioGroup onChange={this.onChangeTab} default="2" value={this.state.tab} >
              <RadioButton value="5">全部</RadioButton>
              <RadioButton value="2">{`执行中${inProcessNum}`}</RadioButton>
              <RadioButton value="3">{`待验收${waitCheckNum}`}</RadioButton>
            </RadioGroup>
          </div>
          <div className={styles.add}>
            <Button onClick={this.onAdd}><Icon type="plus" />新建</Button>
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
          scroll={{y : 400}}
          pagination= {pagination}
        />
      </div>
    )
  }
}

export default InspectionList;