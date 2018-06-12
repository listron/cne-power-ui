import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Radio } from 'antd';
import { getStatus } from '../../../../constants/ticket';
import styles from './list.scss';
import Immutable from 'immutable';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class List extends Component {  
  static propTypes={
    inspectionList: PropTypes.object,
    currentPage: PropTypes.number,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    
  }

  static defaultProps={
    inspectionList: Immutable.fromJS([]),
    currentPage:1,
    currentSelectedStatus: null,

  }

  constructor(props){
    super(props);
    this.state={
      tab: "5",
      selectedRowKeys: [],

    }
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
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

  onChangeTab(e){
    this.setState({
      tab: e.target.value,
    })

  }
  render(){
    let inspectionList = this.props.inspectionList;
    let inProcessNum = inspectionList.filter((item) => { return item.get("defectStatus") === 2 });
    let waitCheckNum = inspectionList.filter((item) => { return item.get("defectStatus") === 3 });

    const pagination={
      total: inspectionList.size,
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.props.currentPage,
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
            { record.is_overtime === 0 ? <span>超时</span> : null }
            { record.is_overtime === 0 ? <span>超时</span> : null }
          </div>
        </div>
      ),
    },{
      title: '查看',
      render: (text, record) => (
        <span></span>
      )
    }]
    const {selectedRowKeys} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelectedChange,
      getCheckboxProps: (record) => ({
        disabled: record.defectStatus === 2 || record.defectStatus === 4,
      })
    }

    return(
      <div>
        <div>
          <div>
            <RadioGroup onChange={this.onChangeTab} default="2" value={this.state.tab} >
              <RadioButton value="5">全部</RadioButton>
              <RadioButton value="2">{`执行中${inProcessNum}`}</RadioButton>
              <RadioButton value="3">{`待验收${waitCheckNum}`}</RadioButton>
            </RadioGroup>
          </div>
          <div>
            <Button>新建</Button>
            {
              this.state.currentSelectedStatus === 0 && 
                <div>
                  <Button onClick={this.onConfirm}>确认</Button>
                </div>
            }
          </div>
        </div>
        <Table 
          dataSource={inspectionList.toJS()}
          columns= {columns}
          pagination= {pagination}
          rowSelection={rowSelection}
        />
      </div>
    )
  }
}

export default List;