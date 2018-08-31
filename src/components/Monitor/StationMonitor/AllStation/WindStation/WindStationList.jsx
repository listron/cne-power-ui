import React from "react";
import PropTypes from "prop-types";
import styles from './windStation.scss';
import CommonPagination from '../../../../Common/CommonPagination';
import { Progress, Table } from "antd";

class WindStationList extends React.Component {
  static propTypes = {
    stationDataList: PropTypes.array,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    totalNum: PropTypes.number,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      pageNum: 1,//当前页号
      pageSize: 10,//每页容纳条数
      //totalNum: 0,
    }
  }
  onPaginationChange = ({ currentPage, pageSize }) => {
    this.setState({
      pageNum: currentPage,
      pageSize
    })
  }

  onChange = (pagination, filters, sorter) => {
  }

  render() {
    const { stationDataList } = this.props;
    const { pageNum, pageSize } = this.state
    let totalNum = stationDataList.length;
    // pageNum//当前页数
    let startRow = (pageNum - 1) * pageSize;//开始显示的行   数组索引0开始
    let endRow = pageNum * pageSize;//结束显示的行   索引是10但是取不到10，索引取到9但还是第十项
    endRow = (endRow > totalNum) ? totalNum : endRow;  //边界判断，如果最后一项的值大于总数据条数，就取总数据的值  

    let datalist = stationDataList.slice(startRow, endRow);
    const columns = [
      {
        title: "电站名称",
        dataIndex: "stationName",
        onFilter: (value, record) => record.stationName.indexOf(value) === 0,
        sorter: (a, b) => a.stationName.localeCompare(b.stationName),
        render: (value, record, index) => {
          return {
            children: (
              <a href={`#/monitor/singleStation/${record.key}`}>
                <div className={styles.stationName}>{record.stationName}</div>
              </a>
            )
          }
        }
      },
      {
        title: "所在省",
        dataIndex: "stationrovince",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.stationrovince.localeCompare(b.stationrovince),
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
        sorter: (a, b) => a.stationPower - b.stationPower,
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
                    <Progress percent={record.stationPower / record.stationCapacity * 100} showInfo={false} />
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
        sorter: (a, b) => a.stationCapacity - b.stationCapacity,
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
        sorter: (a, b) => a.windSpeed - b.windSpeed
      },
      {
        title: "日发电量(万kWh)",
        dataIndex: "dayOutput",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.dayOutput - b.dayOutput
      },
      {
        title: "月发电量(万kWh)",
        dataIndex: "monthOutput",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.monthOutput - b.monthOutput
      },
      {
        title: "年发电量(万kWh)",
        dataIndex: "yearOutput",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.yearOutput - b.yearOutput,
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
                    <Progress percent={record.yearOutput / record.planOutput * 100} showInfo={false} />
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
        sorter: (a, b) => a.planOutput - b.planOutput,
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
        sorter: (a, b) => a.equipmentNum - b.equipmentNum
      },
      {
        title: "告警(个)",
        dataIndex: "alarmNum",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.alarmNum - b.alarmNum
      },
      {
        title: "状态",
        dataIndex: "currentStation",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.currentStation - b.currentStation,
        render: (value, record, index) => {
          return {
            children: (
              <div className={styles.currentStation}>
              {record.currentStation === '500' ? <div className={styles.dataInterruptionColor} ></div> :
               record.currentStation === '900' ? <div className={styles.unconnectionColor}></div> : 
               record.currentStation === '400' ?<div className={styles.normalColor}></div>:''
               }
              </div>
            )
          }
        }
      }
    ];
    const data = datalist.map((item, index) => {
      const stationStatus=item.stationStatus||{};
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
          currentStation: `${stationStatus.stationStatus}`
        }
      )
    })
    return (
      <div className={styles.windStationList}>
        <div className={styles.pagination}>
          <CommonPagination total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>

        <Table columns={columns} dataSource={data} onChange={this.onChange} pagination={false} />
      </div>
    )
  }
}
export default (WindStationList)
