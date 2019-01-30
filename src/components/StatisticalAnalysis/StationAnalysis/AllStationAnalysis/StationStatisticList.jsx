import React from "react";
import PropTypes from "prop-types";
import styles from './stationStatisticList.scss';
import CommonPagination from '../../../../components/Common/CommonPagination';
import { Table, Radio } from "antd";
import Cookie from 'js-cookie';

class StationStatisticList extends React.Component {
  static propTypes = {
    allStationAvalibaData: PropTypes.array,
    dateType: PropTypes.string,
    showPage: PropTypes.string,
    sortType: PropTypes.string,
    sort: PropTypes.string,
    allStationStatisticTableData: PropTypes.array,
    getAllStationStatisticTableData: PropTypes.func,
    changeAllStationStore: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    totalNum: PropTypes.number,
    allStationAvalibaData: PropTypes.array,
    history: PropTypes.object,

  }
  constructor(props, context) {
    super(props, context)
  }

  ontableSort = (pagination, filter, sorter) => {
    const { getAllStationStatisticTableData, stationType, year, month, powerSelectYear, dateType, pageSize, pageNum } = this.props;
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
    getAllStationStatisticTableData(prams)
    this.props.changeAllStationStore({ sort, sortType })
  }


  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器操作
    const { getAllStationStatisticTableData, dateType, sortType, stationType, month, year, sort, powerSelectYear } = this.props;
    getAllStationStatisticTableData({
      year: dateType === 'month' ? year[0] : powerSelectYear,
      dateType,
      pageSize,
      sortType,
      sort,
      month,
      pageNum: currentPage,
      stationType
    })
    this.props.changeAllStationStore({ pageNum: currentPage, pageSize, })
  }


  handleTime = (e) => {  // 选择月
    const changeMonth = Number(e.target.value);
    const { changeAllStationStore, getAllStationStatisticTableData, stationType, dateType, pageNum, pageSize, sortType, year, sort, powerSelectYear } = this.props;
    changeAllStationStore({ month: changeMonth, powerSelectMonth: changeMonth, })
    getAllStationStatisticTableData(
      {
        year: year[0],
        dateType,
        month: changeMonth,
        pageNum, // 当前页
        pageSize, // 每页条数
        sortType,
        sort,
        stationType
      }
    )
  }

  handleYearTime = (e) => { // 选择年
    const changeYear = Number(e.target.value);
    const { getAllStationStatisticTableData, dateType, pageNum, pageSize, sortType, sort, stationType, changeAllStationStore } = this.props;
    getAllStationStatisticTableData(
      {
        year: changeYear,
        dateType,
        pageNum, // 当前页
        pageSize, // 每页条数
        sortType,
        sort,
        stationType
      }
    )
    changeAllStationStore({ powerSelectYear: changeYear, })
  }

  selectYear() { // 计划完成选择年份
    const { allStationAvalibaData, dateType, powerSelectMonth, powerSelectYear } = this.props;
    if (dateType === 'year' && allStationAvalibaData.length > 0) {
      return (
        <Radio.Group value={`${powerSelectYear}`} buttonStyle="solid" onChange={this.handleYearTime}>
          {allStationAvalibaData.map((e, index) => {
            if (e.isTrue === true) {
              return <Radio.Button value={e.year} key={index} style={{ margin: '0 5px' }}>{e.year}</Radio.Button>
            } else {
              return <Radio.Button value={e.year} key={index} disabled style={{ margin: '0 5px' }}>{e.year}</Radio.Button>
            }
          }
          )}
        </Radio.Group>
      )
    } else if (allStationAvalibaData.length > 0) {
      return (
        <Radio.Group value={+powerSelectMonth} buttonStyle="solid" onChange={this.handleTime}>
          {allStationAvalibaData.map((e, index) => {
            if (e.isTrue === true) {
              return <Radio.Button value={e.year} key={index} style={{ margin: '0 5px' }}>{e.year}月</Radio.Button>
            } else {
              return <Radio.Button value={e.year} key={index} disabled style={{ margin: '0 5px' }}>{e.year}月</Radio.Button>
            }
          }
          )}
        </Radio.Group>
      )
    }
  }


  selectStation = (record) => {
    const stationCode = record.stationCode
    this.props.history.push(`/statistical/stationaccount/allstation/${stationCode}`);
    this.props.changeAllStationStore({
      showPage: 'single',
      singleStationCode: `${stationCode}`
    });
  }

  //月table表
  initMonthColumn = () => {
    const columns = [
      {
        title: "电站名称",
        dataIndex: "stationName",

        onFilter: (value, record) => record.stationName.indexOf(value) === 0,
        sorter: true,
        render: (value, record, index) => {
          return {
            children: (
              <a onClick={() => this.selectStation(record)}>
                <div title={record.stationName} className={styles.stationName}>{record.stationName}</div>
              </a>
            )
          }
        }

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
  //年table表
  initYearColumn = () => {
    const columns = [
      {
        title: "电站名称",
        dataIndex: "stationName",

        onFilter: (value, record) => record.stationName.indexOf(value) === 0,
        sorter: true,
        render: (value, record, index) => {
          return {
            children: (
              <a href={`#/statistical/stationaccount/allstation/${record.key}`} onClick={() => this.selectStation(record)}>
                <div title={record.stationName} className={styles.stationName}>{record.stationName}</div>
              </a >
            )
          }
        }
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
        title: "年实际发电量(万kWh)",
        dataIndex: "genValid",
        sorter: true,
        render: text => (text || text === 0) ? text : '--'
      },
      {
        title: "年计划发电量(万kWh)",
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
        title: "发电量环比",
        dataIndex: "powerRate",
        sorter: true,

      },
      {
        title: "辐射总量(MJ/m²)",
        dataIndex: "resourceValue",
        sorter: true,
      },

      {
        title: "资源环比",
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
    const { dateType, allStationStatisticTableData, totalNum, pageSize, pageNum, showPage } = this.props;
    const columns = dateType === 'month' ? this.initMonthColumn() : this.initYearColumn();
    const dataSource = allStationStatisticTableData.map((e, i) => ({
      ...e, key: i,
      pr: `${e.pr ? e.pr : '--'}%`,
      resourceRate: `${e.resourceRate ? e.resourceRate : '--'}%`,
      planGenRate: `${e.planGenRate ? e.planGenRate : '--'}%`,
      powerRate: `${e.powerRate ? e.powerRate : '--'}%`
    }))
    return (
      <div className={styles.stationStatisticList}>
        <div className={styles.stationStatisticFilter}>
          <div className={styles.leftTime}>
            <div>综合指标统计表</div>
            {this.selectYear()}
          </div>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
        <div>
          <Table columns={columns}
            dataSource={dataSource}
            onChange={this.ontableSort}
            pagination={false} />
        </div>

      </div>
    )
  }
}
export default (StationStatisticList)