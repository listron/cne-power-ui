import React from "react";
import styles from './styles.scss';
import echarts from 'echarts';
import PropTypes from 'prop-types';
/*
  双柱单折线组件：
  参数:
  1  必填 -每一个图表的ID：graphId 不能重复
  2. 选填 -第一个y轴的name  yAxisName 
  3. 选填 -判断颜色 以及tooltip 的提示框右侧的文字显示  xAxisName 
  4. 选填 -判断是单柱 单折线 还是双柱单折线 dateType  month|day 双柱单折线 year 单柱 单折线
  5. 选填 -判断是否有title  title
*/

class BarGraph extends React.Component {
  static propTypes = {
    graphId: PropTypes.string,
    yAxisName: PropTypes.string,
    xAxisName: PropTypes.string,
    dateType: PropTypes.string,

  };

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    // const {graphId, yAxisName, xAxisName, dateType,title} = this.props;
    this.drawCharts(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // const {graphId, yAxisName, xAxisName, dateType,title} = nextProps;
    this.drawCharts(nextProps);
  }

  getColor = (xAxisName) => {
    let result = '';
    switch (xAxisName) {
      case '发电量':
        result = ['#dfdfdf', '#199475', '#f9b600'];
        break;
      case '辐射总量':
        result = ['#dfdfdf', '#a42b2c', '#f9b600'];
        break;
      case '等效利用小时数':
        result = ['#dfdfdf', '#ceebe0', '#f9b600'];
        break;
      case 'PR':
        result = ['#dfdfdf', '#3e97d1', '#f9b600'];
        break;
      case '损失电量':
        result = ['#dfdfdf', '#c7ceb2', '#f9b600'];
        break;
      case '损失电量等效时':
        result = ['#dfdfdf', '#199475', '#f9b600'];
        break;
      case '损失电量同比':
        result = ['#dfdfdf', '#199475', '#f9b600'];
        break;
      default:
        result = '#ccc';
    }
    return result;
  };


  tooltip = (params) => {
    return `<div  style="border-bottom: 1px solid #ccc;line-height:30px;width:180px;overflow:hidden;"> 
              <span style="float: left">${params[0].name} </span>
              <span style="float: right">${xAxisName} </span>
            </div>
            <div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;color: #ccc;"> ${params[0].seriesName} :</span> ${params[0].value}</div>
            <div><span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;color:${color}">${params[1].seriesName} </span> ${params[1].value}</div>
            <div><span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;color: #ccc;">${params[2].seriesName} </span> ${params[2].value}</div>`
  }




  
  drawCharts = (param) => { 
    const { graphId, yAxisName, xAxisName, dateType, title } = param;
    const targetChart = echarts.init(document.getElementById(graphId));
    let targetOption = {};
    targetChart.clear();
    targetChart.resize();
    let color = this.getColor(xAxisName);
    if (dateType === 'month' || dateType === 'day') {
      targetOption = {
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
          padding: 10,
          textStyle: {
            color: 'rgba(0, 0, 0, 0.65)',
            fontSize: 12,
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
          formatter: function (params) {
            let paramsItem = '';
            params.forEach((item, index) => {
              return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index]};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${params[index].value}</div>`
            });
            return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"> <span style="float: left">${params[0].name} </span><span style="float: right">${xAxisName} </span>
            </div>${paramsItem}`
          }
        },
        legend: {
          top: 20,
          left: 'center',
          icon: 'circle',
          itemWidth: 5,
          itemHeight: 5,
        },
        xAxis: [
          {
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
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: yAxisName,
            nameTextStyle: {
              color: '#666',
            },
            // min: 0,
            splitNumber: 5,
            scale: true,
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
              // show:false,
              lineStyle: {
                color: '#666',
                type: 'dashed'
              }
            },
          },
          {
            type: 'value',
            name: '同比',
            nameTextStyle: {
              color: '#666',
            },
            axisLabel: {
              formatter: '{value} %',
              color: '#666',
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#f1f1f1',
                type: 'dashed'
              }
            },
          }
        ],
        series: [
          {
            name: '2017年',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            itemStyle: {
              barBorderRadius: 3,
            },
            barWidth: 5,
          },
          {
            name: '2018年',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
            itemStyle: {
              barBorderRadius: 3,
            },
            barWidth: 5,
          },
          {
            name: '同比',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
          }
        ]
      };
    }
    if (dateType === 'year') {
      targetOption = {
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
              return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index + 1]};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${params[index].value}</div>`
            });
            return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"> <span style="float: left">${params[0].name} </span>
            </div>
           ${paramsItem}`
          },
          padding: 10,
          textStyle: {
            color: 'rgba(0, 0, 0, 0.65)',
            fontSize: 12,
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
        },
        legend: {
          top: 20,
          left: 'center',
          icon: 'circle',
          itemWidth: 5,
          itemHeight: 5,
        },
        xAxis: [
          {
            type: 'category',
            data: ['2014年', '2015年', '2016年', '2017年', '2018年', '2019年',],
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
            },
          }
        ],
        color: color.slice(1),
        yAxis: [
          {
            type: 'value',
            name: yAxisName,
            nameTextStyle: {
              color: '#666',
            },
            min: 0,
            max: 250,
            interval: 50,
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
              // show:false,
              lineStyle: {
                color: '##f1f1f1',
                type: 'dashed'
              }
            },
          },
          {
            type: 'value',
            name: '环比',
            nameTextStyle: {
              color: '#666',
            },
            min: 0,
            max: 25,
            interval: 5,
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
              // show:false,
              lineStyle: {
                color: '#666',
                type: 'dashed'
              }
            },
          }
        ],
        series: [
          {
            name: xAxisName,
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7,],
            itemStyle: {
              barBorderRadius: 10,
            },
            barWidth: 10,
          },
          {
            name: '环比',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2,]
          }
        ]
      }
    }
    targetChart.setOption(targetOption)
  };

  render() {
    const { graphId, dateType } = this.props;
    return (
      <div id={graphId} className={styles.statisticGraph}> </div>
      // <div id={graphId} className={styles.statisticGraph} style={{width: '100%', height: "100%"}}></div>
    )
  }
}

export default (BarGraph)
