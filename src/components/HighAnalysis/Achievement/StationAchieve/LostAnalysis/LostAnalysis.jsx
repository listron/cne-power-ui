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
    lostQuota: PropTypes.string,
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

  state = {
    quotaName: '',
  }

  componentDidMount(){
    const { lostQuota, lostStringify, location } = this.props;
    const { search } = location;
    const infoStr = searchUtil(search).getValue('station');
    const originLoad = infoStr && !lostStringify; // // 初次加载
    const pageBack = lostStringify && infoStr && infoStr !== lostStringify; // 其他两个页面修改路径信息后返回
    if (originLoad || pageBack) {
      this.queryTypes(infoStr); // 初次加载只重新请求损失电量分解
      pageBack && lostQuota && this.queryRank(infoStr, lostQuota);
      pageBack && lostQuota && this.queryTrend(infoStr, lostQuota);
    }
  }

  componentWillReceiveProps(nextProps){
    const nextLocation = nextProps.location;
    const nextQuota = nextProps.quotaInfo;
    const nextQuotaParam = nextProps.lostQuota;
    const nextSearch = nextLocation.search || '';
    const { lostStringify, quotaInfo, changeStore } = this.props;
    const infoStr = searchUtil(nextSearch).getValue('station');
    if (infoStr && infoStr !== lostStringify && nextQuotaParam) { // 搜索信息有变
      changeStore({ lostStringify: infoStr });
      this.queryTypes(infoStr);
      this.queryRank(infoStr, nextQuotaParam);
      this.queryTrend(infoStr, nextQuotaParam);
    }
    if (quotaInfo.length === 0 && nextQuota.length > 0) { // 得到指标数据
      this.propsQuotaChange(nextQuota, infoStr);
    }
  }

  propsQuotaChange = (quotaInfo, infoStr) => { // 得到指标
    const { changeStore } = this.props;
    // 第一个指标作为数据
    const firstType = quotaInfo[0] || {};
    const quotas = firstType.children || [];
    let lostQuota, quotaName;
    if(quotas.length > 0){
      const firstQuota = quotas[0] || {};
      lostQuota = firstQuota.value || null;
      quotaName = firstQuota.label || '';
    } else {
      lostQuota = firstType.value || null;
      quotaName = firstType.label || '';
    }
    this.setState({ quotaName });
    changeStore({ lostQuota });
    infoStr && this.queryRank(infoStr, lostQuota);
    infoStr && this.queryRank(infoStr, lostQuota);
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

  queryRank = (infoStr, lostQuota) => {
    const baseParam = this.getQueryParam(infoStr);
    this.props.getLostRank({ ...baseParam, indicatorCode: lostQuota });
  }

  queryTrend = (infoStr, lostQuota) => {
    const baseParam = this.getQueryParam(infoStr);
    this.props.getLostTrend({
      ...baseParam,
      indicatorCode: lostQuota,
      type: this.props.lostChartTimeMode,
    });
  }

  queryTypes = (infoStr) => {
    const baseParam = this.getQueryParam(infoStr);
    this.props.getLostTypes({ ...baseParam });
  }

  quotaSelect = (lostQuota, quotaName) => { // 指标选择
    const { search } = this.props.location || {};
    const infoStr = searchUtil(search).getValue('station');
    const baseParam = this.getQueryParam(infoStr);
    this.setState({ quotaName });
    this.props.changeStore({ lostQuota });
    this.props.getLostRank({ ...baseParam, indicatorCode: lostQuota });
    this.props.getLostTrend({
      ...baseParam,
      indicatorCode: lostQuota,
      type: this.props.lostChartTimeMode,
    });
  }

  render() {
    const { active, lostChartDevice, lostChartTime } = this.props;
    const { quotaName } = this.state;
    return (
      <div className={`${styles.lostAnalysis} ${styles.eachPage} ${active ? styles.active : styles.inactive}`}>
        <ChartLostRank
          {...this.props}
          quotaName={quotaName}
          onQuotaChange={this.quotaSelect}
        />
        <ChartLostTrend
          {...this.props}
          quotaName={quotaName}
        />
        <ChartLostTypes {...this.props} lostChartDevice={lostChartDevice} lostChartTime={lostChartTime} />
      </div>
    );
  }
}

export default LostAnalysis;

