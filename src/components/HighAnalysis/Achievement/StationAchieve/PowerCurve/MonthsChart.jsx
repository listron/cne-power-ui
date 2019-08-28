import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { getCurveBaseOption } from './curveBaseOption';
import { dataFormats } from '../../../../../utils/utilFunc';
import searchUtil from '../../../../../utils/searchUtil';
import styles from './curve.scss';

class MonthsChart extends Component {

  static propTypes = {
    history: PropTypes.object,
    curveCheckedMonths: PropTypes.array,
    curveDeviceName: PropTypes.string,
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
    const { curveMonthsLoading, curveMonths, curveCheckedMonths } = nextProps;
    const preLoading = this.props.curveMonthsLoading;
    const preChecked = this.props.curveCheckedMonths;
    if (preLoading && !curveMonthsLoading) { // 请求完毕
      this.renderChart(curveMonths, curveCheckedMonths);
    } else if (!preLoading && curveMonthsLoading) { // 请求中
      this.setChartLoading();
    }
    if (curveCheckedMonths.length !== preChecked.length) {
      this.renderChart(curveMonths, curveCheckedMonths);
    }
  }

  setChartLoading = () => {
    const monthChart = this.monthRef && echarts.getInstanceByDom(this.monthRef);
    monthChart && monthChart.showLoading();
  }

  createSeires = (curveData = [], activeMonths = []) => curveData.map((e) => {
    const { devicePowerInfoVos = [], calcDate } = e || {};
    const lineOpacity = activeMonths.includes(calcDate) || (calcDate === '理论功率') ? 1 : 0;
    return {
      type: 'line',
      smooth: true,
      name: calcDate,
      itemStyle: { opacity: lineOpacity },
      lineStyle: { opacity: lineOpacity },
      data: devicePowerInfoVos.map((m = {}) => [m.windSpeed, m.power]),
    };
  })

  toStopPage = () => {
    const { history } = this.props;
    const { search } = history.location;
    const { pages = '', station } = searchUtil(search).parse(); // 新的pages变化
    const curPages = pages.split('_');
    const stopExist = curPages.includes('stop');
    const nextPagesStr = stopExist ? pages : curPages.concat('stop');
    const { code, device, date } = JSON.parse(station); // 传入运行数据
    const stationSearch = JSON.stringify({ code, device: device.join('_'), dates: date });
    const searchResult = searchUtil(search).replace({pages: nextPagesStr}).replace({stop: stationSearch}).stringify();
    this.props.history.push(`/analysis/achievement/analysis/stop?${searchResult}`);
  }

  renderChart = (monthsData, checkedMonths) => {
    const monthChart = echarts.init(this.monthRef);
    const { actual = [], theory = [] } = monthsData;
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
                <span>${dataFormats(value[0], '--', 2, true)}</span>
              </span>
              <span class=${styles.eachItem}>
                <span>平均功率</span>
                <span>${dataFormats(value[1], '--', 2, true)}</span>
              </span>
            </div>
          </section>`;
        },
      },
      series: this.createSeires(totalMonthData, checkedMonths),
    };
    monthChart.hideLoading();
    monthChart.clear();
    monthChart.setOption(option);
    monthChart.on('click', this.toStopPage);
  }

  render() {
    const { curveDeviceName } = this.props;
    return (
      <section className={styles.leftCurve}>
        <h3>{curveDeviceName || '--'}各月功率曲线</h3>
        <div className={styles.totalChart} ref={(ref)=> {this.monthRef = ref;}} />
      </section>
    );
  }
}

export default MonthsChart;

