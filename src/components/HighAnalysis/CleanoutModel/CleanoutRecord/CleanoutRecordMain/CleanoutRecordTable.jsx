import React, { Component } from "react";
import { Table, Icon } from 'antd';
import styles from './cleanoutRecordMain.scss';
class CleanoutRecordTable extends Component {
  constructor(props, context) {
    super(props, context)
  }
  tableChange = () => {

  }
  tableChange = () => {

  }
  showDetailModal = () => {
 
    this.props.changeCleanoutRecordStore({showPage:'detail'})

  }
  render() {
    const { loading } = this.props;
    const column = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
        render: (text, record, index) => {
          return (
            <span className={styles.stationName} title={record.stationName}>{record.stationName}</span>
          )
        }
      }, {
        title: '清洗计划(个)',
        dataIndex: 'cleanPlanNum',
        key: 'cleanPlanNum',
        sorter: true,
      }, {
        title: '平均清洗周期(天)',
        dataIndex: 'cleanCycle',
        key: 'cleanCycle',
        render: text => (<span>{parseInt(text) >= 0 ? `${text}%` : '--'}</span>),
        sorter: true,
      }, {
        title: '累计清洗收益(万kWh)',
        dataIndex: 'cleanProfit',
        key: 'cleanProfit',
        sorter: true,
      }, {
        title: '上次清洗时间',
        dataIndex: 'cleanTime',
        key: 'cleanTime',
        sorter: true,
      }, {
        title: '添加清洗计划/降雨',
        key: 'addplan',
        render: (text, record, index) => {
          return (<span title="查看" className="iconfont icon-look" onClick={() => this.showPopModal(record)}></span>)
        }
      },{
        title: '查看',
        key: 'check',
        render: (text, record, index) => {
          return (<span title="查看" className="iconfont icon-look" onClick={() => this.showDetailModal(record)}></span>)
        }
      }

    ];
    const data=[{stationName:'dalidadali',check:'1',addplan:'2',cleanTime:'3',cleanProfit:'4',cleanCycle:'5',cleanPlanNum:'6'},{stationName:'wulala',check:'6',addplan:'7',cleanTime:'8',cleanProfit:'9',cleanCycle:'10',cleanPlanNum:'11'}]
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
export default (CleanoutRecordTable)