import React from "react";
//import styles from './styles.scss';
import echarts from 'echarts';


class PlanCompleteRateAnalysisBar extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.drawChart(this.props) 
  }
  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps)
  }


  drawChart = (param)=>{
    const { graphId, yAxisName,xAxisName, dateType ,title} =param;
    const targetChart = echarts.init(document.getElementById(graphId));
    const color=['#dfdfdf','#dfdfdf','##999999','#3e97d1','#f9b600']
    const targetYearOption = {
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
        top: title ? 0 :20,
        left: 'center',
        icon: 'circle',
        itemWidth: 5,
        itemHeight: 5,
      },
      xAxis: [
        {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          // data:barGraphmonth,
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
          name: '限电损失',
          type: 'bar',
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        },
       {
          name: '限电率',
          type: 'line',
          yAxisIndex: 1,
          data: [2.0, 2.2, 6.3, 4.5, 6.3, 4.2, 10.3, 23.4, 10.0, 16.5, 12.0, 6.2]
        }, {
          name: '限电率环比',
          type: 'line',
          yAxisIndex: 1,
          data: [2.0, 2.2, 6.3,  3.3, 4.5,  3.3, 4.5, 6.3, 10.2, 20.3, 12.0, 6.2]
        }
      ]

    };
    targetChart.setOption(targetYearOption)
    targetChart.resize();
  }
  render() {
    const { graphId,dateType } = this.props;
    return (
      <div id={graphId}> </div>
    )
  }
}
export default (PlanCompleteRateAnalysisBar)