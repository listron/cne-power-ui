import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import { message } from 'antd';
import TimeSelect from '../../AchieveCommon/TimeSelect';
import { dataFormats } from '../../../../../utils/utilFunc';
import { getBaseOption } from './chartBaseOption';
import styles from './lost.scss';

class ChartLostTrend extends Component {

  static propTypes = {
    lostChartTime: PropTypes.string,
    lostStringify: PropTypes.string,
    lostChartTimeMode: PropTypes.string,
    lostTrend: PropTypes.array,
    quotaInfo: PropTypes.array,
    lostChartDevice: PropTypes.object,
    lostTrendLoading: PropTypes.bool,
    changeStore: PropTypes.func,
    getLostTrend: PropTypes.func,
    getLostTypes: PropTypes.func,
  }

  state= {
    zoomRange: [0, 100],
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
    const trendChart = this.trendRef && echarts.getInstanceByDom(this.trendRef);
    trendChart && trendChart.showLoading();
  }

  unitValue = (value, unit) => dataFormats(dataFormats(value) * (unit === '%' ? 100 : 1), '')

  createSeries = (lostTrend = [], lostChartTime, unit) => {
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
      const activeSymbol = (lostChartTime && efficiencyDate === lostChartTime);
      const symbolSize = activeSymbol ? 10 : 4;
      firstLineData.push({
        value: this.unitValue(indicatorData[indicatorType === 'single' ? 'value': 'actualGen'], unit),
        symbolSize,
      });
      indicatorType !== 'single' && secendLineData.push({
        value: this.unitValue(indicatorData.theoryGen, unit),
        symbolSize,
      });
    });
    series[0] = {
      type: 'line',
      data: firstLineData,
      lineStyle: {
        opacity: lostChartTime ? 0.2 : 1,
        color: '#2564cc',
        width: 2,
        shadowColor: 'rgba(0,0,0,0.20)',
        shadowBlur: 3,
        shadowOffsetY: 3,
      },
    };
    indicatorType === 'double' && (series[1] = {
      type: 'line',
      data: secendLineData,
      lineStyle: {
        opacity: lostChartTime ? 0.2 : 1,
        color: '#f9b600',
        width: 2,
        shadowColor: 'rgba(0,0,0,0.20)',
        shadowBlur: 3,
        shadowOffsetY: 3,
      },
    });
    return { dataAxis, series, indicatorType };
  }

  getQuota = (quotaList = [], quotaCode) => {
    let selectedQuota = {};
    quotaList.find(e => {
      const { value, children = [] } = e || {};
      if (children.length > 0) {
        return children.find(m => {
          m.value === quotaCode && (selectedQuota = { ...m });
          return m.value === quotaCode;
        });
      }
      value === quotaCode && (selectedQuota = { ...e });
      return value === quotaCode;
    });
    return selectedQuota;
  }

  getZoomRange = (chartInstance = {}) => { // 获取实例的zoom起止位置。
    const { dataZoom = [] } = chartInstance.getOption && chartInstance.getOption() || {};
    const zoomInfo = dataZoom[0] || {};
    const { start = 0, end = 100 } = zoomInfo;
    return [start, end];
  }

  timeModeChange = (lostChartTimeMode) => {
    const { changeStore, getLostTrend, lostStringify } = this.props;
    // 携带参数重新请求信息
    changeStore({ lostChartTimeMode });
    const searchParam = JSON.parse(lostStringify) || {};
    getLostTrend({
      stationCodes: [searchParam.code],
      deviceFullcodes: searchParam.device,
      startTime: searchParam.date[0],
      endTime: searchParam.date[1],
      indicatorCode: searchParam.quota,
      type: lostChartTimeMode,
    });
  }

  chartHandle = ({ dataIndex }, lostTrend, chart) => {
    const { lostChartTimeMode, lostChartDevice, lostChartTime, lostStringify } = this.props;
    if(!lostChartDevice){
      message.info('先选择设备后, 才能对时间进行操作');
      return;
    }
    const chartTimeInfo = lostTrend[dataIndex] || {};
    const { efficiencyDate } = chartTimeInfo;
    const searchParam = JSON.parse(lostStringify) || {};
    const { date } = searchParam;
    let startTime, endTime;
    if (efficiencyDate === lostChartTime) {
      startTime = date[0];
      endTime = date[1];
      this.props.changeStore({ lostChartTime: null });
    } else {
      const clickStart = moment(efficiencyDate).startOf(lostChartTimeMode);
      const clickEnd = moment(efficiencyDate).endOf(lostChartTimeMode);
      this.props.changeStore({ lostChartTime: efficiencyDate });
      startTime = moment.max(clickStart, moment(date[0])).format('YYYY-MM-DD');
      endTime = moment.min(clickEnd, moment(date[1])).format('YYYY-MM-DD');
    }
    this.setState({
      zoomRange: this.getZoomRange(chart),
    }, () => this.renderChart(lostTrend));
    this.props.getLostTypes({
      startTime,
      endTime,
      stationCodes: [searchParam.code],
      deviceFullcodes: [lostChartDevice.deviceFullcode],
    });
  }

  renderChart = (lostTrend = []) => {
    const { zoomRange } = this.state;
    const { lostChartTime, lostStringify, quotaInfo } = this.props;
    const { quota } = lostStringify ? JSON.parse(lostStringify) :{};
    const selectedQuota = this.getQuota(quotaInfo, quota);
    const { label = '--', unit, pointLength } = selectedQuota;
    const trendChart = echarts.init(this.trendRef);
    const { dataAxis, series } = this.createSeries(lostTrend, lostChartTime, unit);
    const baseOption = getBaseOption(dataAxis);
    baseOption.yAxis.name = `${label}${unit ? `(${unit})` : ''}`;
    baseOption.yAxis.nameTextStyle.padding = [0, -40, 0, 0];
    baseOption.grid.left = 36;
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
                  <span>
                    ${i === 1 ? '应发小时数' : `${label}`}
                  </span>
                  <span>${dataFormats(e.value, '--', pointLength, true)}${unit || ''}</span>
                </span>`
              )).join('')}
            </div>
          </section>`;
        },
      },
      series,
    };
    trendChart.hideLoading();
    lostTrend.length > 0 && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      start: zoomRange[0],
      end: zoomRange[1],
      bottom: 16,
      height: 20,
    }, {
      type: 'inside',
      start: zoomRange[0],
      end: zoomRange[1],
      filterMode: 'empty',
    }]);
    trendChart.clear();
    trendChart.setOption(option);
    trendChart.off('click');
    trendChart.on('click', (param) => this.chartHandle(param, lostTrend, trendChart));
  }

  render() {
    const { lostChartTimeMode, lostChartDevice, quotaInfo, lostStringify } = this.props;
    const chartName = lostChartDevice && lostChartDevice.deviceName ? `${lostChartDevice.deviceName}-` : '';
    const { quota } = lostStringify ? JSON.parse(lostStringify) :{};
    const selectedQuota = this.getQuota(quotaInfo, quota);
    return (
      <div className={styles.lostTrend}>
        <div className={styles.top}>
          <span className={styles.title}>
            {chartName}{selectedQuota.label || '--'}趋势图
          </span>
          <TimeSelect timeMode={lostChartTimeMode} timeModeChange={this.timeModeChange} />
        </div>
        <div className={styles.chart} ref={(ref)=> {this.trendRef = ref;}} />
      </div>
    );
  }
}

export default ChartLostTrend;

