import React from 'react';
import styles from './styles.scss';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import CneTable from '../../../../Common/Power/CneTable';

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
    className: PropTypes.string,
    sortMethod: PropTypes.string,
    sortField: PropTypes.string,
    column: PropTypes.array,
  };

  constructor(props, context) {
    super(props, context);
    const { sortMethod = 'date', sortField = 'descend' } = props;
    this.state = {
      sortMethod: sortMethod,
      sortField: sortField,
    };
  }

  onMouseEnter = (record) => {
    return (
      <div>xuanfukuang</div>
    );
  };

  tableChange = (pagination, filter, sorter) => {
    const { field, order } = sorter || {};
    const { sortMethod, sortField } = this.state;
    let newSortField = sortField, newSortMethod = 'ascend';
    if (!field || field === sortField) {
      newSortMethod = sortMethod === 'descend' ? 'ascend' : 'descend';
    } else {
      newSortField = field;
    }

    this.setState({
      sortMethod: newSortMethod,
      sortField: newSortField,
    });
  }

  //table列
  getColumnsArray = (tableType, lastYear, currentYear, column = []) => {
    if (column.length > 0) { // 外部传入的column
      return column;
    }
    let columns = [];
    switch (tableType) {
      case 'plan': // 计划完成率最低排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: '25%',
          textAlign: 'center',
          sorter: true,
        }, {
          title: '计划发电量',
          dataIndex: 'planPower',
          width: '25%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '实际发电量',
          dataIndex: 'actualPower',
          width: '25%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '计划完成率',
          dataIndex: 'per',
          width: '25%',
          defaultSortOrder: 'ascend',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'lightTB': // 光资源同比降幅排名
        columns = [{
          title: '日期',
          dataIndex: 'monthOrDay',
          width: '17%',
          textAlign: 'center',
          sorter: true,
        }, {
          title: lastYear,
          dataIndex: 'lastYearData',
          width: '17%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: currentYear,
          dataIndex: 'thatYearData',
          width: '17%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '辐射总量同比',
          dataIndex: 'lightYearOnYear',
          width: '25%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text + '%' : '--',
        }, {
          title: '发电量同比',
          dataIndex: 'powerYearOnYear',
          width: '22%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'lightRatio': // 光资源环比降幅排名
        columns = [{
          title: '日期',
          dataIndex: 'year',
          textAlign: 'center',
          sorter: true,
          width: '33%',
        }, {
          title: '辐射总量',
          dataIndex: 'thatYearData',
          defaultSortOrder: 'descend',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
          width: '33%',
        }, {
          title: '环比',
          dataIndex: 'ringRatio',
          width: '33%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'lightAnotherTB': // 光资源同比降幅排名(资源)
        columns = [{
          title: '日期',
          dataIndex: 'monthOrDay',
          width: '25%',
          textAlign: 'center',
          sorter: true,
        }, {
          title: lastYear,
          dataIndex: 'lastYearData',
          width: '25%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: currentYear,
          dataIndex: 'thatYearData',
          width: '25%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '同比',
          dataIndex: 'lightYearOnYear',
          width: '25%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'pr': //PR 最低排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: '25%',
          textAlign: 'center',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '等效利用小时数',
          dataIndex: 'hours',
          width: '29%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '-',
        }, {
          title: '辐射总量',
          dataIndex: 'light',
          width: '22%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: 'PR',
          dataIndex: 'pr',
          width: '22%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text + '%' : '--',
        },
        ];
        break;
      case 'lostPowerTB':
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: '25%',
          textAlign: 'center',
          sorter: true,
        }, {
          title: lastYear,
          dataIndex: 'lastYearData',
          width: '25%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {

          title: currentYear,
          dataIndex: 'thatYearData',
          width: '25%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '同比',
          dataIndex: 'yearOnYear',
          width: '25%',
          textAlign: 'right',
          defaultSortOrder: 'descend',
          sorter: true,
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'lostPowerRatio': // 损失电量环比升幅排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: '33%',
          textAlign: 'center',
          sorter: true,
        }, {
          title: '损失电量',
          dataIndex: 'thatYearData',
          width: '33%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '环比',
          dataIndex: 'ringRatio',
          width: '33%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'powerGenTB': // 发电量同比降幅排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: '25%',
          textAlign: 'center',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: lastYear,
          dataIndex: 'lastYearData',
          width: '25%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {

          title: currentYear,
          dataIndex: 'thatYearData',
          width: '25%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '同比',
          dataIndex: 'yearOnYear',
          width: '25%',
          textAlign: 'right',
          defaultSortOrder: 'ascend',
          sorter: true,
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'powerGenRatio': // 发电量环比降幅排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: '33%',
          textAlign: 'center',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '发电量',
          dataIndex: 'thatYearData',
          width: '33%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '环比',
          dataIndex: 'ringRatio',
          width: '33%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'utilization': // 可利用率最低排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: '33%',
          textAlign: 'center',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '电站可利用率',
          dataIndex: 'stationUtilization',
          width: '33%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text + '%' : '--',
        }, {
          title: '发电系统可利用率',
          dataIndex: 'deviceUtilization',
          width: '33%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'powerLimitRatio': // 限电率环比升幅排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: '25%',
          textAlign: 'center',
          sorter: true,
        }, {
          title: '限电损失',
          dataIndex: 'limitPower',
          width: '25%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        },
        {
          title: '限电率',
          dataIndex: 'limitPowerRate',
          width: '25%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text + '%' : '--',
        }, {
          title: '限电率环比',
          dataIndex: 'ringRatio',
          width: '25%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'lightDistributed': // 光资源分布排名
        columns = [{
          title: '瞬时辐射区间',
          dataIndex: 'radiationInterval',
          width: '33%',
          textAlign: 'right',
          defaultSortOrder: 'ascend',
          sorter: true,
          render: (text, record) => {
            return (text || text === 0) ? text : '--';
          },
        }, {
          title: '辐射总量',
          dataIndex: 'radiationSum',
          width: '33%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '占比',
          dataIndex: 'ration',
          width: '33%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'lightDistributedTB': // 光资源同比降幅排名
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: '25%',
          textAlign: 'center',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: lastYear,
          dataIndex: 'lastYearData',
          width: '25%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: currentYear,
          dataIndex: 'thatYearData',
          width: '25%',
          textAlign: 'right',
          sorter: true,
          render: text => (text || text === 0) ? text : '--',
        }, {
          title: '同比',
          dataIndex: 'yearOnYear',
          width: '25%',
          textAlign: 'right',
          defaultSortOrder: 'ascend',
          sorter: true,
          render: text => (text || text === 0) ? text + '%' : '--',
        }];
        break;
      case 'limitPower':
        columns = [{
          title: '日期',
          dataIndex: 'date',
          width: '13%',
          textAlign: 'center',
          sorter: true,
        }, {
          title: lastYear,
          children: [{
            title: '限电损失',
            dataIndex: 'lastyearLostPower',
            width: '18%',
            className: styles.rightText,
            render: text => text ? text : '--',
            sorter: true,
          }, {
            title: '限电率',
            dataIndex: 'lastyearLostPowerRate',
            width: '15%',
            className: styles.rightText,
            render: text => (text || text === 0) ? text + '%' : '--',
            sorter: true,
          }],
        }, {
          title: currentYear,
          children: [{
            title: '限电损失',
            dataIndex: 'thatYearLostPower',
            width: '18%',
            className: styles.rightText,
            render: text => text ? text : '--',
            sorter: true,
          }, {
            title: '限电率',
            dataIndex: 'thatYearLostPowerRate',
            width: '15%',
            className: styles.rightText,
            render: text => (text || text === 0) ? text + '%' : '--',
            sorter: true,
          }],
        }, {
          title: '限电率同比',
          dataIndex: 'lostPowerRateYearOnYear',
          width: '22%',
          textAlign: 'right',
          render: text => (text || text === 0) ? text + '%' : '--',
          sorter: true,
        }];
        break;
      default:
        columns = [];
    }
    return columns;
  };

  // dataSource
  getDataArray = (tableType, dataArray = [], dateType) => {
    const { sortMethod, sortField } = this.state;
    const sortType = sortMethod === 'descend' ? -1 : 1;
    dataArray.sort((a, b) => {
      if (sortField === 'radiationInterval') {
        return sortType * (a['key'] - b['key']);
      }
      return sortType * (a[sortField] - b[sortField]);
    });
    return dataArray.map((e, i) => ({
      ...e,
      key: i,
      [e.date && 'date' || 'monthOrDay']: `${e.date || e.monthOrDay}${{ 'month': '月', 'day': '日', 'year': '' }[dateType]}`,
    }));

  };

  getTitle = {
    'plan': { title: '计划完成率最低排名', unit: '发电量:万kWh' },
    'lightTB': { title: '光资源同比降幅排名', unit: '辐射总量:MJ/㎡' },
    'lightRatio': { title: '光资源环比降幅排名', unit: '辐射总量:MJ/㎡' },
    'pr': { title: 'PR最低排名', unit: '等效利用小时数:h / 辐射总量:MJ/㎡' },
    'powerGenTB': { title: '发电量同比降幅排名', unit: '发电量:万kWh' },
    'powerGenRatio': { title: '损失电量环比降幅排名', unit: '损失电量:万kWh' },
    'lostPowerTB': { title: '损失电量同比升幅排名', unit: '损失电量:万kWh' },
    'lostPowerRatio': { title: '损失电量环比升幅排名', unit: '损失电量：万kWh' },
    'utilization': { title: '可利用率最低排名', unit: '' },
    'powerLimitRatio': { title: '限电率环比升幅排名', unit: '限电损失：万kWh' },
    'lightDistributed': { title: '光资源分布排名', unit: '瞬时辐射区间：w/㎡，辐射总量：MJ/㎡' },
    'lightDistributedTB': { title: '光资源同比降幅排名', unit: '瞬时辐射区间：w/㎡，辐射总量：MJ/㎡' },
    'lightAnotherTB': { title: '光资源同比降幅排名', unit: '辐射总量：MJ/㎡' },
    'limitPower': { title: '限电率同比升幅排名', unit: '发电量:万kWh' },
  }

  render() {
    const { tableType, currentYear, dateType, lastYear, dataArray, bordered, theme, className, title, unit, column = [], scroll } = this.props;
    let columns = '';
    columns = this.getColumnsArray(tableType, lastYear, currentYear, column);
    const dataSource = this.getDataArray(tableType, dataArray, dateType, column);
    const temp = this.getTitle[tableType] || {};
    const { sortMethod, sortField } = this.state;
    return (
      <div className={`${styles.TableGraphContainer} ${styles[theme]} ${className}`} >
        <div className={styles.TableGraphContainerTitle}>
          <div className={styles.title}> {title || temp.title}  </div>
          <div className={styles.unit}>  {unit || temp.unit}  </div>
        </div>
        <CneTable
          className={styles.tableList}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={scroll && scroll || { y: 206 }}
          bordered={bordered}
          onChange={this.tableChange}
          sortField={sortField}
          sortMethod={sortMethod}
          onRow={(record) => { return { onMouseEnter: this.onMouseEnter }; }} />
      </div>
    );
  }
}
export default (TableGraph);

