import React, { Component } from "react";
import { Tabs, Input, DatePicker, Card, Table, Popover, Radio } from 'antd';
import PropTypes from 'prop-types';
import styles from "./scoreAnalysis.scss";


export default function table(props) {
    const { sigleData } = props;
    // const indexList = sigleData.indexList || [];
    const indexList=[
        {
            "finishStatus":null,
            "indexCode":"1",
            "indexContent":"实际上网电量/计划发电量*100%",
            "indexIncrDecrStandard":"1",
            "indexIncrDecrValue":"3",
            "indexLowerLimit":"95",
            "indexName":"计划完成率",
            "indexPercent":"40",
            "indexTypeCode":"1",
            "indexTypeName":"发电水平",
            "indexUnit":"%",
            "indexUpperLimit":"105",
            "scoreLevel":null,
            "scoreValue":null
        },
        {
            "finishStatus":null,
            "indexCode":"2",
            "indexContent":"实际PR/计划PR*100%",
            "indexIncrDecrStandard":"1",
            "indexIncrDecrValue":"2",
            "indexLowerLimit":"95",
            "indexName":"PR完成率",
            "indexPercent":"20",
            "indexTypeCode":"1",
            "indexTypeName":"发电水平",
            "indexUnit":"%",
            "indexUpperLimit":"105",
            "scoreLevel":null,
            "scoreValue":null
        },
        {
            "finishStatus":null,
            "indexCode":"3",
            "indexContent":"损失电量等效时 (h)",
            "indexIncrDecrStandard":"0",
            "indexIncrDecrValue":"0",
            "indexLowerLimit":"0",
            "indexName":"损失电量等效时",
            "indexPercent":"0",
            "indexTypeCode":"1",
            "indexTypeName":"发电水平",
            "indexUnit":"h",
            "indexUpperLimit":"0",
            "scoreLevel":null,
            "scoreValue":null
        },
        {
            "finishStatus":null,
            "indexCode":"4",
            "indexContent":"(实际发电量-上网电量+购网电量)/实际发电量*100%",
            "indexIncrDecrStandard":"1",
            "indexIncrDecrValue":"2",
            "indexLowerLimit":"0.01",
            "indexName":"综合厂用电率",
            "indexPercent":"10",
            "indexTypeCode":"1",
            "indexTypeName":"发电水平",
            "indexUnit":"%",
            "indexUpperLimit":"0.01",
            "scoreLevel":null,
            "scoreValue":null
        },
        {
            "finishStatus":null,
            "indexCode":"5",
            "indexContent":"已消缺数/总故障数*100%",
            "indexIncrDecrStandard":"1",
            "indexIncrDecrValue":"2",
            "indexLowerLimit":"100",
            "indexName":"消缺率",
            "indexPercent":"15",
            "indexTypeCode":"2",
            "indexTypeName":"运维管理",
            "indexUnit":"%",
            "indexUpperLimit":"100",
            "scoreLevel":null,
            "scoreValue":null
        },
        {
            "finishStatus":null,
            "indexCode":"6",
            "indexContent":"A级故障平均处理时长 (h)",
            "indexIncrDecrStandard":"24",
            "indexIncrDecrValue":"20",
            "indexLowerLimit":"0",
            "indexName":"消缺及时性",
            "indexPercent":"5",
            "indexTypeCode":"2",
            "indexTypeName":"运维管理",
            "indexUnit":"h",
            "indexUpperLimit":"24",
            "scoreLevel":null,
            "scoreValue":null
        },
        {
            "finishStatus":null,
            "indexCode":"7",
            "indexContent":"B级故障平均处理时长 (h)",
            "indexIncrDecrStandard":"6",
            "indexIncrDecrValue":"20",
            "indexLowerLimit":"0",
            "indexName":"消缺及时性",
            "indexPercent":"5",
            "indexTypeCode":"2",
            "indexTypeName":"运维管理",
            "indexUnit":"h",
            "indexUpperLimit":"6",
            "scoreLevel":null,
            "scoreValue":null
        },
        {
            "finishStatus":null,
            "indexCode":"8",
            "indexContent":"C级故障平均处理时长 (h)",
            "indexIncrDecrStandard":"2",
            "indexIncrDecrValue":"20",
            "indexLowerLimit":"0",
            "indexName":"消缺及时性",
            "indexPercent":"5",
            "indexTypeCode":"2",
            "indexTypeName":"运维管理",
            "indexUnit":"h",
            "indexUpperLimit":"2",
            "scoreLevel":null,
            "scoreValue":null
        }
    ]
    const dataSource = indexList.map((e, i) => {
        const judgementStandard=e.indexLowerLimit===e.indexUpperLimit ?e.indexLowerLimit:`${e.indexLowerLimit}~${e.indexUpperLimit}`
        const indexName=+e.indexCode>5 && e.indexContent || e.indexName;
        return  ({
            ...e,
            key:i,
            judgementStandard: judgementStandard,
            indexName,
        })
    })

    const columns = [{
        title: '分类',
        dataIndex: 'indexTypeName',
        key: 'indexTypeName',
        render: (value, row, index) => {
            const obj = {
                children: value,
                props: {},
            };
            if (index === 0 ||index === 4) {
                obj.props.rowSpan = 4;
            }
            if (index === 1 || index === 2 || index === 3 || index === 5 || index === 6) {
                obj.props.rowSpan = 0;
            }
            return obj;
        },
    }, {
        title: '指标',
        dataIndex: 'indexName',
        key: 'indexName',
    }, {
        title: '判断标准',
        dataIndex: 'judgementStandard',
        key: 'judgementStandard',
    }, {
        title: '完成情况',
        dataIndex: 'finishStatus',
        key: 'finishStatus',
    }, {
        title: '评价',
        dataIndex: 'scoreLevel',
        key: 'scoreLevel',
    }];

    const getLevel = (e) => {
        let result = '';
        switch (e) {
            case "1": result = '优秀'; break;
            case "2": result = '良好'; break;
            case "3": result = '合格'; break;
            case "4": result = '较差'; break;
            default: result = '--'
                break;
        }
        return result;
    }

    const title = (data) => {
        if (data.scoreLevel) {
            return `电站评分: ${data.scoreValue} ${getLevel(data.scoreLevel)}`
        }
        return '数据缺失'
    }

    const getColor = (level) => {
        let result = '';
        switch (level) {
            case "1": result = 'excellent'; break;
            case "2": result = 'good'; break;
            case "3": result = 'qualified'; break;
            case "4": result = 'poor'; break;
            default: result = 'poor'
        }
        return result
    }


   
    return (
        <div className={`${styles.scoreTable}  ${styles[getColor(sigleData.scoreLevel)]}`}>
            <div className={styles.text}>
                <p className={styles.stationScore}>{sigleData.stationName} {title(sigleData)} </p>
                <p className={styles.scoreTime}>评分时间 ：{sigleData.scoreStartDate}~{sigleData.scoreEndDate}</p>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false} bordered />
        </div>
    )

}