import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Select } from 'antd';
import searchUtil from '../../../../../utils/searchUtil';
import IndicateCascader from './IndicateCascader';
import { getBaseOption } from './chartBaseOption';
import styles from './lost.scss';
const { Option } = Select;

class ChartLostRank extends Component {

  static propTypes = {
    lostRank: PropTypes.array, // 损失根源 - 指标排名
    quotaName: PropTypes.string,
    lostQuota: PropTypes.string,
    lostChartTimeMode: PropTypes.string,
    lostSort: PropTypes.string,
    lostRankLoading: PropTypes.bool,
    quotaInfo: PropTypes.array,
    location: PropTypes.object,
    onQuotaChange: PropTypes.func,
    changeStore: PropTypes.func,
    getLostTrend: PropTypes.func,
  }


  componentDidMount(){
    const { lostRank = [], lostSort } = this.props;
    lostRank.length > 0 && this.renderChart(lostRank, lostSort);
  }

  componentWillReceiveProps(nextProps){
    const { lostRankLoading, lostRank, lostSort } = nextProps;
    const preLoading = this.props.lostRankLoading;
    if (preLoading && !lostRankLoading) { // 请求完毕
      const sortedLostRank = this.sortRank(lostRank, lostSort);
      this.renderChart(sortedLostRank);
    } else if (!preLoading && lostRankLoading) { // 请求中
      this.setChartLoading();
    }
  }

  sortRank = (rankList, sortType = 'name') => {
    const sortedList = [...rankList].sort((a, b) => {
      if (sortType = 'name') {
        return a.deviceName.localeCompare(b.deviceName);
      }
      const sortName = Object.keys(a.indicatorData).includes('value') ? 'value' : 'actualGen';
      return a.indicatorData[sortName] - b.indicatorData[sortName];
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

  cascaderChange = (codes, fullInfo) => {
    this.props.onQuotaChange(codes[1], fullInfo[1].label);
  }

  sortChart = (value) => {
    const { changeStore, lostRank } = this.props;
    changeStore({lostSort: value});
    const sortedLostRank = this.sortRank(lostRank, value);
    this.renderChart(sortedLostRank);
  }

  createSeries = (lostRank = []) => {
    const dataAxis = [];
    const firstBarData = [];
    const secendBarData = [];
    const series = [];
    const modeSet = new Set();
    const firstData = lostRank[0] || {};
    const firstIndicator = firstData.indicatorData || {};
    const indicatorType = Object.keys(firstIndicator).includes('value') ? 'single' : 'double';
    lostRank.forEach(e => {
      const { deviceModeName, deviceName } = e || {};
      dataAxis.push(deviceName);
      modeSet.add(deviceModeName);
    });
    const modeArr = [...modeSet];
    lostRank.forEach(e => {
      const { deviceModeName, indicatorData = {} } = e || {};
      const colorIndex = modeArr.indexOf(deviceModeName);
      firstBarData.push({
        name: deviceModeName,
        value: indicatorType === 'single' ? indicatorData.value : indicatorData.actualGen,
        itemStyle: {
          color: new echarts.graphic.LinearGradient( 0, 0, 0, 1, [
            {offset: 0, color: this.barColor[colorIndex][0]},
            {offset: 1, color: this.barColor[colorIndex][1]},
          ]),
        },
      });
      if (indicatorType === 'double') {
        secendBarData.push({
          name: deviceModeName,
          value: indicatorData.theoryGen,
        });
      }
    });
    series[0] = {
      type: 'bar',
      barWidth: '10px',
      data: firstBarData,
    };
    indicatorType === 'double' && (series[1] = {
      type: 'bar',
      barWidth: '10px',
      itemStyle: {
        color: '#c1c1c1',
      },
      data: secendBarData,
    });
    return { dataAxis, series, modeArr, indicatorType };
  }

  renderChart = (sortedLostRank = []) => {
    const { quotaName, changeStore, location, getLostTrend, lostQuota, lostChartTimeMode } = this.props;
    const rankChart = echarts.init(this.rankRef);
    const { dataAxis, series, modeArr } = this.createSeries(sortedLostRank);
    const baseOption = getBaseOption(dataAxis);
    baseOption.yAxis.name = quotaName;
    const option = {
      ...baseOption,
      legend: { data: modeArr },
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
                  <span>${i === 1 ? quotaName : '应发小时数'}</span>
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
    rankChart.on('click', ({dataIndex}) => {
      const lostChartDevice = sortedLostRank[dataIndex] || {};
      changeStore({ lostChartDevice });
      const { search } = location;
      const infoStr = searchUtil(search).getValue('station');
      const searchParam = JSON.parse(infoStr) || {};
      getLostTrend({
        stationCodes: [searchParam.searchCode],
        deviceFullcodes: [lostChartDevice.deviceFullcode],
        startTime: searchParam.searchDates[0],
        endTime: searchParam.searchDates[1],
        indicatorCode: lostQuota,
        type: lostChartTimeMode,
      });
    });
  }


  render() {
    const { quotaInfo, lostQuota, quotaName, lostSort } = this.props;
    return (
      <div className={styles.lostRank}>
        <div className={styles.top}>
          <span className={styles.title}>
            风机{quotaName}排名
          </span>
          <span className={styles.handle}>
            <span className={styles.eachHandle}>
              <span className={styles.text}>选择指标</span>
              <IndicateCascader quotaInfo={quotaInfo} lostQuota={lostQuota} onChange={this.cascaderChange} />
            </span>
            <span className={styles.eachHandle}>
              <span className={styles.text}>选择排序</span>
              <Select
                onChange={this.sortChart}
                style={{width: '150px'}}
                value={lostSort}
              >
                <Option value="name">风机名称</Option>
                <Option value="quota">{quotaName}</Option>
              </Select>
            </span>
          </span>
        </div>
        <div className={styles.chart} ref={(ref)=> {this.rankRef = ref;}} />
      </div>
    );
  }
}

export default ChartLostRank;

