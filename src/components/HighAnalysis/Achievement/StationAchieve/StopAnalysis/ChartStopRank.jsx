import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Select } from 'antd';
import searchUtil from '../../../../../utils/searchUtil';
import { getBaseGrid, getBaseYAxis, getBaseXAxis } from './chartBaseOption';
import styles from './stop.scss';
const { Option } = Select;

class ChartStopRank extends Component {

  static propTypes = {
    // quotaName: PropTypes.string,
    // lostChartTimeMode: PropTypes.string,
    // quotaInfo: PropTypes.array,
    // location: PropTypes.object,
    // onQuotaChange: PropTypes.func,
    // changeStore: PropTypes.func,
    // getLostTrend: PropTypes.func,
    stopRank: PropTypes.array,
    stopRankLoading: PropTypes.bool,
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
        return a[sortType].localeCompare(b[sortType]);
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
    console.log('loading');
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
    };
    return { dataAxis, series, modeArr };
  }

  renderChart = (stopRank = [], sortType) => {
    // const { quotaName, changeStore, location, getLostTrend, lostQuota, lostChartTimeMode } = this.props;
    const rankChart = echarts.init(this.rankRef);
    const sortedStopRank = this.sortRank(stopRank, sortType)
    const { dataAxis, series, modeArr } = this.createSeries(sortedStopRank);
    // const baseOption = getBaseOption(dataAxis);
    // baseOption.yAxis.name = quotaName;
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
          console.log(param)
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
    rankChart.setOption(option);
    // rankChart.on('click', ({dataIndex}) => {
    //   const lostChartDevice = sortedLostRank[dataIndex] || {};
    //   changeStore({ lostChartDevice });
    //   const { search } = location;
    //   const infoStr = searchUtil(search).getValue('station');
    //   const searchParam = JSON.parse(infoStr) || {};
    //   getLostTrend({
    //     stationCodes: [searchParam.searchCode],
    //     deviceFullcodes: [lostChartDevice.deviceFullcode],
    //     startTime: searchParam.searchDates[0],
    //     endTime: searchParam.searchDates[1],
    //     indicatorCode: lostQuota,
    //     type: lostChartTimeMode,
    //   });
    // });
  }


  render() {
    const { sortType } = this.state;
    return (
      <div className={styles.stopRank}>
        <div className={styles.top}>
          <span className={styles.title}>
            风机停机时长及次数
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

