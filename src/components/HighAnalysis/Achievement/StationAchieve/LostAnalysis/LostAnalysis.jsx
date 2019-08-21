import React, { Component } from 'react';
import PropTypes from 'prop-types';
import searchUtil from '../../../../../utils/searchUtil';
import ChartLostRank from './ChartLostRank';
import ChartLostTrend from './ChartLostTrend';
import ChartLostTypes from './ChartLostTypes';
import styles from './lost.scss';

class LostAnalysis extends Component {

  static propTypes = {
    active: PropTypes.bool,
    pageName: PropTypes.string,
    selectedQuota: PropTypes.object,
    lostStringify: PropTypes.string,
    lostChartTimeMode: PropTypes.string,
    lostChartDevice: PropTypes.object,
    lostChartTime: PropTypes.string,
    location: PropTypes.object,
    quotaInfo: PropTypes.array,
    changeStore: PropTypes.func,
    getLostRank: PropTypes.func,
    getLostTrend: PropTypes.func,
    getLostTypes: PropTypes.func,
  }

  componentDidMount(){
    const { lostStringify, location } = this.props;
    const { search } = location;
    const infoStr = searchUtil(search).getValue('station');
    const pageReload = infoStr && !lostStringify; // 有路径信息的跳转打开 或者 f5刷新
    if (pageReload) {
      this.props.changeStore({ lostStringify: infoStr });
      this.queryTypes(infoStr); // 只能重新请求损失电量分解, 等指标数据得到后再请求风机指标排名rank, trend
    }
  }

  componentWillReceiveProps(nextProps){
    const nextLocation = nextProps.location;
    const nextQuota = nextProps.quotaInfo;
    const nextQuotaParam = nextProps.selectedQuota || {};
    const nextSearch = nextLocation.search || '';
    const { lostStringify, quotaInfo, changeStore } = this.props;
    const infoStr = searchUtil(nextSearch).getValue('station');
    // 停机或者功率tab跳转过来
    if (infoStr && infoStr !== lostStringify && nextQuotaParam.value) { // 搜索信息有变
      changeStore({ lostStringify: infoStr });
      this.queryTypes(infoStr);
      this.queryRank(infoStr, nextQuotaParam.value);
      this.queryTrend(infoStr, nextQuotaParam.value);
    }
    if (quotaInfo.length === 0 && nextQuota.length > 0) { // 得到指标数据
      this.propsQuotaChange(nextQuota, infoStr);
    }
    // 得到电站数据 - 直接进入风电分析/电站效能; 或刷新f5得到电站数据。
  }

  propsQuotaChange = (quotaInfo, infoStr) => { // 得到指标
    const { changeStore } = this.props;
    // 第一个指标作为数据
    const firstType = quotaInfo[0] || {};
    const quotas = firstType.children || [];
    let selectedQuota;
    if(quotas.length > 0){
      selectedQuota = quotas[0] || {};
    } else {
      selectedQuota = firstType;
    }
    changeStore({ selectedQuota });
    infoStr && this.queryRank(infoStr, selectedQuota.value);
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

  queryRank = (infoStr, quotaCode) => {
    const baseParam = this.getQueryParam(infoStr);
    this.props.getLostRank({ ...baseParam, indicatorCode: quotaCode });
  }

  queryTrend = (infoStr, quotaCode) => {
    const baseParam = this.getQueryParam(infoStr);
    this.props.getLostTrend({
      ...baseParam,
      indicatorCode: quotaCode,
      type: this.props.lostChartTimeMode,
    });
  }

  queryTypes = (infoStr) => {
    const baseParam = this.getQueryParam(infoStr);
    this.props.getLostTypes({ ...baseParam });
  }

  onQuotaChange = (selectedQuota = {}) => { // 指标选择 selectedQuota { value, label, unit }
    const { search } = this.props.location || {};
    const { value } = selectedQuota;
    const infoStr = searchUtil(search).getValue('station');
    const baseParam = this.getQueryParam(infoStr);
    this.props.changeStore({ selectedQuota });
    this.props.getLostRank({ ...baseParam, indicatorCode: value });
    this.props.getLostTrend({
      ...baseParam,
      indicatorCode: value,
      type: this.props.lostChartTimeMode,
    });
  }

  render() {
    const { active } = this.props;
    return (
      <div className={`${styles.lostAnalysis} ${styles.eachPage} ${active ? styles.active : styles.inactive}`}>
        <ChartLostRank {...this.props} />
        <ChartLostTrend {...this.props} />
        <ChartLostTypes {...this.props} />
      </div>
    );
  }
}

export default LostAnalysis;

