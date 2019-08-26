import React from 'react';
import styles from './styles.scss';
import { Table } from 'antd';

class TableGraph extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  onMouseEnter = (record) => {

    return (
      <div>xuanfukuang</div>
    );
  }

  //table排序
  getSort(a, b, sortBy, variable) {
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

  getColumnsArray = (tableType, lastYear, currentYear) => {
    let columns = [];
    switch (tableType) {
      case 'limitPower':
        columns = [
          {
            title: '日期',
            dataIndex: 'date',
            key: 'time',
            width: 70,
            sorter: (a, b) => { return a.date.split('月')[0].split('日')[0] - b.date.split('月')[0].split('日')[0]; },
          }, {
            title: lastYear,
            children: [{
              title: '限电损失',
              dataIndex: 'lastyearLostPower',
              key: 'lastyearLostPower',
              width: 90,
              sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'lastyearLostPower'),
              render: text => text ? text : '--',
            }, {
              title: '限电率',
              dataIndex: 'lastyearLostPowerRate',
              key: 'lastyearLostPowerRate',
              width: 80,
              sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'lastyearLostPowerRate'),
              render: text => (text || text === 0) ? text + '%' : '--',
            }],
          }, {
            title: currentYear,
            children: [{
              title: '限电损失',
              dataIndex: 'thatYearLostPower',
              key: 'thatYearLostPower',
              width: 90,
              sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'thatYearLostPower'),
              render: text => text ? text : '--',
            }, {
              title: '限电率',
              dataIndex: 'thatYearLostPowerRate',
              key: 'thatYearLostPowerRate',
              width: 80,
              sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'thatYearLostPowerRate'),
              render: text => (text || text === 0) ? text + '%' : '--',
            }],
          }, {
            title: '限电率同比',
            dataIndex: 'lostPowerRateYearOnYear',
            key: 'lostPowerRateYearOnYear',
            width: 105,
            defaultSortOrder: 'descend',
            sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, 'lostPowerRateYearOnYear'),
            render: text => (text || text === 0) ? text + '%' : '--',
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
      case 'limitPower': // 计划完成率最低排名
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
      case 'limitPower': // 计划完成率最低排名
        unit = ['限电率同比升幅排名', '发电量：万kWh'];
        break;
      default:
        data = [];
        break;
    }
    return unit;
  }

  render() {
    const { tableType, title, unit, currentYear, dateType, lastYear, dataArray, theme = 'light' } = this.props;
    const columns = this.getColumnsArray(tableType, lastYear, currentYear);
    const dataSource = this.getDataArray(tableType, dataArray, dateType);
    const getTitle = this.getTitle(tableType);
    return (
      <div className={`${styles.TableGraphContainer} ${styles[theme]}`} >
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
          scroll={{ y: 125 }}
          size="small"
          onRow={(record) => { return { onMouseEnter: this.onMouseEnter }; }} />
      </div>
    );
  }
}



export default (TableGraph);
