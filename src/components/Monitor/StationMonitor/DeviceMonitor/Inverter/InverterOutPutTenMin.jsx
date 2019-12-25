import React, { Component } from 'react';
import echarts from 'echarts';
import moment from 'moment';
import PropTypes from 'prop-types';
import styles from './inverter.scss';
import { dataFormat, chartsInterval } from '../../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';
import { chartsLoading, themeConfig, chartsNodata } from '../../../../../utils/darkConfig';


class InverterOutPutTenMin extends Component {
  static propTypes = {
    tenMinChartLoading: PropTypes.bool,
    tenMinUnix: PropTypes.number,
    deviceTenMin: PropTypes.array,
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate(prevProps) {
    const { tenMinUnix, tenMinChartLoading, theme = 'light' } = this.props;
    const prevTenMinUnix = prevProps.tenMinUnix;
    if (tenMinUnix !== prevTenMinUnix || tenMinChartLoading || theme !== prevProps.theme) { // 获得数据
      this.renderChart();
    }
  }

  renderChart = () => {
    const { deviceTenMin, tenMinChartLoading, theme } = this.props;
    const echartBox = document.getElementById('inverter_monitor_tenMin');
    let inverterChart = echarts.init(echartBox, themeConfig[theme]);
    if (inverterChart) {
      inverterChart.dispose();
      inverterChart = echarts.init(echartBox, themeConfig[theme]);
    }
    chartsLoading(inverterChart, tenMinChartLoading, theme);
    const acPowerData = [], dcPowerData = [], radiationLineData = [], xTime = [];
    deviceTenMin.length > 0 && deviceTenMin.forEach(e => {
      xTime.push(moment(e.utc).format('YYYY-MM-DD HH:mm'));
      acPowerData.push(+e.acPower); // 交流侧功率
      dcPowerData.push(+e.dcPower); // 直流侧功率
      radiationLineData.push(e.instantaneous);
    });
    const maxArr = [...new Set(dcPowerData), ...new Set(acPowerData)];
    const yAxisInterval = chartsInterval(maxArr, 5);
    const { max = null, interval } = yAxisInterval;

    const filterStationPower = deviceTenMin.filter(e => e.acPower);
    const filterInstantaneous = deviceTenMin.filter(e => e.dcPower);
    const inverterTenMinGraphic = (filterStationPower.length === 0 && filterInstantaneous.length === 0);
    const graphic = !tenMinChartLoading && chartsNodata(!inverterTenMinGraphic, theme);
    const colorGroup = ['#3e97d1', '#a42b2c', '#f9b600'];
    const option = {
      color: theme === 'light' ? ['#3e97d1', '#a42b2c', '#f9b600'] : ['#fd6e8f', '#f8b14e', '#00f8ff'],
      graphic: graphic,
      legend: {
        data: ['直流侧功率', '交流侧功率', '瞬时辐照'],
        top: 24,
        itemWidth: 24,
        itemHeight: 6,
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        axisPointer: {
          type: 'cross',
        },
        formatter: (param) => {
          if (!param || (param.length === 0)) {
            return '<div></div>';
          }
          const showTime = param[0] || {};
          return `<div class=${styles.tooltip}>
            <div class=${styles.header}>${showTime.name || ''}</div>
            ${param.map((e, i) => (
            `<div class=${styles.eachInfo}>
                <span class=${styles.extraTip} style="color: ${e.color}"></span>
                <span class=${styles.name}>${e.seriesName}</span>
                <span class=${styles.value}>${dataFormat(e.value, '--', 2)}</span>
              </div>`
          )).join('')}
          </div>`;
        },
        padding: 0,
      },
      calculable: true,
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
            show: true,
          },
          max: max,
          min: 0,
          // splitNumber: 5,
          interval: interval,
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
          name: '直流侧功率',
          type: 'line',
          yAxisIndex: 0,
          data: dcPowerData,
          showSymbol: false,
          z: 2,
        }, {
          name: '交流侧功率',
          type: 'line',
          yAxisIndex: 0,
          data: acPowerData,
          showSymbol: false,
          z: 2,
        }, {
          name: '瞬时辐照',
          type: 'line',
          yAxisIndex: 1,
          data: radiationLineData,
          showSymbol: false,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(249,182,0,0.4)',
              }, {
                offset: 1,
                color: 'rgba(249,182,0,0.1)',

              }]),
            },
          },
          z: 1,
        },
      ],
    };
    deviceTenMin.length > 0 && (option.dataZoom = [
      {
        show: true,
        // zoomLock: true,
        start: 90,
        end: 100,
        height: '16px',
      }, {
        type: 'inside',
        start: 90,
        // zoomLock: true,
        end: 100,
      },
    ]);
    inverterChart.setOption(option);
    inverterChart.resize();
  }

  render() {
    return (
      <div id="inverter_monitor_tenMin" style={{ height: '335px', width: '100%', flex: 1, marginTop: '10px' }}></div>
    );
  }
}

export default InverterOutPutTenMin;
