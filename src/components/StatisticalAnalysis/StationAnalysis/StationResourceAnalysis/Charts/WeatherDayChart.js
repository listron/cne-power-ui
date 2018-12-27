import React from "react";
import echarts from "echarts";
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';

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
      default: name = ""; break;
    }
    return name;
  }
  getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示
    const length = data.length;
    let replaceData = [];
    for (let i = 0; i < length; i++) { replaceData.push('--') }
    let realData = data.some(e => e || e === 0) ? data : replaceData;
    return realData
  }

  drawChart = param => {
    const { graphId, yAxisName, xAxisName, yData, xData, title, hasData } = param;

    const targetChart = echarts.init(document.getElementById(graphId));
    let color = ['#ceebe0', '#c7ceb2', '#199475', '#a42b2c', '#dfdfdf', "#f9b600"];
    const lineColor = '#f1f1f1';
    const fontColor = '#333';
    let seriesData = [];
    yData.forEach(e => {
      console.log('test',e)
      seriesData.push({
        name: this.getName(e.weather),
        barWidth: 13,
        value: [e.temp ? e.temp : '--'],
        itemStyle: {
          color: color[+e.weather]
        }
      })
    })
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || " ";
    const targetMonthOption = {
      graphic: confluenceTenMinGraphic,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        },
        backgroundColor: '#fff',
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
        formatter: function (params) {
          let paramsItem = '';
          params.forEach((item, index) => {
            return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index]};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${params[index].value === '0' || params[index].value || '--'}</div>`
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:160px;overflow:hidden;"> <span style="float: left">${params[0].name} </span>
            </div>${paramsItem}`
        }
      },
      title: {
        text: title,
        show: title ? "show" : false,
        left: "23",
        top: "top",
        textStyle: {
          color: fontColor,
          fontSize: 14,
          fontWeight: "normal"
        }
      },
      color: color,
      legend: {
        left: "center",
        icon: "circle",
        itemWidth: 8,
        itemHeight: 5,
      },
      yAxis: {
        type: "value",
        name: yAxisName,
        nameTextStyle: {
          color: fontColor
        },
        axisLabel: {
          color: fontColor
        },
        axisLine: {
          show: false,
          lineStyle: { color: lineColor }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          // show:false,
          lineStyle: {
            color: lineColor,
            type: "dashed"
          }
        }
      },
      xAxis: {
        type: "category",
        data: xData,
        axisLine: {
          lineStyle: {
            color: lineColor
          }
        },
        axisLabel: {
          color: fontColor
        }
      },
      series: {
        name: '天气',
        type: "bar",
        data: seriesData
      }
    };
    setTimeout(() => {
      targetChart.resize();
    }, 1000);
    targetChart.setOption(targetMonthOption);
  };
  render() {
    const { graphId, dateType } = this.props;
    return <div id={graphId}> </div>;
  }
}
export default WeatherDayChart;
