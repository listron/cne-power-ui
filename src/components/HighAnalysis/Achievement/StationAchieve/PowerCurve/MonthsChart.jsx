import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { getCurveBaseOption } from './curveBaseOption';
import styles from './curve.scss';

class MonthsChart extends Component {

  static propTypes = {
    curveMonths: PropTypes.object,
    curveMonthsLoading: PropTypes.bool,
  }

  componentDidMount(){
    const { curveMonths = {} } = this.props;
    const { actual = [] } = curveMonths;
    if (actual.length > 0) {
      this.renderChart(curveMonths);
    }
  }

  componentWillReceiveProps(nextProps){
    const { curveMonthsLoading, curveMonths } = nextProps;
    const preLoading = this.props.curveMonthsLoading;
    if (preLoading && !curveMonthsLoading) { // 请求完毕
      this.renderChart(curveMonths);
    } else if (!preLoading && curveMonthsLoading) { // 请求中
      this.setChartLoading();
    }
  }

  setChartLoading = () => {
    const monthChart = this.monthRef && echarts.getInstanceByDom(this.monthRef);
    monthChart && monthChart.showLoading();
  }

  createSeires = (curveData = []) => curveData.map((e) => {
    const { devicePowerInfoVos = [], calcDate } = e || {};
    return {
      type: 'line',
      smooth: true,
      name: calcDate,
      data: devicePowerInfoVos.map((m = {}) => [m.windSpeed, m.power]),
    };
  })

  renderChart = (curveMonths) => {
    const monthChart = echarts.init(this.monthRef);
    const { actual = [], theory = [] } = curveMonths;
    const modeName = theory[0] && theory[0].modeName || '--';
    const totalMonthData = actual.concat(theory.map(e => ({
      calcDate: '理论功率',
      ...e,
    })));
    const baseOption = getCurveBaseOption();
    baseOption.xAxis.type = 'value';
    baseOption.xAxis.name = '风速(m/s)';
    baseOption.yAxis.name = '功率(kW)';
    baseOption.xAxis.nameTextStyle.padding = [60, 0, 0, -60];
    const option = {
      ...baseOption,
      tooltip: {
        padding: 0,
        formatter: ({ seriesIndex, value = [] }) => {
          const lineInfo = totalMonthData[seriesIndex] || {};
          const { calcDate } = lineInfo;
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>
              <span>${calcDate || ''}</span>
            </h3>
            <div class=${styles.info}>
              <span class=${styles.eachItem}>
                <span>型号</span>
                <span class=${styles.modeName}>${modeName}</span>
              </span>
              <span class=${styles.eachItem}>
                <span>平均风速</span>
                <span>${value[0]}</span>
              </span>
              <span class=${styles.eachItem}>
                <span>平均功率</span>
                <span>${value[1]}</span>
              </span>
            </div>
          </section>`;
        },
      },
      series: this.createSeires(totalMonthData),
    };
    monthChart.hideLoading();
    monthChart.setOption(option);
  }

  render() {
    return (
      <div className={styles.totalChart} ref={(ref)=> {this.monthRef = ref;}} />
    );
  }
}

export default MonthsChart;

