import React from 'react';
import styles from './styles.scss';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

/*
*  type
*  计划完成率最低排名  plan
*  光资源同比降幅排名  lightTB  日期 前一年 当年 辐射总量同比 发电量同比
   光资源同比降幅排名  lightAnotherTB  日期 前一年 当年 发电量同比
   光资源环比降幅排名  lightRatio 
*  发电量同比降幅排名   powerGenTB
*  发电量环比降幅排名   powerGenRatio
*  损失电量同比升幅排名 lostPowerTB
*  损失电量环比升幅排名  lostPowerRatio
*  可利用率最低排名     utilization
*  限电率环比升幅排名    powerLimitRatio
*  光资源分布排名      lightDistributed
   PR最低排名         pr
* 
*  光资源环比排名   lightDistributedTB

*
*  1 必填 类型 参见上面  tableType
*  2 必填 时间 dateType ／year/month/day
*  3 可选 表头的名字  title 默认 如果没有，会根据tableType 判断
*  4 可选 单位  unit  默认 如果没有，会根据tableType 判断
*  5 可选  查询日期当前年  currentYear 
*  6 可选  查询日期去年  lastYear
   7 必填 数据  dataArray 
   8 可选  bordered 是否有边框
* */

class TableGraph extends React.Component {
  static propTypes = {
    tableType: PropTypes.string,
    dateType: PropTypes.string,
    title: PropTypes.string,
    unit: PropTypes.string,
    currentYear: PropTypes.string,
    lastYear: PropTypes.string,
    dataArray: PropTypes.array,
  };
  constructor(props, context) {
    super(props, context);
  }
  onMouseEnter = (record) => {
    return (
      <div>xuanfukuang</div>
    );
  };

  //table排序
  getSort = (a, b, sortBy, variable) => {//  因为antd 本身有排序方式，所以需要反着来
    let result;
    sortBy === 'descend' ? result = -1 : result = 1;
    if (!a[variable]) {
      return 1 * result;
    }
    if (!b[variable]) {
      return -1 * result;
    }
    return a[variable] - b[variable];
  }


  getRadiationSort = (a, b, sortBy, variable) => {// 区间的排序 100-200 200-300 
    if (!a[variable].split('-')[1]) {
      return 1;
    }
    if (!b[variable].split('-')[1]) {
      return -1;
    }
    return a[variable].split('-')[0] - b[variable].split('-')[0];
  }


  getMomentType = (type) => {
    let result = '';
    switch (type) {
      case 'month': result = 'month'; break;
      case 'day': result = 'days'; break;
      case 'year': result = 'year'; break;
      default: result = '';
    }
    return result;
  }

  getTimeSort(a, b, variable) { // 日期的排序 年 月 日
    const { dateType } = this.props;
    return moment(a[variable], this.getMomentType(dateType)) - moment(b[variable], this.getMomentType(dateType)) > 0;
    // return `${a[variable]}`.split('月')[0].split('日')[0] - `${b[variable]}`.split('月')[0].split('日')[0]
  }



  //table列
  getColumnsArray = (tableType, lastYear, currentYear, column) => {
    let columns = [];
    switch (tableType) {
      case 'plan': // 计划完成率最低排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 120,
          sorter: (a, b) => this.getTimeSort(a, b, 'date'),
        }, {
          title: '计划发电量',
          dataIndex: 'planPower',
          width: 150,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'planPower'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '实际发电量',
          dataIndex: 'actualPower',
          width: 150,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'actualPower'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '计划完成率',
          dataIndex: 'per',
          width: 150,
          defaultSortOrder: 'ascend',
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'per'),
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'lightTB': // 光资源同比降幅排名
        columns = [{
          title: '日期',
          dataIndex: 'monthOrDay',
          width: 90,
          sorter: (a, b) => this.getTimeSort(a, b, 'monthOrDay'),
        }, {
          title: lastYear,
          dataIndex: 'lastYearData',
          width: 110,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'lastYearData'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: currentYear,
          dataIndex: 'thatYearData',
          width: 110,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'thatYearData'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '辐射总量同比',
          dataIndex: 'lightYearOnYear',
          width: 170,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'lightYearOnYear'),
          render: text => (text || text === 0) ? text + '%' : '--',
        }, {
          title: '发电量同比',
          dataIndex: 'powerYearOnYear',
          width: 150,
          defaultSortOrder: 'ascend',
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'powerYearOnYear'),
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'lightRatio': // 光资源环比降幅排名
        columns = [{
          title: '日期',
          dataIndex: 'year',
          sorter: (a, b) => this.getTimeSort(a, b, 'year'),
          width: 150,
        }, {
          title: '辐射总量',
          dataIndex: 'thatYearData',
          defaultSortOrder: 'descend',
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'thatYearData'),
          render: text => (text || text === 0) ? text : '--',
          width: 150,
        }, {
          title: '环比',
          dataIndex: 'ringRatio',
          width: 150,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'ringRatio'),
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'lightAnotherTB': // 光资源同比降幅排名(资源)
        columns = [{
          title: '日期',
          dataIndex: 'monthOrDay',
          width: 120,
          sorter: (a, b) => this.getTimeSort(a, b, 'monthOrDay'),
        }, {
          title: lastYear,
          dataIndex: 'lastYearData',
          width: 150,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'lastYearData'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: currentYear,
          dataIndex: 'thatYearData',
          width: 150,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'thatYearData'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '同比',
          dataIndex: 'lightYearOnYear',
          width: 150,
          defaultSortOrder: 'ascend',
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'lightYearOnYear'),
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'pr': //PR 最低排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 90,
          sorter: (a, b) => this.getTimeSort(a, b, 'date'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '等效利用小时数',
          dataIndex: 'hours',
          width: 170,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'hours'),
          render: text => (text || text === 0) ? text : '-',
        }, {
          title: '辐射总量',
          dataIndex: 'light',
          width: 150,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'light'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: 'PR',
          dataIndex: 'pr',
          width: 120,
          defaultSortOrder: 'ascend',
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'pr'),
          render: text => (text || text === 0) ? text + '%' : '--',
        },
        ];
        break;
      case 'lostPowerTB':
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 120,
          sorter: (a, b) => this.getTimeSort(a, b, 'date'),
        }, {
          title: lastYear,
          dataIndex: 'lastYearData',
          width: 150,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'lastYearData'),
          render: text => (text || text === 0) ? text : '--',
        }, {

          title: currentYear,
          dataIndex: 'thatYearData',
          width: 150,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'thatYearData'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '同比',
          dataIndex: 'yearOnYear',
          width: 150,
          defaultSortOrder: 'descend',
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'yearOnYear'),
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'lostPowerRatio': // 损失电量环比升幅排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 120,
          sorter: (a, b) => this.getTimeSort(a, b, 'date'),
        }, {
          title: '损失电量',
          dataIndex: 'thatYearData',
          width: 200,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'thatYearData'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '环比',
          dataIndex: 'ringRatio',
          width: 200,
          defaultSortOrder: 'descend',
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'ringRatio'),
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'powerGenTB': // 发电量同比降幅排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 120,
          sorter: (a, b) => this.getTimeSort(a, b, 'date'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: lastYear,
          dataIndex: 'lastYearData',
          width: 150,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'lastYearData'),
          render: text => (text || text === 0) ? text : '--',
        }, {

          title: currentYear,
          dataIndex: 'thatYearData',
          width: 150,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'thatYearData'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '同比',
          dataIndex: 'yearOnYear',
          width: 150,
          defaultSortOrder: 'ascend',
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'yearOnYear'),
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'powerGenRatio': // 发电量环比降幅排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 120,
          sorter: (a, b) => this.getTimeSort(a, b, 'date'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '发电量',
          dataIndex: 'thatYearData',
          width: 200,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'thatYearData'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '环比',
          dataIndex: 'ringRatio',
          width: 200,
          defaultSortOrder: 'ascend',
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'ringRatio'),
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'utilization': // 可利用率最低排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 120,
          sorter: (a, b) => this.getTimeSort(a, b, 'date'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '电站可利用率',
          dataIndex: 'stationUtilization',
          width: 150,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'stationUtilization'),
          render: text => (text || text === 0) ? text + '%' : '--',
        }, {
          title: '发电系统可利用率',
          dataIndex: 'deviceUtilization',
          defaultSortOrder: 'ascend',
          width: 150,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'deviceUtilization'),
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'powerLimitRatio': // 限电率环比升幅排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 120,
          sorter: (a, b) => this.getTimeSort(a, b, 'date'),
        }, {
          title: '限电损失',
          dataIndex: 'limitPower',
          width: 150,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'limitPower'),
          render: text => (text || text === 0) ? text : '--',
        },
        {
          title: '限电率',
          dataIndex: 'limitPowerRate',
          width: 150,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'limitPowerRate'),
          render: text => (text || text === 0) ? text + '%' : '--',
        }, {
          title: '限电率环比',
          dataIndex: 'ringRatio',
          width: 150,
          defaultSortOrder: 'descend',
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'ringRatio'),
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'lightDistributed': // 光资源分布排名
        columns = [{
          title: '瞬时辐射区间',
          dataIndex: 'radiationInterval',
          width: 200,
          defaultSortOrder: 'ascend',
          sorter: (a, b, sortBy) => this.getRadiationSort(a, b, sortBy, 'radiationInterval'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '辐射总量',
          dataIndex: 'radiationSum',
          width: 200,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'radiationSum'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '占比',
          dataIndex: 'ration',
          width: 200,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'ration'),
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'lightDistributedTB': // 光资源同比降幅排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: 150,
          sorter: (a, b) => this.getTimeSort(a, b, 'date'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: lastYear,
          dataIndex: 'lastYearData',
          width: 150,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'lastYearData'),
          render: text => (text || text === 0) ? text : '--',
        }, {

          title: currentYear,
          dataIndex: 'thatYearData',
          width: 150,
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'thatYearData'),
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '同比',
          dataIndex: 'yearOnYear',
          width: 150,
          defaultSortOrder: 'ascend',
          sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'yearOnYear'),
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      default:
        columns = [];
    }
    return columns;
  };

  // dataSource
  getDataArray = (tableType, dataArray, dateType) => {
    let data = [];
    const columnData = dataArray && dataArray.map((e, i) => ({ ...e, key: i, date: `${e.date}${dateType === 'month' ? '月' : (dateType === 'day' ? '日' : '')}` }));
    switch (tableType) {
      case 'lightAnotherTB': // 光资源同比降幅排名(  四列)
      case 'lightTB': // 光资源同比降幅排名
        data = dataArray && dataArray.map((e, i) => ({ ...e, key: i, monthOrDay: `${e.monthOrDay}${dateType === 'month' ? '月' : (dateType === 'day' ? '日' : '')}` }));
        break;
      case 'plan': // 计划完成率最低排名
      case 'lightRatio': //光资源环比
      case 'pr': //PR 最低排名
      case 'powerGenTB': // 发电量同比降幅排名
      case 'powerGenRatio': // 发电量环比降幅排名
      case 'lostPowerTB': // 损失电量同比降幅排名
      case 'lostPowerRatio': // 损失电量环比降幅排名
      case 'utilization': // 可利用率最低排名
      case 'powerLimitRatio': // 限电率环比升幅排名
      case 'lightDistributed': // 光资源分布排名
      case 'lightDistributedTB': // 光资源环比降幅排名
        data = columnData;
        break;
      default:
        data = [];
        break;
    }
    return data;
  };


  // title 与 unit
  getTitle = (tableType) => {
    let unit = [];
    switch (tableType) {
      case 'plan': // 计划完成率最低排名
        unit = ['计划完成率最低排名', '发电量：万kWh'];
        break;
      case 'lightTB': // 光资源同比降幅排名
        unit = ['光资源同比降幅排名', '辐射总量：MJ/㎡'];
        break;
      case 'lightRatio': // 光资源同比降幅排名
        unit = ['光资源环比降幅排名', '辐射总量：MJ/㎡'];
        break;
      case 'pr': //PR 最低排名
        unit = ['PR最低排名', '等效利用小时数：h / 辐射总量：MJ/㎡'];
        break;
      case 'powerGenTB': // 发电量同比降幅排名
        unit = ['发电量同比降幅排名', '发电量：万kWh'];
        break;
      case 'powerGenRatio': // 发电量环比
        unit = ['损失电量环比降幅排名', '损失电量：万kWh'];
        break;
      case 'lostPowerTB':
        unit = ['损失电量同比升幅排名', '损失电量：万kWh'];
        break;
      case 'lostPowerRatio': // 损失电量环比
        unit = ['损失电量环比升幅排名', '损失电量：万kWh'];
        break;
      case 'utilization': // 可利用率最低排名
        unit = ['可利用率最低排名', ''];
        break;
      case 'powerLimitRatio': // 限电率环比升幅排名
        unit = ['限电率环比升幅排名', '限电损失：万kWh'];
        break;
      case 'lightDistributed': // 光资源分布排名
        unit = ['光资源分布排名', '瞬时辐射区间：w/㎡，辐射总量：MJ/㎡'];
        break;
      case 'lightDistributedTB': // 光资源环比降幅排名
        unit = ['光资源同比降幅排名', '瞬时辐射区间：w/㎡，辐射总量：MJ/㎡'];
        break;
      case 'lightAnotherTB': // 光资源同比降幅排名
        unit = ['光资源同比降幅排名', '辐射总量：MJ/㎡'];
        break;
      default:
        unit = [];
        break;
    }
    return unit;
  }

  render() {
    const { tableType, title, unit, currentYear, dateType, lastYear, dataArray, bordered, theme } = this.props;
    let columns = '';
    columns = this.getColumnsArray(tableType, lastYear, currentYear);
    const dataSource = this.getDataArray(tableType, dataArray, dateType);
    const getTitle = this.getTitle(tableType);
    return (
      <div className={`${styles.TableGraphContainer} ${styles[theme]}`} >
        <div className={styles.TableGraphContainerTitle}>
          <div className={styles.title}>
            {title ? title : getTitle[0]}
          </div>
          <div className={styles.unit}>
            {unit ? unit : getTitle[1]}
          </div>
        </div>
        <Table
          className={styles.tableList}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ y: 204 }}
          bordered={bordered}
          size="small"
          onRow={(record) => { return { onMouseEnter: this.onMouseEnter }; }} />
      </div>
    );
  }
}
export default (TableGraph);

