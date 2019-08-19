import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    quotaInfo: PropTypes.array,
    timeStatus: PropTypes.string,
  };

  componentDidMount(){
    const { search } = this.props.location;
    const { timeStatus } = this.props;
    const groupInfoStr = searchUtil(search).getValue('area');
    if(groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basicParams = this.basicParams(groupInfo);
      const {
        stations = [],
        modes = [],
        quota = [],
        modesInfo = [],
      } = groupInfo;
      // 默认指标分析
      const quotaValue = quota[1] || quota[0];
      const paramsCapacity = {
        ...basicParams,
        deviceModes: modes,
        regionName: [stations[0].regionName],
        manufactorIds: modesInfo.map(cur => {
          return cur.value;
        }),
      };
      const paramsHour = {
        ...basicParams,
        manufactorIds: paramsCapacity.manufactorIds,
        deviceModes: paramsCapacity.deviceModes,
      };
      const paramsTrend = {
        ...basicParams,
        // regionName: paramsCapacity.regionName,
        indicatorCode: quotaValue,
        type: timeStatus, // 默认按月
      };
      const paramsRank = {
        ...basicParams,
        indicatorCode: quotaValue,
      };
      const paramsTotal = {
        ...basicParams,
        deviceModes: paramsCapacity.deviceModes,
        regionName: paramsCapacity.regionName,
        indicatorCode: quotaValue,
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
    const { search } = this.props.location;
    const { timeStatus } = this.props;
    const groupNextInfoStr = searchUtil(nextSearch).getValue('area');
    const groupInfoStr = searchUtil(search).getValue('area');
    // 发生变化
    if (groupNextInfoStr && groupNextInfoStr !== groupInfoStr) {
      const groupInfo = groupNextInfoStr ? JSON.parse(groupNextInfoStr) : {};
      const basicParams = this.basicParams(groupInfo);
      const {
        stations = [],
        modes = [],
        quota = [],
        modesInfo = [],
      } = groupInfo;
      // 默认指标分析
      const quotaValue = quota[1] || quota[0];
      const paramsCapacity = {
        ...basicParams,
        deviceModes: modes,
        regionName: [stations[0].regionName],
        manufactorIds: modesInfo.map(cur => {
          return cur.value;
        }),
      };
      const paramsHour = {
        ...basicParams,
        manufactorIds: paramsCapacity.manufactorIds,
        deviceModes: paramsCapacity.deviceModes,
      };
      const paramsTrend = {
        ...basicParams,
        regionName: paramsCapacity.regionName,
        indicatorCode: quotaValue,
        type: timeStatus, // 默认按月
      };
      const paramsRank = {
        ...basicParams,
        indicatorCode: quotaValue,
      };
      const paramsTotal = {
        ...basicParams,
        deviceModes: paramsCapacity.deviceModes,
        regionName: paramsCapacity.regionName,
        indicatorCode: quotaValue,
        manufactorIds: paramsCapacity.manufactorIds,
      };
      this.props.getStationCapacity(paramsCapacity);
      this.props.getLostGenHour(paramsHour);
      this.props.getTrendInfo(paramsTrend);
      this.props.getIndicatorRank(paramsRank);
      this.props.getIndicatorRankTotal(paramsTotal);
    }
  }

  // 基本-公共参数
  basicParams = (data) => {
    return {
      startTime: data.dates[0],
      endTime: data.dates[1],
      stationCodes: data.searchCode,
    };
  };

  titleFunc = () => {
    const { rankTotal, quotaInfo } = this.props;
    const { search } = this.props.location;
    const groupInfoStr = searchUtil(search).getValue('area');
    if(groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const { quota = [] } = groupInfo;
      // 默认指标分析
      const quotaValue = quota[1] || quota[0];
      let qutaName = ''; //  根据quota的value值遍历名称
      quotaInfo.forEach(cur => {
        if(quota[0] === cur.value) {
          qutaName = cur.label;
          return false;
        }
        cur.children.forEach(item => {
          if(quota[1] === item.value) {
            qutaName = item.label;
          }
        });
      });
      // 等于PBA => 能量可利用率
      if(quotaValue === '100') {
        return <span>{rankTotal.length > 0 && `${rankTotal[0].regionName || '--'}: ${qutaName.toString() || ''} ${rankTotal[0].indicatorData.value || '--'}%`}</span>;
      }
      return <span>{`${rankTotal[0].regionName || '--'}: 实发小时数${rankTotal[0].indicatorData.actualGen || '--'} 应发小时数${rankTotal[0].indicatorData.theoryGen || '--'}`}</span>;
    }
    return <span>--:--</span>;
  };

  //选中选择指标名字
  qutaName = () => {
    const { quotaInfo } = this.props;
    const { search } = this.props.location;
    const groupInfoStr = searchUtil(search).getValue('area');
    if(groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const { quota = [] } = groupInfo;
      // 默认指标分析
      let qutaName = ''; //  根据quota的value值遍历名称
      quotaInfo.forEach(cur => {
        // 有没有子集
        if(quota[1] === cur.value) {
          cur.children.forEach(item => {
            if(quota[0] === item.value) {
              qutaName = item.label;
            }
          });
          return false;
        }
        if(quota[0] === cur.value) {
          qutaName = cur.label;
        }
      });
      return qutaName;
    }
    return '--';
  };

  render() {
    return (
      <div className={styles.areaAchieveBox}>
        <AreaSearch {...this.props} />
        <div className={styles.areaTitle}>
          {this.titleFunc()}
        </div>
        <div className={styles.areaChartBox}>
          <div className={styles.areaTopChart}>
            <AreaChart {...this.props} />
            <StationPBAChart qutaName={this.qutaName()} {...this.props} />
          </div>
          <div className={styles.areaBottomChart}>
            <AreaTrendChart qutaName={this.qutaName()} {...this.props} />
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
  changeStore: (payload) => dispatch({type: areaAchieveAction.changeStore, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AreaAchieve);

