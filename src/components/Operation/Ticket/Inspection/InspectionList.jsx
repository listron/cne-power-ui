import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Radio, Icon } from 'antd';
import { getStatus } from '../../../../constants/ticket';
import styles from './list.scss';
import Immutable from 'immutable';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class InspectionList extends Component {  
  static propTypes={
    inspectionList: PropTypes.object,
    currentPage: PropTypes.number,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    getInspectionList: PropTypes.func,
    loading: PropTypes.bool,
    onChangeStatus: PropTypes.func,
  }

  static defaultProps={
    inspectionList: Immutable.fromJS([]),
    currentPage: 1,
    currentSelectedStatus: null,

  }

  constructor(props){
    super(props);
    this.state={
      tab: "5",
      selectedRowKeys: [],
      
    }
    this.onChangeTab = this.onChangeTab.bind(this);
  }

  onChangeTab(e){
    // this.setState({
    //   tab: e.target.value,
    // })
    this.props.onChangeStatus(e.target.value);
  }
  onChangeTable(selectedRowKeys, selectedRows){

  }
  render(){
    let inspectionList = this.props.inspectionList;
    let inProcessNum = inspectionList.filter((item) => { return item.get("inspectStatus") === 2 }).size;
    let waitCheckNum = inspectionList.filter((item) => { return item.get("inspectStatus") === 3 }).size;

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
      onChange: (selectedRowKeys, selectedRows) => {
        let status = this.state.currentSelectedStatus;
        if(selectedRowKeys.length > 0){
          selectedRows.forEach((e, i) => {
            (e.inspectStatus !== selectedRows[0].inspectStatus) && (alert("请选择相同进度的工单进行处理！"))
          })
          status = selectedRows[0].inspectStatus;
        }else{
          status = null;
        }
        this.setState({
          selectedRowKeys: selectedRowKeys,
          currentSelectedStatus: status,
        });
      },
      getCheckboxProps: (record) => ({
        disabled: record.inspectStatus === 2 || record.inspectStatus === 4,
      }),
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
              this.state.currentSelectedStatus === 3 && 
                <div>
                  <Button onClick={this.onConfirm}>确认</Button>
                </div>
            }
          </div>
        </div>
        <Table 
          rowKey={(record) => { return record.inspectId }}
          dataSource={inspectionList.toJS()}
          columns= {columns}
          pagination= {pagination}
          rowSelection={rowSelection}
          onChange={this.onChangeTable}
          loading={this.props.loading}
        />
      </div>
    )
  }
}

export default InspectionList;