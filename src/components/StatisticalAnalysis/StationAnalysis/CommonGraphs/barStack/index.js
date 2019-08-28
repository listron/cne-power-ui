import React from 'react';
import echarts from 'echarts';
import { dataFormats } from '../../../../../utils/utilFunc';
import { chartsLoading, themeConfig, chartsNodata } from '../../../../../utils/darkConfig';
import styles from '../styles.scss';

class barStack extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.drawChart(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps);
  }

  getName = (type) => { // 获取对应的name
    let name = '';
    switch (type) {
      case 'limit': name = '限电'; break;
      case 'eletric': name = '变电故障'; break;
      case 'plane': name = '计划停机'; break;
      case 'system': name = '光伏发电系统故障'; break;
      case 'other': name = '场外因素'; break;
      case 'sunny': name = '晴'; break;
      case 'cloudy': name = '阴'; break;
      case 'rain': name = '雨'; break;
      case 'snow': name = '雪'; break;
      case 'haze': name = '霾'; break;
      case 'otherWeather': name = '其他'; break;
    }
    return name;
  }

  getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示
    const length = data.length;
    const replaceData = [];
    for (let i = 0; i < length; i++) { replaceData.push('--'); }
    const realData = data.some(e => e || e === 0) ? data : replaceData;
    return realData;
  }

  drawChart = param => {
    const { graphId, yAxisName, xAxisName, data, title, hasData, theme = 'light' } = param;
    let targetChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    if (targetChart) {
      targetChart.dispose();
      targetChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    }
    const color = ['#f9b600', '#999999', '#199475', '#c7ceb2', '#a42b2c', '#ceebe0'];
    const darkColor = ['#f8b14e', '#f8e71c', '#ff73f4', '#ff7878', '#00f0ff', '#7ed321'];
    const seriesData = [];
    for (var type in data) {
      if (type !== 'date') {
        seriesData.push({
          name: this.getName(type),
          data: this.getDefaultData(data[type]),
          type: 'bar',
          stack: '总量',
          barWidth: 13,
        });
      }
    }

    const graphic = chartsNodata(hasData, theme);
    const targetMonthOption = {
      graphic: graphic,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params) => {
          let paramsItem = '';
          params.forEach(item => {
            const color = item.color.colorStops && item.color.colorStops[1].color || item.color;
            paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color}"> </span> 
                        ${item.seriesName} :  ${dataFormats(item.value, '--', 2)}</div>`;
          });
          return (
            `<div class=${styles[theme]}>
                <div class=${styles.axisValue}>${params[0].name}</div>
                <div class=${styles.tooltipContainer}> ${paramsItem}</div>
            </div>`
          );
        },

      },
      title: {
        text: title,
        show: title ? 'show' : false,
        left: '23',
        top: 'top',
      },
      color: theme === 'dark' ? darkColor : color,
      legend: {
        left: 'center',
        itemWidth: 8,
        itemHeight: 5,
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
        data: data.date,
      },
      series: seriesData,
    };
    targetChart.setOption(targetMonthOption);
  };
  render() {
    const { graphId } = this.props;
    return <div id={graphId}> </div>;
  }
}
export default barStack;
