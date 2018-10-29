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


  getColumnsArray = (tableType, lastYear, currentYear) => {
    let columns = [];
    switch (tableType) {
      case 'limitPower':
        columns = [
          {
            title: '日期',
            dataIndex: 'date',
            key: 'time',
            sorter: true,
            width: 80,
            sorter: (a, b) => (a.date).localeCompare(b.date),
          }, {
            title: lastYear,
            children: [{
              title: '限电损失',
              dataIndex: 'lastyearLostPower',
              key: 'lastyearLostPower',
              sorter: true,
              width: 80,
              sorter: (a, b) => a.lastyearLostPower - b.lastyearLostPower,
              render: text => text ? text : '--'
            }, {
              title: '限电率',
              dataIndex: 'lastyearLostPowerRate',
              key: 'lastyearLostPowerRate',
              sorter: true,
              width: 80,
              sorter: (a, b) => a.lastyearLostPowerRate - b.lastyearLostPowerRate,
              render: text => text ? text : '--'
            }],
          }, {
            title: currentYear,
            children: [{
              title: '限电损失',
              dataIndex: 'thatYearLostPower',
              key: 'thatYearLostPower',
              sorter: true,
              width: 80,
              sorter: (a, b) => a.thatYearLostPower - b.thatYearLostPower,
              render: text => text ? text : '--'
            }, {
              title: '限电率',
              dataIndex: 'thatYearLostPowerRate',
              key: 'thatYearLostPowerRate',
              sorter: true,
              width: 80,
              sorter: (a, b) => a.thatYearLostPowerRate - b.thatYearLostPowerRate,
              render: text => text ? text : '--'
            }],
          }, {
            title: '限电率同比',
            dataIndex: 'lostPowerRateYearOnYear',
            key: 'lostPowerRateYearOnYear',
            sorter: true,
            width: 80,
            sorter: (a, b) => a.lostPowerRateYearOnYear - b.lostPowerRateYearOnYear,
            render: text => text ? text : '--'
          }];
        break;
    }
    return columns;
  }

  // dataSource
  getDataArray = (tableType, dataArray, dateType) => {
    let data = [];
    const columnData = dataArray && dataArray.map((e, i) => ({ ...e, key: i, date: `${e.date}${dateType === 'month' ? '月' : (dateType === 'day' ? '日' : '')}` }));
    switch (tableType) {
      case "limitPower": // 计划完成率最低排名
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
      case "limitPower": // 计划完成率最低排名
        unit = ['限电率同比升幅排名', '发电量：万kWh'];
        break;
      default:
        data = [];
        break;
    }
    return unit;
  }

  render() {
    const { tableType, title, unit, currentYear, dateType, lastYear, dataArray } = this.props;
    const columns = this.getColumnsArray(tableType, lastYear, currentYear);
    const dataSource = this.getDataArray(tableType, dataArray, dateType);
    const getTitle = this.getTitle(tableType);
    return (
      <div className={styles.TableGraphContainer} >
        <div className={styles.TableGraphContainerTitle}>
          <div>
            {title ? title : getTitle[0]}
          </div>
          <div className={styles.unit}>
            {unit ? unit : getTitle[1]}
          </div>
        </div>
        <Table
          className={styles.tableList}
          columns={columns}
          bordered
          dataSource={dataSource}
          pagination={false}
          scroll={{ y: 260 }}
          size="small" onRow={(record) => { return { onMouseEnter: this.onMouseEnter } }} />
      </div>
    )
  }
}



export default (TableGraph)