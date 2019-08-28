import React from 'react';
import echarts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './styles.scss';
import { themeConfig } from '../../../../../utils/darkConfig';

class WeatherDayChart extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.drawChart(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps);
  }

  getName = (type) => {
    let name = '';
    switch (type) {
      // "雪1", "雨2", "霾3", "阴4", "晴5","其他0"
      case '5': name = '晴'; break;
      case '4': name = '阴'; break;
      case '2': name = '雨'; break;
      case '1': name = '雪'; break;
      case '3': name = '霾'; break;
      case '0': name = '其他'; break;
      default: name = ''; break;
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


  getColor = {
    'light': ['#ceebe0', '#c7ceb2', '#199475', '#a42b2c', '#999999', '#f9b600'],
    'dark': ['#7ed321', '#ff7878', '#ff73f4', '#00f0ff', '#f8e71c', '#f8b14e'],
  }

  drawChart = param => {
    const { graphId, yAxisName, yData, title, hasData, theme = 'light' } = param;
    let targetChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    if (targetChart) {
      targetChart.dispose();
      targetChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    }
    const seriesData = [];
    yData.forEach(e => {
      seriesData.push({
        name: this.getName(e.weather),
        barWidth: 10,
        value: [e.day, dataFormats(e.temp, '--')],
        itemStyle: {
          color: this.getColor[theme][+e.weather],
        },
      });
    });
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || ' ';
    const targetMonthOption = {
      graphic: confluenceTenMinGraphic,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        alwaysShowContent: true,
        formatter: function (params) {
          if (params[0].name) {
             const color = params[0].color.colorStops && params[0].color.colorStops[1].color || params[0].color;
            return (
              `<div class=${styles[theme]}>
                <div class=${styles.axisValue}><span>${params[0].value[0]}日</span> <span>天气</span></div>
                <div class=${styles.tooltipContainer}>
                 <div class=${styles.tooltipCont}> <span style="background:${color}"></span>  ${params[0].name} :   ${params[0].value[1]}℃</div>
                </div>
               </div>`
            );
          }
        },
      },
      title: {
        text: title,
        show: title ? 'show' : false,
        left: '23',
        top: 'top',
      },
      legend: {
        left: 'center',
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 5,
        data: ['晴', '阴', '雨', '雪', '霾', '其他', '--'],
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
      },
      series: {
        name: '天气',
        type: 'bar',
        data: seriesData,
      },
    };
    targetChart.setOption(targetMonthOption);
  };
  render() {
    const { graphId } = this.props;
    return <div id={graphId}> </div>;
  }
}
export default WeatherDayChart;
