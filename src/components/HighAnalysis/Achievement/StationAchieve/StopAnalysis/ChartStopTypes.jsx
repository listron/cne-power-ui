import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import { Select } from 'antd';
import { dataFormats } from '../../../../../utils/utilFunc';
import { getBaseGrid, getBaseYAxis, getBaseXAxis } from './chartBaseOption';
import styles from './stop.scss';
const { Option } = Select;

class ChartStopTypes extends Component {

  static propTypes = {
    stopTopStringify: PropTypes.string,
    stopChartTime: PropTypes.string,
    stopChartTimeMode: PropTypes.string,
    stopTypes: PropTypes.array,
    stopChartDevice: PropTypes.object,
    stopChartTypes: PropTypes.object,
    stopElecType: PropTypes.string,
    stopTypesLoading: PropTypes.bool,
    changeStore: PropTypes.func,
    getStopRank: PropTypes.func,
    getStopTrend: PropTypes.func,
  }

  state = {
    sortName: 'stopCount',
    zoomRange: [0, 100],
  }

  componentDidMount(){
    const { stopTypes, stopChartTypes } = this.props;
    const { sortName } = this.state;
    stopTypes.length > 0 && this.renderChart(stopTypes, sortName, stopChartTypes);
  }

  componentWillReceiveProps(nextProps){
    const { stopTypesLoading, stopTypes, stopChartTypes } = nextProps;
    const preLoading = this.props.stopTypesLoading;
    if (preLoading && !stopTypesLoading) { // 请求完毕
      const { sortName } = this.state;
      this.renderChart(stopTypes, sortName, stopChartTypes);
    } else if (!preLoading && stopTypesLoading) { // 请求中
      this.setChartLoading();
    }
  }

  setChartLoading = () => {
    const typesChart = this.typesRef && echarts.getInstanceByDom(this.typesRef);
    typesChart && typesChart.showLoading();
  }

  sortChange = (sortName) => {
    const { stopTypes, stopChartTypes } = this.props;
    this.setState({ sortName }, () => this.renderChart(stopTypes, sortName, stopChartTypes));
  }

  sortChart = (stopTypes, sortName) => [...stopTypes].sort((a, b) => b[sortName] - a[sortName]);

  createBaseBar = (data, colors) => ({
    type: 'bar',
    barWidth: '10px',
    data,
    itemStyle: {
      color: new echarts.graphic.LinearGradient( 0, 0, 0, 1, [
        {offset: 0, color: colors[0]},
        {offset: 1, color: colors[1]},
      ]),
    },
  })

  createSeries = (sortedTypes = [], stopChartTypes) => {
    const dataAxis = [];
    const hourData = [];
    const genData = [];
    const countData = [];
    let series = [];
    sortedTypes.forEach(e => {
      const { faultId, faultName } = e;
      dataAxis.push(faultName);
      genData.push({
        value: e.stopLostGen,
        itemStyle: {
          opacity: (stopChartTypes && faultId !== stopChartTypes.faultId) ? 0.4 : 1,
        },
      });
      hourData.push({
        value: e.stopHour,
        itemStyle: {
          opacity: (stopChartTypes && faultId !== stopChartTypes.faultId) ? 0.4 : 1,
        },
      });
      countData.push({
        value: e.stopCount,
        itemStyle: {
          opacity: (stopChartTypes && faultId !== stopChartTypes.faultId) ? 0.4 : 1,
        },
      });
    });
    series = [
      {
        ...this.createBaseBar(countData, ['#e024f2', '#bd10e0']),
        xAxisIndex: 0,
        yAxisIndex: 0,
      }, {
        ...this.createBaseBar(hourData, ['#df7789', '#bc4251']),
        xAxisIndex: 1,
        yAxisIndex: 1,
      }, {
        ...this.createBaseBar(genData, ['#f2b75f', '#e08031']),
        xAxisIndex: 2,
        yAxisIndex: 2,
      },
    ];
    return { dataAxis, series };
  }

  chartHandle = ({ dataIndex }, sortedTypes, chart) => {
    const { sortName } = this.state;
    const { stopElecType, stopChartTypes, stopChartDevice, stopChartTime, stopChartTimeMode, stopTopStringify } = this.props;
    const curFaultInfo = sortedTypes[dataIndex] || {};
    const searchParam = JSON.parse(stopTopStringify) || {};
    const deviceFullcodes = stopChartDevice ? [stopChartDevice.deviceFullcode] : searchParam.device;
    let [startTime, endTime] = searchParam.date;
    if (stopChartTime) { // 已有时间选择。
      const recordStart = moment(stopChartTime).startOf(stopChartTimeMode);
      const recordEnd = moment(stopChartTime).endOf(stopChartTimeMode);
      startTime = moment.max(recordStart, moment(startTime)).format('YYYY-MM-DD');
      endTime = moment.min(recordEnd, moment(endTime)).format('YYYY-MM-DD');
    }
    let faultInfo = {};
    if (stopChartTypes && stopChartTypes.faultId === curFaultInfo.faultId) { // 取消选中
      this.props.changeStore({ stopChartTypes: null });
      this.setState({
        zoomRange: this.getZoomRange(chart),
      }, () => this.renderChart(sortedTypes, sortName, null));
    } else {
      faultInfo = { faultId: curFaultInfo.faultId };
      this.props.changeStore({ stopChartTypes: curFaultInfo });
      this.setState({
        zoomRange: this.getZoomRange(chart),
      }, this.renderChart(sortedTypes, sortName, curFaultInfo));
    }
    const param = {
      stationCodes: [searchParam.code],
      deviceFullcodes,
      startTime,
      endTime,
      parentFaultId: stopElecType,
      ...faultInfo,
    };
    // this.props.getStopRank({ ...param });
    this.props.getStopTrend({ ...param });
  }

  getZoomRange = (chartInstance = {}) => { // 获取实例的zoom起止位置。
    const { dataZoom = [] } = chartInstance.getOption && chartInstance.getOption() || {};
    const zoomInfo = dataZoom[0] || {};
    const { start = 0, end = 100 } = zoomInfo;
    return [start, end];
  }

  renderChart = (stopTypes = [], sortName, stopChartTypes) => {
    const { zoomRange } = this.state;
    const typesChart = echarts.init(this.typesRef);
    const sortedTypes = this.sortChart(stopTypes, sortName);
    const { dataAxis, series } = this.createSeries(sortedTypes, stopChartTypes);
    const option = {
      grid: [
        { ...getBaseGrid(), top: 30, height: 85, containLabel: false, left: 40 },
        { ...getBaseGrid(), top: 155, height: 85, containLabel: false, left: 40 },
        { ...getBaseGrid(), top: 275, height: 85, containLabel: false, left: 40 },
      ],
      xAxis: [
        { ...getBaseXAxis(dataAxis), gridIndex: 0, axisLabel: { show: false } },
        { ...getBaseXAxis(dataAxis), gridIndex: 1, axisLabel: { show: false } },
        { ...getBaseXAxis(dataAxis), gridIndex: 2 },
      ],
      yAxis: [
        { ...getBaseYAxis('停机次数(次)'), gridIndex: 0, min: 0 },
        { ...getBaseYAxis('时长(h)'), gridIndex: 1, min: 0 },
        { ...getBaseYAxis('损失电量(万kWh)'), gridIndex: 2, min: 0 },
      ],
      axisPointer: {
        link: { xAxisIndex: 'all' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        padding: 0,
        formatter: (param) => {
          const { axisValue } = param && param[0] || {};
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>
              <span>${axisValue}</span>
            </h3>
            <div class=${styles.info}>
              ${param.sort((a, b) => a.seriesIndex - b.seriesIndex).map(({ seriesIndex, value }) => (
                `<span class=${styles.eachItem}>
                  <span>${['停机次数', '停机时长', '停机电量'][seriesIndex]}</span>
                  <span>${dataFormats(value / ([1, 1, 10000][seriesIndex]), '--', [0, 0, 4][seriesIndex], true)}</span>
                </span>`
              )).join('')}
            </div>
          </section>`;
        },
      },
      series,
    };
    typesChart.hideLoading();
    sortedTypes.length > 0 && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      bottom: 16,
      showDetail: false,
      start: zoomRange[0],
      end: zoomRange[1],
      height: 20,
    }, {
      type: 'inside',
      filterMode: 'empty',
      start: zoomRange[0],
      end: zoomRange[1],
      xAxisIndex: [0, 1, 2],
    }]);
    typesChart.setOption(option);
    typesChart.off('click');
    typesChart.on('click', (param) => this.chartHandle(param, sortedTypes, typesChart));
  }

  render() {
    const { stopChartDevice, stopChartTime } = this.props;
    const { sortName } = this.state;
    const stopDeviceText = stopChartDevice ? `${stopChartDevice.deviceName}-` : '';
    const stopTimeText = stopChartTime ? `${stopChartTime}-` : '';
    return (
      <div className={styles.stopTrend}>
        <div className={styles.top}>
          <span className={styles.title}>
            {stopDeviceText}{stopTimeText}各类停机次数、时长及损失电量
          </span>
          <span className={styles.handle}>
            <span className={styles.eachHandle}>
              <span className={styles.text}>选择排序</span>
              <Select
                onChange={this.sortChange}
                style={{width: '150px'}}
                value={sortName}
              >
                <Option value="stopCount">停机次数</Option>
                <Option value="stopHour">停机时长</Option>
                <Option value="stopLostGen">停机电量</Option>
              </Select>
            </span>
          </span>
        </div>
        <div className={styles.chart} ref={(ref)=> {this.typesRef = ref;}} />
      </div>
    );
  }
}

export default ChartStopTypes;

