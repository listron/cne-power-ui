import React from "react";

import echarts from 'echarts';
import PropTypes from 'prop-types';

class PowerEfficency extends React.Component {
  static propTypes = {
    graphId: PropTypes.string,
    yAxisName: PropTypes.string,
    xAxisName: PropTypes.string,
    dateType: PropTypes.string,
    title: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context)
  }

  getYaxisName = (title) => {
    let result = '';
    switch (title) {
      case '发电效率':
        result = ['等效利用小时数(h)', '辐射总量(MJ/㎡)', 'PR'];
        break;
      case '计划完成率':
        result = ['发电量(万kWh)', '辐射总量(MJ/㎡)', '完成率'];
        break;
      default:
        result = '';
    }
    return result;
  };

  getColor = (title) => {
    let result = '';
    switch (title) {
      case '发电效率':
        result = ['#199475', '#e08031', '#3e97d1'];
        break;
      case '计划完成率':
        result = ['#dfdfdf', '#f9b600', '#e08031', '#3e97d1'];
        break;
      default:
        result = '';
    }
    return result;
  };

  componentDidMount() {
    this.drawChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps);
  }

  drawChart = (params) => {
    const {graphId, title} = params;
    const targetChart = echarts.init(document.getElementById(graphId));
    let color=this.getColor(title);
    const targetMonthOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {type: 'cross'},
        backgroundColor: '#fff',
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
        formatter: function (params) {
          let paramsItem='';
          params.map((item,index)=>{
            return paramsItem+= `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index]};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${ params[index].value}</div>`
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"> <span style="float: left">${params[0].name} </span></div>
           ${paramsItem}`
        }
      },
      title: {
        text: title,
        left: '23',
        top: 'top',
        textStyle:{
          color:'#666',
          fontSize:14,
          fontWeight:'normal',
        }
      },
      color: this.getColor(title),
      grid: {
        right: '15%'
      },
      legend: {
        icon: 'circle',
        left: 'center',
        itemWidth: 5,
        itemHeight: 5,
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisPointer: {
          type: 'shadow'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#dfdfdf',
          }
        },
        axisLabel: {
          color: '#666',
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
          axisLabel: {
            formatter: '{value} '
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            // show:false,
            lineStyle: {
              color: '#666',
              type: 'dashed'
            }
          },
        },
        {
          type: 'value',
          name: this.getYaxisName(title)[1],
          position: 'right',
          nameTextStyle:{
            textAlign:'left',
            padding:[0,40,0,0]
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine:{show:false},
          axisLabel: {
            formatter: '{value}'
          },
        }, {
          type: 'value',
          name: this.getYaxisName(title)[2],
          position: 'right',
          splitLine:{show:false},
          axisLine: {
            lineStyle: {
              color: '#666',
            }
          },
          offset: 50,
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
      series: [
        {
          name: '等效利用小时数',
          type: 'bar',
          yAxisIndex: 0,
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
          itemStyle: {
            barBorderRadius: 3,
          },
          barWidth: 5,
        },
        {
          name: '辐射总量',
          type: 'line',
          yAxisIndex: 1,
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
        },
        {
          name: 'PR',
          type: 'line',
          yAxisIndex: 2,
          data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        }
      ]
    };
    targetChart.setOption(targetMonthOption)
    targetChart.resize();
  }

  render() {
    const {graphId,} = this.props;
    return (
      <div id={graphId} style={{width: '55%', height: "300px",}}></div>
    )
  }
}

export default (PowerEfficency)
