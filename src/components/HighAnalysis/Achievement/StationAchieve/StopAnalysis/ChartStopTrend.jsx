import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import TimeSelect from '../../AchieveCommon/TimeSelect';
import searchUtil from '../../../../../utils/searchUtil';
import { getBaseGrid, getBaseYAxis, getBaseXAxis } from './chartBaseOption';
import styles from './stop.scss';

class ChartLostTrend extends Component {

  static propTypes = {
    stopChartTimeMode: PropTypes.string,
    stopChartTime: PropTypes.string,
    stopTrend: PropTypes.array,
    location: PropTypes.object,
    stopChartDevice: PropTypes.object,
    stopChartTypes: PropTypes.object,
    stopElecType: PropTypes.string,
    stopTrendLoading: PropTypes.bool,
    changeStore: PropTypes.func,
    getStopTrend: PropTypes.func,
    getStopTypes: PropTypes.func,
    getStopRank: PropTypes.func,
  }

  componentDidMount(){
    const { stopTrend } = this.props;
    stopTrend.length > 0 && this.renderChart(stopTrend);
  }

  componentWillReceiveProps(nextProps){
    const { stopTrendLoading, stopTrend } = nextProps;
    const preLoading = this.props.stopTrendLoading;
    if (preLoading && !stopTrendLoading) { // 请求完毕
      this.renderChart(stopTrend);
    } else if (!preLoading && stopTrendLoading) { // 请求中
      this.setChartLoading();
    }
  }

  setChartLoading = () => {
    const trendChart = this.trendRef && echarts.getInstanceByDom(this.trendRef);
    trendChart && trendChart.showLoading();
  }

  createSeries = (stopTrend = []) => {
    const dataAxis = [];
    const hourData = [];
    const countData = [];
    const series = [];
    stopTrend.forEach(e => {
      dataAxis.push(e.efficiencyDate);
      hourData.push(e.stopHour);
      countData.push(e.stopCount);
    });
    series[0] = {
      type: 'line',
      data: countData,
      xAxisIndex: 0,
      yAxisIndex: 0,
      lineStyle: {
        normal: {
          color: '#f9b600',
          width: 2,
          shadowColor: 'rgba(0,0,0,0.20)',
          shadowBlur: 3,
          shadowOffsetY: 3,
        },
      },
    };
    series[1] = {
      type: 'line',
      data: hourData,
      xAxisIndex: 1,
      yAxisIndex: 1,
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
    return { dataAxis, series };
  }

  getSearchInfo = () => {
    const { location } = this.props;
    const { search } = location;
    const infoStr = searchUtil(search).getValue('station');
    return JSON.parse(infoStr) || {};
  }

  timeModeChange = (stopChartTimeMode) => {
    const { stopElecType, stopChartDevice } = this.props;
    const searchParam = this.getSearchInfo();
    const deviceFullcodes = stopChartDevice ? [stopChartDevice.deviceFullcode] : searchParam.searchDevice;
    this.props.changeStore({ stopChartTimeMode, stopChartTime: null });
    this.props.getStopTrend({
      stationCodes: [searchParam.searchCode],
      deviceFullcodes,
      startTime: searchParam.searchDates[0],
      endTime: searchParam.searchDates[1],
      type: stopChartTimeMode,
      parentFaultId: stopElecType,
    });
  }

  chartHandle = ({dataIndex}, stopTrend, chart) => {
    const { stopChartTime, stopChartTimeMode, stopElecType, stopChartTypes, stopChartDevice } = this.props;
    const selectedInfo = stopTrend[dataIndex] || {};
    const { efficiencyDate } = selectedInfo;
    const searchParam = this.getSearchInfo();
    const deviceFullcodes = stopChartDevice ? [stopChartDevice.deviceFullcode] : searchParam.searchDevice;
    let [startTime, endTime] = searchParam.searchDates;
    if (stopChartTime !== efficiencyDate) { // 非取消选择
      const recordStart = moment(efficiencyDate).startOf(stopChartTimeMode);
      const recordEnd = moment(efficiencyDate).endOf(stopChartTimeMode);
      startTime = moment.max(recordStart, moment(startTime)).format('YYYY-MM-DD');
      endTime = moment.min(recordEnd, moment(endTime)).format('YYYY-MM-DD');
      this.props.changeStore({ stopChartTime: null });
    } else {
      this.props.changeStore({ stopChartTime: efficiencyDate });
    }
    let faultInfo = {};
    if (stopChartTypes) {
      faultInfo = { faultId: stopChartTypes.faultTypeId };
    }
    const param = {
      stationCodes: [searchParam.searchCode],
      deviceFullcodes,
      startTime,
      endTime,
      parentFaultId: stopElecType,
    };
    this.props.getStopRank({ ...param, ...faultInfo });
    this.props.getStopTypes({ ...param });
  }

  renderChart = (stopTrend = []) => {
    const trendChart = echarts.init(this.trendRef);
    const { dataAxis, series } = this.createSeries(stopTrend);
    const option = {
      grid: [
        { ...getBaseGrid(), top: 40, height: 160 },
        { ...getBaseGrid(), top: 240, height: 160 },
      ],
      xAxis: [
        { ...getBaseXAxis(dataAxis), gridIndex: 0 },
        { ...getBaseXAxis(dataAxis), gridIndex: 1 },
      ],
      yAxis: [
        { ...getBaseYAxis('次数(次)'), gridIndex: 0 },
        { ...getBaseYAxis('时长(h)'), gridIndex: 1 },
      ],
      axisPointer: {
        link: {xAxisIndex: 'all'},
      },
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
                  <span>${i === 0 ? '故障次数' : '故障时长'}</span>
                  <span>${e.value}</span>
                </span>`
              )).join('')}
            </div>
          </section>`;
        },
      },
      series,
    };
    stopTrend.length > 0 && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      bottom: 16,
    }, {
      type: 'inside',
      filterMode: 'empty',
    }]);
    trendChart.hideLoading();
    trendChart.setOption(option);
    trendChart.on('click', (param) => this.chartHandle(param, stopTrend, trendChart));
  }

  render() {
    const { stopChartTimeMode } = this.props;
    const { stopChartTypes, stopChartDevice } = this.props;
    const stopDeviceText = stopChartDevice ? `${stopChartDevice.deviceName}-` : '';
    const stopTypeText = stopChartTypes ? `${stopChartTypes.faultName}-` : '';
    return (
      <div className={styles.stopTrend}>
        <div className={styles.top}>
          <span className={styles.title}>
            {stopDeviceText}{stopTypeText}停机时长及次数
          </span>
          <TimeSelect stopChartTimeMode={stopChartTimeMode} timeModeChange={this.timeModeChange} />
        </div>
        <div className={styles.chart} ref={(ref)=> {this.trendRef = ref;}} />
      </div>
    );
  }
}

export default ChartLostTrend;

