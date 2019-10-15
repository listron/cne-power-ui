import React from 'react';
import styles from './styles.scss';
import echarts from 'echarts';
import { Gradient1, Gradient2, barRadius, themeConfig, chartsNodata } from '../../../../../utils/darkConfig';
import { dataFormats } from '../../../../../utils/utilFunc';

/*
 graphId, yAxisName, xAxisName, dateType, title, data, currentYear, lastYear,hasData 
 */
class PlanCompleteRateAnalysisBar extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.drawChart(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps);
  }

  getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示
    const length = data.length;
    const replaceData = [];
    for (let i = 0; i < length; i++) { replaceData.push('--'); }
    const realData = data.some(e => e || e === 0) ? data : replaceData;
    return realData;
  }

  getName = (type, currentYear, lastYear) => { // 获取对应的name
    let name = '';
    switch (type) {
      case 'thatYearLostPower': name = currentYear + '年限电损失'; break;
      case 'lastyearLostPower': name = lastYear + '年限电损失'; break;
      case 'thatYearLostPowerRate': name = currentYear + '年限电率'; break;
      case 'lastyearLostPowerRate': name = lastYear + '年限电率'; break;
      case 'lostPowerRateYearOnYear': name = '限电率同比'; break;
      case 'limitPower': name = '限电损失'; break;
      case 'limitPowerRate': name = '限电率'; break;
      case 'ringRatio': name = '限电率环比'; break;
    }
    return name;
  }

  getColor = {
    light: {
      'year': ['#f9b600', '#3e97d1', '#f9b600'],
      'month': ['#dfdfdf', '#f9b600', '#999999', '#3e97d1', '#e08031'],
      'day': ['#dfdfdf', '#f9b600', '#999999', '#3e97d1', '#e08031'],
    },
    dark: {
      'year': [Gradient2, '#00f8ff', '#f95071'],
      'month': [Gradient1, Gradient2, '#f8e71c', '#00f8ff', '#f8b14e'],
      'day': [Gradient1, Gradient2, '#f8e71c', '#00f8ff', '#f8b14e'],
    },
  }



  drawChart = (param) => {
    const { graphId, yAxisName, xAxisName, dateType, title, data, currentYear, lastYear, hasData, theme } = param;
    let targetChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    if (targetChart) {
      targetChart.dispose();
      targetChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    }
    const color = this.getColor[theme][dateType];
    const seriesData = [];
    const lineData = data.yData.lineData;
    const barData = data.yData.barData;
    let targetOption = {};
    for (var bar in barData) {
      var json = {
        name: this.getName(bar, currentYear, lastYear),
        data: this.getDefaultData(barData[bar]),
        type: 'bar',
        barWidth: 6,
        ...barRadius,
      };
      seriesData.push(json);
    }
    for (var line in lineData) {
      seriesData.push({
        name: this.getName(line, currentYear, lastYear),
        data: this.getDefaultData(lineData[line]),
        type: 'line',
        yAxisIndex: 1,
      });
    }
    const graphic = chartsNodata(hasData, theme);
    targetOption = {
      graphic: graphic,
      color: color,
      title: {
        text: title,
        show: title ? 'show' : false,
        left: '23',
        top: 'top',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          let paramsItem = '';
          params.forEach(item => {
            const color = item.color.colorStops && item.color.colorStops[1].color || item.color;
            paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color}"> </span> 
                        ${item.seriesName} :  ${dataFormats(item.value, '--', 2)}${item.seriesType === 'line' && '%' || ''}</div>`;
          });
          return (
            `<div class=${styles[theme]}>
                <div class=${styles.axisValue}><span>${params[0].name}</span> <span>${xAxisName}</span></div>
                <div class=${styles.tooltipContainer}> ${paramsItem}</div>
            </div>`
          );
        },
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        top: title ? 0 : 20,
        left: 'center',
        width: 430,
        itemWidth: 8,
        itemHeight: 5,
      },
      xAxis: [
        {
          type: 'category',
          data: data.xData,
          axisPointer: {
            type: 'shadow',
          },
          axisTick: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: yAxisName,
          splitNumber: 5,
          scale: true,
          axisLine: { show: false },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
        },
        {
          type: 'value',
          name: dateType === 'year' ? '限电率／环比' : '限电率／同比',
          axisLabel: {
            formatter: '{value} %',
          },
          axisTick: {
            show: false,
          },
          axisLine: { show: false },
          splitLine: {
            show: false,
          },
        },
      ],
      series: seriesData,
    };
    targetChart.setOption(targetOption, { notMerge: true });

  }
  render() {
    const { graphId } = this.props;
    return (
      <div id={graphId}> </div>
    );
  }
}
export default (PlanCompleteRateAnalysisBar);
