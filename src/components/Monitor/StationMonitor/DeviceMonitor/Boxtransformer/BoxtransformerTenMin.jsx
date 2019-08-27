import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import styles from '../eachDeviceMonitor.scss';
import { dataFormat } from '../../../../../utils/utilFunc';
import { chartsLoading, themeConfig, chartsNodata } from '../../../../../utils/darkConfig';

class BoxtransformerTenMin extends Component {
  static propTypes = {
    tenMinChartLoading: PropTypes.bool,
    tenMinUnix: PropTypes.number,
    deviceTenMin: PropTypes.array,
  }

  componentDidUpdate(prevProps) {
    const { tenMinUnix, tenMinChartLoading, theme } = this.props;
    const prevTenMinUnix = prevProps.tenMinUnix;
    if (tenMinUnix !== prevTenMinUnix || tenMinChartLoading || theme !== prevProps.theme) { // 获得数据
      this.renderChart();
    }
  }

  renderChart = () => {
    const { deviceTenMin, tenMinChartLoading, theme } = this.props;
    const echartBox = document.getElementById('boxtransformer_monitor_tenMin');
    let boxtransformerChart = echarts.init(echartBox, themeConfig[theme]);
    if (boxtransformerChart) {
      boxtransformerChart.dispose();
      boxtransformerChart = echarts.init(echartBox, themeConfig[theme]);
    }
    chartsLoading(boxtransformerChart, tenMinChartLoading, theme);
    const powerLineData = [], instantaneousData = [], xTime = [];
    deviceTenMin.length > 0 && deviceTenMin.forEach(e => {
      xTime.push(moment(e.utc).format('YYYY-MM-DD HH:mm:ss'));
      powerLineData.push(e.acPower);
      instantaneousData.push(e.instantaneous);
    });
    const filterStationPower = deviceTenMin.filter(e => e.acPower);
    const filterInstantaneous = deviceTenMin.filter(e => e.instantaneous);
    const boxtransformerTenMinGraphic = (filterStationPower.length === 0 && filterInstantaneous.length === 0);
    const graphic = !tenMinChartLoading && chartsNodata(!boxtransformerTenMinGraphic, theme);
    const option = {
      graphic: graphic,
      title: {
        text: '时序图',
        left: 60,
      },
      legend: {
        data: ['功率', '瞬时辐照'],
        top: 24,
        itemWidth: 24,
        itemHeight: 6,
        textStyle: {
          fontSize: 12,
        },
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        axisPointer: {
          type: 'cross',
        },
        formatter: (params) => {
          let paramsItem = '';
          params.forEach(item => {
            const color = item.color.colorStops && item.color.colorStops[1].color || item.color;
            paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color}"> </span> 
              ${item.seriesName} :  ${dataFormat(item.value, 2, '--')} 
            </div>`;
          });
          return (
            `<div class=${styles.tooltipBox}>
                  <div class=${styles.axisValue}><span>${params[0].name}</span></div>
                  <div class=${styles.tooltipContainer}> ${paramsItem}</div>
              </div>`
          );
        },
      },
      grid: {
        top: 95,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xTime,
        axisTick: {
          show: false,
        },
        axisPointer: {
          label: {
            show: false,
          },
        },
      },
      yAxis: [
        {
          name: '功率(kW)',
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        {
          name: '瞬时辐照(W/m²)',
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '功率',
          type: 'line',
          lineStyle: {
            type: 'solid',
            color: '#c57576',
            width: 1,
          },
          itemStyle: {
            opacity: 0,
          },
          areaStyle: {
            normal: {
              opacity: 0.2,
            },
          },
          label: {
            normal: {
              show: false,
            },
          },
          yAxisIndex: 0,
          data: powerLineData,
        },
        {
          name: '瞬时辐照',
          type: 'line',
          smooth: true,
          lineStyle: {
            type: 'dotted',
            color: '#199475',
            width: 1,
          },
          itemStyle: {
            color: '#199475',
            opacity: 0,
          },
          label: {
            normal: {
              show: false,
            },
          },
          yAxisIndex: 1,
          data: instantaneousData,
        },
      ],
    };
    boxtransformerChart.setOption(option);
    boxtransformerChart.resize();
  }

  render() {
    const { theme } = this.props;
    return (
      <div id="boxtransformer_monitor_tenMin" className={`${styles.boxtransformerTenMin} ${styles[theme]}`} style={{ height: '335px', marginTop: 10 }}></div>
    );
  }
}

export default BoxtransformerTenMin;
