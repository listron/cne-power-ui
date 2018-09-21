import React from "react";
import PropTypes from "prop-types";
import styles from './windStation.scss';
import CommonPagination from '../../../../Common/CommonPagination';
import { Progress, Table } from "antd";

class WindStationList extends React.Component {
  static propTypes = {
    stationDataList: PropTypes.array,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
    onPaginationChange: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      sortName: 'stationName',
      descend: false,
    }
  }

  ontableSort = (pagination, filters, sorter) => {
    this.setState({
      sortName: sorter.field,
      descend: sorter.order === 'descend'
    })
  }
  initColumn = () => {
    const columns = [
      {
        title: "电站名称",
        dataIndex: "stationName",
        onFilter: (value, record) => record.stationName.indexOf(value) === 0,
        sorter: true,
        // (a, b) => a.stationName.localeCompare(b.stationName),
        render: (value, record, index) => {
          return {
            children: (
              <a href={`#/monitor/singleStation/${record.key}`}>
                <div title={record.stationName} className={styles.stationName}>{record.stationName}</div>
              </a>
            )
          }
        }
      },
      {
        title: "所在省",
        dataIndex: "stationrovince",
        defaultSortOrder: "descend",
        sorter: true,
        // (a, b) => a.stationrovince.localeCompare(b.stationrovince),
        render: (value, record, index) => {
          return {
            children: (
              <div className={styles.stationrovince}>{record.stationrovince}</div>
            )
          }
        }
      },
      {
        title: "实时功率(MW)",

        dataIndex: "stationPower",
        defaultSortOrder: "descend",
        sorter: true,
        // (a, b) => a.stationPower - b.stationPower,
        render: (value, record, index) => {
          return {
            children: (
              <div>
                <div className={styles.progressInfo}>
                  <div className={styles.progressData}>
                    <div className={styles.stationValue}>
                      <div>{record.stationPower}</div>
                      <div>{record.stationCapacity}</div>
                    </div>
                    <Progress strokeWidth={3} percent={record.stationPower / record.stationCapacity * 100} showInfo={false} />
                  </div>
                </div>
              </div>
            ),
            props: {
              colSpan: 2
            }
          };
        }
      },
      {
        title: "装机容量(MW)",
        dataIndex: "stationCapacity",
        defaultSortOrder: "descend",
        sorter: true,
        // (a, b) => a.stationCapacity - b.stationCapacity,
        render: (value, columns, index) => {
          const obj = {
            children: null,
            props: {
              colSpan: 0
            }
          };
          return obj;
        }
      },
      {
        title: "平均风速(m/s)",
        dataIndex: "windSpeed",
        defaultSortOrder: "descend",
        sorter: true,
        // (a, b) => a.windSpeed - b.windSpeed
      },
      {
        title: "日发电量(万kWh)",
        dataIndex: "dayOutput",
        defaultSortOrder: "descend",
        sorter: true,
        // (a, b) => a.dayOutput - b.dayOutput
      },
      {
        title: "月累计发电量(万kWh)",
        dataIndex: "monthOutput",
        defaultSortOrder: "descend",
        sorter: true,
        // (a, b) => a.monthOutput - b.monthOutput
      },
      {
        title: "年累计发电量(万kWh)",
        dataIndex: "yearOutput",
        defaultSortOrder: "descend",
        sorter: true,
        // (a, b) => a.yearOutput - b.yearOutput,
        render: (value, record, index) => {
          return {
            children: (
              <div >
                <div className={styles.progressInfo}>
                  <div className={styles.progressData}>
                    <div className={styles.stationValue}>
                      <div>{record.yearOutput}</div>
                      <div>{record.planOutput}</div>
                    </div>
                    <Progress strokeWidth={3} percent={record.yearOutput / record.planOutput * 100} showInfo={false} />
                  </div>
                </div>
              </div>
            ),
            props: {
              colSpan: 2
            }
          };
        }
      },
      {
        title: "计划发电量(万kWh)",
        dataIndex: "planOutput",
        defaultSortOrder: "descend",
        sorter: true,
        // (a, b) => a.planOutput - b.planOutput,
        render: (value, columns, index) => {
          const obj = {
            children: null,
            props: {
              colSpan: 0
            }
          };
          return obj;
        }
      },
      {
        title: "装机(台)",
        dataIndex: "equipmentNum",
        defaultSortOrder: "descend",
        sorter: true,
        // (a, b) => a.equipmentNum - b.equipmentNum
      },
      {
        title: "告警(个)",
        dataIndex: "alarmNum",
        defaultSortOrder: "descend",
        sorter: true,
        // (a, b) => a.alarmNum - b.alarmNum
      },
      {
        title: "状态",
        dataIndex: "currentStation",
        defaultSortOrder: "descend",
        sorter: true,
        // (a, b) => a.currentStation - b.currentStation,
        render: (value, record, index) => {
          return {
            children: (
              <div className={styles.currentStation}>
                {record.currentStation === '500' ? <div className={styles.dataInterruptionColor} ></div> :
                  record.currentStation === '900' ? <div className={styles.unconnectionColor}></div> :
                    record.currentStation === '400' ? <div className={styles.normalColor}></div> : ''
                }
              </div>
            )
          }
        }
      }
    ];
    return columns
  }
  createTableSource = (data) => { // 数据源的排序，翻页
    const { sortName, descend } = this.state;
    const tableSource = [...data].map((e, i) => ({
      ...e,
      key: i,
    })).sort((a, b) => { // 手动排序
      const sortType = descend ? -1 : 1;
      const arraySort = ['stationrovince', 'stationName'];
      const arrayNumSort = ['stationPower', 'stationCapacity', 'windSpeed', 'dayOutput', 'monthOutput', 'yearOutput', 'planOutput', 'equipmentNum', 'alarmNum', 'currentStation'];
      if (arrayNumSort.includes(sortName)) {
        return sortType * (a[sortName] - b[sortName]);
      } else if (arraySort.includes(sortName)) {
        a[sortName] = a[sortName] ? a[sortName] : '';
        return sortType * (a[sortName].localeCompare(b[sortName]));
      }
    })
    // const { inverterList } = this.props;
    // const initDeviceList = inverterList.deviceList || [];
    // const totalNum = initDeviceList.length || 0;
    // const maxPage = Math.ceil(totalNum / pageSize);
    // if(totalNum === 0){ // 总数为0时，展示0页
    //   currentPage = 0;
    // }else if(maxPage < currentPage){ // 当前页已超出
    //   currentPage = maxPage;
    // }
    return tableSource
  }
  render() {
    const { stationDataList, pageSize, currentPage, onPaginationChange } = this.props;
    const columns = this.initColumn()
    const dataSort = this.createTableSource(stationDataList);
    let startRow = (currentPage - 1) * pageSize;
    let endRow = currentPage * pageSize;
    endRow = (endRow > totalNum) ? totalNum : endRow;
    let datalist = dataSort.slice(startRow, endRow)
    // // 表单数据
    const data = datalist.map((item, index) => {
      const stationStatus = item.stationStatus || {};
      return (
        {
          key: `${item.stationCode}`,
          stationName: `${item.stationName || '--'}`,
          stationrovince: `${item.provinceName || '--'}`,
          stationPower: `${item.stationPower || '--'}`,
          stationCapacity: `${item.stationCapacity || '--'}`,
          windSpeed: `${item.instantaneous || '--'}`,
          dayOutput: `${item.dayPower || '--'}`,
          monthOutput: `${item.monthPower || '--'}`,
          yearOutput: `${item.yearPower || '--'}`,
          planOutput: `${item.yearPlanPower || '--'}`,
          equipmentNum: `${item.stationUnitCount || '--'}`,
          alarmNum: `${item.alarmNum || '--'}`,
          currentStation: `${stationStatus.stationStatus || ''}`
        }
      )
    })

    const totalNum = stationDataList.length;
    return (
      <div className={styles.windStationList}>
        <div className={styles.pagination}>
          <CommonPagination pageSize={pageSize} currentPage={currentPage} total={totalNum} onPaginationChange={onPaginationChange} />
        </div>

        <Table columns={columns} dataSource={data} onChange={this.ontableSort} pagination={false} />
      </div>
    )
  }
}
export default (WindStationList)

