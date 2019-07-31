import React, { Component } from 'react';
import { Tabs, Input, DatePicker, Card, Table, Popover, Radio } from 'antd';
import PropTypes from 'prop-types';
import styles from './scoreAnalysis.scss';
import StationScoreList from './StationScoreList';
import TimeSelect from '../../../../components/Common/TimeSelect/TimeSelectIndex';
import PvStationSelect from '../../../../components/Common/PvStationSelect';
import WarningTip from '../../../Common/WarningTip';
import moment from 'moment';
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
        pvParams: PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            stationSelect: '',
            reportStation: [],
            highToLow: false,
            warningTipText: '数据计算中，请选择其他月份进行查看',
            showWarningTip: moment().isBefore(moment().format('YYYY-MM') + '-03', 'day'), // 在每个月前两天没有数据提示
        };
    }

    componentDidMount() {
        this.props.getPvStationType();
        this.getScoreList();
    }

    onTimeChange = (value) => { // 统计时间选择
        const { startTime, timeStyle } = value;
        const dataType = timeStyle === 'month' ? 'year' : 'month';
        this.getScoreList({ dataType, time: startTime });
        const currentMoth = moment(startTime).add(1, 'months').isBefore(moment(), 'month');
        const isBefore = !currentMoth && moment().date() < 3;
        dataType === 'month' && this.setState({ showWarningTip: isBefore });
    }

    getScoreList = (param) => {
        const { pvParams, stationType, getScoreList } = this.props;
        getScoreList({ ...pvParams, stationType, ...param });
    }

    PvStationSelect = (e) => {
        const reportType = e.target.value;
        this.getScoreList({ reportType, stationCodes: [] });
        this.setState({ reportStation: [] });
    }

    singleDetail = (data) => { // 查看单电站详情
        const stationCode = data.stationCode;
        const { dataType, time } = this.props.pvParams;
        this.props.singleStaionScore({ dataType, time, stationCode });
    }

    stationSelected = (stations) => {
        this.setState({ reportStation: stations });
        const stationCodes = stations.map(e => e.stationCode);
        this.getScoreList({ stationCodes });
    }

    scoreSort = () => { // 分数排序切换
        const unit = !this.state.highToLow;
        this.setState({ highToLow: unit });
        const sortMethod = unit ? 'desc' : 'asc';
        this.getScoreList({ sortMethod });
    }

    confirmWarningTip = () => {
        this.setState({ showWarningTip: false });
    }

    render() {
        const { pvStationType, scoreList, singleScoreData, stations, theme } = this.props;
        const { reportType } = this.props.pvParams;
        const { reportStation, highToLow } = this.state;
        const PvStations = stations.filter(e => e.stationType === 1);
        const PVSelectStations = reportType === '' ? PvStations : PvStations.filter(e => e.reportType === reportType);
        const { showWarningTip, warningTipText } = this.state;
        const noReportTypeData = scoreList.filter(e => !e.reportType);
        return (
            <div className={`${styles.PvScore} ${styles[theme]}`}>
                {showWarningTip &&
                    <WarningTip onOK={this.confirmWarningTip} value={warningTipText} style={{ height: '110px', width: '210px' }} />}
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
                <div className={styles.scoreBox}>
                    <div className={styles.scoreMiddle}>
                        <div className={styles.scoreFilter}>
                            <div className={styles.stationFilter}>
                                <span className={styles.text}>电站筛选</span>
                                <PvStationSelect
                                    data={PVSelectStations}
                                    value={reportStation}
                                    multiple={true}
                                    onChange={this.stationSelected}
                                    theme={theme}
                                />
                            </div>
                            <div className={styles.timeSelect}>
                                <TimeSelect
                                    showYearPick={false}
                                    onChange={this.onTimeChange}
                                    style={{ lineHeight: '42px' }}
                                    defaultLast={true}
                                    theme={theme}
                                    value={{
                                        timeStyle: 'day',
                                        startTime: moment().subtract(1, 'months').format('YYYY-MM-DD'),
                                        endTime: moment().subtract(1, 'months').format('YYYY-MM-DD'),
                                    }} />
                            </div>
                        </div>
                        <div className={styles.scoreTranslate}>
                            <div className={styles.scoreTranslateBtn}>排序</div>
                            <div onClick={this.scoreSort} className={styles.scoreSort}>
                                <i className="iconfont icon-mark" />
                                {highToLow && '分数由高到低' || '分数由低到高'}
                            </div>
                        </div>
                    </div>
                    {
                        !reportType &&
                        (<div>
                            <StationScoreList dataList={scoreList.filter(e => e.reportType)} onChange={this.singleDetail} singleData={singleScoreData} theme={theme} />
                            <div>
                                {noReportTypeData.length > 0 && <p className={styles.title}>电站类型未明确电站，建议在电站管理中填写项目类型以分类。</p>}
                                <StationScoreList dataList={noReportTypeData} onChange={this.singleDetail} singleData={singleScoreData} hasReportType={false} theme={theme} />
                            </div>
                        </div>)
                        || <StationScoreList dataList={scoreList} onChange={this.singleDetail} singleData={singleScoreData} theme={theme} />
                    }
                </div>


            </div>
        );
    }
}
export default PvScoreAnalysis;
