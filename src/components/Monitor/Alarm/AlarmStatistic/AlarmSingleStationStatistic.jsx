import React from 'react';
import PropTypes from 'prop-types';
import styles from './alarmStatistic.scss';
import { Icon, DatePicker, Select, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import AlarmSingleStationGraph from './AlarmSingleStationGraph';
import AlarmSingleStationTable from './AlarmSingleStationTable';
import ChangeStation from '../../StationMonitor/SingleStation/SingleStationCommon/ChangeStation';
import moment from 'moment';
import { dataFormat } from '../../../../utils/utilFunc';
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const TabPane = Tabs.TabPane;

class ALarmSingleStationStatistic extends React.Component {
  static propTypes = {
    stations: PropTypes.object,
    showPage: PropTypes.string,
    singleStationCode: PropTypes.string,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    singleAlarmSummary: PropTypes.object,
    singleAlarmStatistic: PropTypes.array,
    summaryType: PropTypes.number,
    getSingleStationAlarmStatistic: PropTypes.func,
    changeAlarmStatisticStore: PropTypes.func,
    showPage: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      showStationSelect: false,
      showTimeSelect: false,
      key: 'graph',
      pageNum: 1,
      pageSize: 10,
    };
  }

  componentDidMount() {
    if (this.props.showPage === 'single') {
      const { singleStationCode, summaryType, orderField, orderCommand } = this.props;
      const { pageNum, pageSize } = this.state;
      this.props.getSingleStationAlarmStatistic({
        stationCode: singleStationCode,
        startTime: moment().subtract(30, 'days').utc().format(),
        endTime: moment().utc().format(),
        summaryType,
        pageSize,
        pageNum,
        orderField,
        orderCommand,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { startTime, endTime, summaryType, singleStationCode, orderField, orderCommand, showPage } = nextProps;
    const { pageSize, pageNum } = this.state;
    if (singleStationCode !== this.props.singleStationCode && showPage === 'single') {
      this.props.getSingleStationAlarmStatistic({
        stationCode: singleStationCode,
        startTime: startTime,
        endTime: endTime,
        summaryType,
        pageSize,
        pageNum,
        orderField,
        orderCommand,
      });
    }
  }

  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    this.setState({
      pageNum: currentPage,
      pageSize,
    });
  }

  onChangeFilter = (obj) => {
    const { singleStationCode, startTime, endTime, summaryType, orderField, orderCommand } = this.props;
    const { pageSize } = this.state;
    const filter = {
      stationCode: singleStationCode,
      startTime,
      endTime,
      summaryType,
      pageSize,
      orderField,
      orderCommand,
    };
    this.setState({ pageNum: 1 });
    const newFiter = { ...filter, ...obj, pageNum: 1 };
    this.props.getSingleStationAlarmStatistic(newFiter);
  }

  onChangeTime = (value, dateString) => {
    const startTime = value[0].utc().format();
    const endTime = value[1].utc().format();
    this.onChangeFilter({
      startTime,
      endTime,
    });
  }

  onClose = () => {
    this.props.changeAlarmStatisticStore({
      showPage: 'multiple',
      singleStationCode: '',
    });
  }

  onChangeTab = (key) => {
    this.setState({ key, pageNum: 1 });
    const { singleStationCode, startTime, endTime, summaryType, orderField, orderCommand } = this.props;
    const { pageSize, pageNum } = this.state;
    if (key === 'graph') {
      this.props.getSingleStationAlarmStatistic({
        stationCode: singleStationCode,
        startTime,
        endTime,
        summaryType,
        orderField: '',
        orderCommand: '',
      });
    } else if (key === 'table') {
      this.props.getSingleStationAlarmStatistic({
        stationCode: singleStationCode,
        startTime,
        endTime,
        summaryType,
        pageSize: pageSize ? pageSize : 10,
        pageNum: pageNum ? pageNum : 1,
        orderField: orderField !== '' ? orderField : '',
        orderCommand: orderField !== '' ? orderCommand : '',
      });
    }
  }

  onChangeDuration = (value) => {
    let startTime, endTime;
    if (value === 'other') {
      this.setState({ showTimeSelect: true });
    } else {
      this.setState({ showTimeSelect: false });
      if (value === 'today') {
        startTime = moment().hour(0).minute(0).second(0).utc().format();
        endTime = moment().utc().format();
      } else if (value === 'yesterday') {
        startTime = moment().subtract(1, 'days').hour(0).minute(0).second(0).utc().format();
        endTime = moment().subtract(1, 'days').hour(23).minute(59).second(59).utc().format();
      } else if (value === 'last7') {
        startTime = moment().subtract(7, 'days').utc().format();
        endTime = moment().utc().format();
      } else if (value === 'last30') {
        startTime = moment().subtract(30, 'days').utc().format();
        endTime = moment().utc().format();
      }
      this.onChangeFilter({
        startTime,
        endTime,
      });
    }
  }

  onCalendarChange = (dates) => {
    if (dates.length === 1) {
      this.start = dates[0].format('YYYY-MM-DD');
    } else {
      this.start = null;
    }
  }
  disabledDate = (current) => {
    if (this.start) {
      const end = moment(this.start).add(30, 'days');
      return current > moment.min(moment().endOf('day'), end);
    }
    return current && current > moment().endOf('day');

  }

  hideStationChange = () => {
    this.setState({
      showStationSelect: false,
    });
  }

  renderTitle() {
    const { singleStationCode, singleAlarmSummary, stations } = this.props;
    const { showStationSelect } = this.state;
    const stationItem = stations.find(station => station.get('stationCode').toString() === singleStationCode).toJS();
    return (
      <div className={styles.title}>
        {showStationSelect &&
          <ChangeStation stations={stations.toJS()} stationName={stationItem.stationName} baseLinkPath="/monitor/alarm/statistic" hideStationChange={this.hideStationChange} />}
        <div className={styles.titleLeft}>
          <div onClick={() => this.setState({ showStationSelect: true })} className={styles.stationName}>
            <Icon className={styles.icon} type="swap" /><span>{stationItem.stationName}</span>
          </div>
          <div className={styles.stationStatus}>
            <div className={styles.status}>{`电站状态：${singleAlarmSummary && singleAlarmSummary.stationStatusName ? singleAlarmSummary.stationStatusName : '- -'}`}</div>
            <div>{singleAlarmSummary && singleAlarmSummary.stationStatus === '500' && `时间：${singleAlarmSummary && singleAlarmSummary.interruptTime}`}</div>
          </div>
        </div>
        <Link to="/monitor/alarm/statistic"><Icon type="arrow-left" className={styles.backIcon} onClick={this.onClose} /></Link>
      </div>
    );
  }

  renderFilter() {
    const { showTimeSelect } = this.state;
    return (
      <div className={styles.filter}>
        <div className={styles.label}>筛选条件</div>
        <Select className={styles.duration} dropdownClassName={styles.dropdownMenu} defaultValue="last30" style={{ width: 120 }} onChange={this.onChangeDuration}>
          <Option value="today">今天</Option>
          <Option value="yesterday">昨天</Option>
          <Option value="last7">最近7天</Option>
          <Option value="last30">最近30天</Option>
          <Option value="other">其他时间段</Option>
        </Select>
        {showTimeSelect &&
          <RangePicker
            showTime={false}
            disabledDate={this.disabledDate}
            onCalendarChange={this.onCalendarChange}
            format="YYYY-MM-DD"
            format="YYYY-MM-DD"
            placeholder={['Start Time', 'End Time']}
            onChange={this.onChangeTime}
          />
        }
      </div>
    );
  }

  renderSummary() {
    const { singleStationCode, singleAlarmSummary, stations } = this.props;

    singleAlarmSummary.transferWorkRate = null;
    const stationItem = stations.find(station => station.get('stationCode').toString() === singleStationCode).toJS();
    return (
      <div className={styles.alarmSummary}>
        <i className={stationItem.stationType === 0 ? 'iconfont icon-summary icon-windlogo' : 'iconfont icon-summary icon-pvlogo'} />
        <div className={styles.summaryItem}>
          <span className={styles.alarmNum}>{singleAlarmSummary && dataFormat(singleAlarmSummary.alarmNum, '--')}</span>
          <span className={styles.alarmText}>告警数</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.alarmNum}>{singleAlarmSummary && dataFormat(singleAlarmSummary.transferWorkAlarmNum, '--')}</span>
          <span className={styles.alarmText}>转工单告警数</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.alarmNum}>{singleAlarmSummary && dataFormat(+singleAlarmSummary.transferWorkRate, '--') + '%'}</span>
          <span className={styles.alarmText}>转工单率</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.alarmNum}>{singleAlarmSummary && dataFormat(singleAlarmSummary.eliminateAlarmNum, '--')}</span>
          <span className={styles.alarmText}>告警消除数</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.alarmNum}>{singleAlarmSummary && singleAlarmSummary.eliminateAlarmAvgTime}</span>
          <span className={styles.alarmText}>平均处理时间</span>
        </div>
      </div>
    );
  }

  renderContent() {
    const { key, pageNum, pageSize } = this.state;
    return (
      <Tabs activeKey={key} onChange={this.onChangeTab} className={styles.tabContainer} animated={false}>
        <TabPane
          tab={<i className="iconfont icon-grid"></i>}
          key="graph"
        >
          <AlarmSingleStationGraph {...this.props} />
        </TabPane>
        <TabPane
          tab={<i className="iconfont icon-table"></i>}
          key="table"
        >
          <AlarmSingleStationTable
            {...this.props}
            pageNum={pageNum}
            pageSize={pageSize}
            onPaginationChange={this.onPaginationChange}
          />
        </TabPane>
      </Tabs>
    );
  }

  render() {
    if (this.props.stations.size === 0) {
      return null;
    }
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
