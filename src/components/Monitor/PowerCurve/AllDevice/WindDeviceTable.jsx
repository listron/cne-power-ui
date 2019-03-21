import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./allDeviceCurve.scss";
import CommonPagination from '../../../Common/CommonPagination';
import { Table, } from 'antd';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../utils/utilFunc';


class WindDeviceTable extends Component {
  static propTypes = {
    changeAllDeviceStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
    this.state={
      sortName:'deviceName',
      descend: false,

    }
  }
  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    const { changeAllDeviceStore, } = this.props;
    changeAllDeviceStore({ pageNum: currentPage, pageSize })
  }
 
  tableChange = (pagination, filters, sorter) => {
    this.setState({
      sortName: sorter.field,
      descend: sorter.order === 'descend'
    })
  }
  createTableSource = (data) => { // 数据源的排序，翻页
    const { sortName, descend } = this.state;
    const tableSource = [...data].map((e, i) => ({
      ...e,
      key: i,
    })).sort((a, b) => { // 手动排序
      const sortType = descend ? -1 : 1;
      const arraySort = ['deviceName', 'stationName'];
      const arrayNumSort = ['windSpeedCenter', 'windSpeedAvg', 'powerAvg', 'powerTheory', 'frequency',];
      if (arrayNumSort.includes(sortName)) {
        return sortType * (a[sortName] - b[sortName]);
      } else if (arraySort.includes(sortName)) {
        a[sortName] = a[sortName] ? a[sortName] : '';
        return sortType * (a[sortName].localeCompare(b[sortName]));
      }
    })
   
    return tableSource
  }
  render() {
    const { pageSize, pageNum, powerCurveListData,stationCode,startTime,endTime } = this.props;
    const time=`${startTime}~${endTime}`;
    const dataSort = this.createTableSource(powerCurveListData);
    const totalNum = powerCurveListData.length;
    let startRow = (pageNum - 1) * pageSize;
    let endRow = pageNum * pageSize;
    endRow = (endRow > totalNum) ? totalNum : endRow;
    let datalist = dataSort.slice(startRow, endRow);
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        sorter: true,
        render:(value,record,index)=>{
          return  (<a href={`#/monitor/powercurve/${stationCode}/${record.deviceFullCode}/${time}`}>
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
        title:<TableColumnTitle title="平均功率" unit="kW" />,
        dataIndex: 'powerAvg',
        render(text){ return numWithComma(text); },

        sorter: true,
      }, {
        title:<TableColumnTitle title="理论功率" unit="kW" />, 
        dataIndex: 'powerTheory',
        render(text){ return numWithComma(text); },
        sorter: true,
      },{
        title:<TableColumnTitle title="频次" unit="次" />, 
        dataIndex: 'frequency',
        render(text){ return numWithComma(text); },

      }
    ]
    
    return (
      <div className={styles.windDeviceList} >
        <div className={styles.tableHeader}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} total={totalNum} />
        </div>
        <Table
          dataSource={datalist}
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