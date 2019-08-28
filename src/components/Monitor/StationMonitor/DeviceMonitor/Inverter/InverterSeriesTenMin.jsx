import React, { Component } from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from '../eachDeviceMonitor.scss';
import { chartsLoading, themeConfig, chartsNodata } from '../../../../../utils/darkConfig';


class InverterSeriesTenMin extends Component {
  static propTypes = {
    branchTenMinUnix: PropTypes.number,
    branchTenMin: PropTypes.object,
    theme: PropTypes.string,
  }

  state = {
    HLColors: ['#e08031', '#f9b600', '#fbe6e3', '#999999', '#ceebe0', '#f8e71c', '#50e3c2', '#c7ceb2', '#7ed321', '#d0021b', '#024d22', '#bd10e0', '#8b572a', '#9013fe', '#45a0b3', '#000d34'],
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate(prevProps) {
    const { branchTenMinUnix, theme } = this.props;
    const prevTenMinUnix = prevProps.branchTenMinUnix;
    if (branchTenMinUnix !== prevTenMinUnix || theme !== prevProps.theme) { // 获得数据
      this.renderChart();
    }
  }

  renderChart = () => {
    const { branchTenMin, theme } = this.props;
    const { HLColors } = this.state;
    const echartBox = document.getElementById('seriesInverter_monitor_tenMin');
    let seriesInverterChart = echarts.init(echartBox, themeConfig[theme]);
    if (seriesInverterChart) {
      seriesInverterChart.dispose();
      seriesInverterChart = echarts.init(echartBox, themeConfig[theme]);
    }
    const { index = [], time = [], rate = [] } = branchTenMin;
    const timeFormatArr = time.map(e => moment(e).format('YYYY-MM-DD HH:mm:ss'));
    const hlArr = index.filter(e => e > 0); // 取出正确的组串标识对应索引。
    const hlSeries = hlArr.map(e => {
      return {
        name: `HL#${`${e}`.padStart(2, '0')}`,
        type: 'line',
        lineStyle: {
          type: 'solid',
          width: 1,
        },
        label: {
          normal: {
            show: false,
          },
        },
        itemStyle: {
          opacity: 0,
        },
        yAxisIndex: 0,
        data: branchTenMin[e],
      };
    });
    const seriesInverterGraphic = chartsNodata(!(time.length === 0), theme);
    const option = {
      graphic: seriesInverterGraphic,
      color: ['#3e97d1', ...HLColors],
      legend: {
        data: ['离散率', ...hlArr.map(e => `HL#${`${e}`.padStart(2, '0')}`)],
        top: 24,
        itemWidth: 20,
        itemHeight: 4,
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          crossStyle: {
            width: 1,
            type: 'dotted',
          },
        },
        position: function (point, params, dom, rect, size) {
          // 固定在顶部
          return [point[0], '10%'];
        },
        formatter: (params) => {
          let paramsItem = '';
          params.forEach(item => {
            const color = item.color.colorStops && item.color.colorStops[1].color || item.color;
            paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color}"> </span> 
              ${item.seriesName} :  ${item.value || '--'} 
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
        data: timeFormatArr,
        axisTick: {
          show: false,
        },
      },
      yAxis: [
        {
          name: '电流(A)',
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisTick: {
            show: false,
          },
        }, {
          name: '离散率(%)',
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisTick: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '离散率',
          type: 'line',
          lineStyle: {
            type: 'dotted',
            width: 1,
          },
          label: {
            normal: {
              show: false,
            },
          },
          itemStyle: {
            opacity: 0,
          },
          yAxisIndex: 1,
          data: rate,
        },
        ...hlSeries,
      ],
    };
    time.length > 0 && (option.dataZoom = [
      {
        show: true,
        zoomLock: true,
        start: 90,
        end: 100,
      }, {
        type: 'inside',
        start: 90,
        zoomLock: true,
        end: 100,
      },
    ]);
    seriesInverterChart.setOption(option);
    seriesInverterChart.resize();
  }

  render() {
    return (
      <div id="seriesInverter_monitor_tenMin" style={{ height: '335px', marginTop: '20px' }} />
    );
  }
}

export default InverterSeriesTenMin;
