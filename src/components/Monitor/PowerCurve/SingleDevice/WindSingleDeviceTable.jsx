import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./singleDevice.scss";
import CommonPagination from '../../../Common/CommonPagination';
import { Table, } from 'antd';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../utils/utilFunc';

class WindSingleDeviceTable extends Component {
  static propTypes = {
    getSingleDeviceCurveList:PropTypes.func,
    changeSingleDeviceStore:PropTypes.func,
    stationCode:PropTypes.string,
    startTime:PropTypes.string,
    correct:PropTypes.number,
    total:PropTypes.number,
    pageNum:PropTypes.number,
    pageSize:PropTypes.number,
    singleDeviceCurveList:PropTypes.array,
    endTime:PropTypes.string,
  }
  constructor(props, context) {
    super(props, context)
  }
  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    const tabledeviceFullCode= this.props.match.params.deviceFullCode;
    const { changeSingleDeviceStore,stationCode, startTime,correct, endTime, } = this.props;
    const params = { stationCode, startTime, endTime,correct };
    changeSingleDeviceStore({ pageNum: currentPage, pageSize })
    this.props.getSingleDeviceCurveList({...params, pageNum: currentPage, pageSize,deviceFullCode:tabledeviceFullCode})
  }
  tableChange=(pagination, filters, sorter)=>{
  }
  render() {
    const { pageSize, pageNum, total,singleDeviceCurveList } = this.props;
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        render:(value,record,index)=>{
          return  (
          <div title={record.deviceName} className={styles.deviceName}>{record.deviceName}</div>
        )
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
        title: <TableColumnTitle title="中心风速" unit="m/s" />,
        dataIndex: 'windSpeedCenter',
        render(text){ return numWithComma(text); },
      }, {
        title: <TableColumnTitle title="平均风速" unit="m/s" />, 
        dataIndex: 'windSpeedAvg',
        render(text){ return numWithComma(text); },
      }, {
        title: <TableColumnTitle title="平均功率" unit="kW" />,
        dataIndex: 'powerAvg',
        render(text){ return numWithComma(text); },
      }, {
        title: <TableColumnTitle title="理论功率" unit="kW" />, 
        dataIndex: 'powerTheory',
        render(text){ return numWithComma(text); },
      },{
        title: <TableColumnTitle title="频次" unit="次" />, 
        dataIndex: 'frequency',
        render(text){ return numWithComma(text); },
      }
    ]
    
    return (
      <div className={styles.windDeviceList} >
        <div className={styles.tableHeader}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} total={total} />
        </div>
        <Table
          dataSource={singleDeviceCurveList}
          columns={columns}
          pagination={false}
          onChange={this.tableChange}
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
        />
      </div>
    )
  }
}
export default (WindSingleDeviceTable)