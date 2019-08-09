import React, { Component } from 'react';
import PropTypes from 'prop-types';
import searchUtil from '../../../../../utils/searchUtil';
import StopElecTypes from './StopElecTypes';
import ChartStopRank from './ChartStopRank';
import styles from './stop.scss';

class StopAnalysis extends Component {

  static propTypes = {
    // active: PropTypes.bool,
    // lostQuota: PropTypes.string,
    stopTopStringify: PropTypes.string,
    stopElecType: PropTypes.string,
    stopChartTimeMode: PropTypes.string,
    // lostChartDevice: PropTypes.object,
    // lostChartTime: PropTypes.string,
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
      this.props.changeStore({ stopElecType: 'all', stopChartTimeMode: 'month' });
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
    // const { quotaName } = this.state;
    const stopRank = [1, 2, 3, 4, 5, 6, 7, 8].map(e => ({
      deviceModeName: `${e}123jkl`,
      deviceName: `${e}fkwelfwlef`,
      deviceFullcode: `MMMMM${e}`,
      stopCount: parseInt(Math.random() * 100, 10),
      stopHour: parseInt(Math.random() * 100, 10),
    }))
    return (
      <div className={`${styles.stopAnalysis} ${styles.eachPage} ${active ? styles.active : styles.inactive}`}>
        <StopElecTypes {...this.props} />
        <ChartStopRank
          {...this.props}
          stopRank={stopRank}
        />
        {/* <ChartLostTrend
          {...this.props}
          quotaName={quotaName}
        />
        <ChartLostTypes {...this.props} lostChartDevice={lostChartDevice} lostChartTime={lostChartTime} /> */}
      </div>
    );
  }
}

export default StopAnalysis;


