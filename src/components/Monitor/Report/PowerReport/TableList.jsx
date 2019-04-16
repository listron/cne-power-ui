import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './powerReport.scss';
import { Table } from "antd";
import CommonPagination from '../../../Common/CommonPagination';
import TableColumnTitle from '../../../Common/TableColumnTitle';

class TableList extends Component {
  static propTypes = {
    getPowerReportList: PropTypes.func,
    changePowerReportStore: PropTypes.func,
    onChangeFilter: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    dateType: PropTypes.number,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    summaryType: PropTypes.number,
    summaryData: PropTypes.array,
    powerReportList: PropTypes.array,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    filterTable: PropTypes.number,

  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器操作
    this.props.changePowerReportStore({ pageNum: currentPage, pageSize, })
    this.props.onChangeFilter({ pageNum: currentPage, pageSize })
  }
  ontableSort = (pagination, filter, sorter) => {
    const { onChangeFilter, } = this.props;
    const { field, order } = sorter;
    const sortInfo = {
      regionName: '0',
      stationName: '1',
      deviceName: '2',
      deviceModeName: '3',
      time: '4',
      windSpeedAvg: '5',
      genValid: '6',
      genTime: '7',
      equivalentHours: '8',
      limitGen: '9',
      limitTime: '10',
      faultGen: '11',
      faultTime: '12'
    };
    const sortField = sortInfo[field] ? sortInfo[field] : '';
    const sortMethod = order ? (sorter.order === 'descend' ? 'desc' : 'asc') : '';
    this.props.changePowerReportStore({ sortField, sortMethod })
    onChangeFilter({ sortField, sortMethod })
  }
  initMonthColumn = () => {
    const { filterTable } = this.props;
    const filterShow = [
      {
        title: "区域",
        dataIndex: "regionName",
        sorter: true,
        // width:40,
      },
      {
        title: "电站名称",
        dataIndex: "stationName",
        sorter: true,
      },
      {
        title: "设备名称",
        dataIndex: "deviceName",
        sorter: true,
      },
      {
        title: "风机型号",
        dataIndex: "deviceModeName",
        sorter: true,

      },
    ];
    const show = filterShow.slice(0, filterTable);
    const columns = [

      {
        title: "统计时段",
        dataIndex: "date",
        sorter: true,
      
      },
      {
        title: () => <TableColumnTitle title="平均风速" unit="m/s" />,
        dataIndex: "windSpeedAvg",
        sorter: true,

      },
      {
        title: () => <TableColumnTitle title="发电量" unit="kWh" />,
        dataIndex: "genValid",
        sorter: true,
      },

      {
        title: () => <TableColumnTitle title="发电时间" unit="h" />,
        dataIndex: "genTime",
        sorter: true,
      },
      {
        title: () => <TableColumnTitle title="等效利用小时数" unit="h" />,
        dataIndex: "equivalentHours",
        sorter: true,
      },
      {
        title: () => <TableColumnTitle title="限电损失电量" unit="kWh" />,
        dataIndex: "limitGen",
        sorter: true,
      },
      {
        title: () => <TableColumnTitle title="限电时长" unit="h" />,
        dataIndex: "limitTime",
        sorter: true,
      },
      {
        title: () => <TableColumnTitle title="故障损失电量" unit="kWh" />,
        dataIndex: "faultGen",
        sorter: true,

      },
      {
        title: () => <TableColumnTitle title="故障时长" unit="h" />,
        dataIndex: "faultHours",
        sorter: true,
      },
    ];
    columns.unshift(...show)
    return columns
  }


  render() {
    const { total, pageSize, pageNum, powerReportList } = this.props;
    const columns = this.initMonthColumn();
    const dataSource = powerReportList.map((e, i) => ({
      ...e, key: i,
     
    }))
    return (
      <React.Fragment>
        <div className={styles.tableHeader}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table columns={columns}
          dataSource={dataSource}
          onChange={this.ontableSort}
          // scroll={{ x: 1440 }}
          pagination={false} />
      </React.Fragment>
    )
  }
}

export default TableList;