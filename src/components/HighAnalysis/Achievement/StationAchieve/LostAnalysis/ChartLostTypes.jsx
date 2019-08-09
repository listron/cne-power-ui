import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import echarts from 'echarts';
import { getBaseOption } from './chartBaseOption';
import styles from './lost.scss';

class ChartLostTypes extends Component {

  static propTypes = {
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

  dataAxis = ['应发小时', '降容损失', '风机故障', '变电故障', '场外因素', '计划停机', '其他损失', '实发小时'];
  dataKey = ['theoryGen', 'deratingGen', 'faultGen', 'substationGen', 'courtGen', 'planShutdownGen', 'otherGen', 'actualGen'];
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

  getBarValue = (lostTypes, dataKey) => {
    const hideBarData = [];
    const barData = [];
    dataKey.map((e, i) => {
      const barValue = lostTypes[e] || 0;
      i === 0 && hideBarData.push(0);
      i === 1 && hideBarData.push(lostTypes[dataKey[0]] - barValue);
      i > 1 && hideBarData.push(hideBarData[i - 1] - barValue);
      barData.push(barValue);
    });
    return { hideBarData, barData };
  }

  toWorkDetail = () => {
    console.log('去运行数据分析页');
  }

  renderChart = (lostTypes = {}) => {
    const typesChart = echarts.init(this.typesRef);
    const baseOption = getBaseOption(this.dataAxis);
    const { hideBarData, barData } = this.getBarValue(lostTypes, this.dataKey);
    baseOption.yAxis.name = '小时数(h)';
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
              ${param && param[1] &&
              `<span class=${styles.eachItem}>
                <span>小时数:</span>
                <span>${param[1].value}</span>
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
          name: '生活费',
          type: 'bar',
          stack: '总量',
          barWidth: '10px',
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
    typesChart.setOption(option);
  }

  render() {
    const { lostChartDevice, lostChartTime } = this.props;
    return (
      <div className={styles.lostTypes}>
        <div className={styles.top}>
          <span className={styles.title}>
            {`${lostChartDevice && lostChartDevice.deviceName}-${lostChartTime || ''}-`}损失电量分解图
          </span>
          <span className={styles.handle}>
            <Button onClick={this.toWorkDetail}>运行数据</Button>
          </span>
        </div>
        <div className={styles.chart} ref={(ref)=> {this.typesRef = ref;}} />
      </div>
    );
  }
}

export default ChartLostTypes;

