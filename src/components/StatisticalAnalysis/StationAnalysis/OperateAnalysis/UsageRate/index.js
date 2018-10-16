import React from "react";

import echarts from 'echarts';


class UsageRate extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    const { graphId, yAxisName, xAxisName, dateType, title, legendOne, legendTwo,showyAxis,rightyAxis } = this.props;
   

    const targetChart = echarts.init(document.getElementById(graphId));
    const targetMonthOption = {
      title: {
        text: title,

      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: [legendOne, legendTwo]
      },

      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      },
      yAxis: [{
        type: 'value',
        name: yAxisName,
        axisLabel: {
          formatter: '{value} %'
        }
      },{
        type: 'value',
        name: rightyAxis,   
        axisLabel: {
          formatter: '{value} %'
        },
        show:showyAxis,
      }],
      series: [
        {
          name: legendOne,
          type: 'line',
          data: [11, 11, 15, 13, 12, 13, 10, 1, 2, 2, 5, 3, 2, 0],


        },
        {
          name: legendTwo,
          type: 'line',
          data: [1, 2, 2, 5, 3, 2, 0, 11, 15, 13, 12, 13, 10, 1,],


        }
      ]
    };


    targetChart.setOption(targetMonthOption)
    targetChart.resize();


  }
  componentWillReceiveProps(nextProps) {
    const { graphId, yAxisName, xAxisName, dateType, title, legendOne, legendTwo ,showyAxis,rightyAxis} = nextProps;
    // if (dateType === 'month') {
    
    // }

    const targetChart = echarts.init(document.getElementById(graphId));
    const targetMonthOption = {
      title: {
        text: title,

      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: [legendOne, legendTwo]
      },

      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      },
      yAxis: [{
        type: 'value',
        name: yAxisName,
        axisLabel: {
          formatter: '{value} %'
        }
      },{
        type: 'value',
        name: rightyAxis,
        show:showyAxis,
        axisLabel: {
          formatter: '{value} %'
        }
      }],
      series: [
        {
          name: legendOne,
          type: 'line',
          data: [11, 11, 15, 13, 12, 13, 10, 1, 2, 2, 5, 3, 2, 0],


        },
        {
          name: legendTwo,
          type: 'line',
          data: [1, 2, 2, 5, 3, 2, 0, 11, 15, 13, 12, 13, 10, 1,],


        }
      ]
    };
    targetChart.setOption(targetMonthOption)
    targetChart.resize();



  }
  render() {
    const { graphId, dateType } = this.props;
    return (

      <div id={graphId} style={{ width: '55%', height: "300px", }}> </div>

    )
  }
}
export default (UsageRate)