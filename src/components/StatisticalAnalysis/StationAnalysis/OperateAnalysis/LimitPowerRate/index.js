import React from "react";
//import styles from './styles.scss';
import echarts from 'echarts';


class PlanCompleteRateAnalysisBar extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    const { graphId, yAxisName,xAxisName, dateType } = this.props;
   
      const targetChart = echarts.init(document.getElementById(graphId));
      const targetMonthOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        
        legend: {
          data: ['2017年限电损失', '2018年限电损失', '2017年限电率','2018年限电率','限电率同比']
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
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
        yAxis: [
          {
            type: 'value',
            name: '限电损失',
            nameTextStyle: {
              color: '#666',
            },
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} '
            },
            axisLabel: {
              color: '#666',
            },
            axisLine: {
              show: false,
            },
          },
          {
            type: 'value',
            name: '限电率/同比',
            position: 'right',
            offset: 40,
            nameTextStyle: {
              color: '#666',
            },
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} %'
            },
            axisLabel: {
              color: '#666',
            },
            axisLine: {
              show: false,
            },
          },
         
        ],
        series: [
          {
            name: '2017年限电损失',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          },
          {
            name: '2018年限电损失',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
          },
          {
            name: '2017年限电率',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }, {
            name: '2018年限电率',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 6.3, 4.5, 6.3, 4.2, 10.3, 23.4, 10.0, 16.5, 12.0, 6.2]
          }, {
            name: '限电率同比',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 6.3,  3.3, 4.5,  3.3, 4.5, 6.3, 10.2, 20.3, 12.0, 6.2]
          }
        ]

      };
      targetChart.setOption(targetMonthOption)
      targetChart.resize();
    
  
     
     
  }
  componentWillReceiveProps(nextProps) {
    const { graphId, yAxisName,xAxisName, dateType }  = nextProps;
    if (dateType === 'year') {
      const targetChart = echarts.init(document.getElementById(graphId));
      const targetYearOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        
        legend: {
          data: [ '限电损失','限电率','限电率环比']
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
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
        yAxis: [
          {
            type: 'value',
            name: '限电损失',
            nameTextStyle: {
              color: '#666',
            },
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} '
            },
            axisLabel: {
              color: '#666',
            },
            axisLine: {
              show: false,
            },
          },
          {
            type: 'value',
            name: '限电率/环比',
            position: 'right',
            offset: 40,
            nameTextStyle: {
              color: '#666',
            },
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} %'
            },
            axisLabel: {
              color: '#666',
            },
            axisLine: {
              show: false,
            },
          },
         
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
    if (dateType === 'month'||dateType === 'day') {
      const targetChart = echarts.init(document.getElementById(graphId));
      const targetMonthOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        
        legend: {
          data: ['2017年限电损失', '2018年限电损失', '2017年限电率','2018年限电率','限电率同比']
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
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
        yAxis: [
          {
            type: 'value',
            name: '限电损失',
            nameTextStyle: {
              color: '#666',
            },
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} '
            },
            axisLabel: {
              color: '#666',
            },
            axisLine: {
              show: false,
            },
          },
          {
            type: 'value',
            name: '限电率/同比',
            position: 'right',
            offset: 40,
            nameTextStyle: {
              color: '#666',
            },
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} %'
            },
            axisLabel: {
              color: '#666',
            },
            axisLine: {
              show: false,
            },
          },
         
        ],
        series: [
          {
            name: '2017年限电损失',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          },
          {
            name: '2018年限电损失',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
          },
          {
            name: '2017年限电率',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }, {
            name: '2018年限电率',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 6.3, 4.5, 6.3, 4.2, 10.3, 23.4, 10.0, 16.5, 12.0, 6.2]
          }, {
            name: '限电率同比',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 6.3,  3.3, 4.5,  3.3, 4.5, 6.3, 10.2, 20.3, 12.0, 6.2]
          }
        ]

      };
      targetChart.setOption(targetMonthOption)
      targetChart.resize();
    } 
  }
  render() {
    const { graphId,dateType } = this.props;
    return (

      <div id={graphId}  style={{ width: '55%', height: "300px", }}> </div>

    )
  }
}
export default (PlanCompleteRateAnalysisBar)