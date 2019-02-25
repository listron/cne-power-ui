import React, { Component } from "react";
import { Tabs, Input, DatePicker, Card, Table, Popover, Radio } from 'antd';
import PropTypes from 'prop-types';
import styles from "./scoreAnalysis.scss";
import StationScoreList from './StationScoreList';
import TimeSelect from '../../../../components/Common/TimeSelect/TimeSelectIndex';
import PvStationSelect from '../../../../components/Common/PvStationSelect';

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
        stationType: PropTypes.string,
        scoreList: PropTypes.array,
        singleStaionScore: PropTypes.func,
        singleScoreData: PropTypes.object,
        stations: PropTypes.array,
    };
    constructor(props) {
        super(props);
        this.state = {
            stationSelect: '',
            reportStation: [],
            highToLow: true
        }
    }

    componentDidMount() {
        this.props.getPvStationType();
        this.getScoreList()
    }

    onTimeChange = (value) => { // 统计时间选择
        const { startTime, timeStyle } = value;
        let dataType = timeStyle === 'month' ? 'year' : 'month';
        this.getScoreList({ dataType, time: startTime })
    }

    getScoreList = (param) => {
        const { reportType, stationCodes, dataType, time, sortField, sortMethod, stationType } = this.props;
        this.props.getScoreList({ reportType, stationCodes, dataType, time, sortField, sortMethod, stationType, ...param })
    }

    PvStationSelect = (e) => {
        const reportType = e.target.value;
        this.getScoreList({ reportType })
        this.setState({ reportStation: [] })
    }

    singleDetail = (data) => { // 查看单电站详情
        const stationCode = data.stationCode;
        const { dataType, time } = this.props;
        this.props.singleStaionScore({ dataType, time, stationCode })
    }

    stationSelected = (stations) => {
        this.setState({ reportStation: stations })
        const stationCodes = stations.map(e => e.stationCode);
        this.getScoreList({ stationCodes })
    }

    scoreSort = (highToLow) => { // 分数排序切换
        this.setState({ highToLow: !highToLow })
        const sortMethod = highToLow ? 'desc' : 'asc';
        this.getScoreList({ sortMethod })
    }

    render() {
        const { pvStationType, scoreList, reportType, singleScoreData, stations } = this.props;
        const { reportStation, highToLow } = this.state;
        const PvStations = stations.filter(e => e.stationType === 1);
        const PVSelectStations = reportType === '' ? PvStations : PvStations.filter(e => e.reportType === reportType);
        return (
            <div className={styles.PvScore}>
                <div className={styles.stationTypeTab}>
                    {pvStationType === 'multiple' &&
                        <Radio.Group defaultValue="" buttonStyle="solid" onChange={this.PvStationSelect}>
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
                <div className={styles.scoreMiddle}>
                    <div className={styles.scoreFilter}>
                        <div className={styles.stationFilter}>
                            <span className={styles.text}>电站筛选</span>
                            <PvStationSelect
                                data={PVSelectStations}
                                value={reportStation}
                                multiple={true}
                                onChange={this.stationSelected}
                            />
                        </div>
                        <div className={styles.timeSelect}>
                            <TimeSelect
                                showYearPick={false}
                                onChange={this.onTimeChange}
                                style={{ lineHeight: '42px' }}
                            />
                        </div>
                    </div>
                    <div className={styles.scoreTranslate}>
                        <div className={styles.scoreTranslateBtn}>排序</div>
                        <div onClick={() => { this.scoreSort(highToLow) }} className={styles.scoreSort}>
                            <i className="iconfont icon-menu-open" />
                            {highToLow && '分数由高到低' || '分数由低到高'}
                        </div>
                    </div>
                </div>
                {
                    !reportType &&
                    (<div>
                        <StationScoreList dataList={scoreList.filter(e => e.reportType)} onChange={this.singleDetail} sigleData={singleScoreData} />
                        <div>
                            <p className={styles.title}>电站类型未明确电站，建议在电站管理中填写项目类型以分类。</p>
                            <StationScoreList dataList={scoreList.filter(e => !e.reportType)} onChange={this.singleDetail} sigleData={singleScoreData} hasReportType={false} />
                        </div>
                    </div>)
                    || <StationScoreList dataList={scoreList} onChange={this.singleDetail} sigleData={singleScoreData} />
                }

            </div>
        )
    }
}
export default PvScoreAnalysis;