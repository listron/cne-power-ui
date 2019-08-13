import React, { Component } from 'react';
import PropTypes from 'prop-types';
import searchUtil from '../../../../../utils/searchUtil';
import StopElecTypes from './StopElecTypes';
import ChartStopRank from './ChartStopRank';
import ChartStopTrend from './ChartStopTrend';
import ChartStopTypes from './ChartStopTypes';
import styles from './stop.scss';

class StopAnalysis extends Component {

  static propTypes = {
    stopTopStringify: PropTypes.string,
    stopElecType: PropTypes.string,
    stopChartTimeMode: PropTypes.string,
    location: PropTypes.object,
    changeStore: PropTypes.func,
    getStopElec: PropTypes.func,
    getStopRank: PropTypes.func,
    getStopTrend: PropTypes.func,
    getStopTypes: PropTypes.func,
  }

  componentDidMount(){
    const { stopTopStringify, location } = this.props;
    const { search } = location;
    const infoStr = searchUtil(search).getValue('station');
    const originLoad = infoStr && !stopTopStringify; // // 初次加载
    const pageBack = stopTopStringify && infoStr && infoStr !== stopTopStringify; // 其他两个页面修改路径信息后返回
    if (originLoad || pageBack) {
      const originParam = this.getQueryParam(infoStr);
      this.props.changeStore({
        stopElecType: 'all',
        stopChartTimeMode: 'month',
        stopTopStringify: infoStr,
      });
      this.props.getStopElec({ ...originParam });
      this.props.getStopRank({ ...originParam, parentFaultId: 'all' });
      this.props.getStopTrend({ ...originParam, parentFaultId: 'all', type: 'month' });
      this.props.getStopTypes({ ...originParam });
    }
  }

  componentWillReceiveProps(nextProps){
    const nextLocation = nextProps.location;
    const nextSearch = nextLocation.search || '';
    const { stopTopStringify, changeStore, stopElecType, stopChartTimeMode } = this.props;
    const infoStr = searchUtil(nextSearch).getValue('station');
    if (infoStr && infoStr !== stopTopStringify) { // 搜索信息有变
      const originParam = this.getQueryParam(infoStr);
      changeStore({ stopTopStringify: infoStr });
      this.props.getStopElec({ ...originParam });
      this.props.getStopRank({ ...originParam, parentFaultId: stopElecType });
      this.props.getStopTrend({ ...originParam, parentFaultId: stopElecType, type: stopChartTimeMode });
      this.props.getStopTypes({ ...originParam });
    }
  }

  getQueryParam = (infoStr) => {
    const searchParam = JSON.parse(infoStr) || {};
    return {
      stationCodes: [searchParam.searchCode],
      deviceFullcodes: searchParam.searchDevice,
      startTime: searchParam.searchDates[0],
      endTime: searchParam.searchDates[1],
    };
  }

  render() {
    const { active, lostChartDevice, stopChartTimeMode } = this.props;
    return (
      <div className={`${styles.stopAnalysis} ${styles.eachPage} ${active ? styles.active : styles.inactive}`}>
        <StopElecTypes {...this.props} />
        <ChartStopRank {...this.props} />
        <ChartStopTrend {...this.props} />
        <ChartStopTypes {...this.props} />
      </div>
    );
  }
}

export default StopAnalysis;


