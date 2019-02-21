import React, { Component } from "react";
import { Tabs, Input, DatePicker, Card, Table, Popover, Radio } from 'antd';
import PropTypes from 'prop-types';
import styles from "./scoreAnalysis.scss";
const { MonthPicker } = DatePicker;

const renderContent = (value, row, index) => {
    const obj = {
        children: value,
        props: {},
    };
    if (index === 4) {
        obj.props.colSpan = 0;
    }
    return obj;
};

const dataSource = [{
    key: '1',
    classification: '发电水平',
    target: '发电量完成率',
    judgementStandard: '95%~100%',
    completionStatus: '123%',
    evaluate: '优秀',
}, {
    key: '2',
    classification: '发电水平',
    target: '发电量完成率',
    judgementStandard: '95%~100%',
    completionStatus: '123%',
    evaluate: '优秀',
}, {
    key: '3',
    classification: '发电水平',
    target: '发电量完成率',
    judgementStandard: '95%~100%',
    completionStatus: '123%',
    evaluate: '优秀',
}, {
    key: '4',
    classification: '运维管理',
    target: '发电量完成率',
    judgementStandard: '95%~100%',
    completionStatus: '123%',
    evaluate: '优秀',
}, {
    key: '5',
    classification: '运维管理',
    target: '发电量完成率',
    judgementStandard: '95%~100%',
    completionStatus: '123%',
    evaluate: '优秀',
}, {
    key: '6',
    classification: '运维管理',
    target: '发电量完成率',
    judgementStandard: '95%~100%',
    completionStatus: '123%',
    evaluate: '优秀',
}];

const columns = [{
    title: '分类',
    dataIndex: 'classification',
    key: 'classification',
    render: (value, row, index) => {
        const obj = {
            children: value,
            props: {},
        };
        console.log(index, value);

        if (index === 0 || index === 3) {
            obj.props.rowSpan = 3;
        }
        if (index === 1 || index === 2 || index === 4 || index === 5) {
            obj.props.rowSpan = 0;
        }
        return obj;
    },
}, {
    title: '指标',
    dataIndex: 'target',
    key: 'target',
}, {
    title: '判断标准',
    dataIndex: 'judgementStandard',
    key: 'judgementStandard',
}, {
    title: '完成情况',
    dataIndex: 'completionStatus',
    key: 'completionStatus',
}, {
    title: '评价',
    dataIndex: 'evaluate',
    key: 'evaluate',
}];

const content = (
    <div className={styles.scoreTable}>
        <div className={styles.text}>
            <p className={styles.stationScore}>xxx电站总分：88分 良好</p>
            <p className={styles.scoreTime}>评分时间；2019年1月1日~2019年1月2日</p>
        </div>
        <Table dataSource={dataSource} columns={columns} pagination={false} bordered />
    </div>
);

class StationScoreList extends Component {
    static propTypes = {
        scoreList: PropTypes.array,
        
    };
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this.props.getPvStationType()
    }

    getLevel=(e)=>{
        let result='';
        switch (e) {
            case 1:result='优秀';  break;
            case 2:result='合格';  break;
            case 3:result='未达标';  break;
            case 4:result='较差';  break;
            default: result='--'
                break;
        }
        return result;
    }

    stionSelect = (value) => {
        console.log(value)
    }

   

    render() {
        const {scoreList}=this.props;
        return (
            <div className={styles.stationCardContainer}>
            {scoreList.map(item=>{
                return (
                    <Popover content={content} trigger="hover" key={item.stationCode}>
                    <div className={styles.stationCard}>
                        <p className={styles.stationName}>{item.stationName}</p>
                        <div className={styles.scoreCircleCon}>
                            <div className={styles.evaluate}>
                                <p className={styles.num}>{item.scoreValue || '--'}</p>
                                <p className={styles.text}>{this.getLevel(item.scoreLevel)}</p>
                            </div>
                        </div>
                        <div className={styles.scoreCardBottom}>
                            <p className={styles.installedCapacity}>装机容量 {item.stationCapacity}MW</p>
                            <p className={styles.equivalent}>发电等效时 {item.equivalentHours}h</p>
                        </div>
                    </div>
                </Popover>
                )
            })}
                
            </div>
        )
    }
}
export default StationScoreList;