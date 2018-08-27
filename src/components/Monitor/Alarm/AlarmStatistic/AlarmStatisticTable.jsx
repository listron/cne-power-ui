import React from "react";
import PropTypes from "prop-types";
import styles from './alarmStatistic.scss';
import { Table } from "antd";
import CommonPagination from '../../../Common/CommonPagination';

class AlarmStatisticTable extends React.Component {
    static propTypes = {
        pageNum: PropTypes.number,
        pageSize: PropTypes.number,
        stationDataList: PropTypes.array,

    }
    constructor(props, context) {
        super(props, context);
        this.state = {
            pageNum: 1,
            pageSize: 10,
        }
    }
    onPaginationChange = ({ currentPage, pageSize }) => {//分页器
        this.setState({
            pageNum: currentPage,
            pageSize
        })
    }
    onChange = (pagination, filters, sorter) => {
        console.log("params", pagination, filters, sorter);
    }

    render() {
        const { stationDataList } = this.props;
        const { pageNum, pageSize, } = this.state;
        //const totalNum = stationDataList.length;
        //let startRow = (pageNum - 1) * pageSize;
        //let endRow = pageNum * pageSize;
        //endRow = (endRow > totalNum) ? totalNum : endRow;
        //let datalist = stationDataList.slice(startRow, endRow)
        const columns = [
            {
                title: "电站名称",
                dataIndex: "stationName",
                onFilter: (value, record) => record.stationName.indexOf(value) === 0,
                sorter: (a, b) => a.stationName.localeCompare(b.stationName),
                render: (value, record, index) => {
                    return {
                        children: (<a href={'javascript:void(0)'} onClick={() => console.log("record", '跳转到单电站')} ><div className={styles.stationName}>{record.stationName}</div></a>

                        )
                    }
                }
            },
            {
                title: "告警总数",
                dataIndex: "stationrovince",
                defaultSortOrder: "descend",
                sorter: (a, b) => a.stationrovince - b.stationrovince,

            },
            {
                title: "一级总数",
                dataIndex: "stationPower",
                defaultSortOrder: "descend",
                sorter: (a, b) => a.stationPower - b.stationPower,

            },
            {
                title: "二级总数",
                dataIndex: "stationCapacity",
                defaultSortOrder: "descend",
                sorter: (a, b) => a.stationCapacity - b.stationCapacity,

            },
            {
                title: "三级总数",
                dataIndex: "windSpeed",
                defaultSortOrder: "descend",
                sorter: (a, b) => a.windSpeed - b.windSpeed
            },
            {
                title: "四级总数",
                dataIndex: "dayOutput",
                defaultSortOrder: "descend",
                sorter: (a, b) => a.dayOutput - b.dayOutput
            },
            {
                title: "平均处理时间",
                dataIndex: "monthOutput",
                defaultSortOrder: "descend",
                sorter: (a, b) => a.monthOutput - b.monthOutput
            },
            {
                title: "一级处理时间",
                dataIndex: "yearOutput",
                defaultSortOrder: "descend",
                sorter: (a, b) => a.yearOutput - b.yearOutput,

            },
            {
                title: "二级处理时间",
                dataIndex: "planOutput",
                defaultSortOrder: "descend",
                sorter: (a, b) => a.planOutput - b.planOutput,

            },
            {
                title: "三级处理时间",
                dataIndex: "equipmentNum",
                defaultSortOrder: "descend",
                sorter: (a, b) => a.equipmentNum - b.equipmentNum
            },
            {
                title: "四级处理时间",
                dataIndex: "alarmNum",
                defaultSortOrder: "descend",
                sorter: (a, b) => a.alarmNum - b.alarmNum
            },

        ];
        // 表单数据
        // const data = datalist.map((item, index) => {
        //     return (
        //         {
        //             key: `${item.stationCode}`,
        //             stationName: `${item.stationName || '--'}`,
        //             stationrovince: `${item.provinceName || '--'}`,
        //             stationPower: `${item.stationPower || '--'}`,
        //             stationCapacity: `${item.stationCapacity || '--'}`,
        //             windSpeed: `${item.instantaneous || '--'}`,
        //             dayOutput: `${item.dayPower || '--'}`,
        //             monthOutput: `${item.monthPower || '--'}`,
        //             yearOutput: `${item.yearPower || '--'}`,
        //             planOutput: `${item.yearPlanPower || '--'}`,
        //             equipmentNum: `${item.stationUnitCount || '--'}`,
        //             alarmNum: `${item.alarmNum || '--'}`,
        //             currentStation: `${item.stationStatus.stationStatus}`
        //         }
        //     )
        // })
        const data = [1, 2, 3, 4, 5, 6, 7].map((item, i) => {
            return (
                {
                    key: `${i}`,
                    stationName: `山东${i}`,
                    stationrovince: `${i}`,
                    stationPower: `${i}`,
                    stationCapacity: `${i}`,
                    windSpeed: `${i}`,
                    dayOutput: `${i}`,
                    monthOutput: `${i}`,
                    yearOutput: `${i}`,
                    planOutput: `${i}`,
                    equipmentNum: `${i}`,
                    alarmNum: `${i}`,
                    currentStation: `${i}`
                }
            )
        })
        return (
            <div>

                <div className={styles.pagination}>
                    <CommonPagination total={56} onPaginationChange={this.onPaginationChange} />
                </div>
                <Table columns={columns} dataSource={data} onChange={this.onChange} pagination={false} />
            </div>
        )
    }
}
export default (AlarmStatisticTable)