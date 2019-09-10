import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import echarts from 'echarts';
import { getBaseOption } from './chartBaseOption';
import { dataFormats } from '../../../../../utils/utilFunc';
import searchUtil from '../../../../../utils/searchUtil';
import styles from './lost.scss';

class ChartLostTypes extends Component {

  static propTypes = {
    history: PropTypes.object,
    lostTypes: PropTypes.object, // 损失根源 - 指标排名
    lostTypesLoading: PropTypes.bool,
    lostChartDevice: PropTypes.object,
    lostChartTime: PropTypes.string,
  }

  componentDidMount(){
    const { lostTypes } = this.props;
    Object.keys(lostTypes).length > 0 && this.renderChart(lostTypes);
  }

  componentWillReceiveProps(nextProps){
    const { lostTypesLoading, lostTypes } = nextProps;
    const preLoading = this.props.lostTypesLoading;
    if (preLoading && !lostTypesLoading) { // 请求完毕
      this.renderChart(lostTypes);
    } else if (!preLoading && lostTypesLoading) { // 请求中
      this.setChartLoading();
    }
  }

  // dataAxis = ['应发小时', '降容损失', '风机故障', '变电故障', '场外因素', '计划停机', '其他损失', '实发小时'];
  // dataKey = ['theoryGen', 'deratingGen', 'faultGen', 'substationGen', 'courtGen', 'planShutdownGen', 'otherGen', 'actualGen'];
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
    const typesChart = this.rankRef && echarts.getInstanceByDom(this.typesRef);
    typesChart && typesChart.showLoading();
  }

  getBarValue = (lostTypes = {}) => {
    const { theoryGen, actualGen, detailList = [] } = lostTypes;
    const hideBarData = [dataFormats(theoryGen, '0')];
    const xAxisLabel = ['应发小时'];
    const barData = [dataFormats(theoryGen, '0')];
    detailList && detailList.forEach((e, i) => {
      barData.push(dataFormats(e.value, '0'));
      hideBarData.push(hideBarData[i] - dataFormats(e.value, '0'));
      xAxisLabel.push(e.name || '--');
    });
    hideBarData.push(0);
    hideBarData[0] = 0;
    xAxisLabel.push('实发小时');
    barData.push(dataFormats(actualGen, '0'));
    return {
      hideBarData,
      barData: barData.map(val => dataFormats(val, '', 1)),
      xAxisLabel,
    };
  }

  toRunPage = () => {
    const { history, lostChartDevice } = this.props;
    const { search } = history.location;
    const { pages = '', station } = searchUtil(search).parse(); // 新的pages变化
    const curPages = pages.split('_').filter(e => !!e);
    const stopExist = curPages.includes('run');
    const nextPagesStr = (stopExist ? curPages : curPages.concat('run')).join('_');
    let code, date;
    try {
      ({ code, date } = JSON.parse(station)); // 传入运行数据
    } catch (error) { null; }
    const stationSearch = JSON.stringify({
      searchCode: code,
      searchDevice: [lostChartDevice.deviceFullcode],
      searchDates: date,
    });
    const searchResult = searchUtil(search).replace({pages: nextPagesStr}).replace({run: stationSearch}).stringify();
    this.props.history.push(`/analysis/achievement/analysis/run?${searchResult}`);
  }

  renderChart = (lostTypes = {}) => {
    const typesChart = echarts.init(this.typesRef);
    const { hideBarData, barData, xAxisLabel } = this.getBarValue(lostTypes);
    const baseOption = getBaseOption(xAxisLabel);
    baseOption.yAxis.name = '利用小时数(h)';
    baseOption.yAxis.min = 0;
    baseOption.xAxis.axisLabel.interval = 0;
    baseOption.xAxis.axisLabel.formatter = (str) => {
      const labelStr = [];
      let index = 0;
      while(str[index]){
        labelStr.push(str[index]);
        index % 4 === 3 && str[index + 1] && labelStr.push('\n');
        index++;
      }
      return labelStr.join('');
    };
    const option = {
      ...baseOption,
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
              ${param && param[1] &&
              `<span class=${styles.eachItem}>
                <span>小时数:</span>
                <span>${dataFormats(param[1].value, '--', 1)}</span>
              </span>`}
            </div>
          </section>`;
        },
      },
      series: [{
        name: '辅助',
        type: 'bar',
        stack: '总量',
        itemStyle: {
          normal: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)',
          },
          emphasis: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)',
          },
        },
        data: hideBarData,
      }, {
          name: '损失电量',
          type: 'bar',
          stack: '总量',
          barWidth: '10px',
          cursor: 'default',
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#666',
            },
          },
          data: barData.map((e, i) => ({
            value: e,
            itemStyle: {
              color: new echarts.graphic.LinearGradient( 0, 0, 0, 1, [
                {offset: 0, color: this.barColor[i][0]},
                {offset: 1, color: this.barColor[i][1]},
              ]),
            },
          })),
      }],
    };
    typesChart.hideLoading();
    typesChart.setOption(option);
  }

  render() {
    const { lostChartDevice, lostChartTime } = this.props;
    const chartName = lostChartDevice && lostChartDevice.deviceName ? `${lostChartDevice.deviceName}-` : '';
    const chartTime = lostChartTime ? `${lostChartTime}-` : '';
    return (
      <div className={styles.lostTypes}>
        <div className={styles.top}>
          <span className={styles.title}>
            {chartName}{chartTime}损失电量分解图
          </span>
          <span className={styles.handle}>
            <Button disabled={!lostChartDevice} onClick={this.toRunPage}>运行数据</Button>
          </span>
        </div>
        <div className={styles.chart} ref={(ref)=> {this.typesRef = ref;}} />
      </div>
    );
  }
}

export default ChartLostTypes;

