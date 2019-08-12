import React, { Component } from 'react';
import { Table } from 'antd';
import styles from './scoreAnalysis.scss';
import { Link } from 'react-router-dom';
import { dataFormats } from '../../../../utils/utilFunc';


export default function table(props) {
    const { singleData = {} } = props;
    const indexList = singleData.indexList || [];
    const dataSource = indexList.map((e, i) => {
        const unit = ['%', '%', 'h', '%', '%', 'h', 'h', 'h'][e.indexCode - 1];
        const judgementStandard = e.indexLowerLimit === e.indexUpperLimit ? `${e.indexLowerLimit}${unit}` : `${e.indexLowerLimit}${unit}~${e.indexUpperLimit}${unit}`;
        const indexName = +e.indexCode > 5 && e.indexContent || e.indexName;
        return ({
            ...e,
            key: i,
            judgementStandard: judgementStandard,
            ownIndexName: indexName,
            finishStatus: (e.finishStatus || e.finishStatus === 0) ? `${e.finishStatus}${unit}` : '--',
        });
    });

    const columns = [{
        title: '分类',
        dataIndex: 'indexTypeName',
        key: 'indexTypeName',
        render: (value, row, index) => {
            const obj = {
                children: value,
                props: {},
            };
            obj.props.rowSpan = 0;
            if (index === 0 || index === 4) {
                obj.props.rowSpan = 4;
            }
            return obj;
        },
    }, {
        title: '指标',
        dataIndex: 'ownIndexName',
        key: 'ownIndexName',
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
        render: text => (text || text === 0) ? ['优秀', '良好', '合格', '较差'][text - 1] : '数据缺失',
    }];


    const title = (data) => {
        if (data.scoreLevel) {
            return `电站总分: ${dataFormats(data.scoreValue, '--', 2, true)} ${['优秀', '良好', '合格', '较差'][data.scoreLevel - 1] || '--'}`;
        }
        return ' 数据缺失';
    };

    return (
        <div className={`${styles.scoreTable}  ${styles[['excellent', 'good', 'qualified', 'poor'][singleData.scoreLevel - 1] || 'poor']}`}>
            <div className={styles.text}>
                <p className={styles.stationScore}><Link to={`/statistical/stationaccount/allstation/${singleData.stationCode}`}> {singleData.stationName}</Link>{title(singleData)} </p>
                <p className={styles.scoreTime}>评分时间 ：{singleData.scoreStartDate}~{singleData.scoreEndDate}</p>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false} bordered />
        </div>
    );

}
