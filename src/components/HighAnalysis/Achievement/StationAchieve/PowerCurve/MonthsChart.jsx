import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import { Tooltip } from 'antd';
import { getCurveBaseOption } from './curveBaseOption';
import { dataFormats } from '@utils/utilFunc';
import searchUtil from '@utils/searchUtil';
import uiColors from '@constants/ui';
import styles from './curve.scss';

class MonthsChart extends Component {

  static propTypes = {
    history: PropTypes.object,
    curveCheckedMonths: PropTypes.array,
    curveDeviceName: PropTypes.string,
    curveDeviceFullcode: PropTypes.string,
    curveMonths: PropTypes.object,
    curveMonthsLoading: PropTypes.bool,
    curveAllMonths: PropTypes.array,
  }

  componentDidMount(){
    const { curveMonths = {}, curveCheckedMonths } = this.props;
    const { actual = [] } = curveMonths;
    if (actual.length > 0) {
      this.renderChart(curveMonths, curveCheckedMonths);
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
    const { curveAllMonths } = this.props;
    const { devicePowerInfoVos = [], calcDate } = e || {};
    const lineOpacity = activeMonths.includes(calcDate) || (calcDate === '理论功率') ? 1 : 0;
    const monthIndex = curveAllMonths.indexOf(calcDate);
    const lineColor = uiColors.outputColors[monthIndex];
    return {
      type: 'line',
      smooth: true,
      name: calcDate,
      silent: !lineOpacity,
      itemStyle: { opacity: lineOpacity },
      lineStyle: {
        opacity: lineOpacity,
        color: calcDate === '理论功率' ? 'rgb(194,53,49)' : lineColor,
      },
      data: devicePowerInfoVos.map((m = {}) => [m.windSpeed, m.power]),
    };
  })

  toStopPage = ({ seriesName }) => {
    const { history, curveDeviceFullcode } = this.props;
    const { search } = history.location;
    const { pages = '', station } = searchUtil(search).parse(); // 新的pages变化
    const curPages = pages.split('_').filter(e => !!e);
    const stopExist = curPages.includes('run');
    const nextPagesStr = (stopExist ? curPages : curPages.concat('run')).join('_');
    let code, date = []; // 传入运行数据
    try {
      ({ code, date } = JSON.parse(station));
    } catch (error) {
      console.log(error);
    }
    let startTime = moment(seriesName).startOf('month').format('YYYY-MM-DD');
    let endTime = moment(seriesName).endOf('month').format('YYYY-MM-DD');
    if (seriesName === '理论功率') {
      [startTime, endTime] = date;
    }
    const stationSearch = JSON.stringify({
      searchCode: code,
      searchDevice: [curveDeviceFullcode],
      searchDates: [startTime, endTime],
    });
    const searchResult = searchUtil(search).replace({pages: nextPagesStr}).replace({run: stationSearch}).stringify();
    this.props.history.push(`/analysis/achievement/analysis/run?${searchResult}`);
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
    totalMonthData.length > 0 && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      start: 0,
      end: 100,
      showDetail: false,
      height: 20,
      bottom: 10,
    }, {
      type: 'inside',
      filterMode: 'empty',
      start: 0,
      end: 100,
    }]);
    monthChart.hideLoading();
    monthChart.clear();
    monthChart.setOption(option);
    monthChart.on('click', this.toStopPage);
  }

  render() {
    const { curveDeviceName } = this.props;
    return (
      <section className={styles.leftCurve}>
        <h3>
          <span>{curveDeviceName || '--'}各月功率曲线</span>
          <Tooltip title="功率曲线所用的均为清洗后的数据" placement="top">
            <span className={styles.curveTip}>i</span>
          </Tooltip>
        </h3>
        <div className={styles.totalChart} ref={(ref)=> {this.monthRef = ref;}} />
      </section>
    );
  }
}

export default MonthsChart;

