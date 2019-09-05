import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import { message } from 'antd';
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
    stopHandleInfo: PropTypes.array,
    stopChartDevice: PropTypes.object,
    stopChartTypes: PropTypes.object,
    stopElecType: PropTypes.string,
    stopTrendLoading: PropTypes.bool,
    changeStore: PropTypes.func,
    getStopTrend: PropTypes.func,
    getStopTypes: PropTypes.func,
    getStopRank: PropTypes.func,
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
    let searchParam = {};
    try {
      searchParam = JSON.parse(stopTopStringify);
    } catch (error) { console.log(error); }
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

  chartHandle = ({ dataIndex }, stopTrend, chart) => { // 'device', 'time', 'types'
    const { stopHandleInfo } = this.props;
    const handleLength = stopHandleInfo.length;
    const timeIndex = stopHandleInfo.indexOf('time');
    const lastCheck = stopHandleInfo[handleLength - 1];
    if (handleLength === 2 && timeIndex === -1) { // 已选别的两个指标， 直接返回。
      return;
    }

    if (handleLength === 2 && timeIndex === 0) { // 已选两级指标, 设备为第一级
      message.info( `请先取消${lastCheck === 'device' ? '设备' : '停机类型'}选择, 再选择时间` );
      return;
    }

    const { stopChartTime, stopElecType, stopChartTypes, stopChartDevice, stopTopStringify } = this.props;
    let searchParam = {};
    try {
      searchParam = JSON.parse(stopTopStringify);
    } catch (error) { console.log(error); }
    const selectedInfo = stopTrend[dataIndex] || {};
    const { efficiencyDate } = selectedInfo;
    const cancelSelect = stopChartTime && stopChartTime === efficiencyDate;
    const [startTime, endTime] = this.getTimeRange(searchParam.date, efficiencyDate, cancelSelect);
    const tmpDateResult = cancelSelect ? null : efficiencyDate;
    const param = {
      stationCodes: [searchParam.code],
      deviceFullcodes: stopChartDevice ? [stopChartDevice.deviceFullcode] : searchParam.device,
      startTime,
      endTime,
      parentFaultId: stopElecType,
    };
    this.setState({
      zoomRange: this.getZoomRange(chart),
    }, () => this.renderChart(stopTrend, tmpDateResult));

    const timeBothEnd = handleLength === 2 && timeIndex === 1; // 两级指标: 二级为时间 => 切换
    const timeAdd = handleLength === 1 && timeIndex === -1; // 一级指标: 非时间 => 添加
    if (timeBothEnd || timeAdd) { //  => 变两级指标, 请求受影响单图表。
      let tmpHandleInfo = [...stopHandleInfo];
      timeAdd && tmpHandleInfo.push('time');
      cancelSelect && (tmpHandleInfo = tmpHandleInfo.filter(e => e!== 'time'));
      this.props.changeStore({
        stopChartTime: tmpDateResult,
        stopHandleInfo: tmpHandleInfo,
      });
      stopHandleInfo[0] === 'device' ? this.props.getStopTypes({
        ...param,
      }) : this.props.getStopRank({
        ...param,
        faultId: stopChartTypes.faultId,
      });
    }
    const queryBoth = (handleLength === 1 && timeIndex === 0) || handleLength === 0;
    if (queryBoth) { // 选中一个一级指标: 时间 或者 未选中任何指标 => 请求两个图表数据。
      this.props.changeStore({
        stopChartTime: tmpDateResult,
        stopHandleInfo: ['time'],
      });
      this.props.getStopTypes({ ...param });
      this.props.getStopRank({ ...param });
    }
  }

  getTimeRange = (date = [], efficiencyDate, cancelSelect) => { // 根据两个时间取交集
    const { stopChartTimeMode } = this.props;
    let [startTime, endTime] = date;
    if (cancelSelect) {
      return [startTime, endTime];
    }
    const recordStart = moment(efficiencyDate).startOf(stopChartTimeMode);
    const recordEnd = moment(efficiencyDate).endOf(stopChartTimeMode);
    startTime = moment.max(recordStart, moment(startTime)).format('YYYY-MM-DD');
    endTime = moment.min(recordEnd, moment(endTime)).format('YYYY-MM-DD');
    return [startTime, endTime];
  }

  getZoomRange = (chartInstance = {}) => { // 获取实例的zoom起止位置。
    const { dataZoom = [] } = chartInstance.getOption && chartInstance.getOption() || {};
    const zoomInfo = dataZoom[0] || {};
    const { start = 0, end = 100 } = zoomInfo;
    return [start, end];
  }

  getTitle = () => {
    const titleTexts = [];
    const { stopChartTypes, stopChartDevice, stopHandleInfo } = this.props;
    const baseText = {
      device: stopChartDevice ? `${stopChartDevice.deviceName}-` : '',
      types: stopChartTypes ? `${stopChartTypes.faultName}-` : '',
    };
    stopHandleInfo.find((e, i) => {
      baseText[e] && titleTexts.push(baseText[e]);
      return e === 'time';
    });
    titleTexts.push('停机时长及次数趋势图');
    return titleTexts.join('');
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
        { ...getBaseYAxis('停机时长(h)'), gridIndex: 0 },
        { ...getBaseYAxis('停机次数(次)'), gridIndex: 1 },
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
                  <span>${seriesIndex === 0 ? '停机时长' : '停机次数'}</span>
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
    const { stopChartTimeMode } = this.props;
    return (
      <div className={styles.stopTrend}>
        <div className={styles.top}>
          <span className={styles.title}>{this.getTitle()}</span>
          <TimeSelect timeMode={stopChartTimeMode} timeModeChange={this.timeModeChange} />
        </div>
        <div className={styles.chart} ref={(ref)=> {this.trendRef = ref;}} />
      </div>
    );
  }
}

export default ChartLostTrend;

