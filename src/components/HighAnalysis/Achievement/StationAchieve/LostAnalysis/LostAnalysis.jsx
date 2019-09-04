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
    stationInfoStr: PropTypes.string,
    pageName: PropTypes.string,
    selectedQuota: PropTypes.object,
    lostStringify: PropTypes.string,
    lostChartTimeMode: PropTypes.string,
    lostChartDevice: PropTypes.object,
    history: PropTypes.object,
    lostChartTime: PropTypes.string,
    location: PropTypes.object,
    quotaInfo: PropTypes.array,
    changeStore: PropTypes.func,
    getLostRank: PropTypes.func,
    getLostTrend: PropTypes.func,
    getLostTypes: PropTypes.func,
    pageQuery: PropTypes.func,
  }

  handleContextMenu = () => {
    event.preventDefault();
    const { stationInfoStr, pageName, lostChartDevice } = this.props;
    if (lostChartDevice) {
      this.props.pageQuery(stationInfoStr, pageName);
    }
  }

  getSearchParam = (infoStr) => {
    let searchParam = {};
    try {
      searchParam = JSON.parse(infoStr);
    } catch(err){ console.log(err); }
    const { code, device = [], date = [], quota } = searchParam;
    return {
      stationCodes: [code],
      deviceFullcodes: device || [],
      startTime: date[0],
      endTime: date[1],
      indicatorCode: quota,
    };
  }

  onQuotaChange = (selectedQuota = {}) => { // 指标选择 selectedQuota { value, label, unit }
    const { history, lostStringify } = this.props;
    const { search } = location;
    const param = this.getSearchParam(lostStringify);
    const newSearch = searchUtil(search).replace({station: JSON.stringify({
      code: param.stationCodes[0],
      device: param.deviceFullcodes,
      date: [param.startTime, param.endTime],
      quota: selectedQuota.value,
    })}).stringify();
    history.push(`/analysis/achievement/analysis/station?${newSearch}`);
  }

  render() {
    const { active } = this.props;
    return (
      <div
        onContextMenu={this.handleContextMenu}
        className={`${styles.lostAnalysis} ${styles.eachPage} ${active ? styles.active : styles.inactive}`}
      >
        <ChartLostRank {...this.props} onQuotaChange={this.onQuotaChange} />
        <ChartLostTrend {...this.props} />
        <ChartLostTypes {...this.props} />
      </div>
    );
  }
}

export default LostAnalysis;

