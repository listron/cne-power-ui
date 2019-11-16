import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import styles from './allStationStatistic.scss';
import StationSelectModal from './StationSelectModal.jsx';
import StationStatisticList from './StationStatisticList.jsx';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import PlanCompletionRate from './Chart/PlanCompletionRate';
import TargetTabs from './TargetTabs.jsx';
import Cookie from 'js-cookie';
const TabPane = Tabs.TabPane;
import moment from 'moment';
class AllStationStatistic extends React.Component {
  static propTypes = {
    stations: PropTypes.object,
    userId: PropTypes.string,
    stationType: PropTypes.any,
    sortType: PropTypes.string,
    sort: PropTypes.string,
    stationCode: PropTypes.array,
    allStationAvalibaData: PropTypes.array,
    allStationStatisticData: PropTypes.object,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    history: PropTypes.object,
    showPage: PropTypes.string,
    dateType: PropTypes.string,
    changeAllStationStore: PropTypes.func,
    getAllStationAvalibaData: PropTypes.func,
    getAllStationStatisticData: PropTypes.func,
    getAllStationStatisticTableData: PropTypes.func,
    getAllStationMonthBarData: PropTypes.func,
    getAllStationMonthPieData: PropTypes.func,
    year: PropTypes.array,
    theme: PropTypes.string,
    stationTypeCount: PropTypes.string,

  }
  constructor(props) {
    super(props);
    this.state = {
      showStationSelect: false,
    };
  }

  componentDidMount() {
    const { params } = this.props.match;
    if (params.stationCode) {
      this.props.changeAllStationStore({
        showPage: 'single',
        singleStationCode: `${params.stationCode}`,
      });
    }
    this.getMonthData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { dateType, year } = nextProps;
    if (dateType === 'month' && (this.props.dateType !== 'month' || (this.props.year[0] !== year[0]))) {
      this.getMonthData(nextProps);
    }

    if (dateType === 'year' && (this.props.dateType !== 'year' ||
      (this.props.year[0] !== year[0] || this.props.year[1] !== year[1]))) {
      this.getYearData(nextProps);
    }

  }

  componentWillUnmount() {
    this.props.changeAllStationStore({
      //stationTypes: null,
      dateType: 'month',
      year: [],
      month: '',
      pageNum: 1, // 当前页
      pageSize: 10, // 每页条数
      totalNum: 0, //总数
      allStationAvalibaData: [],
      selectYear: '',
    });
  }


  onTimeChange = (timeObj) => { // 时间选择
    const dateType = timeObj.timeStyle;
    const currentMonth = moment().month();
    timeObj.timeStyle === 'year' ?
      this.props.changeAllStationStore({ dateType, year: [timeObj.startTime, timeObj.endTime], selectYear: timeObj.endTime, powerSelectYear: timeObj.endTime }) : this.props.changeAllStationStore({ dateType, year: [timeObj.startTime], powerSelectMonth: currentMonth });
    this.props.changeAllStationStore({ targetShowType: 'EqpGen' });
  }

  onChangeStation = (stationCode) => {
    this.props.history.push(`/statistical/stationaccount/allstation/${stationCode}`);
    this.props.changeAllStationStore({
      showPage: 'single',
      singleStationCode: `${stationCode}`,
    });
  }


  getMonthData = (props) => { // 年的时间选择 初始加载
    const { userId, year, dateType, month, pageNum, pageSize, sortType, sort } = props;
    const stationType = 1;
    const choiceYear = year[0] ? year : [moment().year()];
    const currentMonth = moment().month() + 1;
    const prams = {
      userId: userId,
      year: choiceYear,
      dateType,
      stationType,
    };
    props.changeAllStationStore({ year: [`${choiceYear}`], month: currentMonth, powerSelectMonth: currentMonth });
    props.getAllStationAvalibaData(prams);
    props.getAllStationStatisticData({ ...prams, year: choiceYear[0] });
    props.getAllStationStatisticTableData({
      year: choiceYear[0],
      dateType,
      month: currentMonth, //默认当前月
      pageNum: 1, // 当前页
      pageSize, // 每页条数
      sortType,
      sort,
      stationType,
    });
    props.getAllStationMonthBarData({ ...prams, dataType: 'EqpGen' });
    props.getAllStationMonthPieData({ ...prams, dataType: 'EqpGen', year: choiceYear[0] });
  }

  getYearData = (props) => { //多年的时间选择
    const { dateType, userId, year, pageNum, pageSize, sortType, sort } = props;
    const endYear = year[1] ? year[1] : +moment().year();
    const startYear = year[0] ? year[0] : moment().subtract(5, 'year').year();
    const rangeYear = [];
    const stationType = 1;
    for (let i = Number(startYear); i < Number(endYear) + 1; i++) {
      rangeYear.push(`${i}`);
    }
    const prams = {
      userId,
      year: rangeYear,
      dateType,
      stationType,
    };
    const isFirst = dateType === 'year' && this.props.dateType === 'month';
    props.getAllStationAvalibaData(prams);
    props.getAllStationStatisticData({ ...prams, year: endYear });
    props.getAllStationMonthBarData({ ...prams, dataType: 'EqpGen' });
    props.getAllStationStatisticTableData({
      year: endYear,
      dateType,
      pageNum: isFirst && 1 || pageNum, // 当前页
      pageSize, // 每页条数
      sortType,
      sort,
      stationType,
    });
    props.changeAllStationStore({
      targetShowType: 'EqpGen',
      pageNum: isFirst && 1 || pageNum,
    });
  }


  showStationSelect = () => {
    this.setState({
      showStationSelect: true,
    });
  }

  queryTargetData = (activeKey) => {
    const { getAllStationAvalibaData, changeAllStationStore, getAllStationStatisticData, getAllStationStatisticTableData, getAllStationMonthBarData, getAllStationMonthPieData, year, stationType, sortType, dateType, pageNum, pageSize, sort } = this.props;
    const currentYear = moment().format('YYYY');
    const curYear = Number(moment().format('YYYY'));
    const currentMonth = Number(moment().format('MM'));
    const time = year ? year : [`${currentYear}`];
    const userId = Cookie.get('userId');
    changeAllStationStore({
      year: [`${currentYear}`], month: currentMonth, powerSelectMonth: currentMonth, stationType: activeKey,
      targetShowType: 'EqpGen',
    });
    getAllStationAvalibaData(
      {
        userId: userId,
        year: time,
        dateType,
        stationType: activeKey,
      }
    );
    getAllStationStatisticData(
      {
        userId: userId,
        year: curYear,
        dateType,
        stationType: activeKey,
      }
    );
    getAllStationStatisticTableData(
      {
        year: curYear,
        dateType,
        month: currentMonth, //默认当前月
        pageNum, // 当前页
        pageSize, // 每页条数
        sortType,
        sort,
        stationType: activeKey,

      }
    );
    getAllStationMonthBarData({
      userId: userId,
      year: time,
      dateType,
      dataType: 'EqpGen',
      stationType: activeKey,

    });
    getAllStationMonthPieData({
      userId: userId,
      year: curYear,
      dataType: 'EqpGen',
      stationType: activeKey,
    });
  }

  render() {
    const { stationType, stations, dateType, year, allStationAvalibaData, allStationStatisticData = {}, getAllStationStatisticData, selectYear, changeAllStationStore, theme, stationTypeCount } = this.props;
    const { showStationSelect } = this.state;
    const enterpriseId = Cookie.get('enterpriseId');
    const operations = (
      <div className={styles.operation} onClick={this.showStationSelect}>
        查看单电站
        <i className="iconfont icon-filter"></i>
      </div>
    );
    const planSummary = allStationStatisticData.planSummary || []; // 什么sb 传回来的数据结构
    return (
      <div className={`${styles.allStationTypeTabs} ${styles[theme]}`}>

        {(stationTypeCount === 'pv' || stationTypeCount === 'wind') ?
          <div className={styles.AlarmStatisticByTypeBox} >
            {enterpriseId !== '451436467886592' && (<div className={styles.singleAlarmFilter} >{operations}</div>)}
            <div className={styles.componentContainer}>
              <div className={styles.timeSelect}> <TimeSelect showDayPick={false} onChange={this.onTimeChange} theme={theme} /></div>
              <PlanCompletionRate
                dateType={dateType}
                theme={theme}
                stationType={stationType}
                allStationAvalibaData={allStationAvalibaData}
                allStationStatisticData={planSummary.length > 0 && planSummary[0] || {}}
                getAllStationStatisticData={getAllStationStatisticData}
                year={year}
                selectYear={selectYear}
                changeAllStationStore={changeAllStationStore} />
              <TargetTabs {...this.props} theme={theme} />
              <StationStatisticList {...this.props} theme={theme} />
            </div>
          </div>
          :
          <Tabs
            type="card"
            tabBarExtraContent={enterpriseId !== '451436467886592' ? operations : null}
            activeKey={stationType}
            onChange={this.queryTargetData}
          >
            <TabPane tab="风电" key={'0'}>
              <div className={styles.windContainer} />
            </TabPane>
            <TabPane tab="光伏" key={'1'}>
              <div className={styles.componentContainer}>
                <div className={styles.timeSelect}> <TimeSelect showDayPick={false} onChange={this.onTimeChange} theme={theme} /></div>
                <PlanCompletionRate
                  dateType={dateType}
                  theme={theme}
                  stationType={stationType}
                  allStationAvalibaData={allStationAvalibaData}
                  allStationStatisticData={planSummary.length > 0 && planSummary[0] || {}}
                  getAllStationStatisticData={getAllStationStatisticData}
                  year={year}
                  selectYear={selectYear}
                  changeAllStationStore={changeAllStationStore} />
                <TargetTabs {...this.props} theme={theme} />
                <StationStatisticList {...this.props} theme={theme} />
              </div>
            </TabPane>
          </Tabs>
        }
        {
          showStationSelect &&
          <StationSelectModal
            stations={stations.filter(e => e.get('stationType') === 1)}
            onClose={() => this.setState({ showStationSelect: false })}
            theme={theme}
            onChangeStation={this.onChangeStation} />
        }
      </div >
    );
  }
}
export default withRouter(AllStationStatistic);
