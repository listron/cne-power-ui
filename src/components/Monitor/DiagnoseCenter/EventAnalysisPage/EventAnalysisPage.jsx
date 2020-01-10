import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import ChartLine from './ChartLine';
import EventLineSearch from './EventLineSearch';
import ChartBar from './ChartBar';
import EventBarSearch from './EventBarSearch';
import styles from './eventAnalysis.scss';

class EventAnalysisPage extends PureComponent {

  static propTypes = {
    pageKey: PropTypes.string,
    analysisEvent: PropTypes.object,
    eventAnalysisInfo: PropTypes.object,
    changeStore: PropTypes.func,
    getEventsAnalysis: PropTypes.func,
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

  render(){
    const { pageKey, analysisEvent, eventAnalysisInfo } = this.props;
    const { eventName, pointValueDesc, deviceTypeName } = analysisEvent || {};
    const { chartType } = eventAnalysisInfo || {};
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
        {chartType === 1 && <EventLineSearch {...this.props} />}
        {chartType === 2 && <EventBarSearch {...this.props} />}
        {chartType === 1 && <ChartLine {...this.props} />}
        {chartType === 2 && <ChartBar {...this.props} />}
      </section>
    );
  }
}

export default EventAnalysisPage;


