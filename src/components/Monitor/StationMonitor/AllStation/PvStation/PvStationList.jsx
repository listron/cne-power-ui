import React from "react";
import PropTypes from "prop-types";
import styles from './pvStation.scss';
import CommonPagination from '../../../../Common/CommonPagination';
import { Progress, Table } from "antd";
class PvStationList extends React.Component {
  static propTypes = {  
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    stationDataList:PropTypes.array,
 
  }
  constructor(props, context) {
    super(props, context)
    this.state={
      pageNum:1,
      pageSize:10,
    } 
  }
  onPaginationChange = ({currentPage,pageSize}) => {//分页器
    this.setState({
      pageNum: currentPage,
      pageSize
    })
  }
   onChange=(pagination, filters, sorter)=> {
   
  }
  render() {  
    const {stationDataList}=this.props; 
    const { pageNum,pageSize,}=this.state;
    const totalNum=stationDataList.length;
    let startRow=(pageNum-1)*pageSize;
    let endRow=pageNum*pageSize;
    endRow = (endRow > totalNum) ? totalNum : endRow;
    let datalist=stationDataList.slice(startRow,endRow)
    const columns = [
      {
        title: "电站名称",
        dataIndex: "stationName",
        onFilter: (value, record) => record.stationName.indexOf(value) === 0,
        sorter: (a, b) => a.stationName.length - b.stationName.length,
        render: (value, record, index) => {
          return {
            children: (        
            <a  href={`#/monitor/singleStation/${record.key}`}>
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
                    <Progress percent={record.stationPower/record.stationCapacity *100} showInfo={false} />
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
        title: "日曝辐值(w/m²)",
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
                    <Progress percent={record.yearOutput/record.planOutput *100} showInfo={false} />
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
    // 表单数据
    const data = datalist.map((item, index) => {
     const stationStatus=item.stationStatus||{};

      return (
        {
          key: `${item.stationCode}` ,
          stationName: `${item.stationName||'--'}`,
          stationrovince: `${item.provinceName||'--'}`,
          stationPower: `${item.stationPower||'--'}`,
          stationCapacity: `${item.stationCapacity||'--'}`,
          windSpeed: `${item.instantaneous||'--'}`,
          dayOutput: `${item.dayPower||'--'}`,
          monthOutput: `${item.monthPower||'--'}`,
          yearOutput: `${item.yearPower||'--'}`,
          planOutput: `${item.yearPlanPower||'--'}`,
          equipmentNum: `${item.stationUnitCount||'--'}`,
          alarmNum: `${item.alarmNum||'--'}`,
          currentStation: `${stationStatus.stationStatus||''}`
        }
      )
    })
    return (
      <div className={styles.PvStationList}>
        <div className={styles.pagination}>
          <CommonPagination total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table columns={columns} dataSource={data} onChange={this.onChange} pagination={false} />
      </div>
    )
  }
}
export default (PvStationList)
 