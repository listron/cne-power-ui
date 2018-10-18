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
    stationCode: PropTypes.array,
    AllStationAvalibaData: PropTypes.array,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    history: PropTypes.object,
    showPage: PropTypes.string,
    dateType: PropTypes.string,
    changeAllStationStore: PropTypes.func,
    getAllStationAvalibaData: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showStationSelect: false,
    };
  }
  componentDidMount() {
    const { getAllStationAvalibaData, year, dateType } = this.props;
    const currentYear = moment().format('YYYY');
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
  }
  componentWillReceiveProps(nextProps) {
    const { getAllStationAvalibaData, year, dateType } = this.props;
    const userId = getCookie('userId');
    const currentYear = moment().format('YYYY');
    const rangeYear = [moment().subtract(5, 'year').format('YYYY'), moment().format('YYYY')]
    // console.log(nextProps.year[0] !== this.props.year[0]);
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
    if (dateType !== nextProps.dateType && nextProps.dateType === 'year') {
      getAllStationAvalibaData(
        {
          userId: userId,
          year: rangeYear,
          dateType: nextProps.dateType,
        })
    }
    if (dateType !== nextProps.dateType && nextProps.dateType === 'month') {
      getAllStationAvalibaData(
        {
          userId: userId,
          year:currentYear ,
          dateType: nextProps.dateType,
        })
    }
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
        单电站告警统计
        <i className="iconfont icon-filter"></i>
      </div>
    );
    const { stationType, stations, dateType, year,AllStationAvalibaData } = this.props;
    const { showStationSelect } = this.state;
    console.log(dateType, year);
    return (
      <div className={styles.allStationTypeTabs}>
        <Tabs type="card" tabBarExtraContent={operations}  >
          <TabPane tab="光伏" key="1">
            <div className={styles.componentContainer}>
              <TimeSelect text={'统计时间选择'} {...this.props} />
              <PlanCompletionRate dateType={dateType} AllStationAvalibaData={AllStationAvalibaData} />
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