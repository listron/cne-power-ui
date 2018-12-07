import React, { Component } from "react";
import { Table, Icon } from 'antd';
import styles from './recordDetailTable.scss';

class RecordDetailTable extends Component {
  constructor(props, context) {
    super(props, context)
  }
  tableChange = () => {

  }
 
  showEditModal = (record) => {
 
  

  }
  showDeletModal=(record)=>{

  }
  showAddModal=(record)=>{

  }
  showRecodePlanModal=(record)=>{
    // console.log('2222');
    // console.log(this.props);
    //this.props.changeCleanoutRecordStore({showSidePage:'recordPlan'})
     this.props.onShowSideChange({showSidePage:'recordPlan'}) 
    // this.props.onShowSideChange({ showSidePage:'planRecord' });
  }
  render() {
    const { loading } = this.props;
    const column = [
      {
        title: '计划清洗时间',
        dataIndex: 'estimateStartTime',
        key: 'estimateStartTime',
       
        render: (text, record, index) => {
          return (
            <span className={styles.estimateStartTime} title={record.estimateStartTime}>{record.estimateStartTime}</span>
          )
        }
      }, {
        title: '实际清洗时间',
        dataIndex: 'estimateEndTime',
        key: 'estimateEndTime',
        
      }, {
        title: '实际清洗用时(天)',
        dataIndex: 'actualCleanTime',
        key: 'actualCleanTime',
        render: text => (<span>{parseInt(text) >= 0 ? `${text}` : '--'}</span>),
       
      }, {
        title: '清洗方式',
        dataIndex: 'cleanType',
        key: 'cleanType',
       
      }, {
        title: '清洗公司',
        dataIndex: 'company',
        key: 'company',
       
      }, {
        title: '清洗费用(元)',
        dataIndex: 'cleanCost',
        key: '',
       
      },{
        title: '清洗收益(万kWh)',
        dataIndex: 'cleanProfit',
        key: 'cleanProfit',
       
      },{
          title: '添加/查看清洗记录(元)',
          key: 'addplan',
          render: (text, record, index) => {
            return (
              <div>
              <span style={{marginRight:'8px'}} title="添加" className="iconfont icon-look" onClick={(record) =>console.log('111111')}></span>
              <span title="查看" className="iconfont icon-look" onClick={(record) => this.showRecodePlanModal(record)}></span>
              </div>
              )
          }
        },{
          title: '操作',
          key: 'check',
          render: (text, record, index) => {
            return (
              <div>
              <span style={{marginRight:'4px'}} title="编辑" className="iconfont icon-edit" onClick={(record) => this.showEditModal(record)}></span>
              
              <span title="删除" className="iconfont icon-del" onClick={(record) => this.showDeletModal(record)}></span>
              </div>
            )
          }
      }

    ];
    const data=[
      {estimateStartTime:'dalidadali',estimateEndTime:'1',actualCleanTime:'2',recordTiem:'3',cleanType:'23',company:'4',cleanCost:'5',cleanProfit:'6'},
    {estimateStartTime:'wulala',estimateEndTime:'6',actualCleanTime:'7',recordTiem:'8',cleanType:'32',company:'9',cleanCost:'10',cleanProfit:'11'}]
    return (
      <div>
        <Table
          loading={loading}
          dataSource={data.map((e, i) => ({ ...e, key: i }))}
          columns={column}
          className={styles.stationTable}
          onChange={this.tableChange}
          pagination={false}
          locale={{ emptyText: <img  src="/img/nodata.png" /> }}
        />
      </div>
    )
  }
}
export default (RecordDetailTable)