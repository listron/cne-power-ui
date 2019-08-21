import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Select, message } from 'antd';
import searchUtil from '../../../../../utils/searchUtil';
import IndicateCascader from './IndicateCascader';
import { getBaseOption } from './chartBaseOption';
import styles from './lost.scss';
const { Option } = Select;

class ChartLostRank extends Component {

  static propTypes = {
    lostRank: PropTypes.array, // 损失根源 - 指标排名
    selectedQuota: PropTypes.object,
    lostChartTimeMode: PropTypes.string,
    lostChartTime: PropTypes.string,
    lostRankLoading: PropTypes.bool,
    quotaInfo: PropTypes.array,
    location: PropTypes.object,
    lostChartDevice: PropTypes.object,
    onQuotaChange: PropTypes.func,
    changeStore: PropTypes.func,
    getLostTrend: PropTypes.func,
  }

  state= {
    sortType: 'name',
  }

  componentDidMount(){
    const { lostRank = [] } = this.props;
    const { sortType } = this.state;
    lostRank.length > 0 && this.renderChart(lostRank, sortType);
  }

  componentWillReceiveProps(nextProps){
    const { lostRankLoading, lostRank } = nextProps;
    const preLoading = this.props.lostRankLoading;
    if (preLoading && !lostRankLoading) { // 请求完毕
      const { sortType } = this.state;
      this.renderChart(lostRank, sortType);
    } else if (!preLoading && lostRankLoading) { // 请求中
      this.setChartLoading();
    }
  }

  sortRank = (rankList, sortType = 'name') => {
    const sortedList = [...rankList].sort((a, b) => {
      if (sortType = 'name' && a.deviceName) {
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
    const rankChart = this.rankRef && echarts.getInstanceByDom(this.rankRef);
    rankChart && rankChart.showLoading();
  }

  cascaderChange = (codes, fullInfo) => {
    const index = (fullInfo && fullInfo.length > 1) ? 1 : 0;
    const quotaInfo = fullInfo[index];
    this.props.onQuotaChange(quotaInfo);
  }

  sortChart = (value) => {
    const { lostRank } = this.props;
    this.renderChart(lostRank, value);
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
    lostRank.forEach((e) => {
      const { deviceModeName, indicatorData = {} } = e || {};
      const colorIndex = modeArr.indexOf(deviceModeName);
      firstBarData.push({
        name: deviceModeName,
        value: indicatorType === 'single' ? indicatorData.value : indicatorData.actualGen,
        itemStyle: {
          color: new echarts.graphic.LinearGradient( 0, 0, 0, 1, [
            {offset: 0, color: this.barColor[colorIndex][0] },
            {offset: 1, color: this.barColor[colorIndex][1] },
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

  chartHandle = ({dataIndex}, sortedLostRank, chart) => {
    const { selectedQuota, lostChartTimeMode, lostChartTime, location, lostChartDevice } = this.props;
    if (lostChartTime) {
      message.info('请先取消下方事件选择, 再选择设备');
      return;
    }
    const selectedInfo = sortedLostRank[dataIndex] || {};
    const { search } = location;
    const infoStr = searchUtil(search).getValue('station');
    const searchParam = JSON.parse(infoStr) || {};
    let deviceFullcodes;
    if (lostChartDevice && lostChartDevice.deviceFullcode === selectedInfo.deviceFullcode) { // 取消当前选中项.
      deviceFullcodes = searchParam.searchDevice;
      this.props.changeStore({ lostChartDevice: null });
    } else {
      deviceFullcodes = [selectedInfo.deviceFullcode];
      this.props.changeStore({ lostChartDevice: selectedInfo });
    }
    this.props.getLostTrend({
      stationCodes: [searchParam.searchCode],
      deviceFullcodes,
      startTime: searchParam.searchDates[0],
      endTime: searchParam.searchDates[1],
      indicatorCode: selectedQuota.value,
      type: lostChartTimeMode,
    });
  }

  renderChart = (lostRank = [], sortType) => {
    const { selectedQuota } = this.props;
    const rankChart = echarts.init(this.rankRef);
    const sortedLostRank = this.sortRank(lostRank, sortType);
    const { dataAxis, series, modeArr } = this.createSeries(sortedLostRank);
    const baseOption = getBaseOption(dataAxis);
    baseOption.yAxis.name = `${selectedQuota.label || '--'}${selectedQuota.unit ? `(${selectedQuota.unit})` : ''}`;
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
                  <span>${i === 1 ? '应发小时数' : `${selectedQuota.label || '--'}`}</span>
                  <span>${e.value}${selectedQuota.unit || ''}</span>
                </span>`
              )).join('')}
            </div>
          </section>`;
        },
      },
      series,
    };
    const endPosition = 30 / lostRank.length >= 1 ? 100 : 3000 / lostRank.length;
    lostRank.length > 0 && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      start: 0,
      end: endPosition,
      showDetail: false,
      bottom: 15,
      height: 20,
    }, {
      type: 'inside',
      filterMode: 'empty',
      start: 0,
      end: endPosition,
    }]);
    rankChart.hideLoading();
    rankChart.setOption(option);
    rankChart.on('click', (param) => this.chartHandle(param, sortedLostRank, rankChart ));
  }

  render() {
    const { quotaInfo, selectedQuota } = this.props;
    const { sortType } = this.state;
    return (
      <div className={styles.lostRank}>
        <div className={styles.top}>
          <span className={styles.title}>
            风机{selectedQuota.label || '--'}排名
          </span>
          <span className={styles.handle}>
            <span className={styles.eachHandle}>
              <span className={styles.text}>选择指标</span>
              <IndicateCascader quotaInfo={quotaInfo} selectedQuota={selectedQuota} onChange={this.cascaderChange} />
            </span>
            <span className={styles.eachHandle}>
              <span className={styles.text}>选择排序</span>
              <Select
                onChange={this.sortChart}
                style={{width: '150px'}}
                value={sortType}
              >
                <Option value="name">风机名称</Option>
                <Option value="quota">{selectedQuota.label}</Option>
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

