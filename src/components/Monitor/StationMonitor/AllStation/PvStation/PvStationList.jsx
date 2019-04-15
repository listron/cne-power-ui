import React from "react";
import PropTypes from "prop-types";
import styles from './pvStation.scss';
import CommonPagination from '../../../../Common/CommonPagination';
import { Progress, Table, message } from "antd";
import { unitDataFormat } from '../../../../../utils/utilFunc';
import TableColumnTitle from '../../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../../utils/utilFunc';

class PvStationList extends React.Component {
  static propTypes = {
    stationDataList: PropTypes.array,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
    onPaginationChange: PropTypes.func,
    windMonitorStation: PropTypes.object,
    realTimePowerUnit: PropTypes.string,
    realCapacityUnit: PropTypes.string,
    powerUnit: PropTypes.string,
    realTimePowerPoint: PropTypes.any,
    realCapacityPoint: PropTypes.any,
    powerPoint: PropTypes.any,
    pvMonitorStation: PropTypes.object,
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
      duration: 200,
      maxCount: 1,
    });
    message.warning('电站未接入,无法查看详情', 2);
  }

  initColumn = () => {
    const { realTimePowerUnit, realCapacityUnit, powerUnit, pvMonitorStation } = this.props;
    const planStatus = pvMonitorStation && pvMonitorStation.stationDataSummary && pvMonitorStation.stationDataSummary.planStatus;
    const planPower = planStatus === 0 ? [{
      title: () => <TableColumnTitle title="年累计发电量" unit={`${powerUnit}`} className="nonePadding" />,
      dataIndex: "yearPower",
      sorter: true,
      render(text) { return numWithComma(text); },
    }] : [{
      title: () => <TableColumnTitle title="年累计发电量" unit={`${powerUnit}`} className="nonePadding" />,
      dataIndex: "yearPower",
      sorter: true,
      render: (value, record, index) => {
        return {
          children: (
            <div >
              <div className={styles.progressInfo}>
                <div className={styles.progressData}>
                  <div className={styles.stationValue}>
                    <div>{numWithComma(record.yearPower)}</div>
                    <div className={styles.planOutput}>{numWithComma(record.yearPlanPower)}</div>
                  </div>
                  <Progress strokeWidth={3} percent={+(record.yearPlanPower) ? (record.yearPower / record.yearPlanPower * 100) : 0} showInfo={false} />
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
      title: () => <TableColumnTitle title="计划发电量" unit={`${powerUnit}`} className="nonePadding" />,
      dataIndex: "yearPlanPower",
      sorter: true,
      render: (value, columns, index) => {
        const obj = { children: null, props: { colSpan: 0 }};
        return obj;
      }
    }];

    const columns = [
      {
        title: "电站名称",
        dataIndex: "stationName",
        sorter: true,
        defaultSortOrder: "ascend",
        render: (value, record, index) => {
          if (record.stationStatus !== '900') {
            return {
              children: (
                <a href={`#/monitor/singleStation/${record.key}`}>
                  <div title={record.stationName} className={styles.stationName}>{record.stationName}</div>
                </a>
              )
            }
          } else {
            return <div title={record.stationName} className={styles.stationName} onClick={record.stationStatus === '900' ? this.showTip : null}>{record.stationName}</div>
          }

        }
      },
      {
        title: "所在省",
        dataIndex: "provinceName",
        sorter: true,
        render: (value) => {
          return { children: (<div className={styles.stationrovince}>{value}</div> )  }
        }
      },
      {
        title: () => <TableColumnTitle title="实时功率" unit={`${realTimePowerUnit}`} className="nonePadding" />,
        dataIndex: "stationPower",
        sorter: true,
        render: (value, record, index) => {
          return {
            children: (
              <div>
                <div className={styles.progressInfo}>
                  <div className={styles.progressData}>
                    <div className={styles.stationValue}>
                      <div>{numWithComma(record.stationPower)}</div>
                      <div className={styles.planOutput}>{numWithComma(record.stationCapacity)}</div>
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
        title: () => <TableColumnTitle title="装机容量" unit={`${realCapacityUnit}`} className="nonePadding" />,
        dataIndex: "stationCapacity",
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
      },
      {
        title: () => <TableColumnTitle title="瞬时辐照" unit="W/m²" className="nonePadding" />,
        dataIndex: "instantaneous",
        sorter: true,
        render:(value)=> { return numWithComma(value); },
      },
      {
        title: () => <TableColumnTitle title="日发电量" unit={`${powerUnit}`} className="nonePadding" />,
        dataIndex: "dayPower",
        sorter: true,
        render:(value)=> { return numWithComma(value); },
      },
      {
        title: () => <TableColumnTitle title="月累计发电量" unit={`${powerUnit}`} className="nonePadding" />,
        dataIndex: "monthPower",
        sorter: true,
        render:(value)=> { return numWithComma(value); },
      },
      ...planPower,
      {
        title: () => <TableColumnTitle title="装机" unit="台" className="nonePadding" />,
        dataIndex: "stationUnitCount",
        render:(value)=> { return numWithComma(value); },
        sorter: true,
      },
      {
        title: () => <TableColumnTitle title="告警" unit="个" className="nonePadding" />,
        dataIndex: "alarmNum",
        render:(value)=> { return numWithComma(value); },
        sorter: true,
      },
      {
        title: "状态",
        dataIndex: "stationStatus",
        sorter: true,
        render: (value) => {
          return {
            children: (
              <div className={styles.currentStation}>
                {value === '500' && <div className={styles.dataInterruptionColor} ></div>}
                {value === '900' && <div className={styles.unconnectionColor}></div>}
                {value === '400' && <div className={styles.normalColor}></div>}
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
      stationStatus:e.stationStatus.stationStatus || ''
    })).sort((a, b) => { // 手动排序
      const sortType = descend ? -1 : 1;
      const arraySort = ['provinceName', 'stationName'];
      const arrayNumSort = ['stationPower', 'stationCapacity', 'instantaneous', 'dayPower', 'monthPower', 'yearPower', 'yearPlanPower', 'stationUnitCount', 'alarmNum', 'stationStatus'];
      if (arrayNumSort.includes(sortName)) {
        return sortType * (a[sortName] - b[sortName]);
      } else if (arraySort.includes(sortName)) {
        a[sortName] = a[sortName] ? a[sortName] : '';
        return sortType * (a[sortName].localeCompare(b[sortName]));
      }
    })
    return tableSource
  }
  render() {
    const { stationDataList, pageSize, currentPage, onPaginationChange, realTimePowerUnit, realCapacityUnit, powerUnit, powerPoint, realCapacityPoint, realTimePowerPoint } = this.props;
    const dataSort = this.createTableSource(stationDataList);
    const columns = this.initColumn()
    const totalNum = stationDataList.length;
    let startRow = (currentPage - 1) * pageSize;
    let endRow = currentPage * pageSize;
    endRow = (endRow > totalNum) ? totalNum : endRow;
    let datalist = dataSort.slice(startRow, endRow)
    // // 表单数据
    const data = datalist.map((item, index) => {
      return (
        {
          key: `${item.stationCode}`,
          stationName: `${item.stationName || '--'}`,
          provinceName: `${item.provinceName || '--'}`,
          stationPower: `${(realTimePowerUnit === 'MW' ? (+item.stationPower) : (+item.stationPower * 1000)).toFixed(realTimePowerPoint) || '--'}`,
          stationCapacity: `${(realCapacityUnit === 'MW' ? (+item.stationCapacity) : (+item.stationCapacity * 1000)).toFixed(realCapacityPoint) || '--'}`,
          instantaneous: `${item.instantaneous || '--'}`,
          dayPower: unitDataFormat(item.dayPower, '--', powerPoint, powerUnit),
          monthPower: unitDataFormat(item.monthPower, '--', powerPoint, powerUnit),
          yearPower: unitDataFormat(item.yearPower, '--', powerPoint, powerUnit),
          yearPlanPower: unitDataFormat(item.yearPlanPower, '--', powerPoint, powerUnit),
          stationUnitCount: `${item.stationUnitCount || '--'}`,
          alarmNum: `${item.alarmNum || '--'}`,
          stationStatus: `${item.stationStatus || ''}`
        }
      )
    })

    return (
      <div className={styles.PvStationList}>
        <div className={styles.pagination}>
          <CommonPagination pageSize={pageSize} currentPage={currentPage} total={totalNum} onPaginationChange={onPaginationChange} />
        </div>
        <Table
          columns={columns}
          dataSource={data}
          onChange={this.ontableSort}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          pagination={false} />
      </div>
    )
  }
}
export default (PvStationList)
