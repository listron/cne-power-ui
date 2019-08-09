import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { areaAchieveAction } from './areaAchieveReducer';
import AreaSearch from '../../../../components/HighAnalysis/Achievement/AreaAchieve/AreaSearch/AreaSearch';
import AreaChart from '../../../../components/HighAnalysis/Achievement/AreaAchieve/AreaChart/AreaChart';
import StationPBAChart from '../../../../components/HighAnalysis/Achievement/AreaAchieve/StationPBAChart/StationPBAChart';
import AreaTrendChart from '../../../../components/HighAnalysis/Achievement/AreaAchieve/AreaTrendChart/AreaTrendChart';
import AreaLossChart from '../../../../components/HighAnalysis/Achievement/AreaAchieve/AreaLossChart/AreaLossChart';

import styles from './areaAchieve.scss';
import searchUtil from '../../../../utils/searchUtil';

class AreaAchieve extends Component {

  static propTypes = {
    getStationCapacity: PropTypes.func,
    getQuotaInfo: PropTypes.func,
    getModesInfo: PropTypes.func,
    getLostGenHour: PropTypes.func,
    getTrendInfo: PropTypes.func,
    getIndicatorRank: PropTypes.func,
    getIndicatorRankTotal: PropTypes.func,
    location: PropTypes.object,
    rankTotal: PropTypes.array,
  };

  componentDidMount(){
    const { search } = this.props.location;
    const groupInfoStr = searchUtil(search).getValue('area');
    const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
    const {
      searchCode = [],
      stations = [],
      modes = [],
      dates = [],
      quota = [],
      modesInfo = [],
    } = groupInfo;
    console.log(modesInfo, 'modesInfo');
    const dataLen = searchCode.length !== 0 && stations.length !== 0 && modes.length !== 0 && dates.length !== 0 && quota.length !== 0;
    if(dataLen) {
      // 默认指标分析
      const quotaValue = quota[1] || quota[0];
      const paramsCapacity = {
        deviceModes: modes,
        regionName: [stations[0].regionName],
        startTime: dates[0],
        endTime: dates[1],
        stationCodes: searchCode,
        manufactorIds: modesInfo.map(cur => {
          return cur.value;
        }),
      };
      const paramsHour = {
        stationCodes: paramsCapacity.stationCodes,
        startTime: '2014-08-08',
        endTime: paramsCapacity.endTime,
        manufactorIds: paramsCapacity.manufactorIds,
        deviceModes: paramsCapacity.deviceModes,
      };
      const paramsTrend = {
        regionName: paramsCapacity.regionName,
        indicatorCode: quotaValue,
        stationCodes: paramsCapacity.stationCodes,
        startTime: paramsCapacity.startTime,
        endTime: paramsCapacity.endTime,
        type: 2, // 默认按月
      };
      const paramsRank = {
        indicatorCode: quotaValue,
        stationCodes: paramsCapacity.stationCodes,
        startTime: paramsCapacity.startTime,
        endTime: paramsCapacity.endTime,
      };
      const paramsTotal = {
        deviceModes: paramsCapacity.deviceModes,
        regionName: paramsCapacity.regionName,
        indicatorCode: quotaValue,
        startTime: paramsCapacity.startTime,
        endTime: paramsCapacity.endTime,
        stationCodes: paramsCapacity.stationCodes,
        manufactorIds: paramsCapacity.manufactorIds,
      };
      this.props.getStationCapacity(paramsCapacity);
      this.props.getLostGenHour(paramsHour);
      this.props.getTrendInfo(paramsTrend);
      this.props.getIndicatorRank(paramsRank);
      this.props.getIndicatorRankTotal(paramsTotal);
    }
  }

  componentWillReceiveProps(nextProps){
    const nextSearch = nextProps.location.search;
    const nextModesInfo = nextProps.modesInfo;
    const nextQuotaInfo = nextProps.quotaInfo;
    const nextAreaStation = nextProps.areaStation;
    const nextCapacityTime = nextProps.capacityTime;
    const nextRankTime = nextProps.rankTime;
    const nextTrendTime = nextProps.trendTime;
    const nextLostTime = nextProps.lostTime;
    const { search } = this.props.location;
    const { modesInfo, quotaInfo, areaStation } = this.props;
    const groupNextInfoStr = searchUtil(nextSearch).getValue('area');
    const groupInfoStr = searchUtil(search).getValue('area');
    // console.log(groupInfoStr, 'groupInfoStr');
    console.log(groupNextInfoStr, 'groupNextInfoStr');
    if (groupNextInfoStr && groupNextInfoStr === groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupNextInfoStr) : {};
      // console.log(groupNextInfoStr, '1');
    }
    // 首次进来
    if (groupNextInfoStr === groupInfoStr && !groupNextInfoStr) {
      // console.log(modesInfo, quotaInfo, areaStation, '11111');
      // console.log(nextModesInfo, nextQuotaInfo, nextAreaStation, '2222');
      // console.log(nextCapacityTime, 'nextCapacityTime');
      // console.log(nextModesInfo.length > 0 && nextQuotaInfo.length > 0 && nextAreaStation.length > 0 && nextCapacityTime === 0 && nextRankTime === 0 && nextTrendTime === 0 && nextLostTime === 0, '+++');
      // console.log(nextCapacityTime === 0 && nextRankTime === 0 && nextTrendTime === 0 && nextLostTime === 0, '====');
      const dataLen = nextModesInfo.length > 0 && nextQuotaInfo.length > 0 && nextAreaStation.length > 0;
      const timeStamp = nextCapacityTime === 0 && nextRankTime === 0 && nextTrendTime === 0 && nextLostTime === 0;
      if (dataLen && timeStamp) {
        const defaultStartTime = moment().subtract(1, 'year').format('YYYY-MM-DD');
        const defaultEndTime = moment().format('YYYY-MM-DD');
        const stations = []; // 电站stationCode
        areaStation[0].stations.forEach(e => {
          stations.push(e.stationCode);
        });
        // 厂家code
        const manufactorId = nextModesInfo.map(cur => {
          return cur.value;
        });

        // 机型code
        const codes = [];
        nextModesInfo.forEach(e => {
          const { children = [] } = e || {};
          children.forEach(m => {
            codes.push(m.value);
          });
        });
        const paramsCapacity = {
          deviceModes: codes,
          regionName: [areaStation[0].regionName],
          startTime: defaultStartTime,
          endTime: defaultEndTime,
          stationCodes: stations,
          manufactorIds: manufactorId,
        };
        // 默认指标分析
        const quotaValue = nextQuotaInfo[0].children.length === 0 ? nextQuotaInfo[0].value : nextQuotaInfo[0].children[0].value;
        const paramsHour = {
            stationCodes: paramsCapacity.stationCodes,
            startTime: paramsCapacity.startTime,
            endTime: paramsCapacity.endTime,
            manufactorIds: paramsCapacity.manufactorIds,
            deviceModes: paramsCapacity.deviceModes,
        };
        const paramsTrend = {
            regionName: paramsCapacity.regionName,
            indicatorCode: quotaValue,
            stationCodes: paramsCapacity.stationCodes,
            startTime: paramsCapacity.startTime,
            endTime: paramsCapacity.endTime,
            type: 2, // 默认按月
        };
        const paramsRank = {
          indicatorCode: quotaValue,
          stationCodes: paramsCapacity.stationCodes,
          startTime: paramsCapacity.startTime,
          endTime: paramsCapacity.endTime,
        };
        const paramsTotal = {
          deviceModes: paramsCapacity.deviceModes,
          regionName: paramsCapacity.regionName,
          indicatorCode: quotaValue,
          startTime: paramsCapacity.startTime,
          endTime: paramsCapacity.endTime,
          stationCodes: paramsCapacity.stationCodes,
          manufactorIds: paramsCapacity.manufactorIds,
        };
        this.props.getStationCapacity(paramsCapacity);
        this.props.getLostGenHour(paramsHour);
        this.props.getTrendInfo(paramsTrend);
        this.props.getIndicatorRank(paramsRank);
        this.props.getIndicatorRankTotal(paramsTotal);
      }
    }
  }

  render() {
    const { rankTotal } = this.props;
    return (
      <div className={styles.areaAchieveBox}>
        <AreaSearch {...this.props} />
        <div className={styles.areaTitle}>
          {1 === 1 ? (
            <span>{rankTotal.length > 0 ? `${rankTotal[0].regionName}: PBA ${rankTotal[0].indicatorData.value}%` : '--:--'}</span>
          ) : (
            <span>{`${rankTotal[0].regionName}: 实发小时数${rankTotal[0].indicatorData.actualGen} 应发小时数${rankTotal[0].indicatorData.theoryGen}`}</span>
          )}
        </div>
        <div className={styles.areaChartBox}>
          <div className={styles.areaTopChart}>
            <AreaChart {...this.props} />
            <StationPBAChart {...this.props} />
          </div>
          <div className={styles.areaBottomChart}>
            <AreaTrendChart {...this.props} />
            <AreaLossChart {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveArea.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  getStationCapacity: (payload) => dispatch({type: areaAchieveAction.getStationCapacity, payload}),
  getLostGenHour: (payload) => dispatch({type: areaAchieveAction.getLostGenHour, payload}),
  getTrendInfo: (payload) => dispatch({type: areaAchieveAction.getTrendInfo, payload}),
  getIndicatorRank: (payload) => dispatch({type: areaAchieveAction.getIndicatorRank, payload}),
  getIndicatorRankTotal: (payload) => dispatch({type: areaAchieveAction.getIndicatorRankTotal, payload}),
  getModesInfo: (payload) => dispatch({type: areaAchieveAction.getModesInfo, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AreaAchieve);

