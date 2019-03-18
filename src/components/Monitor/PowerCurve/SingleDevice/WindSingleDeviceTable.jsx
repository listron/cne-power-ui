import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./singleDevice.scss";
import CommonPagination from '../../../Common/CommonPagination';
import { Table, } from 'antd';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../utils/utilFunc';



class WindSingleDeviceTable extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    const { changeSingleDeviceStore, onChangeFilter, } = this.props;
    changeSingleDeviceStore({ pageNum: currentPage, pageSize })
    onChangeFilter({ pageNum: currentPage, pageSize })
  }
  tableChange=(pagination, filters, sorter)=>{
    const {changeSingleDeviceStore,onChangeFilter}=this.props;
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
    changeSingleDeviceStore({ orderField, orderType })
    onChangeFilter({
        orderField, orderType
    })
  }
  render() {
    const { pageSize, pageNum, total,powerCurveListData,stationCode,startTime,endTime } = this.props;
    const time=`${startTime}-${endTime}`
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        sorter: true,
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
        sorter: true,
      }, {
        title: <TableColumnTitle title="平均风速" unit="m/s" />, 
        dataIndex: 'windSpeedAvg',
        render(text){ return numWithComma(text); },
        sorter: true,
      }, {
        title: <TableColumnTitle title="平均功率" unit="kW" />,
        dataIndex: 'powerAvg',
        render(text){ return numWithComma(text); },
        sorter: true,
      }, {
        title: <TableColumnTitle title="理论功率" unit="kW" />, 
        dataIndex: 'powerTheory',
        render(text){ return numWithComma(text); },
        sorter: true,
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
export default (WindSingleDeviceTable)