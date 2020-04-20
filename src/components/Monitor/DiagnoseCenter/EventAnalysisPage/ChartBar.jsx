
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import { dataFormats } from '@utils/utilFunc';
import styles from './eventAnalysis.scss';

class ChartBar extends PureComponent {
  static propTypes = {
    eventAnalysisInfo: PropTypes.object,
    analysisEvent: PropTypes.object,
  };

  componentDidMount(){
    const { eventAnalysisInfo, analysisEvent } = this.props;
    const { data = [], dataDays } = eventAnalysisInfo || {};
    const { eventCode } = analysisEvent;
    this.drawChart(data, eventCode, dataDays);
  }

  componentWillReceiveProps(nextProps){
    const { analysisEvent } = this.props;
    const preAnalysiInfo = this.props.eventAnalysisInfo;
    const { eventAnalysisInfo } = nextProps;
    const { eventCode } = analysisEvent;
    if (eventAnalysisInfo !== preAnalysiInfo) {
      const { data = [], dataDays } = eventAnalysisInfo || {};
      this.drawChart(data, eventCode, dataDays);
    }
  }

  drawChart = (data = [], eventCode, dataDays) => {
    const dataDay = { // 诊断事件阵列损耗、转换效率偏低事件默认展示7天数据，向前滚动30天
      1: '100',
      30: '75',
    };
    const barChart = echarts.init(this.barRef);
    const xNames = [], baseData = [], theoryData = [], lineData = [], pointData = data;
    const dataEvent = ['NB1039', 'NB1041'].includes(eventCode); // 转换效率偏低、阵列损耗事件
    const conversionEfficiency = ['NB1039'].includes(eventCode); // 转换效率偏低事件
    data.forEach((e) => {
      xNames.push(moment(e.time).format('YYYY-MM-DD'));
      baseData.push(e.gen);
      theoryData.push(e.theoryGen);
      lineData.push(e.diff);
    });
    const option = {
      grid: {
        show: true,
        borderColor: '#d4d4d4',
        top: 0,
        bottom: 104,
        left: '7%',
        right: '7%',
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        extraCssText: 'padding: 5px 10px; background-color: rgba(0,0,0,0.70); box-shadow:0 1px 4px 2px rgba(0,0,0,0.20); border-radius:2px;',
        axisPointer: {
          type: 'none',
          animation: false,
          label: {
            show: true,
            color: '#199475',
            backgroundColor: '#fff',
            fontSize: 14,
            shadowColor: 'rgba(0, 0, 0, 0)',
            shadowBlur: 0,
          },
        },
        formatter: (params = []) => {
          const { name, value: baseValue } = params[0] || {};
          const { value: theoryValue } = params[1] || {};
          const { value: rateValue } = params[2] || {};
          return (
            `<section class=${styles.chartTooltip}>
              <h3 class=${styles.tooltipTitle}>${name}</h3>
              <div>
                <p class=${styles.eachItem}>
                  <span class=${styles.barRect}></span>
                  <span class=${styles.tipName} style="flex: 0 0 76px">${conversionEfficiency ? '交流侧发电量' : '逆变器直流发电量'}(kWh)</span>
                  <span class=${styles.tipValue}>${dataFormats(baseValue, '--', 2, true)}</span>
                </p>
                <p class=${styles.eachItem}>
                  <span class=${styles.barBorderRect}></span>
                  <span class=${styles.tipName} style="flex: 0 0 76px">${conversionEfficiency ? '直流侧发电量' : '方阵理论发电量'}(kWh)</span>
                  <span class=${styles.tipValue}>${dataFormats(theoryValue, '--', 2, true)}</span>
                </p>
                <p class=${styles.eachItem}>
                  <span class=${styles.tipIcon}>
                    <span class=${styles.line} style="background-color: #ff9900"></span>
                    <span class=${styles.rect} style="background-color: #ff9900; border: solid 1px #fff"></span>
                  </span>
                  <span class=${styles.tipName} style="flex: 0 0 76px">${conversionEfficiency ? '转换效率' : '方阵损耗'}(%)</span>
                  <span class=${styles.tipValue}>${dataFormats(rateValue * 100, '--', 2, true)}</span>
                </p>
              </div>
            </section>`
          );
        },
      },
      xAxis: {
        type: 'category',
        data: xNames,
        axisLine: {
          show: false,
        },
        axisLabel: {
          fontSize: 14,
          color: '#353535',
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: [
        {
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
            lineStyle: {
              type: 'dashed',
            },
          },
        }, {
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
        },
      ],
      series: [
        {
          name: conversionEfficiency ? '交流侧发电量(kWh)' : '逆变器直流发电量(kWh)',
          type: 'bar',
          itemStyle: {
            color: '#CEEBE0',
          },
          emphasis: {
            itemStyle: {
              color: '#CEEBE0',
            },
          },
          barWidth: 34,
          data: baseData,
        }, {
          name: conversionEfficiency ? '方阵理论发电量(kWh)' : '方阵理论发电量(kWh)',
          type: 'bar',
          barWidth: 34,
          barGap: '-100%',
          data: pointData.map(e => ({
              value: e.theoryGen,
              itemStyle: {
                color: 'transparent',
                borderWidth: e.isWarned ? 3 : 1,
                borderColor: e.isWarned ? '#ffc581' : '#199475',
                barBorderRadius: [2, 2, 0, 0],
                shadowColor: e.isWarned ? '#f8e71c' :'#ffc581',
                shadowBlur: e.isWarned ? 10 : 0,
                shadowOffsetX: 0,
                shadowOffsetY: e.isWarned ? -4 : 0,
              },
            })),
        }, {
          name: conversionEfficiency ? '转换效率(%)' : '方阵损耗(%)',
          type: 'line',
          data: lineData,
          yAxisIndex: 1,
          itemStyle: {
            color: '#ff9900',
          },
        },
      ],
    };
    if (data.length > 10) {
      const handlerInfo = {
        start: dataEvent ? dataDay[dataDays] : 0,
        end: 100,
      };
      option.dataZoom = [
        {
          show: true,
          height: 20,
          bottom: 16,
          ...handlerInfo,
        }, {
          type: 'inside',
          ...handlerInfo,
        },
      ];
    }
    barChart.clear();
    barChart.setOption(option);
  }

  render(){
    return (
      <div className={styles.analysisChart}>
        <div style={{width: '100%', height: '560px'}} ref={(ref) => { this.barRef = ref; } } />
      </div>
    );
  }
}

export default ChartBar;

