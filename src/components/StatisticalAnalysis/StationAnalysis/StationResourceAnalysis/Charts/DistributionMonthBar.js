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

  drawChart = (param) => {
    const { graphId, yAxisName, xAxisName, dateType, title, data, hasData } = param;
    const targetChart = echarts.init(document.getElementById(graphId));
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || " ";
    const color = ['#199475', '#e08031'];
    const targetOption = {
      graphic: confluenceTenMinGraphic,
      color: color,
      title: {
        text: title,
        show: title ? 'show' : false,
        left: '23',
        top: 'top',
        textStyle: {
          color: '#666',
          fontSize: 14,
          fontWeight: 'normal',
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
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
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            color: '#666',
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
            color: '#666',
          },

          axisLabel: {
            color: '#666',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: '##f1f1f1',
              type: 'dashed'
            }
          },
        },
        {
          type: 'value',
          name: '占比',
          nameTextStyle: {
            color: '#666',
          },

          axisLabel: {
            color: '#666',
            formatter: '{value} %'
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#666',
              type: 'dashed'
            }
          },
        }
      ],
      series: [
        {
          name: '辐射总量',
          type: 'bar',
          data: data && data.yData.barData,
          itemStyle: {
            barBorderRadius: 10,
          },
          barWidth: 10,
        },
        {
          name: '占比',
          type: 'line',
          yAxisIndex: 1,
          data: data && data.yData.lineData
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