import React from "react";
import styles from './styles.scss';
import { Table } from 'antd';

class TableGraph extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  onMouseEnter = (record) => {

    return (
      <div>xuanfukuang</div>
    )
  }
  //table排序

  //table列
  getColumnsArray = (tableType, lastYear, currentYear) => {
    let columns = [];
    switch (tableType) {
      case 'plan':
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 150,
          //sorter: true,
          sorter: (a, b) => (a.date).localeCompare(b.date),
        }, {
          title: '计划发电量',
          dataIndex: 'planPower',
          width: 150,
          //sorter: true,
          sorter: (a, b) => a.planPower - b.planPower,
        }, {
          title: '实际发电量',
          dataIndex: 'actualPower',
          width: 150,
          //sorter: true,
          sorter: (a, b) => a.actualPower - b.actualPower,
        }, {
          title: '计划完成率',
          dataIndex: 'per',
          width: 150,
          // sorter: true,
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.per - b.per,
        }];
        break;
      case 'light':
        columns = [{
          title: '日期',
          dataIndex: 'monthOrDay',
          width: 120,
          // sorter: true,
          sorter: (a, b) => (a.monthOrDay).localeCompare(b.monthOrDay),
        }, {
          title: lastYear,
          dataIndex: 'lastYearData',
          width: 150,
          // sorter: true,
          sorter: (a, b) => a.lastYearData - b.lastYearData,
        }, {

          title: currentYear,
          dataIndex: 'thatYearData',
          width: 150,
          // sorter: true,
          sorter: (a, b) => a.thatYearData - b.thatYearData,
        }, {
          title: '辐射总量同比',
          dataIndex: 'lightYearOnYear',
          width: 170,
          // sorter: true,
          sorter: (a, b) => a.lightYearOnYear - b.lightYearOnYear,
        }, {
          title: '发电量同比',
          dataIndex: 'powerYearOnYear',
          width: 150,
          // sorter: true,
          sorter: (a, b) => a.powerYearOnYear - b.powerYearOnYear,
        }];
        break;
      case 'powerEffective':
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 150,
          // sorter: true,
          sorter: (a, b) => (a.date).localeCompare(b.date),
        }, {
          title: '等效利用小时数',
          dataIndex: 'hours',
          width: 150,
          // sorter: true,
          sorter: (a, b) => a.hours - b.hours,
        }, {
          title: '辐射总量',
          dataIndex: 'light',
          width: 150,
          // sorter: true,
          sorter: (a, b) => a.light - b.light,
        }, {
          title: 'PR',
          dataIndex: 'pr',
          width: 150,
          // sorter: true,
          sorter: (a, b) => a.pr - b.pr,
        }
        ];
        break;
      case 'power':
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 150,
          // sorter: true,
          sorter: (a, b) => (a.date).localeCompare(b.date),
        }, {
          title: lastYear,
          dataIndex: 'lastYearData',
          width: 150,
          // sorter: true,
          sorter: (a, b) => a.lastYearData - b.lastYearData,
        }, {

          title: currentYear,
          dataIndex: 'thatYearData',
          width: 150,
          // sorter: true,
          sorter: (a, b) => a.thatYearData - b.thatYearData,
        }, {
          title: '同比',
          dataIndex: 'yearOnYear',
          width: 150,
          // sorter: true,
          sorter: (a, b) => a.yearOnYear - b.yearOnYear,
        }];
        break;
      default:
        columns = [];

    }
    return columns;

  }
  render() {
    const { tableType, currentYear, lastYear, SingleStationPlanRateData, SingleStationPvCompareData, SingleStationPowerEffectiveData, SingleStationLostPowerData } = this.props;
    //console.log(currentYear,lastYear);
    // columnsArray.map((e, i) => ({
    //   title: e.title,
    //   dataIndex: e.dataIndex,
    //   width: 150,
    //   sorter: true,
    // }))
    const columns = this.getColumnsArray(tableType, lastYear, currentYear)

    let data = []
    switch (tableType) {
      case 'plan':
        data = SingleStationPlanRateData && SingleStationPlanRateData.map((e, i) => ({ ...e, key: i, date: `${e.date}月` }))
        break;
      case 'power':
        data = SingleStationLostPowerData && SingleStationLostPowerData.map((e, i) => ({ ...e, key: i, date: `${e.date}月` }))
        break;
      case 'light':
        data = SingleStationPvCompareData && SingleStationPvCompareData.map((e, i) => ({ ...e, key: i, monthOrDay: `${e.monthOrDay}月` }))
        break;
      case 'powerEffective':
        data = SingleStationPowerEffectiveData && SingleStationPowerEffectiveData.map((e, i) => ({ ...e, key: i, date: `${e.date}月` }))
        break;

    }

    return (
      <div className={styles.TableGraphContainer} >
        <div className={styles.TableGraphContainerTitle}>
          <div>
            计划完成率最低排名
          </div>
          <div className={styles.unit}>
            发电量：万kWh
          </div>
        </div>
        <Table className={styles.tableList} columns={columns} dataSource={data} pagination={false} scroll={{ y: 204 }} size="small" onRow={(record) => { return { onMouseEnter: this.onMouseEnter } }} />
      </div>
    )
  }
}
export default (TableGraph)

