import React from "react";
import echarts from 'echarts';
import PropTypes from "prop-types";
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';


class BarGraph extends React.Component {
  static propTypes = {
    graphId: PropTypes.string,
    yAxisName: PropTypes.string,
    xAxisName: PropTypes.string,
    dateType: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.drawChart(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps)
  }

  getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示
    const length = data.length;
    let replaceData = [];
    for (let i = 0; i < length; i++) { replaceData.push('--') }
    let realData = data.some(e => e || e === 0) ? data : replaceData;
    return realData
  }

  drawChart = (param) => {
    const { graphId, yAxisName, xAxisName, dateType, title, data, hasData } = param;
    const targetChart = echarts.init(document.getElementById(graphId));
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || " ";
    const lineColor = '#f1f1f1';
    const fontColor='#333';
    const color = ['#199475', '#e08031','#fff'];
    const targetOption = {
      graphic: confluenceTenMinGraphic,
      color: color,
      title: {
        text: title,
        show: title ? 'show' : false,
        left: '23',
        top: 'top',
        textStyle: {
          color: fontColor,
          fontSize: 14,
          fontWeight: 'normal',
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: fontColor,
          },
          label: { color: fontColor },
        },
        backgroundColor: '#fff',
        formatter: function (params) {
          let paramsItem = '';
          params.forEach((item, index) => {
            return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index]};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${params[index].value === '0' || params[index].value || '--'}${params[index].seriesName==='占比' && '%' ||''}</div>`
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"> <span style="float: left">${params[0].name} </span><span style="float: right">${xAxisName} </span>
          </div>${paramsItem}`

        },
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
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
            type: 'shadow'
          },
          axisLine: {
            lineStyle: {
              color: lineColor,
            },
          },
          axisLabel: {
            color: fontColor,
            interval: 0,
            rotate: -30
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: yAxisName,
          nameTextStyle: {
            color: fontColor,
          },

          axisLabel: {
            color:fontColor,
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: lineColor,
            }
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: lineColor,
              type: 'dashed'
            }
          },
        },
        {
          type: 'value',
          name: '占比',
          nameTextStyle: {
            color: fontColor,
          },
          axisLabel: {
            color: fontColor,
            formatter: '{value} %'
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: lineColor,
            }
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: fontColor,
              type: 'dashed'
            }
          },
        }
      ],
      series: [
        {
          name: '辐射总量',
          type: 'bar',
          stack: "总量",
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
          name:'瞬时辐射区间（w/㎡）',
          type: 'bar',
          stack: "总量",
        }
      ]
    };
    setTimeout(() => { targetChart.resize(); }, 1000)
    targetChart.setOption(targetOption)

  }
  render() {
    const { graphId } = this.props;
    return (
      <div id={graphId}> </div>
    )
  }
}
export default (BarGraph)