import React, { Component } from "react";
import { Tabs, Input, DatePicker, Card, Table, Popover, Radio } from 'antd';
import PropTypes from 'prop-types';
import styles from "./scoreAnalysis.scss";
import StationScoreList from './StationScoreList';
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

class PvScoreAnalysis extends Component {
    static propTypes = {
        pvStationType: PropTypes.string,
        getPvStationType: PropTypes.func,
        getScoreList: PropTypes.func,
        reportType: PropTypes.string,
        stationCodes: PropTypes.array,
        dataType: PropTypes.string,
        time: PropTypes.string,
        sortField: PropTypes.string,
        sortMethod: PropTypes.string,
    };
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this.props.getPvStationType();
        const {reportType,stationCodes,dataType,time,sortField,sortMethod}=this.props;
        console.log(reportType,stationCodes,dataType,time,sortField,sortMethod)
        this.props.getScoreList({reportType,stationCodes,dataType,time,sortField,sortMethod})
    }

    stionSelect = (value) => {
        console.log(value)
    }

    render() {
        const { pvStationType } = this.props;
        return (
            <div className={styles.PvScore}>
                <div className={styles.stationTypeTab}>
                    {pvStationType === 'multiple' &&
                        <Radio.Group defaultValue="" buttonStyle="solid" onChange={this.stionSelect}>
                            <Radio.Button value="">全部</Radio.Button>
                            <Radio.Button value="1">集中式光伏电站</Radio.Button>
                            <Radio.Button value="2">分布式光伏电站</Radio.Button>
                        </Radio.Group>
                    }
                    {pvStationType !== 'multiple' &&
                        <Radio.Group defaultValue="" buttonStyle="solid">
                            <Radio.Button value="">全部</Radio.Button>
                        </Radio.Group>
                    }
                </div>
                {/* <div className={styles.scoreMiddle}>
                     <div className={styles.scoreFilter}>
                        <div className={styles.stationFilter}>
                            <span className={styles.text}>电站筛选</span>
                            <Input placeholder="请输入关键字快速查询" />
                        </div>
                        <div className={styles.timeSelect}>
                            <span className={styles.text}>统计时间选择</span>
                            <MonthPicker />
                        </div>
                    </div>
                    <div className={styles.scoreTranslate}>
                        <div className={styles.scoreTranslateBtn}>排序</div>
                    </div>
                </div> */}

                <StationScoreList {...this.props} />
            </div>
        )
    } 
}
export default PvScoreAnalysis;