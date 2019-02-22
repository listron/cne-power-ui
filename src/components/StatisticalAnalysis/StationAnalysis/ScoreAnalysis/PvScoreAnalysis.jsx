import React, { Component } from "react";
import { Tabs, Input, DatePicker, Card, Table, Popover, Radio } from 'antd';
import PropTypes from 'prop-types';
import styles from "./scoreAnalysis.scss";
import StationScoreList from './StationScoreList';
const { MonthPicker } = DatePicker;


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
        reportType: PropTypes.string,
        scoreList: PropTypes.array,
        singleStaionScore: PropTypes.func,
        singleScoreData: PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            stationSelect: ''
        }
    }

    componentDidMount() {
        this.props.getPvStationType();
        const { reportType, stationCodes, dataType, time, sortField, sortMethod } = this.props;
        this.props.getScoreList({ reportType, stationCodes, dataType, time, sortField, sortMethod })
    }

    stionSelect = (e) => {
        const reportType = e.target.value;
        const { stationCodes, dataType, time, sortField, sortMethod } = this.props;
        this.props.getScoreList({ reportType, stationCodes, dataType, time, sortField, sortMethod })
    }

    singleDetail = (data) => { // 查看单电站详情
       const stationCode=data.stationCode;
       const {dataType,time}=this.props;
       this.props.singleStaionScore({dataType,time,stationCode})
    }

    render() {
        const { pvStationType, scoreList, reportType,singleScoreData} = this.props;
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
                {
                    !reportType &&
                    (<div>
                        <StationScoreList dataList={scoreList.filter(e => e.reportType)} onChange={this.singleDetail} sigleData={singleScoreData} />
                        <div>
                            <p className={styles.title}>电站类型未明确电站，建议在电站管理中填写项目类型以分类。</p>
                            <StationScoreList dataList={scoreList.filter(e => !e.reportType)} onChange={this.singleDetail} sigleData={singleScoreData} />
                        </div>
                    </div>)
                    || <StationScoreList dataList={scoreList} onChange={this.singleDetail} sigleData={singleScoreData} />
                }

            </div>
        )
    }
}
export default PvScoreAnalysis;