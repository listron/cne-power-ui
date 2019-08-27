import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { areaAchieveAction } from './areaAchieveReducer';
import AreaSearch from '../../../../components/HighAnalysis/Achievement/AreaAchieve/AreaSearch/AreaSearch';
import AreaChart from '../../../../components/HighAnalysis/Achievement/AreaAchieve/AreaChart/AreaChart';
import StationPBAChart from '../../../../components/HighAnalysis/Achievement/AreaAchieve/StationPBAChart/StationPBAChart';
import AreaTrendChart from '../../../../components/HighAnalysis/Achievement/AreaAchieve/AreaTrendChart/AreaTrendChart';
import AreaLossChart from '../../../../components/HighAnalysis/Achievement/AreaAchieve/AreaLossChart/AreaLossChart';
import searchUtil from '../../../../utils/searchUtil';
import { dataFormat } from '../../../../utils/utilFunc';

import styles from './areaAchieve.scss';

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
    dataName: PropTypes.string,
    changeStore: PropTypes.func,
    areaStation: PropTypes.array,
    modesInfo: PropTypes.array,
  };

  componentDidMount(){
    const {location: { search }} = this.props;
    const groupInfoStr = searchUtil(search).getValue('area');
    if(groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      this.queryParamsFunc(groupInfo);
    }
    // 右键重置图表
    // 去掉默认的contextmenu事件，否则会和右键事件同时出现。
    document.oncontextmenu = (e) => {
      e.preventDefault();
    };
    // 鼠标右击
    document.getElementsByTagName('body')[0].onmousedown = e => {
      if (e.button === 2) {
        const { dataName, changeStore } = this.props;
        // 判断如果选中过区域可以重置图表
        if(dataName !== '') {
          const { search } = this.props.location;
          const groupInfoStr = searchUtil(search).getValue('area');
          const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
          changeStore({
            dataIndex: '', // 选中信息
            selectStationCode: [], // 选中电站信息
            selectTime: '', // 选中时间
            dataName: '', // 保存选择区域名称
          });
          this.queryParamsFunc(groupInfo);
        }
      }
    };
  }

  componentWillReceiveProps(nextProps){
    const nextSearch = nextProps.location.search;
    const { search } = this.props.location;
    const groupNextInfoStr = searchUtil(nextSearch).getValue('area');
    const groupInfoStr = searchUtil(search).getValue('area');
    // 发生变化
    if (groupNextInfoStr && groupNextInfoStr !== groupInfoStr) {
      const groupInfo = groupNextInfoStr ? JSON.parse(groupNextInfoStr) : {};
      this.queryParamsFunc(groupInfo);
    }
  }

  queryParamsFunc = (groupInfo) => {
    const { timeStatus } = this.props;
    const basicParams = this.basicParams(groupInfo);
    const {
      modes = [],
      quota = [],
      modesInfo = [],
    } = groupInfo;
    // 默认指标分析
    const quotaValue = quota[1] || quota[0];
    const paramsCapacity = {
      ...basicParams,
      deviceModes: modes,
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
  };

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
      let unitName = ''; //  单位
      let pointLength = ''; //  小数位数
      quotaInfo.forEach(cur => {
        if(quota[0] === cur.value) {
          qutaName = cur.label;
          unitName = cur.unit;
          pointLength = cur.pointLength;
          return false;
        }
        cur.children && cur.children.forEach(item => {
          if(quota[1] === item.value) {
            qutaName = item.label;
            unitName = item.unit;
            pointLength = item.pointLength;
          }
        });
      });
      // 等于PBA => 能量可利用率
      if(quotaValue === '100') {
        return <span>{rankTotal.length > 0 && `${rankTotal[0].regionName || '--'}: ${qutaName.toString() || ''} ${dataFormat(unitName === '%' ? rankTotal[0].indicatorData.value * 100 : rankTotal[0].indicatorData.value, '--', pointLength)}${unitName || '--'}`}</span>;
      }
      return <span>{`${rankTotal[0].regionName || '--'}: 实发小时数${dataFormat(unitName === '%' ? rankTotal[0].indicatorData.actualGen : rankTotal[0].indicatorData.actualGen, '--', pointLength)}${unitName || '--'} 应发小时数${dataFormat(unitName === '%' ? rankTotal[0].indicatorData.theoryGen * 100 : rankTotal[0].indicatorData.theoryGen, '--', pointLength)}${unitName || '--'}`}</span>;
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

  //选中选择指标名字
  unitName = () => {
    const { quotaInfo } = this.props;
    const { search } = this.props.location;
    const groupInfoStr = searchUtil(search).getValue('area');
    if(groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const { quota = [] } = groupInfo;
      // 默认指标分析
      let unitName = ''; //  根据quota的value值遍历名称
      quotaInfo.forEach(cur => {
        // 有没有子集
        if(quota[1] === cur.value) {
          cur.children.forEach(item => {
            if(quota[0] === item.value) {
              unitName = item.unit;
            }
          });
          return false;
        }
        if(quota[0] === cur.value) {
          unitName = cur.unit;
        }
      });
      return unitName;
    }
    return '-';
  };

  pointLength = () => {
    const { quotaInfo } = this.props;
    const { search } = this.props.location;
    const groupInfoStr = searchUtil(search).getValue('area');
    if(groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const { quota = [] } = groupInfo;
      // 默认指标分析
      let pointLength = 0; //  根据quota的value值遍历名称
      quotaInfo.forEach(cur => {
        // 有没有子集
        if(quota[1] === cur.value) {
          cur.children.forEach(item => {
            if(quota[0] === item.value) {
              pointLength = item.pointLength;
            }
          });
          return false;
        }
        if(quota[0] === cur.value) {
          pointLength = cur.pointLength;
        }
      });
      return pointLength;
    }
    return 0;
  };

  render() {
    return (
      <div className={styles.areaAchieveBox}>
        <AreaSearch queryParamsFunc={this.queryParamsFunc} {...this.props} />
        <div className={styles.areaTitle}>
          {this.titleFunc()}
        </div>
        <div className={styles.areaChartBox}>
          <div className={styles.areaTopChart}>
            <AreaChart {...this.props} />
            <StationPBAChart
              unitName={this.unitName()}
              qutaName={this.qutaName()}
              pointLength={this.pointLength()}
              {...this.props}
            />
          </div>
          <div className={styles.areaBottomChart}>
            <AreaTrendChart
              unitName={this.unitName()}
              qutaName={this.qutaName()}
              pointLength={this.pointLength()}
              {...this.props}
            />
            <AreaLossChart
              {...this.props}
              pointLength={this.pointLength()}
            />
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
  getDeviceType: (payload) => dispatch({type: areaAchieveAction.getDeviceType, payload}),
  changeStore: (payload) => dispatch({type: areaAchieveAction.changeStore, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AreaAchieve);

