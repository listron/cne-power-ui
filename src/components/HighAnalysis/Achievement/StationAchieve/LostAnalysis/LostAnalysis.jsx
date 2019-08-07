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
    chartTimeMode: PropTypes.string,
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
    const originLoad = infoStr && !lostStringify; // // 初次加载
    const pageBack = lostStringify && infoStr && infoStr !== lostStringify; // 其他两个页面修改路径信息后返回
    if (originLoad || pageBack) {
      this.queryAllCharts(infoStr);
    }
  }

  componentWillReceiveProps(nextProps){
    const nextLocation = nextProps.location;
    const nextQuota = nextProps.quotaInfo;
    const nextQuotaParam = nextProps.lostQuota;
    const nextSearch = nextLocation.search || '';
    const { lostStringify, quotaInfo } = this.props;
    const infoStr = searchUtil(nextSearch).getValue('station');
    if (infoStr !== lostStringify && nextQuotaParam) { // 搜索信息有变
      this.queryAllCharts(infoStr, nextQuotaParam);
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
    const firstQuota = quotas[0] || {};
    const lostQuota = firstQuota.value || null;
    console.log(quotaInfo)
    console.log(lostQuota)
    changeStore({ lostQuota });
    infoStr && this.queryAllCharts(infoStr, lostQuota);
  }

  timeMode = {
    day: '1',
    month: '2',
    year: '3',
  }

  queryAllCharts = (infoStr, lostQuota) => { // 重置3图表
    const { changeStore, getLostRank, getLostTrend, getLostTypes, chartTimeMode } = this.props;
    const searchParam = JSON.parse(infoStr) || {};
    changeStore({ lostStringify: infoStr }); // 存储路径
    const param = {
      stationCodes: searchParam.searchCode,
      deviceFullcodes: searchParam.searchDevice,
      startTime: searchParam.searchDates[0],
      endTime: searchParam.searchDates[1],
    };
    getLostRank({
      ...param,
      indicatorCode: lostQuota,
    });
    getLostTrend({
      ...param,
      indicatorCode: lostQuota,
      type: this.timeMode[chartTimeMode],
    });
    getLostTypes({ ...param });
  }

  render() {
    const { active, quotaInfo, lostQuota } = this.props;
    const lostRank = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(e => ({
      deviceFullcode: `M${e}M`,
      deviceName: `设备名字${e}`,
      deviceModeName: `modeName${e}`,
      indicatorData: parseInt(Math.random() * 10, 10) * e,
    }));
    const lostRankLoading = false;
    return (
      <div className={`${styles.lostAnalysis} ${styles.eachPage} ${active ? styles.active : styles.inactive}`}>
        <ChartLostRank lostRank={lostRank} lostRankLoading={lostRankLoading} quotaInfo={quotaInfo} lostQuota={lostQuota} />
        <ChartLostTrend lostRank={lostRank} lostRankLoading={lostRankLoading} />
        <ChartLostTypes lostRank={lostRank} lostRankLoading={lostRankLoading} />
      </div>
    );
  }
}

export default LostAnalysis;

