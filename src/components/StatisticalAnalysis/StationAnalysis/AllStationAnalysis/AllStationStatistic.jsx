import React from "react";
import PropTypes from "prop-types";
import { Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import styles from './allStationStatistic.scss';
import StationSelectModal from './StationSelectModal.jsx';
// import TimeSelect from '../../../Common/TimeSelect';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import PlanCompletionRate from './Chart/PlanCompletionRate';
import TargetTabs from './TargetTabs.jsx';
// import { getCookie } from '../../../../utils/index.js';
import Cookie from 'js-cookie';
import moment from 'moment';
class AllStationStatistic extends React.Component {
  static propTypes = {
    stations: PropTypes.object,
    userId: PropTypes.string,
    stationType: PropTypes.string,
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
    const { getAllStationAvalibaData, changeAllStationStore, getAllStationStatisticData, getAllStationStatisticTableData, getAllStationMonthBarData, getAllStationMonthPieData, year, stationType, sortType, dateType, pageNum, pageSize, sort } = this.props;
    const currentYear = moment().format('YYYY');
    const curYear = Number(moment().format('YYYY'));
    const currentMonth = Number(moment().format('MM'));
    let time = year ? year : [`${currentYear}`];
    const userId = Cookie.get('userId')
    changeAllStationStore({ year: [`${currentYear}`], month: currentMonth })
    getAllStationAvalibaData(
      {
        userId: userId,
        year: time,
        dateType,
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
    //月->月
    if (dateType === 'month' && nextProps.dateType === 'month') {
      if (nextProps.year[0] !== this.props.year[0]) {
        getAllStationAvalibaData(
          {
            userId: userId,
            year: nextProps.year,
            dateType,
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
          dataType: 'EqpGen', stationType
        })
        getAllStationStatisticTableData(
          {

            year: curYear,
            dateType,
            month: nextProps.month,//默认当前月
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
      changeAllStationStore({
        year: rangeYear
      })
      getAllStationAvalibaData(
        {
          userId: userId,
          year: rangeYear,
          dateType: nextProps.dateType,
        })
      getAllStationStatisticData(
        {
          userId: userId,
          year: curYearPlan,
          dateType: nextProps.dateType,
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
          month: currentMonth,//默认当前月
          pageNum: nextProps.pageNum, // 当前页
          //pageNum: 1, // 当前页
          pageSize, // 每页条数
          sortType,
          sort,
        }
      )

    }
    //年->月
    if (dateType !== nextProps.dateType && nextProps.dateType === 'month') {
      changeAllStationStore({ year: currentYear, month: currentMonth })
      getAllStationAvalibaData(
        {
          userId: userId,
          year: currentYear,
          dateType: nextProps.dateType,
        })

      getAllStationStatisticData(
        {
          userId: userId,
          year: currentTableYear,
          dateType: nextProps.dateType,
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
        dataType: 'EqpGen'
      })
    }
    //年->年
    if (dateType === 'year' && nextProps.dateType === 'year') {
      if (nextProps.year[0] !== this.props.year[0] || nextProps.year[1] !== this.props.year[1]) {
        getAllStationAvalibaData(
          {
            userId: userId,
            year: nextProps.year,
            dateType,
          }
        )
        getAllStationStatisticData(
          {
            userId: userId,
            year: curYearPlan,
            dateType,
          }
        )
        getAllStationMonthBarData({
          userId: userId,
          year: nextProps.year,
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
    });
  }
  onTimeChange = (timeObj) => {
    timeObj.timeStyle === 'year' ? this.props.changeAllStationStore({ dateType: timeObj.timeStyle, year: [timeObj.startTime, timeObj.endTime] }) : this.props.changeAllStationStore({ dateType: timeObj.timeStyle, year: [timeObj.startTime] })
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
    const { stationType } = this.props;
    this.props.changeAllStationStore({
      stationType: activeKey
    });
  }
  render() {
    const TabPane = Tabs.TabPane;
    const operations = (
      <div className={styles.operation} style={{ marginRight: '50px', color: '#199475' }} onClick={this.showStationSelect}>
        查看单电站
        <i className="iconfont icon-filter"></i>
      </div>
    );
    const { stationType, stations, dateType, year, allStationAvalibaData, allStationStatisticData, getAllStationStatisticData } = this.props;
    const { showStationSelect } = this.state;
    return (
      <div className={styles.allStationTypeTabs}>
        <Tabs type="card" tabBarExtraContent={operations} activeKey={stationType} onChange={this.queryTargetData} >
          <TabPane tab="光伏" key="1">
            <div className={styles.componentContainer}>
              <TimeSelect showDayPick={false} onChange={this.onTimeChange} />
              <PlanCompletionRate dateType={dateType} stationType={stationType} allStationAvalibaData={allStationAvalibaData} allStationStatisticData={allStationStatisticData} getAllStationStatisticData={getAllStationStatisticData} year={year} />
              <TargetTabs {...this.props} />
            </div>
          </TabPane>
          <TabPane tab="风电" key="0">
          </TabPane>
        </Tabs>
        {showStationSelect &&
          <StationSelectModal
            stations={stations}
            onClose={() => this.setState({ showStationSelect: false })}
            onChangeStation={this.onChangeStation} />}
      </div>
    );
  }
}
export default withRouter(AllStationStatistic);
