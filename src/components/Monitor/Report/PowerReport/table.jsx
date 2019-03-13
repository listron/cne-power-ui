import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './powerReport.scss';
import { Table } from "antd";
import CommonPagination from '../../../Common/CommonPagination';

class TableList extends Component {
  static propTypes = {
    // getPowerReportList: PropTypes.func,
    // changePowerReportStore: PropTypes.func,
  }
  componentDidMount() {
    console.log(this.props)
  }
  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器操作
    const { getPowerReportList } = this.props;
    getPowerReportList({

    })
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
        title: "电站名称",
        dataIndex: "stationName",

        onFilter: (value, record) => record.stationName.indexOf(value) === 0,
        sorter: true,


      },
      {
        title: "区域",
        dataIndex: "region",
        sorter: true,
        render: (value, record, index) => {
          return {
            children: (
              <div className={styles.region}>{record.region}</div>
            )
          }
        }
      },
      {
        title: "月实际发电量(万kWh)",
        dataIndex: "genValid",
        sorter: true,
        render: text => (text || text === 0) ? text : '--'
      },
      {
        title: "月计划发电量(万kWh)",
        dataIndex: "planGen",
        sorter: true,
        render: text => (text || text === 0) ? text : '--'
      },
      {
        title: "计划完成率",
        dataIndex: "planGenRate",
        sorter: true,
        defaultSortOrder: 'ascend'
      },
      {
        title: "发电量同比",
        dataIndex: "powerRate",
        sorter: true,

      },
      {
        title: "辐射总量(MJ/m²)",
        dataIndex: "resourceValue",
        sorter: true,
      },

      {
        title: "资源同比",
        dataIndex: "resourceRate",
        sorter: true,
      },
      {
        title: "等效利用小时数 (h)",
        dataIndex: "equivalentHours",
        sorter: true,
      },
      {
        title: "PR",
        dataIndex: "pr",
        sorter: true,
      }, {
        title: "损失电量(万kWh)",
        dataIndex: "lostPower",
        sorter: true,
      },
      {
        title: "损失电量等效时",
        dataIndex: "limitPowerHours",
        sorter: true,

      }
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
        <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} />
        <div>
          <Table columns={columns}
            dataSource={dataSource}
            onChange={this.ontableSort}
            pagination={false} />
        </div>
      </React.Fragment>
    )
  }
}

export default TableList;