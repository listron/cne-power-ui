import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import TimeSelect from '../../AchieveCommon/TimeSelect';
import searchUtil from '../../../../../utils/searchUtil';
import { getBaseOption } from './chartBaseOption';
import styles from './lost.scss';

class ChartLostTrend extends Component {

  static propTypes = {
    quotaName: PropTypes.string,
    lostChartTimeMode: PropTypes.string,
    lostQuota: PropTypes.string,
    lostTrend: PropTypes.array,
    location: PropTypes.object,
    lostChartDevice: PropTypes.object,
    lostTrendLoading: PropTypes.bool,
    changeStore: PropTypes.func,
    getLostTrend: PropTypes.func,
    getLostTypes: PropTypes.func,
  }

  componentDidMount(){
    const { lostTrend } = this.props;
    lostTrend.length > 0 && this.renderChart(lostTrend);
  }

  componentWillReceiveProps(nextProps){
    const { lostTrendLoading, lostTrend } = nextProps;
    const preLoading = this.props.lostTrendLoading;
    if (preLoading && !lostTrendLoading) { // 请求完毕
      this.renderChart(lostTrend);
    } else if (!preLoading && lostTrendLoading) { // 请求中
      this.setChartLoading();
    }
  }

  setChartLoading = () => {
    console.log('loading');
  }

  createSeries = (lostTrend = []) => {
    const dataAxis = [];
    const series = [];
    const firstLineData = [];
    const secendLineData = [];
    const firstData = lostTrend[0] || {};
    const firstIndicator = firstData.indicatorData || {};
    const indicatorType = Object.keys(firstIndicator).includes('value') ? 'single' : 'double';
    lostTrend.forEach(e => {
      const { efficiencyDate, indicatorData = {} } = e || {};
      dataAxis.push(efficiencyDate);
      if (indicatorType === 'single') {
        firstLineData.push(indicatorData.value);
      } else {
        firstLineData.push(indicatorData.actualGen);
        secendLineData.push(indicatorData.theoryGen);
      }
    });
    series[0] = {
      type: 'line',
      data: firstLineData,
      lineStyle: {
        normal: {
          color: '#2564cc',
          width: 2,
          shadowColor: 'rgba(0,0,0,0.20)',
          shadowBlur: 3,
          shadowOffsetY: 3,
        },
      },
    };
    indicatorType === 'double' && (series[1] = {
      type: 'line',
      data: secendLineData,
      lineStyle: {
        normal: {
          color: '#f9b600',
          width: 2,
          shadowColor: 'rgba(0,0,0,0.20)',
          shadowBlur: 3,
          shadowOffsetY: 3,
        },
      },
    });
    return { dataAxis, series, indicatorType };
  }

  getSearchInfo = () => {
    const { location } = this.props;
    const { search } = location;
    const infoStr = searchUtil(search).getValue('station');
    return JSON.parse(infoStr) || {};
  }

  timeModeChange = (lostChartTimeMode) => {
    const { changeStore, lostQuota, getLostTrend } = this.props;
    // 携带参数重新请求信息
    changeStore({ lostChartTimeMode });
    const searchParam = this.getSearchInfo();
    getLostTrend({
      stationCodes: [searchParam.searchCode],
      deviceFullcodes: searchParam.searchDevice,
      startTime: searchParam.searchDates[0],
      endTime: searchParam.searchDates[1],
      indicatorCode: lostQuota,
      type: lostChartTimeMode,
    });
  }

  renderChart = (lostTrend = []) => {
    const { quotaName, getLostTypes, lostChartTimeMode, changeStore, lostChartDevice } = this.props;
    const trendChart = echarts.init(this.trendRef);
    const { dataAxis, series } = this.createSeries(lostTrend);
    const baseOption = getBaseOption(dataAxis);
    const option = {
      ...baseOption,
      tooltip: {
        trigger: 'axis',
        padding: 0,
        formatter: (param) => {
          const { axisValue } = param && param[0] || {};
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>
              <span>${axisValue}</span>
            </h3>
            <div class=${styles.info}>
              ${param.map((e, i) => (
                `<span class=${styles.eachItem}>
                  <span>${i === 1 ? '应发小时数' : quotaName}</span>
                  <span>${e.value}</span>
                </span>`
              )).join('')}
            </div>
          </section>`;
        },
      },
      series,
    };
    trendChart.setOption(option);
    lostChartDevice && lostChartDevice.deviceFullcode && trendChart.on('click', ({dataIndex}) => {
      const chartTimeInfo = lostTrend[dataIndex] || {};
      const { efficiencyDate } = chartTimeInfo;
      const clickStart = moment(efficiencyDate).startOf(lostChartTimeMode);
      const clickEnd = moment(efficiencyDate).endOf(lostChartTimeMode);
      const searchParam = this.getSearchInfo();
      const { searchDates } = searchParam;
      const startTime = moment.max(clickStart, moment(searchDates[0])).format('YYYY-MM-DD');
      const endTime = moment.min(clickEnd, moment(searchDates[1])).format('YYYY-MM-DD');
      changeStore({ lostChartTime: efficiencyDate });
      getLostTypes({
        startTime,
        endTime,
        stationCodes: [searchParam.searchCode],
        deviceFullcodes: [lostChartDevice.deviceFullcode],
      });
    });
  }


  render() {
    const { lostChartTimeMode } = this.props;
    return (
      <div className={styles.lostTrend}>
        <div className={styles.top}>
          <span className={styles.title}>
            PBA趋势
          </span>
          <TimeSelect lostChartTimeMode={lostChartTimeMode} timeModeChange={this.timeModeChange} />
        </div>
        <div className={styles.chart} ref={(ref)=> {this.trendRef = ref;}} />
      </div>
    );
  }
}

export default ChartLostTrend;

