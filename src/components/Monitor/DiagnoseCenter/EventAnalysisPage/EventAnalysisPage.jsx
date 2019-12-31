import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Select, DatePicker } from 'antd';
import ChartLine from './ChartLine';
import styles from './eventAnalysis.scss';
const { Option } = Select;

class EventAnalysisPage extends PureComponent {

  static propTypes = {
    pageKey: PropTypes.string,
    analysisEvent: PropTypes.object,
    changeStore: PropTypes.func,
  };

  titleName = {
    alarm: '告警事件',
    diagnose: '诊断事件',
    data: '数据事件',
  }

  showMore = () => {
    console.log('todo 查看更多');
  }

  backList = () => { // 返回列表页, 清空数据;
    this.props.changeStore({
      showAnalysisPage: false,
      analysisEvent: {},
      eventAnalysisInfo: {},
    });
  }

  onIntervalChange = (interval) => {
    console.log(interval);
  }

  onDateChange = (date) => {
    console.log(date);
  }

  render(){
    const { pageKey, analysisEvent } = this.props;
    const { eventName, pointValueDesc, deviceTypeName } = analysisEvent || {};
    return (
      <section className={styles.eventAnalysis}>
        <h3 className={styles.detailTop}>
          <span className={styles.titleInfo}>
            <span className={styles.titleName}>诊断分析</span>
            <span className={styles.infoText}>{this.titleName[pageKey]}： { eventName || '--'}</span>
            {pageKey === 'alarm' && <span className={styles.infoText}>告警描述： { pointValueDesc || '--'}</span>}
            <span className={styles.infoText}>设备类型： {deviceTypeName || '--'}</span>
          </span>
          <span className={styles.topHandle}>
            <Button onClick={this.showMore} className={styles.showMore}>
              <span className={styles.shadow}>
                <span className="iconfont icon-gd4" />
                <span>更多数据</span>
              </span>
            </Button>
            <Icon onClick={this.backList} type="arrow-left" className={styles.backIcon} />
          </span>
        </h3>
        <div className={styles.analysisSearch}>
          <strong className={styles.searchText}>告警诊断指标时序图</strong>
          <span className={styles.searchParts}>
            <span className={styles.intervalText}>数据时间间隔</span>
            <Select className={styles.intervalSelect} style={{ width: '114px' }} onChange={this.onIntervalChange}>
              <Option value={1}>10分钟</Option>
              <Option value={2}>5秒钟</Option>
            </Select>
            <Icon className={styles.leftIcon} type="left" />
            <DatePicker className={styles.dateSelect} style={{ width: '128px' }} onChange={this.onDateChange} />
            <Icon className={styles.rightIcon} type="right" />
          </span>
        </div>
        <ChartLine {...this.props} />
      </section>
    );
  }
}

export default EventAnalysisPage;


