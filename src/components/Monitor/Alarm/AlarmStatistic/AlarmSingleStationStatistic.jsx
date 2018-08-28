import React from "react";
import PropTypes from "prop-types";
import styles from './alarmStatistic.scss';
import { Icon, Tab } from 'antd';
const TabPane = Tab.TabPane;
class ALarmSingleStationStatistic extends React.Component {
  static propTypes = {
    stationItem: PropTypes.object,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    singleAlarmSummary: PropTypes.object,
    singleAlarmStatistic: PropTypes.array,
    getSingleStationAlarmStatistic: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showStationSelect: false
    };
  }

  componentDidMount() {
    const { stationItem, startTime, endTime } = this.props;
    this.props.getSingleStationAlarmStatistic({
      stationCode: stationItem.stationCode,
      startTime,
      endTime,
    });
  }

  onChangeFilter = (obj) => {
    const { stationItem, startTime, endTime } = this.props;
    let filter = {
      stationCode: stationItem.stationCode,
      startTime,
      endTime,
    }
    let newFiter = Object.assign({}, filter, obj);
    this.props.getSingleStationAlarmStatistic(newFiter);
  }

  renderTitle() {
    const { stationItem, singleAlarmSummary } = this.props;
    return (
      <div className={styles.title}>
      <div className={styles.stationName} onClick={()=>this.setState({showStationSelect:true})}>
        {stationItem.stationName}
      </div>
      <div className={styles.stationStatus}>
        {`电站状态：${singleAlarmSummary.stationStatusName}`}
        {singleAlarmSummary.stationStatus===0&&`时间：${singleAlarmSummary.interruptTime}`}
      </div>
      <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
      </div>
    );
  }

  renderFilter() {

  }

  renderSummary() {
    return (
      <div className={styles.alarmSummary}>

      </div>
    );

  }

  renderContent() {

  }

  render() {
    const {  }  = this.props;
    return (
      <div className={styles.singleAlarmStatistic}>
        {this.renderTitle()}
        {this.renderFilter()}
        {this.renderSummary()}
        {this.renderContent()}
      </div>
    );
  }
}
export default ALarmSingleStationStatistic;