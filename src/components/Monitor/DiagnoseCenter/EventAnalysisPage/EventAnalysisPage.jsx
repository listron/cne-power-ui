import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Spin } from 'antd';
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
    eventAnalysisLoading: PropTypes.bool,
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
    const { pageKey, analysisEvent, eventAnalysisInfo, eventAnalysisLoading } = this.props;
    const { eventName, pointValueDesc, deviceTypeName, deviceName, stationName } = analysisEvent || {};
    const { chartType, deviceFullcode } = eventAnalysisInfo || {};
    const [stationStr, devoceTypeStr] = deviceFullcode ? deviceFullcode.split('M') : [];
    let redirectPath = '/monitor/pvData/history';
    if (stationStr && devoceTypeStr) {
      redirectPath = `${redirectPath}?stationCode=${stationStr}&deviceTypeCode=${devoceTypeStr}`;
    }
    return (
      <section className={styles.eventAnalysis}>
        <h3 className={styles.detailTop}>
          <span className={styles.titleInfo}>
            <span className={styles.titleName}><span className={styles.icon}><i className="iconfont icon-zhenduan"></i></span>诊断分析</span>
            <span className={styles.infoText}><span className={styles.text}>{this.titleName[pageKey]}：</span> { eventName || '--'}；</span>
            {pageKey === 'alarm' && <span className={styles.infoText}><span className={styles.text}>告警描述：</span> { pointValueDesc || '--'}；</span>}
            <span className={styles.infoText}><span className={styles.text}>设备类型：</span> {deviceTypeName || '--'}；</span>
            <span className={styles.infoText}><span className={styles.text}>设备名称：</span> {deviceName || '--'}；</span>
            <span className={styles.infoText}><span className={styles.text}>电站名称：</span><span className={styles.stationName} title={stationName}> {stationName || '--'}；</span></span>
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
            {/* <Button className={styles.showMore}>
              <span className={styles.shadow}>
                <span className="iconfont icon-gd4" />
                <span>更多数据</span>
              </span>
            </Button> */}
            <div className={styles.backIcon}><i className={'iconfont icon-fanhui'} onClick={this.backList} /></div>
          </span>
        </h3>
        {eventAnalysisLoading ?
        <div className={styles.detailContent}>
          {chartType === 1 && <EventLineSearch {...this.props} />}
          {chartType === 2 && <EventBarSearch {...this.props} />}
          {chartType === 1 && <ChartLine {...this.props} />}
          {chartType === 2 && <ChartBar {...this.props} />}
        </div> :
        <div className={styles.spin}><Spin /></div>}
      </section>
    );
  }
}

export default EventAnalysisPage;



