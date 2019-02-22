import React, { Component } from "react";
import { Tabs, Input, DatePicker, Card, Table, Popover, Radio } from 'antd';
import PropTypes from 'prop-types';
import styles from "./scoreAnalysis.scss";


export default function table(props) {
    const { sigleData } = props;
    const indexList = sigleData.indexList || [];
    const dataSource = indexList.map((e, i) => {
        const judgementStandard=e.indexLowerLimit===e.indexUpperLimit ?e.indexLowerLimit:`${e.indexLowerLimit}~${e.indexUpperLimit}`
        return  ({
            ...e,
            judgementStandard: judgementStandard
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
            if (index === 0 || index === 4) {
                obj.props.rowSpan = 3;
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