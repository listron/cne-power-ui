import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Select, message } from 'antd';
import { dataFormats } from '../../../../../utils/utilFunc';
import IndicateCascader from './IndicateCascader';
import { getBaseOption } from './chartBaseOption';
import styles from './lost.scss';
const { Option } = Select;

class ChartLostRank extends Component {

  static propTypes = {
    lostRank: PropTypes.array, // 损失根源 - 指标排名
    lostStringify: PropTypes.string,
    lostChartTimeMode: PropTypes.string,
    lostChartTime: PropTypes.string,
    lostRankLoading: PropTypes.bool,
    quotaInfo: PropTypes.array,
    lostChartDevice: PropTypes.object,
    onQuotaChange: PropTypes.func,
    changeStore: PropTypes.func,
    getLostTrend: PropTypes.func,
    getLostTypes: PropTypes.func,
  }

  state= {
    sortType: 'name',
    modeArr: [],
    zoomRange: [0, 100],
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
      if (sortType === 'name' && a.deviceName) {
        return a.deviceName.localeCompare(b.deviceName);
      }
      const sortName = Object.keys(a.indicatorData).includes('value') ? 'value' : 'actualGen';
      return b.indicatorData[sortName] - a.indicatorData[sortName];
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
    this.setState({ sortType: value }, () => {
      this.renderChart(lostRank, value);
    });
  }

  unitValue = (value, unit) => dataFormats(dataFormats(value) * (unit === '%' ? 100 : 1), '')

  createSeries = (lostRank = [], lostChartDevice, unit) => {
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
      const { deviceModeName, deviceFullcode, indicatorData = {} } = e || {};
      const colorIndex = modeArr.indexOf(deviceModeName);
      firstBarData.push({
        name: deviceModeName,
        value: this.unitValue(indicatorType === 'single' ? indicatorData.value: indicatorData.actualGen, unit),
        itemStyle: {
          color: new echarts.graphic.LinearGradient( 0, 0, 0, 1, [
            {offset: 0, color: this.barColor[colorIndex][0] },
            {offset: 1, color: this.barColor[colorIndex][1] },
          ]),
          opacity: (lostChartDevice && deviceFullcode !== lostChartDevice.deviceFullcode) ? 0.4 : 1,
        },
      });
      if (indicatorType === 'double') {
        secendBarData.push({
          name: deviceModeName,
          value: indicatorData.theoryGen,
          opacity: (lostChartDevice && deviceFullcode !== lostChartDevice.deviceFullcode) ? 0.4 : 1,
        });
      }
    });
    series[0] = {
      type: 'bar',
      barWidth: '10px',
      itemStyle: {
        opacity: 1,
      },
      data: firstBarData,
    };
    indicatorType === 'double' && (series[1] = {
      type: 'bar',
      barWidth: '10px',
      itemStyle: {
        color: '#c1c1c1',
        opacity: 1,
      },
      data: secendBarData,
    });
    this.setState({ modeArr });
    return { dataAxis, series, indicatorType };
  }

  chartHandle = ({dataIndex}, sortedLostRank, chart) => {
    const { lostChartTimeMode, lostChartTime, lostStringify, lostChartDevice, lostRank } = this.props;
    const { sortType } = this.state;
    if (lostChartTime) {
      message.info('请先取消下方事件选择, 再选择设备');
      return;
    }
    const selectedInfo = sortedLostRank[dataIndex] || {};
    let deviceFullcodes;
    if (lostChartDevice && lostChartDevice.deviceFullcode === selectedInfo.deviceFullcode) { // 取消当前选中项.
      deviceFullcodes = searchParam.device;
      this.props.changeStore({ lostChartDevice: null });
    } else {
      deviceFullcodes = [selectedInfo.deviceFullcode];
      this.props.changeStore({ lostChartDevice: selectedInfo });
    }
    const searchParam = JSON.parse(lostStringify) || {};
    const { code, date = [], quota } = searchParam;
    const [startTime, endTime] = date;
    const params = {
      stationCodes: [code],
      startTime,
      endTime,
      deviceFullcodes,
    };
    this.setState({
      zoomRange: this.getZoomRange(chart),
    }, () => this.renderChart(lostRank, sortType));
    this.props.getLostTrend({
      ...params,
      indicatorCode: quota,
      type: lostChartTimeMode,
    });
    this.props.getLostTypes({ ...params });
  }

  getZoomRange = (chartInstance = {}) => { // 获取实例的zoom起止位置。
    const { dataZoom = [] } = chartInstance.getOption && chartInstance.getOption() || {};
    const zoomInfo = dataZoom[0] || {};
    const { start = 0, end = 100 } = zoomInfo;
    return [start, end];
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

  renderChart = (lostRank = [], sortType) => {
    const { quotaInfo, lostStringify, lostChartDevice } = this.props;
    const { zoomRange } = this.state;
    const rankChart = echarts.init(this.rankRef);
    const sortedLostRank = this.sortRank(lostRank, sortType);
    const { quota } = lostStringify ? JSON.parse(lostStringify) :{};
    const selectedQuota = this.getQuota(quotaInfo, quota);
    const { label = '--', unit, pointLength } = selectedQuota;
    const { dataAxis, series } = this.createSeries(sortedLostRank, lostChartDevice, unit);
    const baseOption = getBaseOption(dataAxis);
    baseOption.yAxis.name = `${label}${unit ? `(${unit})` : ''}`;
    const option = {
      ...baseOption,
      tooltip: {
        trigger: 'axis',
        padding: 0,
        formatter: (param) => {
          const { name, axisValue } = param && param[0] || {};
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>
              <span>${axisValue}</span>
              <span class=${styles.modeName}>${name}</span>
            </h3>
            <div class=${styles.info}>
              ${param.map((e, i) => (
                `<span class=${styles.eachItem}>
                  <span>${i === 1 ? '应发小时数' : `${label === '利用小时数' ? '实发小时数' : label}`}</span>
                  <span>${dataFormats(e.value, '--', pointLength, true)}${unit || ''}</span>
                </span>`
              )).join('')}
            </div>
          </section>`;
        },
      },
      series,
    };
    lostRank.length > 0 && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      start: zoomRange[0],
      end: zoomRange[1],
      showDetail: false,
      bottom: 15,
      height: 20,
    }, {
      type: 'inside',
      filterMode: 'empty',
      start: zoomRange[0],
      end: zoomRange[1],
    }]);
    rankChart.hideLoading();
    rankChart.clear();
    rankChart.setOption(option);
    rankChart.off('click');
    rankChart.on('click', (param) => this.chartHandle(param, sortedLostRank, rankChart ));
  }

  render() {
    const { quotaInfo, lostStringify } = this.props;
    const { sortType, modeArr } = this.state;
    const { quota } = lostStringify ? JSON.parse(lostStringify) :{};
    const selectedQuota = this.getQuota(quotaInfo, quota);
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
        <div className={styles.modes}>
          {modeArr.map((e, i) => (
            <span key={e} className={styles.eachMode}>
              <span className={styles.rect} style={{
                backgroundImage: `linear-gradient(-180deg, ${this.barColor[i][0]} 0%, ${this.barColor[i][1]} 100%)`,
                }} />
              <span className={styles.modeText}>{e}</span>
            </span>
          ))}
        </div>
        <div className={styles.chart} ref={(ref)=> {this.rankRef = ref;}} />
      </div>
    );
  }
}

export default ChartLostRank;

