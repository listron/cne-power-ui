import React, { Component } from "react";
import PropTypes from "prop-types";
import echarts from 'echarts';
import styles from './singleDevice.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

class WindRoseChart extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    this.drawChart((this.props.roseChartData || []))
  }
  componentWillReceiveProps(nextProps) {
    const roseChartData = nextProps.roseChartData || [];
    this.drawChart(roseChartData)
  }

  drawChart = (params) => {
    const windrosechart = echarts.init(document.getElementById('windrosechart'));
    var dataArr = [
      [
        [20, 0],
        [130, 0]
      ],
      [
        [30, 1],
        [130, 1]
      ],
      [
        [40, 1.5],
        [130, 2]
      ],
      [
        [10, 2.5],
        [130, 3]
      ],
      [
        [20, 3.5],
        [130, 4]
      ],
      [
        [20, 5.5],
        [130, 5]
      ],
      [
        [40, 5.5],
        [130, 6]
      ],
      [
        [20, 6.5],
        [130, 7]
      ],
      [
        [60, 8],
        [130, 8]
      ],
      [
        [20, 9],
        [130, 9]
      ]
    ]

    const lineColor = '#666';
    // let color = ['#199475'];
    const option = {
      title: {
        text: '风向玫瑰图',
        padding: [10, 10],
        textStyle: {
          fontSize: 16,
          fontWeight: 'bolder',
          // color: '#666'          // 主标题文字颜色
        },
      },
      legend: {
        show: true,
        top: '5%',
        width: '80%',
        itemWidth: 14,
        itemHeight: 6,
        x: 'right',
        textStyle: {
          color: lineColor,
          fontSize: 12,
        },
        data: ['平均风速', '风向占比']
      },
      polar: {
        center: ['50%', '54%']
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      angleAxis: {
        interval: 1,
        type: 'category',
        boundaryGap: true,
        clockwise: false,
        startAngle: 90,
        data: [
          'N',
          'NNW',
          'NW',
          'WNW',
          'W',
          'WSW',
          'SW',
          'SSW',
          'S',
          'SSE',
          'SE',
          'ESE',
          'E',
          'ENE',
          'NE',
          'NNE',
        ],
        z: 16,
        axisLine: {
          show: true,
          lineStyle:{
            color: "#666",
            width: 1,
            type:'solid',
          }
        }
      },
      radiusAxis: {
        min: 0,
        max: 100,
        interval: 16,
        axisLine: {
            show: false,
            lineStyle: {
                color: "#00c7ff",
                width: 1,
                type: "dashed"
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: false
        },
        splitLine: {
            lineStyle: {
                // color: "#1d51a3",
                width: 1,
                type: "dashed",
                opacity: 0.7
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                // color: '#1d51a3',
                opacity: 0.5
            }
        }
    },
      series: [{
        coordinateSystem: 'polar',
        name: '平均风速',
        type: 'line',
        showSymbol: false,
        data: []
      }, {
        coordinateSystem: 'polar',
        name: '风向占比',
        type: 'line',
        showSymbol: false,
        data: []
      }],




    };
    windrosechart.setOption(option, 'notMerge');
    windrosechart.resize();
  }
  render() {
    console.log(this.props.roseChartData);
    return (
      <div id="windrosechart" className={styles.windrosechart}></div>
    )
  }
}
export default (WindRoseChart)