import React from "react";
import styles from './styles.scss';
import echarts from 'echarts';
import PropTypes from 'prop-types';

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
    this.drawCharts(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.drawCharts(nextProps);
  }

  drawCharts = (param) => {
    const {graphId, yAxisName, xAxisName, dateType} = param;
    const targetChart = echarts.init(document.getElementById(graphId));
    let targetOption = {};
    if (dateType === 'month') {
      targetOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
          backgroundColor:'#fff',
          formatter: function(params){
            return '<div style="border-bottom: 1px solid #ccc; font-size: 12px;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"><span style="float: left">'+params[0].name+'</span><span style="float: right">' + xAxisName+'</span></div>'
              + params[0].seriesName + '：' +  params[0].value + '<br>'
              + params[1].seriesName + '：' +  params[1].value + '<br>'
              + params[2].seriesName + '：' +  params[2].value + '%<br>'
          },
          padding:10,
          textStyle:{
            color:'rgba(0, 0, 0, 0.65)',
            fontSize:12,
          },
        },
        legend: {
          top:20,
          data:[{
            name:'2017年',
            icon:'circle',
          },
            {
              name:'2018年',
              icon:'circle',
            },
            {
              name:'同比',
              icon:'diamond',
            },
          ],
          // icon:'circle',
          left:'center',
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisPointer: {
              type: 'shadow'
            },
            axisLine: {
              show:true,
              lineStyle: {
                color: '#dfdfdf',
              }
            },
            axisLabel: {
              color: '#666',
            },
            axisTick:{
              show:false,
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
            min: 0,
            max:'dataMax',
            // interval: 5,
            axisLabel: {
              color: '#666',
            },
            axisLine: {
              show: false,
            },
            axisTick:{
              show:false,
            },
            splitLine: {
              show:false,
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
            // interval: 5,
            axisLabel: {
              formatter: '{value} %',
              color: '#666',
            },
            axisTick:{
              show:false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              // show: false,
              lineStyle: {
                color: '#999',
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
            itemStyle:{
              color:'#ccc',
              barBorderRadius:5,
            },
            barWidth:10,
          },
          {
            name: '2018年',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
            itemStyle:{
              color:'red',
              barBorderRadius:5,
            },
            barWidth:10,
          },
          {
            name: '同比',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
            lineStyle:{
              color:'#f9b600'
            },
            itemStyle:{
              color:'#f9b600'
            }
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
          }
        },

        legend: {
          data: [xAxisName, '环比']
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
            name: '环比',
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
          }
        ],
        series: [
          {
            name: xAxisName,
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7,]
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
    targetChart.resize();
  }

  render() {
    const {graphId, dateType} = this.props;
    return (
      <div id={graphId} className={styles.statisticGraph} style={{width: '55%', height: "300px",}}></div>
    )
  }
}

export default (BarGraph)
