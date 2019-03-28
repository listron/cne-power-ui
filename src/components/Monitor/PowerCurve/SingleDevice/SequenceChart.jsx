import React, { Component } from "react";
import PropTypes from "prop-types";
import echarts from 'echarts';
import moment from 'moment';
import styles from './singleDevice.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

class SequenceChart extends Component {
  static propTypes = {
    xAxisDate: PropTypes.array,
    sequencechartData: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    this.drawChart((this.props.sequencechartData || []))
  }
  componentWillReceiveProps(nextProps) {
    const theoryPowers = nextProps.sequencechartData || [];
    this.drawChart(theoryPowers)
  }

  drawChart = (params) => {
    const sequenceChart = echarts.init(document.getElementById('sequenceChart'));
    const lineColor = '#666';
    const { xAxisDate } = this.props;
    let color = ['#3e97d1', '#a42b2c'];
    let yData = params.map(e => (e.deviceName))
    const inverterTenMinGraphic = (xAxisDate.length === 0) ? showNoData : hiddenNoData;
    const option = {
      graphic: inverterTenMinGraphic,
      title: {
        text: '时序图',
        x: 'left',
        textStyle: {
          fontSize: 14
        }
      },
      color: color,
      legend: {
        show: true,
        right: '10%',
        top: '10%',
        width: '80%',
        bottom: '80%',
        itemWidth: 14,
        itemHeight: 6,
        textStyle: {
          color: lineColor,
          fontSize: 12,
        }
      },
      grid: {
        // right: '10%',
        height: '190px',
      },
      tooltip: {
        trigger: 'axis',
        enterable: true,
        show: true,
        formatter: (params) => {

          const windSpeed = params.map((e, i) => {
            return (`<div class=${styles.lineStyle}> ${e.marker}${e.seriesName}风速: ${dataFormat(e.value, '--', 2)}</div>`)
          })

          return `<div class=${styles.formatStyle}>
                <div class=${styles.topStyle}>
                  <div>${params[0].name}</div>
                </div>
                <div  style='background:#dfdfdf;height:1px;
                width:100%;' ></div>
                ${windSpeed}
              </div>`
        },
        backgroundColor: '#fff',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: lineColor,
          }
        },
        backgroundColor: '#fff',
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
      },
      xAxis: {
        type: 'category',
        data: xAxisDate,
        boundaryGap: false,
        nameTextStyle: {
          color: lineColor,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#dfdfdf',
          },
        },
        axisLabel: {
          color: lineColor,
        },
        axisPointer: {
          label: {
            show: false,
          }
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '风速(m/s)',
          nameTextStyle: {
            color: lineColor,
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            color: lineColor,
          },
          axisTick: {
            show: false,
          },
        }
      ],
      series: params.map((e, i) => {
        let lineData = [];
        (e.sequenceChartData && e.sequenceChartData.length > 0) && e.sequenceChartData.forEach((item, i) => {
          lineData.push(item.windSpeed)
        }
        )
        return {
          name: `${e.deviceName}`,
          type: 'line',
          data: lineData,
        }
      }),
    };
    // if (xAxisDate && xAxisDate.length > 0) {
    //   option.dataZoom = [{
    //     show: true,
    //     type: 'slider',
    //     realtime: true,
    //     filterMode: 'filter',
    //     startValue: 0,
    //     endValue: 19,
    //     bottom: 20,
    //     // handleSize: '80%',

    //     handleIcon: 'none',
    //     backgroundColor: 'rgba(213,219,228,.8)',
    //     height: '20px',
    //     // zoomLock: true,
    //     handleStyle: {
    //       width: '16px',
    //       height: '16px',
    //       borderRadius: '100%',
    //       color: '#fff',
    //       shadowBlur: 3,
    //       shadowColor: 'rgba(0, 0, 0, 0.6)',
    //       shadowOffsetX: 2,
    //       shadowOffsetY: 2
    //     }
    //   },
    //   ]
    // }
  
    sequenceChart.setOption(option, 'notMerge');
    sequenceChart.resize();

  }
  render() {

    return (
      <div id="sequenceChart" className={styles.sequenceChart}></div>
    )
  }
}
export default (SequenceChart)
// if (params.length > 0) {
//   option.series = params.map((e, i) => {
//     let lineData = [];
//     (e.sequenceChartData && e.sequenceChartData.length > 0) && e.sequenceChartData.forEach((item, i) => {
//       lineData.push(item.windSpeed)
//     }
//     )
//     return {
//       name: `${e.deviceName}`,
//       type: 'line',
//       data: lineData,
//     }
//   })
// }