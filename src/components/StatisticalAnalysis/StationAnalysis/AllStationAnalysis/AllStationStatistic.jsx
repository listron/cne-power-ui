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



class AllStationStatistic extends React.Component {
  static propTypes = {
    stations: PropTypes.object,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    history: PropTypes.object,
    getStationsAlarmStatistic: PropTypes.func,
    showPage: PropTypes.string,
    changeAlarmStatisticStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showStationSelect: false,
    };
  }
  componentDidMount() {

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
    const { stationType, stations,dateType } = this.props;
    const { showStationSelect } = this.state;
    return (
      <div className={styles.allStationTypeTabs}>
        <Tabs type="card" tabBarExtraContent={operations}  >
          <TabPane tab="光伏" key="1">
          <div className={styles.componentContainer}>
          <TimeSelect text={'统计时间选择'} {...this.props} />
          <PlanCompletionRate dateType={dateType} />
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