import React from "react";
import styles from './styles.scss';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';
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
    this.state={
      prevDateType:''
    }
  }

  componentDidMount() {
    this.drawCharts(this.props);
  }

  componentWillReceiveProps(nextProps) {
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
      case '购网电量':
        result = ['#dfdfdf', '#199475', '#f9b600'];
        break;
      case '上网电量':
        result = ['#dfdfdf', '#3e97d1', '#f9b600'];
        break;
      default:
        result = '#ccc';
    }
    return result;
  };


  getYearOption = (param) => {
    const { yAxisName, xAxisName, barGraphThatYear, barGraphmonth, barGraphRingRatio, title, hasData } = param;
    let color = this.getColor(xAxisName);
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || " ";
    return {
      graphic: confluenceTenMinGraphic,
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
            return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index]};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${params[index].value === 0 || params[index].value ? params[index].value : '--'}${params[index].seriesType === 'line' && '%' || ''}</div>`
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
        top: 20,
        left: 'center',
        icon: 'circle',
        itemWidth: 5,
        itemHeight: 5,
      },
      xAxis: [
        {
          type: 'category',
          // data: ['2014年', '2015年', '2016年', '2017年', '2018年', '2019年',],
          data: barGraphmonth,

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
          axisLabel: {
            color: '#666',
            formatter: xAxisName==='PR'?'{value} %':'{value}'
          },
        },
        {
          type: 'value',
          name: '环比',
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
          name: xAxisName,
          type: 'bar',
          data: barGraphThatYear,
          // data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7,],
          //年的数据没有mock,要看接口
          //data:barGraphThatYear,
          itemStyle: {
            barBorderRadius: 10,
          },
          barWidth: 10,
        },
        {
          name: '环比',
          type: 'line',
          yAxisIndex: 1,
          data: barGraphRingRatio,
          //  data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2,],
        }
      ]
    }
  }

  getMonthOption = (param) => {
    const {  yAxisName, xAxisName, barGraphThatYear, barGraphLastYear, barGraphmonth, barGraphYearOnYear, lastYear, currentYear, title,hasData } = param;
    let color = this.getColor(xAxisName);
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || " ";
    return {
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
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
        formatter: function (params) {
          let paramsItem = '';
          params.forEach((item, index) => {
            return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index]};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${params[index].value === 0 || params[index].value ? params[index].value : '--'}${params[index].seriesType === 'line' && '%' || ''}</div>`
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"> <span style="float: left">${params[0].name} </span><span style="float: right">${xAxisName} </span>
        </div>${paramsItem}`
        }
      },
      legend: {
        top: title ? 0 : 20,
        left: 'center',
        icon: 'circle',
        itemWidth: 5,
        itemHeight: 5,
      },
      xAxis: [
        {
          type: 'category',
          // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          data: barGraphmonth,
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
          axisLabel: {
            color: '#666',
            formatter: xAxisName==='PR'?'{value} %':'{value}'
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
          name: lastYear,
          type: 'bar',
          data: barGraphLastYear,
          itemStyle: {
            barBorderRadius: 3,
          },
          barWidth: 5,
        },
        {
          name: currentYear,
          type: 'bar',
          data: barGraphThatYear,
          itemStyle: {
            barBorderRadius: 3,
          },
          barWidth: 5,
        },
        {
          name: '同比',
          type: 'line',
          yAxisIndex: 1,
          data: barGraphYearOnYear,
        }
      ]
    };
  }

  drawCharts = (param) => {
    const { graphId, dateType} = param;
    const targetChart = echarts.init(document.getElementById(graphId));
    if(dateType!==this.state.prevDateType){
      targetChart.clear();
    }
    targetChart.resize();
    let targetOption=" ";
    dateType==='year' ? targetOption =this.getYearOption(param):targetOption =this.getMonthOption(param);
    targetChart.setOption(targetOption)
    this.setState({prevDateType:dateType})
  };

  render() {
    const { graphId } = this.props;
    return (
      <div id={graphId} className={styles.statisticGraph}> </div>
    )
  }
}

export default (BarGraph)
