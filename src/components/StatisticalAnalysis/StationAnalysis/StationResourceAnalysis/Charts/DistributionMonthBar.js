import React from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import { Gradient1, themeConfig, chartsNodata } from '../../../../../utils/darkConfig';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './styles.scss';


class BarGraph extends React.Component {
  static propTypes = {
    graphId: PropTypes.string,
    yAxisName: PropTypes.string,
    xAxisName: PropTypes.string,
    dateType: PropTypes.string,
    theme: PropTypes.string,
  }
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
    light: ['#199475', '#e08031', '#fff'],
    dark: [Gradient1, '#f8e71c', 'rgba(83,104,241,0.60)'],
  }

  drawChart = (param) => {
    const { graphId, yAxisName, xAxisName, dateType, title, data, hasData, theme = 'light' } = param;
    let targetChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    if (targetChart) {
      targetChart.dispose();
      targetChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    }
    const graphic = chartsNodata(hasData, theme);
    const targetOption = {
      graphic: graphic,
      color: this.getColor[theme],
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
                        ${item.seriesName} :  ${dataFormats(item.value, '--', 2)}${item.seriesName === '占比' && '%' || ''}</div>`;
          });
          return (
            `<div class=${styles[theme]}>
                <div class=${styles.axisValue}><span>${params[0].name}</span><span>${xAxisName}</span></div>
                <div class=${styles.tooltipContainer}> ${paramsItem}</div>
            </div>`
          );
        },
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        left: 'center',
        icon: 'circle',
        itemWidth: 5,
        itemHeight: 5,
      },
      xAxis: [
        {
          type: 'category',
          data: data && data.xData,
          axisPointer: {
            type: 'shadow',
          },
          axisLabel: {
            interval: 0,
            rotate: -30,
          },
        },
      ],
      yAxis: [
        {
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
        {
          type: 'value',
          name: '占比',
          axisLabel: {
            formatter: '{value} %',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '辐射总量',
          type: 'bar',
          stack: '总量',
          data: data && this.getDefaultData(data.yData.barData),
          itemStyle: {
            barBorderRadius: 10,
          },
          barWidth: 10,
        },
        {
          name: '占比',
          type: 'line',
          yAxisIndex: 1,
          data: data && this.getDefaultData(data.yData.lineData),
        },
        {
          name: '瞬时辐射区间（w/㎡）',
          type: 'bar',
          stack: '总量',
        },
      ],
    };
    targetChart.setOption(targetOption);

  }
  render() {
    const { graphId } = this.props;
    return (
      <div id={graphId}> </div>
    );
  }
}
export default (BarGraph)
  ;
