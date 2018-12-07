import React, { Component } from "react";
import { Table, Icon } from 'antd';
import styles from './PlanRecordTable.scss';

class PlanRecordTable extends Component {
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
    // this.props.changeCleanoutRecordStore({showPage:'planRecord'})
    // this.props.onShowSideChange({showSidePage:'planRecord'}) 
    // this.props.onShowSideChange({ showSidePage:'planRecord' });
  }
  render() {
    const { loading } = this.props;
    const column = [
      {
        title: '清洗时间',
        dataIndex: 'cleanTime',
        key: 'cleanTime',
       
        render: (text, record, index) => {
          return (
            <span className={styles.cleanTime} title={record.cleanTime}>{record.cleanTime}</span>
          )
        }
      }, {
        title: '方阵',
        dataIndex: 'matrix',
        key: 'matrix',
        
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        render: text => (<span>{parseInt(text) >= 0 ? `${text}` : '--'}</span>),
       
      }, {
        title: 'pr',
        dataIndex: 'pr',
        key: 'pr',
       
      }, {
          title: '操作',
          key: 'check',
          render: (text, record, index) => {
            return (
              <div>
              <span title="编辑" className="iconfont icon-look" onClick={(record) => this.showEditModal(record)}></span>
              <span title="删除" className="iconfont icon-look" onClick={(record) => this.showDeletModal(record)}></span>
              </div>
            )
          }
      }

    ];
    const data=[
      {cleanTime:'dalidadali',matrix:'1',remark:'2',pr:'3',},
    {cleanTime:'wulala',matrix:'6',remark:'7',pr:'8',}]
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
export default (PlanRecordTable)