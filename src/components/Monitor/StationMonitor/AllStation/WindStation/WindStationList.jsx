import React from "react";
import PropTypes from "prop-types";
import styles from './windstation.scss';
import CommonPagination from '../../../../Common/CommonPagination';
import { Progress,Table } from "antd";
const columns = [
  {
    title: "电站名称",
    dataIndex: "stationName",
    onFilter: (value, record) => record.stationName.indexOf(value) === 0,
    sorter: (a, b) => a.stationName.length - b.stationName.length,
    render: (value, record, index) => {
      return {
        children: (
          <div className={styles.stationName}>{record.stationName}</div>
        )
      }
    }
  },
  {
    title: "所在省",
    dataIndex: "stationrovince",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.stationrovince.localeCompare(b.stationrovince)
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
                <Progress percent={50} showInfo={false} />
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
                <Progress percent={50} showInfo={false} />
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
    sorter: (a, b) => a.currentStation - b.currentStation
  }
];
// 表单数据
const data = [
  {
    key: "1",
    stationName: "华坪一期",
    stationrovince: "安徽",
    stationPower: 4,
    stationCapacity: 40,
    windSpeed: 3,
    dayOutput: 23,
    monthOutput: 342,
    yearOutput: 3256,
    planOutput: 3000,
    equipmentNum: 5,
    alarmNum: 3,
    currentStation: 0
  },
  {
    key: "2",
    stationName: "华坪一期华坪一期",
    stationrovince: "河南",
    stationPower: 22,
    stationCapacity: 20,
    windSpeed: 7,
    dayOutput: 43,
    monthOutput: 367,
    yearOutput: 3258,
    planOutput: 3007,
    equipmentNum: 7,
    alarmNum: 4,
    currentStation: 1
  },
  {
    key: "3",
    stationName: "圣经山",
    stationrovince: "广西",
    stationPower: 3,
    stationCapacity: 30,
    windSpeed: 8,
    dayOutput: 73,
    monthOutput: 372,
    yearOutput: 3456,
    planOutput: 3070,
    equipmentNum: 3,
    alarmNum: 4,
    currentStation: 2
  },
  {
    key: "4",
    stationName: "山东平原",
    stationrovince: "云南",
    stationPower: 1,
    stationCapacity: 10,
    windSpeed: 4,
    dayOutput: 33,
    monthOutput: 342,
    yearOutput: 3556,
    planOutput: 4000,
    equipmentNum: 4,
    alarmNum: 2,
    currentStation: 3
  }
];
function onChange(pagination, filters, sorter) {
  console.log("params", pagination, filters, sorter);
}

class WindStationList extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    return (
      <div className={styles.windStationList}>
        <div className={styles.pagination}>
          <CommonPagination total={56} onPaginationChange={10} />
        </div>

        <Table columns={columns} dataSource={data} onChange={onChange} pagination={false} />
      </div>
    )
  }
}
export default (WindStationList)
