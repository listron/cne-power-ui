import React, { Component } from "react";
import PropTypes from "prop-types";
import echarts from 'echarts';
import styles from './singleDevice.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';


class PowerSpeedChart extends Component {
  static propTypes = {
    chartData:PropTypes.array,
    chartId:PropTypes.string,

  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    this.drawChart((this.props.chartData || []))
  }
  componentWillReceiveProps(nextProps) {
    const theoryPowers = nextProps.chartData || [];
    this.drawChart(theoryPowers)
  }
  getYaxisName = (title) => {
    let result = " ";
    switch (title) {
      case "powerSpeedChart":
        result = ["功率&转速", "功率(kW)", "转速(rpm)"];
        break;
      case "pitchange":
        result = ["桨距角&风速", "桨距角(°)", "风速(m/s)"];
        break;
      default:
        result = " ";
    }
    return result;
  };
  drawChart = (params, ) => {
    const { chartId } = this.props;
    const powercurveChart = echarts.init(document.getElementById(chartId));
    const filterDeviceName = params.map(e => e.deviceName);
    let filterData = []
    params.forEach((e, i) => {
      if (e.powerSpeedData) {
        e.powerSpeedData.forEach((item, i) => {
          item.power ? filterData.push(item.power) : null
        })
      }
      if (e.pitChangleSpeedData) {
        e.pitChangleSpeedData.forEach((item, i) => {
          item.pitchangle ? filterData.push(item.pitchangle) : null;
        })
      }
    })
    const inverterTenMinGraphic = (filterData.length === 0||filterDeviceName.length===0) ? showNoData : hiddenNoData;
    const lineColor = '#666';
    // let color = ['#199475'];
    const option = {
      graphic: inverterTenMinGraphic,
      // color: color,
      title: {
        text: this.getYaxisName(chartId)[0],
        x: 'left',
        textStyle: {
          fontSize: 14
        }
      },
      // legend: {
      //   left: '10%',
      //   // right:'30%',
      //   // top: 'bottom',
      //   width: '80%',
      //   bottom: '80%',
      //   itemWidth: 14,
      //   itemHeight: 6,
      //   x: 'center',
      //   y: 'bottom',
      //   padding: [100, 0],
      //   textStyle: {
      //     color: lineColor,
      //     fontSize: 12,
      //   }
      // },
      grid: {
        right: '10%',
        height: '200px',

      },
      tooltip: {
        trigger: 'item',
        enterable: true,
        show: true,
        formatter: (params) => {
          const info = params.data;
          return `<div class=${styles.formatStyle}>
            <div class=${styles.topStyle}>
              <div>${info[2]}</div>
            </div>
            <div  style='background:#dfdfdf;height:1px;
            width:100%;' ></div>
            <div class=${styles.lineStyle}>${chartId === "powerSpeedChart" ? "转速" : "风速"}: ${dataFormat(info[0])}</div>
            <div class=${styles.lineStyle}>${chartId === "powerSpeedChart" ? "功率" : "桨距角"}: ${dataFormat(info[1])}</div>
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
        type: 'value',

        name: this.getYaxisName(chartId)[2],
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
          name: this.getYaxisName(chartId)[1],
          type: 'value',
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
        if (e.powerSpeedData) {
          e.powerSpeedData.forEach((item, i) => {
            lineData.push([item.speed, item.power, item.time])
          })
        } else {
          e.pitChangleSpeedData.forEach((item, i) => {
            lineData.push([item.windSpeed, item.pitchangle, item.time])
            
          })
        }
        
        // 

        return {
          name: `${e.deviceName}`,
          type: 'scatter',
          data: lineData
        }
      })
    };
    powercurveChart.setOption(option, 'notMerge');
    powercurveChart.resize();
  }
  render() {
    const { chartId } = this.props;
    return (
      <div id={chartId} className={styles.powerSpeedChart}></div>
    )
  }
}
export default (PowerSpeedChart)