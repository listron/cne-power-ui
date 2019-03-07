import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./allDeviceCurve.scss";
import CommonPagination from '../../../Common/CommonPagination';
import { Table, } from 'antd';



class WindDeviceTable extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    const { changeAllDeviceStore, onChangeFilter, } = this.props;
    changeAllDeviceStore({ pageNum: currentPage, pageSize })
    onChangeFilter({ pageNum: currentPage, pageSize })
  }
  tableChange=(pagination, filters, sorter)=>{
    const {changeAllDeviceStore,onChangeFilter}=this.props;
    const { field, order } = sorter;
    const sortInfo = {
      deviceName: '1',
      deviceTypeName: '2',
      deviceName: '8',
      deviceTypeName:'3',
      timeOn: '5',
      durationTime: '9',
    };
    const orderField = sortInfo[field] ? sortInfo[field] : '';
    const orderType = order ? (sorter.order === 'ascend' ? '0' : '1') : '';
    changeAllDeviceStore({ orderField, orderType })
    onChangeFilter({
        orderField, orderType
    })
  }
  render() {
    const { pageSize, pageNum, total,powerCurveListData } = this.props;
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        sorter: true,
        render:(value,record,index)=>{
          return  (<a href={`#/monitor/powercurve/${record.key}`}>
          <div title={record.deviceName} className={styles.deviceName}>{record.deviceName}</div>
        </a>)
        }
      }, {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
      }, {
        title: '型号',
        dataIndex: 'deviceModeName',
        key: 'deviceModeName',
       
      }, {
        title: '中心风速(m/s)',
        dataIndex: 'deviceTypeName',
        key: 'deviceTypeName',
        sorter: true,
      }, {
        title: '平均风速(m/s)',
        dataIndex: 'warningCheckDesc',
        key: 'warningCheckDesc',
        sorter: true,
      }, {
        title: '平均功率(kW)',
        dataIndex: 'timeOn',
        key: 'timeOn',
        sorter: true,
      }, {
        title: '理论功率(kW)',
        dataIndex: 'durationTime',
        key: 'durationTime',
        sorter: true,
      },{
        title: '频次(次)',
        dataIndex: 'hz',
        key: 'hz',
      }
    ]
    
    return (
      <div className={styles.windDeviceList} >
        <div className={styles.tableHeader}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} total={total} />
        </div>
        <Table
          dataSource={powerCurveListData}
          columns={columns}
          pagination={false}
          onChange={this.tableChange}
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
        />
      </div>
    )
  }
}
export default (WindDeviceTable)