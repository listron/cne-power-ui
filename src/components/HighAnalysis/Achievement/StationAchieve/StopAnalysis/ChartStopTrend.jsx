import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import TimeSelect from '../../AchieveCommon/TimeSelect';
import { dataFormats } from '../../../../../utils/utilFunc';
import { getBaseGrid, getBaseYAxis, getBaseXAxis } from './chartBaseOption';
import styles from './stop.scss';

class ChartLostTrend extends Component {

  static propTypes = {
    stopChartTimeMode: PropTypes.string,
    stopChartTime: PropTypes.string,
    stopTopStringify: PropTypes.string,
    stopTrend: PropTypes.array,
    stopChartDevice: PropTypes.object,
    stopChartTypes: PropTypes.object,
    stopElecType: PropTypes.string,
    stopTrendLoading: PropTypes.bool,
    changeStore: PropTypes.func,
    getStopTrend: PropTypes.func,
    getStopTypes: PropTypes.func,
    // getStopRank: PropTypes.func,
  }

  state = {
    zoomRange: [0, 100],
  }

  componentDidMount(){
    const { stopTrend, stopChartTime } = this.props;
    stopTrend.length > 0 && this.renderChart(stopTrend, stopChartTime);
  }

  componentWillReceiveProps(nextProps){
    const { stopTrendLoading, stopTrend, stopChartTime } = nextProps;
    const preLoading = this.props.stopTrendLoading;
    if (preLoading && !stopTrendLoading) { // 请求完毕
      this.renderChart(stopTrend, stopChartTime);
    } else if (!preLoading && stopTrendLoading) { // 请求中
      this.setChartLoading();
    }
  }

  setChartLoading = () => {
    const trendChart = this.trendRef && echarts.getInstanceByDom(this.trendRef);
    trendChart && trendChart.showLoading();
  }

  createSeries = (stopTrend = [], stopChartTime) => {
    const dataAxis = [];
    const hourData = [];
    const countData = [];
    const series = [];
    stopTrend.forEach(e => {
      const activeSymbol = (stopChartTime && e.efficiencyDate === stopChartTime);
      const symbolSize = activeSymbol ? 10 : 4;
      dataAxis.push(e.efficiencyDate);
      hourData.push({ value: e.stopHour, symbolSize });
      countData.push({ value: e.stopCount, symbolSize});
    });
    series[0] = {
      type: 'line',
      data: hourData,
      xAxisIndex: 0,
      yAxisIndex: 0,
      lineStyle: {
        opacity: stopChartTime ? 0.2 : 1,
        color: '#f9b600',
        width: 2,
        shadowColor: 'rgba(0,0,0,0.20)',
        shadowBlur: 3,
        shadowOffsetY: 3,
      },
    };
    series[1] = {
      type: 'line',
      data: countData,
      xAxisIndex: 1,
      yAxisIndex: 1,
      lineStyle: {
        opacity: stopChartTime ? 0.2 : 1,
        color: '#2564cc',
        width: 2,
        shadowColor: 'rgba(0,0,0,0.20)',
        shadowBlur: 3,
        shadowOffsetY: 3,
      },
    };
    return { dataAxis, series };
  }

  timeModeChange = (stopChartTimeMode) => {
    const { stopElecType, stopChartDevice, stopTopStringify } = this.props;
    const searchParam = JSON.parse(stopTopStringify) || {};
    const deviceFullcodes = stopChartDevice ? [stopChartDevice.deviceFullcode] : searchParam.searchDevice;
    this.props.changeStore({ stopChartTimeMode, stopChartTime: null });
    this.props.getStopTrend({
      stationCodes: [searchParam.code],
      deviceFullcodes,
      startTime: searchParam.date[0],
      endTime: searchParam.date[1],
      type: stopChartTimeMode,
      parentFaultId: stopElecType,
    });
  }

  chartHandle = ({dataIndex}, stopTrend, chart) => {
    const { stopChartTime, stopChartTimeMode, stopElecType, /* stopChartTypes, */ stopChartDevice, stopTopStringify } = this.props;
    const selectedInfo = stopTrend[dataIndex] || {};
    const { efficiencyDate } = selectedInfo;
    const searchParam = JSON.parse(stopTopStringify) || {};
    const deviceFullcodes = stopChartDevice ? [stopChartDevice.deviceFullcode] : searchParam.device;
    let [startTime, endTime] = searchParam.date;
    if (stopChartTime !== efficiencyDate) { // 非取消选择
      const recordStart = moment(efficiencyDate).startOf(stopChartTimeMode);
      const recordEnd = moment(efficiencyDate).endOf(stopChartTimeMode);
      startTime = moment.max(recordStart, moment(startTime)).format('YYYY-MM-DD');
      endTime = moment.min(recordEnd, moment(endTime)).format('YYYY-MM-DD');
      this.props.changeStore({ stopChartTime: efficiencyDate });
      this.setState({
        zoomRange: this.getZoomRange(chart),
      }, () => this.renderChart(stopTrend, efficiencyDate));
    } else { // 取消选择
      this.props.changeStore({ stopChartTime: null });
      this.setState({
        zoomRange: this.getZoomRange(chart),
      }, () => this.renderChart(stopTrend, null));
    }
    // let faultInfo = {};
    // if (stopChartTypes) {
    //   faultInfo = { faultId: stopChartTypes.faultId };
    // }
    const param = {
      stationCodes: [searchParam.code],
      deviceFullcodes,
      startTime,
      endTime,
      parentFaultId: stopElecType,
    };
    // this.props.getStopRank({ ...param, ...faultInfo });
    this.props.getStopTypes({ ...param });
  }

  getZoomRange = (chartInstance = {}) => { // 获取实例的zoom起止位置。
    const { dataZoom = [] } = chartInstance.getOption && chartInstance.getOption() || {};
    const zoomInfo = dataZoom[0] || {};
    const { start = 0, end = 100 } = zoomInfo;
    return [start, end];
  }

  renderChart = (stopTrend = [], stopChartTime) => {
    const { zoomRange } = this.state;
    const trendChart = echarts.init(this.trendRef);
    const { dataAxis, series } = this.createSeries(stopTrend, stopChartTime);
    const option = {
      grid: [
        { ...getBaseGrid(), top: 30, height: 140, containLabel: false, left: 40 },
        { ...getBaseGrid(), top: 220, height: 140, containLabel: false, left: 40 },
      ],
      xAxis: [
        { ...getBaseXAxis(dataAxis), gridIndex: 0, axisLabel: { show: false } },
        { ...getBaseXAxis(dataAxis), gridIndex: 1 },
      ],
      yAxis: [
        { ...getBaseYAxis('时长(h)'), gridIndex: 0 },
        { ...getBaseYAxis('次数(次)'), gridIndex: 1 },
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
              <span class=${styles.titleText}>${axisValue}</span>
            </h3>
            <div class=${styles.info}>
              ${param.sort((a, b) => a.seriesIndex - b.seriesIndex).map(({seriesIndex, value}) => (
                `<span class=${styles.eachItem}>
                  <span>${seriesIndex === 0 ? '故障时长' : '故障次数'}</span>
                  <span>${dataFormats(value, '--', 2, true)}</span>
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
      showDetail: false,
      height: 20,
      start: zoomRange[0],
      end: zoomRange[1],
      xAxisIndex: [0, 1],
    }, {
      type: 'inside',
      filterMode: 'empty',
      start: zoomRange[0],
      end: zoomRange[1],
      xAxisIndex: [0, 1],
    }]);
    trendChart.hideLoading();
    trendChart.setOption(option);
    trendChart.off('click');
    trendChart.on('click', (param) => this.chartHandle(param, stopTrend, trendChart));
  }

  render() {
    const { stopChartTypes, stopChartDevice, stopChartTimeMode } = this.props;
    const stopDeviceText = stopChartDevice ? `${stopChartDevice.deviceName}-` : '';
    const stopTypeText = stopChartTypes ? `${stopChartTypes.faultName}-` : '';
    return (
      <div className={styles.stopTrend}>
        <div className={styles.top}>
          <span className={styles.title}>
            {stopDeviceText}{stopTypeText}停机时长及次数趋势图
          </span>
          <TimeSelect timeMode={stopChartTimeMode} timeModeChange={this.timeModeChange} />
        </div>
        <div className={styles.chart} ref={(ref)=> {this.trendRef = ref;}} />
      </div>
    );
  }
}

export default ChartLostTrend;

