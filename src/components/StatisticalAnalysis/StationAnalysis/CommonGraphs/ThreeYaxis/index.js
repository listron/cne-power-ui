import React from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import styles from '../styles.scss';
import { dataFormats } from '../../../../../utils/utilFunc';
import { Gradient1, Gradient2, barRadius, chartsLoading, themeConfig, chartsNodata } from '../../../../../utils/darkConfig';

/* 
  1 必填   graphId 图表的id名
  2 必填   title  根据title 判断color  ‘发电效率 计划完成率
  3 必填   data  
  data:{
    xData:[];
    yData:{
      xxx:[],  根据后台的数据判断name  如 hours
      xxx:[]
    }
  }
*/

class PowerEfficency extends React.Component {
  static propTypes = {
    graphId: PropTypes.string,
    yAxisName: PropTypes.string,
    xAxisName: PropTypes.string,
    dateType: PropTypes.string,
    title: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.drawChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps);
  }

  getYaxisName = (title) => {
    let result = ' ';
    switch (title) {
      case '发电效率':
        result = ['等效利用小时数(h)', '辐射总量(MJ/㎡)', 'PR'];
        break;
      case '计划完成率':
        result = ['发电量(万kWh)', '辐射总量(MJ/㎡)', '完成率'];
        break;
      default:
        result = ' ';
    }
    return result;
  };



  getColor = {
    dark: {
      'hours': Gradient1,
      'light': Gradient2,
      'pr': '#3e97d1',
      'planPower': Gradient1,
      'actualPower': Gradient2,
      'planRate': '#f8b14e',
      'resourceValue': '#00f8ff',
    },
    light: {
      'hours': '#199475',
      'light': '#e08031',
      'pr': '#3e97d1',
      'planPower': '#d4d4d4',
      'actualPower': '#f9b600',
      'planRate': '#e08031',
      'resourceValue': '#3e97d1',
    },
  }

  getName = (type) => { // 获取对应的name
    let name = '';
    switch (type) {
      case 'hours': name = '等效利用小时数'; break;
      case 'light': name = '辐射总量'; break;
      case 'pr': name = 'PR'; break;
      case 'planPower': name = '计划发电量'; break;
      case 'actualPower': name = '实际发电量'; break;
      case 'planRate': name = '计划完成率'; break;
      case 'resourceValue': name = '辐射总量'; break;
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

  drawChart = (params) => {
    const { graphId, title, data, hasData, theme = 'light' } = params;
    let targetChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    if (targetChart) {
      targetChart.dispose();
      targetChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    }
    const seriesData = [];
    const lineData = data && data.yData.lineData;
    const barData = data && data.yData.barData;
    for (var bar in barData) {
      var json = {
        name: this.getName(bar),
        data: this.getDefaultData(barData[bar]),
        type: 'bar',
        itemStyle: {
          barBorderRadius: 3,
        },
        barWidth: 5,
        color: this.getColor[theme][bar],
      };
      seriesData.push(json);
    }
    for (var line in lineData) {
      if (line === 'light' || line === 'resourceValue') {
        var json = {
          name: this.getName(line),
          data: this.getDefaultData(lineData[line]),
          type: 'line',
          yAxisIndex: 1,
          color: this.getColor[theme][line],
        };
      } else {
        var json = {
          name: this.getName(line),
          data: this.getDefaultData(lineData[line]),
          type: 'line',
          yAxisIndex: 2,
          color: this.getColor[theme][line],
        };
      }
      seriesData.push(json);
    }
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
                        ${item.seriesName} :  ${dataFormats(item.value, '--', 2)}${(item.seriesName === '计划完成率' || item.seriesName === 'PR') && '%' || ''}</div>`;
          });
          return (
            `<div class=${styles[theme]}>
                <div class=${styles.axisValue}>${params[0].name}</div>
                <div class=${styles.tooltipContainer}> ${paramsItem}</div>
            </div>`
          );
        },
        axisPointer: {
          type: 'cross',
        },
      },
      title: {
        text: title,
        left: '23',
        top: 'top',
      },
      grid: {
        right: '20%',
        left: '12%',
      },
      legend: {
        left: 'center',
        itemWidth: 8,
        itemHeight: 5,
      },
      xAxis: {
        type: 'category',
        data: data && data.xData,
        axisPointer: {
          type: 'shadow',
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: this.getYaxisName(title)[0],
          position: 'left',
          axisLabel: { formatter: '{value} ' },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitNumber: 5,
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
        },
        {
          type: 'value',
          name: this.getYaxisName(title)[1],
          position: 'right',
          nameTextStyle: {
            textAlign: 'left',
            padding: [0, 40, 0, 0],
          },
          axisLine: {
            show: false,
            lineStyle: {
            },
          },
          splitNumber: 5,
          axisTick: {
            show: false,
          },
          splitLine: { show: false },
          axisLabel: { formatter: '{value}' },
        }, {
          type: 'value',
          name: this.getYaxisName(title)[2],
          nameTextStyle: { padding: [0, 0, 0, 40] },
          axisLabel: { formatter: '{value}%' },
          splitLine: { show: false },
          position: 'right',
          splitNumber: 5,
          offset: 50,
        },
      ],
      series: seriesData || [],
    };
    targetChart.setOption(targetMonthOption, { notMerge: true });
    targetChart.resize();
  }

  render() {
    const { graphId } = this.props;
    return (
      <div id={graphId}></div>
    );
  }
}

export default (PowerEfficency);
