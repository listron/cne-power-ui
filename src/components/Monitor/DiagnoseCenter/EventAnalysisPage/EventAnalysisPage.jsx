import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import ChartLine from './ChartLine';
import EventLineSearch from './EventLineSearch';
import ChartBar from './ChartBar';
import EventBarSearch from './EventBarSearch';
import styles from './eventAnalysis.scss';
import CneButton from '@components/Common/Power/CneButton';


class EventAnalysisPage extends PureComponent {

  static propTypes = {
    pageKey: PropTypes.string,
    analysisEvent: PropTypes.object,
    eventAnalysisInfo: PropTypes.object,
    history: PropTypes.object,
    changeStore: PropTypes.func,
    getEventsAnalysis: PropTypes.func,
  };

  titleName = {
    alarm: '告警事件',
    diagnose: '诊断事件',
    data: '数据事件',
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
    const { chartType, data } = eventAnalysisInfo || {};
    const { pointData } = data || {};
    const deviceInfo = pointData ? pointData[0] : {};
    const { deviceFullcode = '' } = deviceInfo || {};
    const [stationStr, devoceTypeStr] = deviceFullcode ? deviceFullcode.split('M') : [];
    let redirectPath = '/monitor/pvData/history';
    if (stationStr && devoceTypeStr) {
      redirectPath = `${redirectPath}?stationCode=${stationStr}&deviceTypeCode=${devoceTypeStr}`;
    }
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
            <Link to={redirectPath} target="_blank" className={styles.showMore}>
              <CneButton className={styles.shadow}>
                <span>
                  <span className="iconfont icon-moredata" />
                  <span>更多数据</span>
                </span>
              </CneButton>
            </Link>
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


