import React from "react";
import PropTypes from "prop-types";
import { Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import styles from './allStationStatistic.scss';
import StationSelectModal from './StationSelectModal.jsx';
import StationStatisticList from './StationStatisticList.jsx';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import PlanCompletionRate from './Chart/PlanCompletionRate';
import TargetTabs from './TargetTabs.jsx';
import Cookie from 'js-cookie';
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
  }
  constructor(props) {
    super(props);
    this.state = {
      showStationSelect: false,
    };
  }
  componentDidMount() {
    const { getAllStationAvalibaData, stations, changeAllStationStore, getAllStationStatisticData, getAllStationStatisticTableData, getAllStationMonthBarData, getAllStationMonthPieData, year, stationType, sortType, dateType, pageNum, pageSize, sort } = this.props;
    const currentYear = moment().format('YYYY');
    const curYear = Number(moment().format('YYYY'));
    const currentMonth = Number(moment().format('MM'));
    let time = year ? year : [`${currentYear}`];
    const userId = Cookie.get('userId')
    const stationTypeOne = this.stationIsOneType();
    let stationTypes;
    if (stationTypeOne) {
      stationTypes = stations.getIn([0, 'stationType']);
      changeAllStationStore({ stationType: stationTypes })
    }
    // console.log(typeof(stationTypes));
    changeAllStationStore({ year: [`${currentYear}`], month: currentMonth, powerSelectMonth: currentMonth, })
    getAllStationAvalibaData(
      {
        userId: userId,
        year: time,
        dateType,
        stationType
      }
    )
    getAllStationStatisticData(
      {
        userId: userId,
        year: curYear,
        dateType,
        stationType
      }
    )
    getAllStationStatisticTableData(
      {

        year: curYear,
        dateType,
        month: currentMonth,//默认当前月
        pageNum, // 当前页
        pageSize, // 每页条数
        sortType,
        sort,
        stationType

      }
    )
    getAllStationMonthBarData({
      userId: userId,
      year: time,
      dateType,
      dataType: 'EqpGen',
      stationType

    })
    getAllStationMonthPieData({
      userId: userId,
      year: curYear,
      dataType: 'EqpGen',
      stationType
    })

  }
  componentWillReceiveProps(nextProps) {
    const { getAllStationAvalibaData, getAllStationMonthBarData, changeAllStationStore, getAllStationStatisticData, getAllStationStatisticTableData, getAllStationMonthPieData, dateType, userId, pageNum, stationType, sortType, sort, pageSize } = this.props;

    const currentYear = [moment().format('YYYY')];
    const currentTableYear = Number(moment().format('YYYY'));
    const currentMonth = Number(moment().format('MM'));
    const curYear = Number(nextProps.year)
    const curYearPlan = Number(nextProps.year[nextProps.year.length - 1]);
    const selectYear = [Number(moment().subtract(5, 'year').format('YYYY')), Number(moment().format('YYYY'))];
    let rangeYear = [];
    for (let i = selectYear[0]; i < selectYear[1] + 1; i++) {
      rangeYear.push(i.toString())
    }
    let changeRangYear = [];
    for (let i = Number(nextProps.year[0]); i < Number(nextProps.year[1]) + 1; i++) {
      changeRangYear.push(i.toString())
    }
    //tab切换
    if (this.props.stationType !== nextProps.stationType) {

      //  this.renderWeb()
    }
    //月->月
    if (dateType === 'month' && nextProps.dateType === 'month') {
      if (nextProps.year[0] !== this.props.year[0]) {
        changeAllStationStore({ targetShowType: 'EqpGen', powerSelectMonth: currentMonth, pageNum: 1, })
        getAllStationAvalibaData(
          {
            userId: userId,
            year: nextProps.year,
            dateType,
            stationType
          })
        getAllStationStatisticData(
          {
            userId,
            year: curYear,
            dateType,
            stationType
          })
        getAllStationMonthBarData({
          userId: userId,
          year: nextProps.year,
          dateType,
          dataType: 'EqpGen',
          stationType

        })
        getAllStationMonthPieData({
          userId: userId,
          year: nextProps.year,
          dataType: 'EqpGen',
          stationType
        })
        getAllStationStatisticTableData(
          {
            year: curYear,
            dateType,
            month: currentMonth,//默认当前月
            pageNum: nextProps.pageNum, // 当前页
            //pageNum: 1, // 当前页
            pageSize: nextProps.pageSize, // 每页条数
            sortType: nextProps.sortType,
            sort: nextProps.sort,
            stationType
          })
      }
    }
    //月->年
    if (dateType !== nextProps.dateType && nextProps.dateType === 'year') {
      changeAllStationStore({ allStationAvalibaData: [], targetShowType: 'EqpGen', pageNum: 1, })

      getAllStationAvalibaData(
        {
          userId: userId,
          year: rangeYear,
          dateType: nextProps.dateType,
          stationType
        })
      getAllStationStatisticData(
        {
          userId: userId,
          year: curYearPlan,
          dateType: nextProps.dateType,
          stationType
        }
      )
      getAllStationMonthBarData({
        userId,
        year: rangeYear,
        dateType: nextProps.dateType,
        dataType: 'EqpGen',
        stationType

      })
      getAllStationStatisticTableData(
        {
          year: currentTableYear,
          dateType: nextProps.dateType,
          pageNum: nextProps.pageNum, // 当前页
          pageSize, // 每页条数
          sortType,
          sort,
          stationType
        }
      )
      changeAllStationStore({
        selectYear: currentTableYear
      })
    }
    //年->月
    if (dateType !== nextProps.dateType && nextProps.dateType === 'month') {
      changeAllStationStore({ year: currentYear, month: currentMonth, allStationAvalibaData: [], targetShowType: 'EqpGen', powerSelectMonth: currentMonth, pageNum: 1, })
      getAllStationAvalibaData(
        {
          userId: userId,
          year: currentYear,
          dateType: nextProps.dateType,
          stationType
        })

      getAllStationStatisticData(
        {
          userId: userId,
          year: currentTableYear,
          dateType: nextProps.dateType,
          stationType
        }
      )
      getAllStationStatisticTableData(
        {

          year: currentTableYear,
          dateType: nextProps.dateType,
          month: currentMonth,//默认当前月
          pageNum: nextProps.pageNum, // 当前页
          pageSize, // 每页条数
          sortType,
          sort,
          stationType
        }
      )
      getAllStationMonthBarData({
        userId: userId,
        year: currentYear,
        dateType: nextProps.dateType,
        dataType: 'EqpGen',
        stationType
      })
      getAllStationMonthPieData({
        userId: userId,
        year: currentTableYear,
        dataType: 'EqpGen',
        stationType
      })
    }
    //年->年
    if (dateType === 'year' && nextProps.dateType === 'year') {
      if (nextProps.year[0] !== this.props.year[0] || nextProps.year[1] !== this.props.year[1]) {
        changeAllStationStore({ targetShowType: 'EqpGen', pageNum: 1, })
        getAllStationAvalibaData(
          {
            userId: userId,
            year: changeRangYear,
            dateType,
            stationType
          }
        )
        getAllStationStatisticData(
          {
            userId: userId,
            year: curYearPlan,
            dateType,
            stationType
          }
        )
        getAllStationMonthBarData({
          userId: userId,
          year: changeRangYear,
          dateType,
          dataType: 'EqpGen',
          stationType
        })
        getAllStationStatisticTableData(
          {
            year: curYearPlan,
            dateType,
            //pageNum: 1, // 当前页
            pageNum: nextProps.pageNum, // 当前页
            pageSize: nextProps.pageSize, // 每页条数
            sortType: nextProps.sortType,
            sort: nextProps.sort,
            stationType
          }
        )
      }
    }
  }
  componentWillUnmount() {
    this.props.changeAllStationStore({
      //stationTypes: null,   
      dateType: 'month',
      year: '',
      month: '',
      pageNum: 1, // 当前页
      pageSize: 10, // 每页条数
      totalNum: 0,//总数
      allStationAvalibaData: [],
      selectYear: ''
    });
  }
  onTimeChange = (timeObj) => {
    timeObj.timeStyle === 'year' ? this.props.changeAllStationStore({ dateType: timeObj.timeStyle, year: [timeObj.startTime, timeObj.endTime], selectYear: timeObj.endTime, powerSelectYear: timeObj.endTime }) : this.props.changeAllStationStore({ dateType: timeObj.timeStyle, year: [timeObj.startTime] })
  }
  onChangeStation = (stationCode) => {
    this.props.history.push(`/statistical/stationaccount/allstation/${stationCode}`);
    this.props.changeAllStationStore({
      showPage: 'single',
      singleStationCode: stationCode.toString()
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
    let time = year ? year : [`${currentYear}`];
    const userId = Cookie.get('userId')
    changeAllStationStore({
      year: [`${currentYear}`], month: currentMonth, powerSelectMonth: currentMonth, stationType: activeKey,
      targetShowType: 'EqpGen',
    })
    getAllStationAvalibaData(
      {
        userId: userId,
        year: time,
        dateType,
        stationType: activeKey
      }
    )
    getAllStationStatisticData(
      {
        userId: userId,
        year: curYear,
        dateType,
        stationType: activeKey,
      }
    )
    getAllStationStatisticTableData(
      {
        year: curYear,
        dateType,
        month: currentMonth,//默认当前月
        pageNum, // 当前页
        pageSize, // 每页条数
        sortType,
        sort,
        stationType: activeKey,

      }
    )
    getAllStationMonthBarData({
      userId: userId,
      year: time,
      dateType,
      dataType: 'EqpGen',
      stationType: activeKey,

    })
    getAllStationMonthPieData({
      userId: userId,
      year: curYear,
      dataType: 'EqpGen',
      stationType: activeKey,
    })
  }
  stationIsOneType() {
    const { stations } = this.props;
    const length = stations.map(e => e.get('stationType')).toSet().size;
    return length === 1;//需求：只有一种类型,不显示tab;两种类型(风电/光伏)才显示tab
  }
  render() {
    const TabPane = Tabs.TabPane;
    const operations = (
      <div className={styles.operation} style={{ marginRight: '50px', color: '#199475' }} onClick={this.showStationSelect}>
        查看单电站
        <i className="iconfont icon-filter"></i>
      </div>
    );
    const stationTypeOne = this.stationIsOneType();

    const { stationType, stations, dateType, year, allStationAvalibaData, allStationStatisticData, getAllStationStatisticData, selectYear, changeAllStationStore } = this.props;
    console.log(stations)
    const { showStationSelect } = this.state;
    return (
      <div className={styles.allStationTypeTabs}>
        {stationTypeOne ?
          <div className={styles.AlarmStatisticByTypeBox} >
            <div className={styles.singleAlarmFilter} >{operations}</div>
            <div className={styles.componentContainer}>
              <TimeSelect showDayPick={false} onChange={this.onTimeChange} />
              <PlanCompletionRate dateType={dateType} stationType={stationType} allStationAvalibaData={allStationAvalibaData} allStationStatisticData={allStationStatisticData} getAllStationStatisticData={getAllStationStatisticData} year={year} selectYear={selectYear}
                changeAllStationStore={changeAllStationStore} />
              <TargetTabs {...this.props} />
              <StationStatisticList {...this.props} />
            </div>

          </div>
          :
          <Tabs type="card" tabBarExtraContent={operations} activeKey={stationType} onChange={this.queryTargetData} >
            {/* <TabPane tab="风电" key={'0'}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                background: '#fff',
                background: "url('/img/undo.png') no-repeat center #fff"
              }}>
              </div>
            </TabPane> */}
            <TabPane tab="光伏" key={'1'}>
              <div className={styles.componentContainer}>
                <TimeSelect showDayPick={false} onChange={this.onTimeChange} />
                <PlanCompletionRate dateType={dateType} stationType={stationType} allStationAvalibaData={allStationAvalibaData} allStationStatisticData={allStationStatisticData} getAllStationStatisticData={getAllStationStatisticData} year={year} selectYear={selectYear}
                  changeAllStationStore={changeAllStationStore} />
                <TargetTabs {...this.props} />
                <StationStatisticList {...this.props} />
              </div>
            </TabPane>

          </Tabs>
        }
        {
          showStationSelect &&
          <StationSelectModal
            stations={stations.filter(e=>e.get('stationType') === 1)}
            onClose={() => this.setState({ showStationSelect: false })}
            onChangeStation={this.onChangeStation} />
        }
      </div >
    );
  }
}
export default withRouter(AllStationStatistic);
