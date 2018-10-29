import React from "react";
import styles from './styles.scss';
import { Table } from 'antd';

/*
*  type
*  计划完成率最低排名  plan
*  光资源同比降幅排名  lightTB
*  PR 最低排名  pr
*  损失电量同比降幅排名 lostPowerTB
*  发电量同比降幅排名   powerGenTB
*  发电量环比降幅排名   powerGenRatio
*  损失电量环比降幅排名  lostPowerRatio
*  可利用率最低排名     utilization
*  限电率环比升幅排名    powerLimitRatio
*  光资源分布排名      lightDistributed
*
*
*  1 必填 类型 参见上面  tableType
*  2 必填 时间 dateType ／year/month/day
*  3 可选 表头的名字  title  默认 计划完成率最低排名
*  4 可选 单位  unit  默认 发电量：万kWh
*  5 可选  当前年 currentYear
*  6 可选  去年  lastYear
* */

class TableGraph extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  onMouseEnter = (record) => {
    return (
      <div>xuanfukuang</div>
    )
  };
  //table排序

  //table列
  getColumnsArray=(tableType,lastYear,currentYear)=> {
    let columns = [];
    switch (tableType) {
      case "plan": // 计划完成率最低排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 150,
          sorter: (a, b) => (a.date).localeCompare(b.date),
        }, {
          title: '计划发电量',
          dataIndex: 'planPower',
          // width: 150,
          sorter: (a, b) => a.planPower - b.planPower,
        }, {
          title: '实际发电量',
          dataIndex: 'actualPower',
          // width: 150,
          sorter: (a, b) => a.actualPower - b.actualPower,
        }, {
          title: '计划完成率',
          dataIndex: 'planRate',
          // width: 150,
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.per - b.per,
        }];
        break;
      case "lightTB": // 光资源同比降幅排名
        columns = [{
          title: '日期',
          dataIndex: 'monthOrDay',
          width: 120,
          sorter: (a, b) => (a.monthOrDay).localeCompare(b.monthOrDay),
        }, {
          title: lastYear,
          dataIndex: 'lastYearData',
          width: 150,
          sorter: (a, b) => a.lastYearData - b.lastYearData,
        }, {
          title: currentYear,
          dataIndex: 'thatYearData',
          width: 150,
          sorter: (a, b) => a.thatYearData - b.thatYearData,
        }, {
          title: '辐射总量同比',
          dataIndex: 'lightYearOnYear',
          width: 170,
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.lightYearOnYear - b.lightYearOnYear,
        }, {
          title: '发电量同比',
          dataIndex: 'powerYearOnYear',
          width: 150,
          sorter: (a, b) => a.powerYearOnYear - b.powerYearOnYear,
        }];
        break;
      case "pr": //PR 最低排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 150,
          sorter: (a, b) => (a.date).localeCompare(b.date),
        }, {
          title: '等效利用小时数',
          dataIndex: 'hours',
          width: 150,
          sorter: (a, b) => a.hours - b.hours,
        }, {
          title: '辐射总量',
          dataIndex: 'light',
          width: 150,
          sorter: (a, b) => a.light - b.light,
        }, {
          title: 'PR',
          dataIndex: 'pr',
          width: 150,
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.pr - b.pr,
        }
        ];
        break;
      case "lostPowerTB":
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 150,
          sorter: (a, b) => (a.date).localeCompare(b.date),
        }, {
          title: lastYear,
          dataIndex: 'lastYearData',
          // width: 150,
          sorter: (a, b) => a.lastYearData - b.lastYearData,
        }, {

          title: currentYear,
          dataIndex: 'thatYearData',
          // width: 150,
          sorter: (a, b) => a.thatYearData - b.thatYearData,
        }, {
          title: '同比',
          dataIndex: 'yearOnYear',
          // width: 150,
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.yearOnYear - b.yearOnYear,
        }];
        break;
      case "powerGenTB": // 发电量同比降幅排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 200,
          sorter: (a, b) => (a.date) - (b.date),
        }, {
          title: '发电量',
          dataIndex: 'thatYearData',
          width: 200,
          sorter: (a, b) => a.thatYearData - b.thatYearData,
        }, {
          title: '环比',
          dataIndex: 'ringRatio',
          width: 200,
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.ringRatio - b.ringRatio,
        }];
        break;
      case "powerGenRatio": // 发电量环比降幅排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 200,
          sorter: (a, b) => (a.date) - (b.date),
        }, {
          title: '发电量',
          dataIndex: 'thatYearData',
          width: 200,
          sorter: (a, b) => a.thatYearData - b.thatYearData,
        }, {
          title: '环比',
          dataIndex: 'ringRatio',
          width: 200,
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.ringRatio - b.ringRatio,
        }];
        break;
      case "lostPowerRatio": // 损失电量环比降幅排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 200,
          sorter: (a, b) => (a.date) - (b.date),
        }, {
          title: '发电量',
          dataIndex: 'thatYearData',
          width: 200,
          sorter: (a, b) => a.thatYearData - b.thatYearData,
        }, {
          title: '环比',
          dataIndex: 'ringRatio',
          width: 200,
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.ringRatio - b.ringRatio,
        }];
        break;
      case "utilization": // 可利用率最低排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          // width: 150,
          sorter: (a, b) => (a.date).localeCompare(b.date),
        }, {
          title:'电站可利用率' ,
          dataIndex: 'stationUtilization',
          // width: 150,
          sorter: (a, b) => a.stationUtilization - b.stationUtilization,
        }, {
          title: '发电系统可利用率',
          dataIndex: 'deviceUtilization',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.deviceUtilization - b.deviceUtilization,
        }];
        break;
      case "powerLimitRatio": // 限电率环比升幅排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 120,
          sorter: (a, b) => (a.date) - (b.date),
        }, {
          title: '限电损失',
          dataIndex: 'limitPower',
          // width: 200,
          sorter: (a, b) => a.limitPower - b.limitPower,
        },
          {
          title: '限电率',
          dataIndex: 'limitPowerRate',
          // width: 200,
          sorter: (a, b) => a.limitPowerRate - b.limitPowerRate,
        }, {
          title: '限电率环比',
          dataIndex: 'ringRatio',
          // width: 200,
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.ringRatio - b.ringRatio,
        }];
        break;
      case "lightDistributed": // 光资源分布排名
        columns = [{
          title: '瞬时辐射区间',
          dataIndex: 'date',
          width: 200,
          defaultSortOrder: 'descend',
          sorter: (a, b) => (a.date) - (b.date),
        }, {
          title: '辐射总量',
          dataIndex: 'thatYearData',
          width: 200,
          sorter: (a, b) => a.thatYearData - b.thatYearData,
        }, {
          title: '占比',
          dataIndex: 'ringRatio',
          width: 200,
          sorter: (a, b) => a.ringRatio - b.ringRatio,
        }];
        break;
      default:
        columns = [];
        return columns;
    }
  };

  // dataSource
  getDataArray=(tableType,dataArray,dateType)=>{
    let data = [];
    const columnData=dataArray && dataArray.map((e, i) => ({ ...e, key: i, date: `${e.date}${dateType === 'month' ? '月' : (dateType === 'day' ? '日' : '')}` }));
    switch (tableType) {
      case "plan": // 计划完成率最低排名
        data = columnData;
        break;
      case "lightTB": // 光资源同比降幅排名
        data =dataArray && dataArray.map((e, i) => ({ ...e, key: i, monthOrDay: `${e.monthOrDay}${dateType === 'month' ? '月' : (dateType === 'day' ? '日' : '')}` }));
        break;
      case "pr": //PR 最低排名
        data = columnData;
        break;
      case "lostPowerTB":
        data = columnData;
        break;
      case "powerGenTB": // 发电量同比降幅排名
        data = columnData;
        break;
      case "powerGenRatio": // 发电量环比降幅排名
        data = columnData;
        break;
      case "lostPowerRatio": // 损失电量环比降幅排名
        data = columnData;
        break;
      case "utilization": // 可利用率最低排名
        data = columnData;
        break;
      case "powerLimitRatio": // 限电率环比升幅排名
        data = columnData;
        break;
      case "lightDistributed": // 光资源分布排名
        data = columnData;
        break;
      default:
        data = [];
        return data;
    }
  };

  render(){
    const { tableType, title,unit,currentYear, dateType, lastYear } = this.props;
    const columns = this.getColumnsArray(tableType, lastYear, currentYear);
    const dataSource=this.getDataArray(tableType,tableType,dateType);
    return (
      <div className={styles.TableGraphContainer} >
        <div className={styles.TableGraphContainerTitle}>
          <div>
            {title ? title :'计划完成率最低排名'}
          </div>
          <div className={styles.unit}>
            {unit ? unit :'发电量：万kWh'}
          </div>
        </div>
        <Table
          className={styles.tableList}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ y: 204 }}
          size="small" 
          onRow={(record) => { return { onMouseEnter: this.onMouseEnter } }} />
      </div>
    )
  }
}
export default (TableGraph)

