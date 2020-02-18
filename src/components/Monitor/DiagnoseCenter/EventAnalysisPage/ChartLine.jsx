import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import { dataFormats } from '@utils/utilFunc';
import styles from './eventAnalysis.scss';

class ChartLine extends PureComponent {

  static propTypes = {
    eventAnalysisLoading: PropTypes.bool,
    eventAnalysisInfo: PropTypes.object,
    analysisEvent: PropTypes.object,
  };

  componentDidMount(){
    const { eventAnalysisInfo } = this.props;
    const { period = [], data = {} } = eventAnalysisInfo || {};
    this.drawChart(period, data);
  }

  componentWillReceiveProps(nextProps){
    const preAnalysiInfo = this.props.eventAnalysisInfo;
    const preLoading = this.props.eventAnalysisLoading;
    const { eventAnalysisInfo, eventAnalysisLoading, analysisEvent } = nextProps;
    if (eventAnalysisLoading && !preLoading) {
      this.chartLoading();
    }
    if (eventAnalysisInfo !== preAnalysiInfo) {
      const { period = [], data = {} } = eventAnalysisInfo || {};
      const { interval } = analysisEvent;
      this.drawChart(period, data, interval);
    }
  }

  lineColors = ['#ff9900', '#4d90fd', '#60c060', '#ff8d83', '#00cdff', '#9f98ff', '#d5c503', '#2ad7ab', '#b550b2', '#3e97d1', '#83bcc4', '#cc6500', '#5578c2', '#86acea', '#d3b08e', '#7286f1', '#512ca8', '#33cc27', '#bfbf95', '#986cff'];

  chartLoading = () => {
    const lineChart = echarts.init(this.lineRef);
    lineChart.showLoading();
  }

  timeFormat = (timeStr, interval = 1) => { // 针对markArea时间进行处理
    if (!timeStr) {
      return '';
    }
    const timeMoment = moment(timeStr);
    if(interval === 1){ // 10min数据处理为YYYY-MM-DD HH:mm0:00的十分钟格式;
      const dayTimeStr = timeMoment.format('YYYY-MM-DD HH:');
      const minuteNum = Math.floor(timeMoment.minute() / 10);
      return `${dayTimeStr}${minuteNum}0:00`;
    } else if (interval === 3) { // 1min数据处理为YYYY-MM-DD HH:mm:00的整分钟格式;
      const dayTimeStr = timeMoment.format('YYYY-MM-DD HH:mm');
      return `${dayTimeStr}:00`;
    }
    // 5s按照正常格式返回 
    const timeMinuteStr = timeMoment.format('YYYY-MM-DD HH:mm');
    const secondNum = Math.floor(timeMoment.second() / 5) * 5;
    const secondNumStr = secondNum > 5 ? `:${secondNum}` : `:0${secondNum}`;
    return `${timeMinuteStr}${secondNumStr}`;
  }

  drawChart = (period = [], data = {}, interval) => {
    const lineChart = echarts.init(this.lineRef);
    lineChart.hideLoading();
    const { time = [], pointData = [] } = data;
    const legends = [{
      name: '告警时段',
      icon: 'rect',
      height: 30,
      left: '7%',
      top: 0,
      data: ['告警时段'],
      textStyle: {
        color: '#353535',
      },
    }];
    const colors = ['#FBE6E3']; // 图标依次着色
    const unitGroupSets = new Set();
    let unitsGroup = []; // 解出单位数组
    const unitSortTemplate = ['W/m2', 'kW', 'V', 'A'];
    const markAreaData = period.map(e => { // 告警事件段数据规范。
      const { beginTime, endTime } = e || {};
      return [{
        xAxis: this.timeFormat(beginTime, interval),
      }, {
        xAxis: this.timeFormat(endTime, interval),
      }];
    });
    const series = [{ // 初始化series;
      name: '告警时段',
      type: 'line',
      data: [],
      markArea: {
        silent: true,
        itemStyle: {
          borderColor: '#fbe6e3',
          borderWidth: 1,
        },
        data: markAreaData,
      },
    }];
    const sortedPointData = pointData.sort((a, b) => { // 单位排序：w/m2 >kw>V>A；其余默认
      const aUnit = a.pointUnit || '';
      const bUnit = b.pointUnit || '';
      unitGroupSets.add(aUnit);
      unitGroupSets.add(bUnit);
      unitsGroup = [...unitGroupSets]; // 解出单位数组
      if(unitSortTemplate.indexOf(aUnit) < 0) {
        return 1;
      }
      if (unitSortTemplate.indexOf(bUnit) < 0) {
        return -1;
      }
      return unitSortTemplate.indexOf(aUnit) - unitSortTemplate.indexOf(bUnit);
    });
    if (pointData.length < 2) { // length < 2不会执行排序函数~
      unitsGroup = sortedPointData.map(e => e.pointUnit);
    }
    sortedPointData.forEach((e, i) => {
      const pointName = `${e.deviceName} ${e.pointName || ''}`;
      const pointFullName = `${pointName}${e.pointUnit ? `(${e.pointUnit})`: ''}`;
      colors.push(this.lineColors[i % this.lineColors.length]);
      legends.push({
        name: pointFullName,
        height: 30,
        left: `${7 + (i + 1) % 4 * 21.5}%`,
        top: `${Math.floor((i + 1) / 4) * 30}`,
        data: [pointFullName],
        textStyle: {
          color: e.isWarned ? '#f5222d' : '#353535',
        },
      });
      series.push({
        name: pointFullName,
        type: 'line',
        yAxisIndex: unitsGroup.indexOf(e.pointUnit || ''), // 空单位统一以''作为单位
        lineStyle: {
          width: 3,
        },
        data: e.value,
        symbol: 'circle',
        showSymbol: false,
        smooth: true,
      });
    });
    const yAxis = unitsGroup.map(e => ({ // 生成多y纵坐标, 相同单位对应一个y轴
      type: 'value',
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    }));
    const legendHeight = Math.ceil(legends.length / 4) * 30;
    const option = {
      legend: legends,
      color: colors,
      grid: {
        show: true,
        borderColor: '#d4d4d4',
        bottom: 100,
        top: legendHeight,
        left: '7%',
        right: '7%',
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        axisPointer: {
          lineStyle: {
            color: '#000',
          },
        },
        extraCssText: 'padding: 5px 10px; background-color: rgba(0,0,0,0.70); box-shadow:0 1px 4px 2px rgba(0,0,0,0.20); border-radius:2px;',
        formatter: (params = []) => {
          const { name } = params[0] || {};
          return (
            `<section class=${styles.chartTooltip}>
              <h3 class=${styles.tooltipTitle}>${name}</h3>
              ${params.map(e => {
                const { color, seriesIndex, value } = e || {};
                const eachFullData = sortedPointData[seriesIndex - 1] || {};
                // 解析全数据使用， 因为系列中有个首条空线， series需减一对应。
                const { isWarned, pointName, deviceName } = eachFullData;
                const lineFullName = `${deviceName} ${pointName || ''}`;
                return (
                  `<p class=${isWarned ? styles.warnedItem : styles.eachItem }>
                    <span class=${styles.tipIcon}>
                      <span class=${styles.line} style="background-color:${color}"></span>
                      <span class=${styles.rect} style="background-color:${color}"></span>
                    </span>
                    <span class=${styles.tipName}>${lineFullName}</span>
                    <span class=${styles.tipValue}>${dataFormats(value, '--', 2, true)}</span>
                  </p>`
                );
              }).join('')}
            </section>`
          );
        },
      },
      xAxis: {
        type: 'category',
        data: time.map(e => moment(e).format('YYYY-MM-DD HH:mm:ss')),
        axisLine: {
          show: false,
        },
        axisLabel: {
          fontSize: 14,
          color: '#353535',
          lineHeight: 21,
          formatter: (value = '') => value.split(' ').join('\n'),
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis,
      series,
    };
    if (pointData.length > 0) {
      option.dataZoom = [
        {
          show: true,
          height: 20,
          bottom: 16,
        }, {
          type: 'inside',
        },
      ];
    }
    lineChart.clear();
    lineChart.setOption(option);
  }

  render(){
    return (
      <div className={styles.analysisChart}>
        {/* <div className={styles.legends}>
          <span className={styles.period}>告警时段</span>
          {legend.map((e, i) => (
            <span key={e} className={styles.eachLegend}>
              <span className={styles.legendIcon}>
                <span style={{ backgroundColor: this.lineColors[i % this.lineColors.length]}} className={styles.legendLine} />
                <span style={{ backgroundColor: this.lineColors[i % this.lineColors.length]}} className={styles.legendRound} />
              </span>
              <span className={styles.legendName}>{e}</span>
            </span>
          ))}
        </div> */}
        <div style={{width: '100%', height: '506px'}} ref={(ref) => { this.lineRef = ref; } } />
      </div>
    );
  }
}

export default ChartLine;


