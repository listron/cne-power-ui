import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './powerReport.scss';
import { Table } from "antd";
import CommonPagination from '../../../Common/CommonPagination';

class TableList extends Component {
  static propTypes = {
    getPowerReportList: PropTypes.func,
    changePowerReportStore: PropTypes.func,
  }
  componentDidMount() {
    const { getPowerReportList, pageNum, pageSize } = this.props;
    getPowerReportList({ stationCodes: '', pageNum, pageSize })
  }
  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器操作
    const { getPowerReportList } = this.props;
    getPowerReportList({ pageNum: currentPage, pageSize })
    this.props.changePowerReportStore({ pageNum: currentPage, pageSize, })
  }
  ontableSort = (pagination, filter, sorter) => {
    const { getPowerReportList, stationType, year, month, powerSelectYear, dateType, pageSize, pageNum } = this.props;
    const { field, order } = sorter;
    const sortInfo = {
      stationName: 'stationName',
      region: 'region',
      planGen: 'planGen',
      genValid: 'genValid',
      planGenRate: 'planGenRate',
      powerRate: 'powerRate',
      resourceValue: 'resourceValue',
      resourceRate: 'resourceRate',
      equivalentHours: 'equivalentHours',
      pr: 'pr',
      lostPower: 'lostPower',
      limitPowerHours: 'limitPowerHours'
    };
    const sort = sortInfo[field] ? sortInfo[field] : '';
    const sortType = order ? (sorter.order === 'descend' ? 'desc' : 'asc') : '';
    let prams = {
      pageNum,
      pageSize,
      year: dateType === 'month' ? year[0] : powerSelectYear,
      stationType,
      month,
      dateType,
      sort,
      sortType,
      stationType
    }
    getPowerReportList(prams)
    this.props.changePowerReportStore({ sort, sortType })
  }


  initMonthColumn = () => {
    const columns = [
      {
        title: "区域",
        dataIndex: "regionName",
        sorter: true,
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
      {
        title: "统计时段",
        dataIndex: "time",
        sorter: true,
        defaultSortOrder: 'ascend'
      },
      {
        title: "平均风速",
        dataIndex: "windSpeedAvg",
        sorter: true,

      },
      {
        title: "发电量",
        dataIndex: "genValid",
        sorter: true,
      },

      {
        title: "发电时间",
        dataIndex: "genTime",
        sorter: true,
      },
      {
        title: "等效利用小时数 (h)",
        dataIndex: "equivalentHours",
        sorter: true,
      },
      {
        title: "限电损失电量",
        dataIndex: "limitGen",
        sorter: true,
      }, {
        title: "限电时长",
        dataIndex: "limitTime",
        sorter: true,
      },
      {
        title: "故障损失电量",
        dataIndex: "faultGen",
        sorter: true,

      },
      {
        title: "故障时长",
        dataIndex: "faultTime",
        sorter: true,

      },
    ];
    return columns
  }


  render() {
    const { total, pageSize, pageNum, powerReportList } = this.props;
    const columns = this.initMonthColumn();
    const dataSource = powerReportList.map((e, i) => ({
      ...e, key: i,
      pr: `${e.pr ? e.pr : '--'}%`,
      resourceRate: `${e.resourceRate ? e.resourceRate : '--'}%`,
      planGenRate: `${e.planGenRate ? e.planGenRate : '--'}%`,
      powerRate: `${e.powerRate ? e.powerRate : '--'}%`
    }))
    return (
      <React.Fragment>
        <div className={styles.tableHeader}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table columns={columns}
          dataSource={dataSource}
          onChange={this.ontableSort}
          pagination={false} />
      </React.Fragment>
    )
  }
}

export default TableList;