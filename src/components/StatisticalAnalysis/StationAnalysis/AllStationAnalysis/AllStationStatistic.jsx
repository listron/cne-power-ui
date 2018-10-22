import React from "react";
import PropTypes from "prop-types";
import { Tabs, TimePicker } from 'antd';
import { withRouter } from 'react-router-dom';
import styles from './allStationStatistic.scss';
// import AlarmStatisticByType from './AlarmStatisticByType';
import StationSelectModal from './StationSelectModal.jsx';
import TimeSelect from '../../../Common/TimeSelect';
import PlanCompletionRate from './CommonGraph/PlanCompletionRate';
import TargetTabs from './TargetTabs.jsx';
import { getCookie } from '../../../../utils/index.js';
import moment from 'moment';


class AllStationStatistic extends React.Component {
  static propTypes = {
    stations: PropTypes.object,

    stationType: PropTypes.string,
    sortType: PropTypes.string,
    stationCode: PropTypes.array,
    AllStationAvalibaData: PropTypes.array,
    AllStationStatisticData: PropTypes.object,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    history: PropTypes.object,
    showPage: PropTypes.string,
    dateType: PropTypes.string,
    changeAllStationStore: PropTypes.func,
    getAllStationAvalibaData: PropTypes.func,
    getAllStationStatisticData: PropTypes.func,
    getAllStationStatisticTableData: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showStationSelect: false,
    };
  }
  componentDidMount() {
    const { getAllStationAvalibaData, getAllStationStatisticData, getAllStationStatisticTableData, year, sortType, dateType, pageNum, pageSize } = this.props;
    const currentYear = moment().format('YYYY');
    const curYear = Number(moment().format('YYYY'));

    const currentMonth = Number(moment().format('MM'));
    let time = year ? year : [`${currentYear}`];
    console.log(time);
    const userId = getCookie('userId');
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
        year: time,
        dateType,
      }
    )
    getAllStationStatisticTableData(
      {
        userId: userId,
        year: curYear,
        dateType,
        month: currentMonth,//默认当前月
        pageNum, // 当前页
        pageSize, // 每页条数
        sortType,
        sort: '计划完成率'

      }
    )

  }
  componentWillReceiveProps(nextProps) {
    const { getAllStationAvalibaData, year, dateType } = this.props;
    const userId = getCookie('userId');
    const currentYear = moment().format('YYYY');
    const selectYear = [Number(moment().subtract(5, 'year').format('YYYY')), Number(moment().format('YYYY'))];
    let rangeYear = [];
    for (let i = selectYear[0]; i < selectYear[1]+1; i++) {
      rangeYear.push(i.toString())
    }
 
    // console.log(nextProps.year[0] !== this.props.year[0]);
    //月->月
    if (dateType === 'month' && nextProps.dateType === 'month') {
      if (nextProps.year[0] !== this.props.year[0]) {
        getAllStationAvalibaData(
          {
            userId: userId,
            year: nextProps.year,
            dateType,
          }
        )
      }
    }
    //月->年
    if (dateType !== nextProps.dateType && nextProps.dateType === 'year') {
      getAllStationAvalibaData(
        {
          userId: userId,
          year: rangeYear,
          dateType: nextProps.dateType,
        })
    }
    //年->月
    if (dateType !== nextProps.dateType && nextProps.dateType === 'month') {
      getAllStationAvalibaData(
        {
          userId: userId,
          year: currentYear,
          dateType: nextProps.dateType,
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
      }
    }
  }

  onChangeStation = (stationCode) => {
    this.props.history.push(`/statistical/stationaccount/allstation`);
    this.props.changeAllStationStore({
      showPage: 'single',
      singleStationCode: stationCode.toString()
    });
  }

  showStationSelect = () => {
    this.setState({
      showStationSelect: true
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
    const { stationType, stations, dateType, year, AllStationAvalibaData, AllStationStatisticData ,getAllStationStatisticData} = this.props;
    const { showStationSelect } = this.state;
    console.log(dateType, year);
    return (
      <div className={styles.allStationTypeTabs}>
        <Tabs type="card" tabBarExtraContent={operations}  >
          <TabPane tab="光伏" key="1">
            <div className={styles.componentContainer}>
              <TimeSelect text={'统计时间选择'} {...this.props} />
              <PlanCompletionRate dateType={dateType} AllStationAvalibaData={AllStationAvalibaData} AllStationStatisticData={AllStationStatisticData} getAllStationStatisticData={getAllStationStatisticData} />
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