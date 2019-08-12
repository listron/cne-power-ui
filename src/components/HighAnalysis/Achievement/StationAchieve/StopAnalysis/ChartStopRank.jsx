import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Select } from 'antd';
import moment from 'moment';
import searchUtil from '../../../../../utils/searchUtil';
import { getBaseGrid, getBaseYAxis, getBaseXAxis } from './chartBaseOption';
import styles from './stop.scss';
const { Option } = Select;

class ChartStopRank extends Component {

  static propTypes = {
    stopElecType: PropTypes.string,
    stopChartTime: PropTypes.string,
    stopChartTimeMode: PropTypes.string,
    location: PropTypes.object,
    stopChartTypes: PropTypes.object,
    stopChartDevice: PropTypes.object,
    changeStore: PropTypes.func,
    stopRank: PropTypes.array,
    stopRankLoading: PropTypes.bool,
    getStopTrend: PropTypes.func,
    getStopTypes: PropTypes.func,
  }

  state = {
    sortType: 'deviceName',
  }

  componentDidMount(){
    const { stopRank = [] } = this.props;
    const { sortType } = this.state;
    stopRank.length > 0 && this.renderChart(stopRank, sortType);
  }

  componentWillReceiveProps(nextProps){
    const { stopRankLoading, stopRank } = nextProps;
    const preLoading = this.props.stopRankLoading;
    const { sortType } = this.state;
    if (preLoading && !stopRankLoading) { // 请求完毕
      this.renderChart(stopRank, sortType);
    } else if (!preLoading && stopRankLoading) { // 请求中
      this.setChartLoading();
    }
  }

  sortRank = (rankList, sortType = 'deviceName') => {
    const sortedList = [...rankList].sort((a, b) => {
      if (sortType = 'deviceName') {
        return a[sortType] && b[sortType] && a[sortType].localeCompare(b[sortType]);
      }
      return a[sortType] - b[sortType];
    });
    return sortedList;
  }

  barColor = [
    ['#72c8ea', '#3e97d1'],
    ['#36c6ad', '#199475'],
    ['#ffb8c4', '#ff8291'],
    ['#df7789', '#bc4251'],
    ['#f2b75f', '#e08031'],
    ['#ffeecc', '#ffd99d'],
    ['#4c9de8', '#2564cc'],
    ['#058447', '#024d22'],
    ['#e024f2', '#bd10e0'],
  ]

  setChartLoading = () => {
    const rankChart = this.rankRef && echarts.getInstanceByDom(this.rankRef);
    rankChart && rankChart.showLoading();
  }

  createSeries = (stopRank = []) => {
    const dataAxis = [];
    const countData = [];
    const hourData = [];
    const series = [];
    const modeSet = new Set();
    stopRank.forEach(e => {
      const { deviceModeName, deviceName } = e || {};
      dataAxis.push(deviceName);
      modeSet.add(deviceModeName);
    });
    const modeArr = [...modeSet];
    stopRank.forEach(e => {
      const { deviceModeName, stopCount, stopHour } = e || {};
      const colorIndex = modeArr.indexOf(deviceModeName);
      hourData.push({
        name: deviceModeName,
        value: stopCount,
        itemStyle: {
          color: new echarts.graphic.LinearGradient( 0, 0, 0, 1, [
            {offset: 0, color: this.barColor[colorIndex][0]},
            {offset: 1, color: this.barColor[colorIndex][1]},
          ]),
        },
      });
      countData.push(stopHour);
    });
    series[0] = {
      type: 'bar',
      barWidth: '10px',
      data: hourData,
    };
    series[1] = {
      type: 'line',
      data: countData,
      yAxisIndex: 1,
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
    return { dataAxis, series, modeArr };
  }

  chartHandle = ({dataIndex}, sortedStopRank, chart) => {
    const { stopElecType, stopChartTimeMode, location, stopChartTime, stopChartDevice, stopChartTypes } = this.props;
    const selectedDevice = sortedStopRank[dataIndex] || {};
    const { search } = location;
    const infoStr = searchUtil(search).getValue('station');
    const searchParam = JSON.parse(infoStr) || {};
    let deviceFullcodes = searchParam.searchDevice;
    let startTime = searchParam.searchDates[0];
    let endTime = searchParam.searchDates[1];
    if (stopChartDevice && selectedDevice.deviceFullcode === stopChartDevice.deviceFullcode) { // 取消选中
      this.props.changeStore({ stopChartDevice: null });
    } else {
      deviceFullcodes = [selectedDevice.deviceFullcode];
      this.props.changeStore({ stopChartDevice: selectedDevice });
    }
    if (stopChartTime) { // 已有时间选择。
      const recordStart = moment(stopChartTime).startOf(stopChartTimeMode);
      const recordEnd = moment(stopChartTime).endOf(stopChartTimeMode);
      startTime = moment.max(recordStart, moment(startTime)).format('YYYY-MM-DD');
      endTime = moment.min(recordEnd, moment(endTime)).format('YYYY-MM-DD');
    }
    const param = {
      stationCodes: [searchParam.searchCode],
      deviceFullcodes,
      startTime,
      endTime,
      parentFaultId: stopElecType,
    };
    const trendParam = { ...param, type: stopChartTimeMode };
    if (stopChartTypes) { // 选中了停机时长及次数中的故障内容。
      trendParam.faultId = stopChartTypes.faultTypeId;
    }
    this.props.getStopTrend({ ...trendParam });
    this.props.getStopTypes({ ...param });
  }

  renderChart = (stopRank = [], sortType) => {
    const rankChart = echarts.init(this.rankRef);
    const sortedStopRank = this.sortRank(stopRank, sortType);
    const { dataAxis, series, modeArr } = this.createSeries(sortedStopRank);
    const option = {
      grid: getBaseGrid(),
      xAxis: getBaseXAxis(dataAxis),
      yAxis: [
        getBaseYAxis('停机时长(h)'),
        getBaseYAxis('故障次数(次)'),
      ],
      tooltip: {
        trigger: 'axis',
        padding: 0,
        formatter: (param) => {
          const { name, axisValue } = param && param[0] || {};
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>
              <span>${axisValue}</span>
              <span>${name}</span>
            </h3>
            <div class=${styles.info}>
              ${param.map((e, i) => (
                `<span class=${styles.eachItem}>
                  <span>${i === 0 ? '停机时长' : '故障次数'}</span>
                  <span>${e.value}</span>
                </span>`
              )).join('')}
            </div>
          </section>`;
        },
      },
      series,
    };
    const endPosition = 30 / stopRank.length >= 1 ? 100 : 3000 / stopRank.length;
    stopRank.length > 0 && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      start: 0,
      end: endPosition,
      bottom: 15,
    }, {
      type: 'inside',
      filterMode: 'empty',
      start: 0,
      end: endPosition,
    }]);
    rankChart.hideLoading();
    rankChart.setOption(option);
    rankChart.on('click', (param) => this.chartHandle(param, sortedStopRank, rankChart ));
  }

  render() {
    const { sortType } = this.state;
    const { stopChartTypes, stopChartTime } = this.props;
    const stopTimeText = stopChartTime ? `${stopChartTime}-` : '';
    const stopTypeText = stopChartTypes ? `${stopChartTypes.faultName}-` : '';
    return (
      <div className={styles.stopRank}>
        <div className={styles.top}>
          <span className={styles.title}>
            {stopTimeText}{stopTypeText}风机停机时长及次数
          </span>
          <span className={styles.handle}>
            <span className={styles.eachHandle}>
              <span className={styles.text}>选择排序</span>
              <Select
                onChange={this.sortChart}
                style={{width: '150px'}}
                value={sortType}
              >
                <Option value="deviceName">风机名称</Option>
                <Option value="stopHour">停机时长</Option>
                <Option value="stopCount">停机次数</Option>
              </Select>
            </span>
          </span>
        </div>
        <div className={styles.chart} ref={(ref)=> {this.rankRef = ref;}} />
      </div>
    );
  }
}

export default ChartStopRank;

