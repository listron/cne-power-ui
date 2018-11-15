import React from "react";
import PropTypes from "prop-types";
import styles from './stationStatisticList.scss';
import Pagination from '../../../../components/Common/CommonPagination/index';
import { Table, Radio } from "antd";
import moment from 'moment';
// import { getCookie } from '../../../../utils/index.js';
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

  }
  constructor(props, context) {
    super(props, context),
      this.state = {
        // month:0,
        // year:0
      }
  }
  ontableSort = (pagination, filter, sorter) => {
    const { getAllStationStatisticTableData, queryListParams,stationType, year, month, dateType, pageSize, pageNum } = this.props;
    let curYear = Number(year);
    year.length>1?curYear=year[year.length-1]:curYear=Number(year);
    console.log(curYear);

    console.log(year);
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
    dateType==='month'?
    getAllStationStatisticTableData({
      pageNum,
      pageSize,
      year: curYear,
      month,
      dateType,
      sort,
      sortType,
      stationType
    }):getAllStationStatisticTableData({
      pageNum,
      pageSize,
      year: curYear,  
      dateType,
      sort,
      sortType,
      stationType
    })

  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器操作
    const { getAllStationStatisticTableData, dateType, sortType,stationType, month, year, sort } = this.props;
    const curYear = Number(year);
    this.props.changeAllStationStore({ pageNum: currentPage })
    getAllStationStatisticTableData({
      year: curYear,
      dateType,
      pageSize,
      sortType,
      sort,
      month: month,
      pageNum: currentPage,
      stationType
    })
  }
  handleTime = (e) => {
    const changeMonth = Number(e.target.value);
    const { changeAllStationStore, getAllStationStatisticTableData, stationType, dateType, pageNum, pageSize, sortType, year, sort } = this.props;
    const curYear = Number(year);
    const userId = Cookie.get('userId')
    changeAllStationStore({ month: changeMonth, powerSelectMonth: changeMonth })
    getAllStationStatisticTableData(
      {
        year: curYear,
        dateType,
        month: changeMonth,//
        pageNum, // 当前页
        pageSize, // 每页条数
        sortType,
        sort,
        stationType
      }
    )
  }
  handleYearTime = (e) => {
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
    changeAllStationStore({ powerSelectYear: changeYear })
  }

  selectYear() {
    const { allStationAvalibaData, dateType, powerSelectMonth, powerSelectYear } = this.props;
    let yearArray = allStationAvalibaData.length > 0 && allStationAvalibaData.map((e, i) => (Number(e.year)));
    let currentYear = yearArray && Math.max(...yearArray);
    const currentMonth = moment().format('MM');
    if (dateType === 'year' && allStationAvalibaData.length > 0) {
      return (
        <Radio.Group value={`${powerSelectYear}`} buttonStyle="solid" onChange={this.handleYearTime}>
          {allStationAvalibaData.map((e, index) => {
            if (e.isTrue === true) {
              return <Radio.Button value={e.year} key={index} style={{ margin: '0 5px' }}>{e.year}年</Radio.Button>
            } else {
              return <Radio.Button value={e.year} key={index} disabled style={{ margin: '0 5px' }}>{e.year}年</Radio.Button>
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
              <a href={`#/statistical/stationaccount/allstation/${record.key}`}>
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
      }, {
        title: "月计划发电量(万kWh)",
        dataIndex: "planGen",
        sorter: true,
      },
      {
        title: "月实际发电量(万kWh)",
        dataIndex: "genValid",
        sorter: true,
      },
      {
        title: "计划完成率",
        dataIndex: "planGenRate",
        sorter: true,
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
              <a href={`#/statistical/stationaccount/allstation/${record.key}`}>
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
      }, {
        title: "年计划发电量(万kWh)",
        dataIndex: "planGen",
        sorter: true,
      },
      {
        title: "年实际发电量(万kWh)",
        dataIndex: "genValid",
        sorter: true,
      },
      {
        title: "计划完成率",
        dataIndex: "planGenRate",
        sorter: true,
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
    return (
      <div className={styles.stationStatisticList}>
        <div className={styles.stationStatisticFilter}>
          <div className={styles.leftTime}>
            <div>综合指标统计表</div>

            {/* {dateType === 'year' && showPage === 'multiple' ? this.selectYear() : this.selectTime()}*/}
            {this.selectYear()}

          </div>

          <Pagination total={totalNum} currentPage={pageNum} pageSize={pageSize} onPaginationChange={this.onPaginationChange} />
        </div>
        <div>
          <Table columns={columns} dataSource={allStationStatisticTableData && allStationStatisticTableData.map((e, i) => ({ ...e, key: i,pr:`${e.pr?e.pr:'--'}%`,resourceRate:`${e.resourceRate?e.resourceRate:'--'}%`,planGenRate:`${e.planGenRate?e.planGenRate:'--'}%`,powerRate:`${e.powerRate?e.powerRate:'--'}%` }))} onChange={this.ontableSort} pagination={false} />
        </div>



      </div>
    )
  }
}
export default (StationStatisticList)