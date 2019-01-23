import React from "react";
import PropTypes from "prop-types";
import styles from './windStation.scss';
import CommonPagination from '../../../../Common/CommonPagination';
import { Progress, Table, message } from "antd";

class WindStationList extends React.Component {
  static propTypes = {
    stationDataList: PropTypes.array,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
    onPaginationChange: PropTypes.func,
    windMonitorStation: PropTypes.object,
    realTimePowerUnit: PropTypes.string,
    realCapacityUnit: PropTypes.string,
    powerUnit: PropTypes.string,
    realTimePowerPoint: PropTypes.number,
    realCapacityPoint: PropTypes.number,
    powerPoint: PropTypes.number,
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
  showTip = (e) => {
    message.destroy();
    message.config({
      top: 225,
      duration: 2,
      maxCount: 1,
    });
    message.warning('电站未接入,无法查看详情', 2);
  }
  initColumn = () => {
    const { realTimePowerUnit, realCapacityUnit, powerUnit, windMonitorStation } = this.props;
    const  planStatus = windMonitorStation && windMonitorStation.stationDataSummary && windMonitorStation.stationDataSummary.planStatus || 0;
    const planPower = planStatus === 0 ? [{
      title: `年累计发电量(${powerUnit})`,
      dataIndex: "yearOutput",
      defaultSortOrder: "descend",
      sorter: true,
    }] : [{
      title: `年累计发电量(${powerUnit})`,
      dataIndex: "yearOutput",
      defaultSortOrder: "descend",
      sorter: true,
      render: (value, record, index) => {
        return {
          children: (
            <div >
              <div className={styles.progressInfo}>
                <div className={styles.progressData}>
                  <div className={styles.stationValue}>
                    <div>{record.yearOutput}</div>
                    <div className={styles.planOutput}>{record.planOutput}</div>
                  </div>
                  <Progress strokeWidth={3} percent={+(record.planOutput) ? (record.yearOutput / record.planOutput * 100) : 0} showInfo={false} />
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
      title: `计划发电量(${powerUnit})`,
      dataIndex: "planOutput",
      defaultSortOrder: "descend",
      sorter: true,
      render: (value, columns, index) => {
        const obj = {
          children: null,
          props: {
            colSpan: 0
          }
        };
        return obj;
      }
    }];

    const columns = [
      {
        title: "电站名称",
        dataIndex: "stationName",
        onFilter: (value, record) => record.stationName.indexOf(value) === 0,
        sorter: true,
        // (a, b) => a.stationName.localeCompare(b.stationName),
        render: (value, record, index) => {
          if (record.currentStation !== '900') {
            return {
              children: (
                <a href={`#/monitor/singleStation/${record.key}`}>
                  <div title={record.stationName} className={styles.stationName}>{record.stationName}</div>
                </a>
              )
            }
          } else {
            return <div title={record.stationName} className={styles.stationName} onClick={record.currentStation === '900' ? this.showTip : null}>{record.stationName}</div>
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
        title: `实时功率(${realTimePowerUnit})`,

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
                      <div className={styles.planOutput}>{record.stationCapacity}</div>
                    </div>
                    <Progress strokeWidth={3} percent={+(record.stationCapacity) ? (record.stationPower / record.stationCapacity * 100) : 0} showInfo={false} />
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
        title: `装机容量(${realCapacityUnit})`,
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
      },
      {
        title: `日发电量(${powerUnit})`,
        dataIndex: "dayOutput",
        defaultSortOrder: "descend",
        sorter: true,
      },
      {
        title: `月累计发电量(${powerUnit})`,
        dataIndex: "monthOutput",
        defaultSortOrder: "descend",
        sorter: true,
      },
      ...planPower,
      {
        title: "装机(台)",
        dataIndex: "equipmentNum",
        defaultSortOrder: "descend",
        sorter: true,
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
    //   currentPage = 1;
    // }else if(maxPage < currentPage){ // 当前页已超出
    //   currentPage = maxPage;
    // }
    return tableSource
  }
  render() {
    const { stationDataList, pageSize, currentPage, onPaginationChange, realTimePowerUnit, realCapacityUnit, powerUnit, powerPoint, realCapacityPoint, realTimePowerPoint } = this.props;
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
          stationPower: `${(realTimePowerUnit==='MW'?(+item.stationPower):(+item.stationPower*1000)).toFixed(realTimePowerPoint) || '--'}`,
          stationCapacity: `${(realCapacityUnit==='MW'?(+item.stationCapacity):(+item.stationCapacity*1000)).toFixed(realCapacityPoint) || '--'}`,
          windSpeed: `${item.instantaneous || '--'}`,
          dayOutput: `${(powerUnit==='万kWh'?(+item.dayPower):(+item.dayPower*10000)).toFixed(powerPoint) || '--'}`,
          monthOutput: `${(powerUnit==='万kWh'?(+item.monthPower):(+item.monthPower*10000)).toFixed(powerPoint) || '--'}`,
          yearOutput: `${(powerUnit==='万kWh'?(+item.yearPower):(+item.yearPower*10000)).toFixed(powerPoint) || '--'}`,
          planOutput: `${(powerUnit==='万kWh'?(+item.yearPlanPower):(+item.yearPlanPower*10000)).toFixed(powerPoint) || '--'}`,
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

