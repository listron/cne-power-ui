import React, { Component } from 'react';
import echarts from 'echarts';
import styles from './powerCurve.scss';
import PropTypes from 'prop-types';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';



class PowerCurveChart extends Component {
  static propTypes = {
    PowerCurveChart: PropTypes.any,
    handelClose: PropTypes.func,

  }
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  componentDidMount() {
    this.drawChart(this.props.PowerCurveChart.theoryPowers || [])
  }


  componentWillReceiveProps(nextProps) {
    const theoryPowers = nextProps.PowerCurveChart.theoryPowers || [];
    const air = nextProps.air;
    this.drawChart(theoryPowers, air)
  }

  closeButton = () => {
    this.props.handelClose(false)
  }


  drawChart = (params, air) => {
    const inverterChart = echarts.init(document.getElementById('powerCurveChart'));
    let powerData = [], speedData = [];
    params.length > 0 && params.forEach(e => {
      powerData.push(e.power || '--');
      speedData.push(e.windSpeed);
    });

    const filterpower = params.filter(e => e.power);
    const filterWindSpeed = params.filter(e => e.speed);

    const inverterTenMinGraphic = (filterpower.length === 0 && filterWindSpeed.length === 0) ? showNoData : hiddenNoData;
    const lineColor = '#353535';
    let color = ['#199475'];
    const option = {
      graphic: inverterTenMinGraphic,
      color: color,
      legend: {
        top: 24,
        itemWidth: 24,
        itemHeight: 6,
        textStyle: {
          color: lineColor,
          fontSize: 12,
        }
      },
      grid: {
        top: 90,
        right: '20%',
      },
      tooltip: {
        trigger: 'axis',
        show: true,
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
        formatter: function (params) {
          let paramsItem = '';
          params.forEach((item, index) => {
            return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${item.color};vertical-align: 3px;margin-right: 3px;"> </span> ${'理论功率'} :${item.value === '0' || item.value || '--'}</div>`
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:150px;overflow:hidden;"> <span style="float: left">${'风速：'}${params[0].name} </span>
            </div>${paramsItem}`
        },
      },
      xAxis: {
        type: 'category',
        data: speedData,
        name: '风速(m/s)',
        nameTextStyle: {
          color: lineColor,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#d4d4d4',
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
          name: '功率(KW)',
          nameTextStyle: {
            color: lineColor,
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#d4d4d4',
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
      series: [
        {
          name: `理论功率 ( ${air} )`,
          type: 'line',
          label: {
            normal: {
              show: false
            }
          },
          yAxisIndex: 0,
          data: powerData,
        }
      ]
    };
    inverterChart.setOption(option);
    inverterChart.resize();
  }

  render() {
    const { PowerCurveChart } = this.props
    const { stationName, deviceModeName } = PowerCurveChart
    return (
      <div className={styles.powerCurveChartBox} >
        <div className={styles.top}>
          <div> {stationName} - {deviceModeName} </div>
          <span className="iconfont icon-close1" onClick={this.closeButton}></span>
        </div>
        <div id="powerCurveChart" className={styles.powerCurveChart}></div>
      </div>

    );
  }
}

export default PowerCurveChart;


