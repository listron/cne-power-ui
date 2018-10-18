import React from "react";

import echarts from 'echarts';


class BarGraph extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    const { graphId, yAxisName, xAxisName, dateType } = this.props;
    if (dateType === 'year') {
      const targetChart = echarts.init(document.getElementById(graphId));
      const targetYearOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['1-100', '101-200', '201-300', '301-400', '401-500', '501-600', '601-700', '701-800', '801-900', '901-1000', '1000以上']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: [
          {
            type: 'value',
            name: yAxisName,
            nameTextStyle: {
              color: '#666',
            },
            // min: 0,
            // max: 250,
            // interval: 50,
            axisLabel: {
              formatter: '{value}'
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
            name: '占比',
            nameTextStyle: {
              color: '#666',
            },
            // min: 0,
            // max: 25,
            // interval: 5,
            axisLabel: {
              formatter: '{value} %'
            },
            axisLabel: {
              color: '#666',
            },
            axisLine: {
              show: false,
            },
          }
        ],

        xAxis: {
          type: 'category',

          data: ['2014年', '2015年', '2016年', '2017年', '2018年', '2019年',],
        },
        series: [
          {
            name: '1-100',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [320, 0, , 390, 330, 320]
          },
          {
            name: '101-200',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [120, , 90, 230, 210,]
          },
          {
            name: '201-300',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [191, 234, 290, 330, 310]
          },
          {
            name: '301-400',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 154, 190, 330, 410]
          },
          {
            name: '401-500',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [901, 934, 1290, 1330, 1320]
          }, {
            name: '501-600',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 212, 190, 330, 410]
          },
          {
            name: '601-700',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 154, 190, 330, 410]
          },
          {
            name: '701-800',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 212, 201, 154, 410]
          },
          {
            name: '801-900',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 154, 190, 330, 410]
          },
          {
            name: '901-1000',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 212, 201, 154, 190,]
          },
          {
            name: '1000以上',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 212, 201, 154, 190, 330, 410]
          }, {
            name: '占比',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 212, 201, 154, 190, 330, 410]
          },

        ]


      }
      targetChart.setOption(targetYearOption)
      targetChart.resize();
    }
    if (dateType === 'month') {
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
          data: ['辐射总量', '占比']
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              color: '#666',
              interval: 0,
              rotate: -30
            },
            data: ['1-100', '101-200', '201-300', '301-400', '401-500', '501-600', '601-700', '701-800', '801-900', '901-1000', '1000以上'],
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
            name: yAxisName,
            nameTextStyle: {
              color: '#666',
            },
            // min: 0,
            // max: 250,
            // interval: 50,
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
            name: '占比',
            nameTextStyle: {
              color: '#666',
            },
            // min: 0,
            // max: 25,
            // interval: 5,
            axisLabel: {
              formatter: '{value} %'
            },
            axisLabel: {
              color: '#666',
            },
            axisLine: {
              show: false,
            },
          }
        ],
        series: [

          {
            name: '辐射总量',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
          },
          {
            name: '占比',
            type: 'line',
          
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]

      };
      targetChart.setOption(targetMonthOption)
      targetChart.resize();
    }
  }
  componentWillReceiveProps(nextProps) {
    const { graphId, yAxisName, xAxisName, dateType } = nextProps;
    if (dateType === 'year') {
      const targetChart = echarts.init(document.getElementById(graphId));
      const targetYearOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['1-100', '101-200', '201-300', '301-400', '401-500', '501-600', '601-700', '701-800', '801-900', '901-1000', '1000以上']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: [
          {
            type: 'value',
            name: yAxisName,
            nameTextStyle: {
              color: '#666',
            },
            // min: 0,
            // max: 250,
            // interval: 50,
            axisLabel: {
              formatter: '{value}'
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
            name: '占比',
            nameTextStyle: {
              color: '#666',
            },
            // min: 0,
            // max: 25,
            // interval: 5,
            axisLabel: {
              formatter: '{value} %'
            },
            axisLabel: {
              color: '#666',
            },
            axisLine: {
              show: false,
            },
          }
        ],

        xAxis: {
          type: 'category',

          data: ['2014年', '2015年', '2016年', '2017年', '2018年', '2019年',],
        },
        series: [
          {
            name: '1-100',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [320, 0, , 390, 330, 320]
          },
          {
            name: '101-200',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [120, , 90, 230, 210,]
          },
          {
            name: '201-300',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [191, 234, 290, 330, 310]
          },
          {
            name: '301-400',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 154, 190, 330, 410]
          },
          {
            name: '401-500',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [901, 934, 1290, 1330, 1320]
          }, {
            name: '501-600',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 212, 190, 330, 410]
          },
          {
            name: '601-700',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 154, 190, 330, 410]
          },
          {
            name: '701-800',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 212, 201, 154, 410]
          },
          {
            name: '801-900',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 154, 190, 330, 410]
          },
          {
            name: '901-1000',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 212, 201, 154, 190,]
          },
          {
            name: '1000以上',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 212, 201, 154, 190, 330, 410]
          }, {
            name: '占比',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 212, 201, 154, 190, 330, 410]
          },

        ]


      }
      targetChart.setOption(targetYearOption)
      targetChart.resize();
    }
    if (dateType === 'month') {
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
          data: ['辐射总量', '占比']
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              color: '#666',
              interval: 0,
              rotate: -30
            },
            data: ['1-100', '101-200', '201-300', '301-400', '401-500', '501-600', '601-700', '701-800', '801-900', '901-1000', '1000以上'],
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
            name: yAxisName,
            nameTextStyle: {
              color: '#666',
            },
            // min: 0,
            // max: 250,
            // interval: 50,
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
            name: '占比',
            nameTextStyle: {
              color: '#666',
            },
            // min: 0,
            // max: 25,
            // interval: 5,
            axisLabel: {
              formatter: '{value} %'
            },
            axisLabel: {
              color: '#666',
            },
            axisLine: {
              show: false,
            },
          }
        ],
        series: [

          {
            name: '辐射总量',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
          },
          {
            name: '占比',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]

      };
      targetChart.setOption(targetMonthOption)
      targetChart.resize();
    }
  }
  render() {
    const { graphId, dateType } = this.props;
    return (

      <div id={graphId} style={{ width: '55%', height: "300px", }}> </div>

    )
  }
}
export default (BarGraph)