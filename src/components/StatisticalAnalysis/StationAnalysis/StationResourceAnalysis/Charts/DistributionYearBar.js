import React from 'react';
import echarts from 'echarts';
import { Gradient1, themeConfig, chartsNodata } from '../../../../../utils/darkConfig';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './styles.scss';
class UsageRate extends React.Component {
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

  getColor = {
    'light': ['#a42b2c', '#d48265', '#91c7af', '#749f83', '#ca8622', '#bda29a', '#546570', '#6e7074', '#9b9b9b', '#ceebe0', '#199475', '#fff'],
    'dark': ['#fd6e8f', '#ee635f', '#fa936b', '#f8b14e', '#4a90e2', '#49b5d2', '#35c3ad', '#1bd77b', '#b8e986', '#e4ef85', '#4d5fe2', '#000'],
  }

  drawChart = param => {
    const { graphId, yAxisName, xAxisName, xData, yData, title, hasData, theme = 'light' } = param;
    const targetChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    const seriesData = [];
    yData.forEach(item => {
      seriesData.push({
        name: item.name,
        data: this.getDefaultData(item.data),
        type: 'bar',
        stack: '总量',
        barWidth: 10,
      });
    });
    seriesData.length > 0 && seriesData.push({
      name: '瞬时辐射区间（w/㎡）',
      type: 'bar',
      stack: '总量',
    });
    const graphic = chartsNodata(hasData, theme);
    const targetMonthOption = {
      graphic: graphic,
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          let paramsItem = '';
          params.forEach(item => {
            const color = item.color.colorStops && item.color.colorStops[1].color || item.color;
            paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color}"> </span> 
                        ${item.seriesName} :  ${dataFormats(item.value, '--', 2)}</div>`;
          });
          return (
            `<div class=${styles[theme]}>
                <div class=${styles.axisValue}><span>${params[0].name}</span><span>${xAxisName}</span></div>
                <div class=${styles.tooltipContainer}> ${paramsItem}</div>
            </div>`
          );
        },
        axisPointer: {
          type: 'shadow',
        },
      },
      title: {
        text: title,
        show: title ? 'show' : false,
        left: '23',
        top: 'top',
      },
      color: this.getColor[theme],
      legend: {
        left: '20%',
        right: '10%',
        icon: 'circle',
        itemWidth: 5,
        itemHeight: 5,
        width: 450,
      },
      yAxis: {
        type: 'value',
        name: yAxisName,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisTick: {
          show: false,
        },
      },
      series: seriesData,
    };
    targetChart.setOption(targetMonthOption, 'notMerge');
  };
  render() {
    const { graphId } = this.props;
    return <div id={graphId}> </div>;
  }
}
export default UsageRate;
