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
        dataIndex: 'effiRate',
        key: 'effiRate',
        sorter: true,
      }, {
        title: '平均清洗周期(天)',
        dataIndex: 'tenday',
        key: 'tenday',
        render: text => (<span>{parseInt(text) >= 0 ? `${text}%` : '--'}</span>),
        sorter: true,
      }, {
        title: '累计清洗收益(万kWh)',
        dataIndex: 'before',
        key: 'before',
        sorter: true,
      }, {
        title: '上次清洗时间',
        dataIndex: 'recordTiem',
        key: 'recordTiem',
        sorter: true,
      }, {
        title: '添加清洗计划/降雨',
        dataIndex: 'addplan',
        key: 'addplan',
        render: (text, record, index) => {
          return (<span title="查看" className="iconfont icon-look" onClick={() => this.showPopModal(record)}></span>)
        }
      },{
        title: '查看',
        dataIndex: 'check',
        key: 'check',
        render: (text, record, index) => {
          return (<span title="查看" className="iconfont icon-look" onClick={() => this.showDetailModal(record)}></span>)
        }
      }

    ];
    const data=[{stationName:'dalidadali',check:'1',addplan:'2',recordTiem:'3',before:'4',tenday:'5',effiRate:'6'},{stationName:'wulala',check:'6',addplan:'7',recordTiem:'8',before:'9',tenday:'10',effiRate:'11'}]
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