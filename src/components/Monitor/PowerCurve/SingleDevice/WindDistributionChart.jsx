import React, { Component } from "react";
import PropTypes from "prop-types";
import echarts from 'echarts';
import styles from './singleDevice.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

class WindDistributionChart extends Component {
  static propTypes = {
    winddistributionchartData:PropTypes.array,
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    const theoryPowers=this.props.winddistributionchartData || [];
    const data =theoryPowers&&theoryPowers.sort(this.compare('windSpeedCenter'))
      this.drawChart(data)
  }
  componentWillReceiveProps(nextProps) {
    const theoryPowers = nextProps.winddistributionchartData || [];
    const data =theoryPowers&&theoryPowers.sort(this.compare('windSpeedCenter'))
    this.drawChart(data)
  }
  
  compare = (key) => {
    return (a, b) => {
      let val1 = +a[key];
      let val2 = +b[key];
      if (val1 < val2) { //正序
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  drawChart = (params) => {
    const windDistribution = echarts.init(document.getElementById('windDistribution'));
    const filterwindSpeed = [];
    (params&&params.length>0)&& params.forEach((e, i) => filterwindSpeed.push(e.windSpeedCenter));
    
    const filterpercent = [];
    (params&&params.length>0)&&params.forEach((e, i) => filterpercent.push(e.precent));
    
    const inverterTenMinGraphic = (filterwindSpeed.length === 0 && filterpercent.length === 0) ? showNoData : hiddenNoData;
    const lineColor = '#666';
    const option = {
      graphic: inverterTenMinGraphic,
      color: '#c7ceb2',
      title: {
        text: '风频分布',
        x: 'left',
        textStyle: {
          fontSize: 14
        }
      },
      legend: {
        data: ['频次占比'],
        right: '10%',
        top: '10%',
        width: '80%',
        itemWidth: 14,
        itemHeight: 6,
        textStyle: {
          color: lineColor,
          fontSize: 12,
        }
      },
      grid: {
        right: '10%',
        height: '170px',
      },
      tooltip: {
        trigger: 'item',
        enterable: true,
        show: true,
        formatter: (params) => {

          return `<div class=${styles.formatStyle}>
            <div class=${styles.topStyle}>
            <div>风速:${dataFormat(params.name,'--',2)}</div>
            </div>
            <div  style='background:#dfdfdf;height:1px;
            width:100%;' ></div>
            <div class=${styles.lineStyle}>频次占比: ${dataFormat(params.value,'--',2)}</div>
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
        name: '风速(m/s)',
        // type: 'category',
        // data: [5, 10, 15, 20, 25],
        data: params.map((e, i) => (e.windSpeedCenter)),

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
          name: '频次占比',
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
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#dfdfdf'],
              type: 'dashed',
            }
          },
        }
      ],
      // dataZoom:[{
      //     show: true,
      //     type: 'slider',
      //     realtime: true,
      //     filterMode: 'filter',
      //     startValue: 0,
      //     endValue: 19,
      //     bottom: 20,
      //     handleSize: '80%',
      //     handleIcon: 'none',
      //     backgroundColor: 'rgba(213,219,228,.8)',
      //     height: '20px',
      //     zoomLock: true,
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
      //   ],
      series: [{
        name: '频次占比',
        type: 'bar',
        barWidth: 10,
        data: filterpercent
        // data: params.map(e=>(e.percent))
      }],
    };
    windDistribution.setOption(option, 'notMerge');
    windDistribution.resize();

  }
  render() {
    return (
      <div id="windDistribution" className={styles.windDistribution}></div>
    )
  }
}
export default (WindDistributionChart)