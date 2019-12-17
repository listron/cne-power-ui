import React, {Component} from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from '../eachDeviceMonitor.scss';
import {chartsLoading, themeConfig, chartsNodata} from '../../../../../utils/darkConfig';
class ConfluenceTenMin extends Component {
  static propTypes = {
    tenMinChartLoading: PropTypes.bool,
    tenMinUnix: PropTypes.number,
    deviceTenMin: PropTypes.array,
    pointNameArr: PropTypes.array,
    theme: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      HLNames: ['HL001', 'HL002', 'HL003', 'HL004', 'HL005', 'HL006', 'HL007', 'HL008', 'HL009', 'HL010', 'HL011', 'HL012', 'HL013', 'HL014', 'HL015', 'HL016'],
    };
    this.HLColors = ['#e08031', '#f9b600', '#fbe6e3', '#999999', '#ceebe0', '#f8e71c', '#50e3c2', '#c7ceb2', '#7ed321', '#d0021b', '#024d22', '#bd10e0', '#8b572a', '#9013fe', '#45a0b3', '#000d34'];
  }

  componentDidUpdate(prevProps) {
    const {tenMinUnix, tenMinChartLoading, theme} = this.props;
    const prevTenMinUnix = prevProps.tenMinUnix;
    const prevPointNameArr = prevProps.pointNameArr;
    if (tenMinUnix !== prevTenMinUnix || tenMinChartLoading || theme !== prevProps.theme || prevPointNameArr.length >= 0) { // 获得数据
      this.renderChart();
    }
  }

  renderChart = () => {
    const {deviceTenMin, tenMinChartLoading, theme, pointNameArr} = this.props;
    const {HLNames} = this.state;
    // 重新赋值
    const echartBox = document.getElementById('confluence_monitor_tenMin');
    let confluenceChart = echarts.init(echartBox, themeConfig[theme]);
    if (confluenceChart) {
      confluenceChart.dispose();
      confluenceChart = echarts.init(echartBox, themeConfig[theme]);
    }
    chartsLoading(confluenceChart, tenMinChartLoading, theme);
    let HLData = [];
    const dispersionRatio = [], xTime = [], conflenceData = [];
    HLData.length = 16;
    HLData.fill([]);
    deviceTenMin.length > 0 && deviceTenMin.forEach((e, outerIndex) => {
      xTime.push(moment(e.utc).format('YYYY-MM-DD HH:mm:ss'));
      dispersionRatio.push(e.dispersionRatio);
      conflenceData.push(e.hLArr || []);
    });
    HLData = HLData.map((e, i) => {
      return conflenceData.map(inner => inner[i]);
    });
    // 遍历选中支路数组
    if(pointNameArr.length > 0) {
      this.HLColors = ['#999999', '#999999', '#999999', '#999999', '#999999', '#999999', '#999999', '#999999', '#999999', '#999999', '#999999', '#999999', '#999999', '#999999', '#999999', '#999999'];
      pointNameArr.forEach(item => {
        this.HLColors[item.pointIndex] = item.bgcColor;
      });
    }
    if(pointNameArr.length === 0) {
      this.HLColors = ['#e08031', '#f9b600', '#fbe6e3', '#999999', '#ceebe0', '#f8e71c', '#50e3c2', '#c7ceb2', '#7ed321', '#d0021b', '#024d22', '#bd10e0', '#8b572a', '#9013fe', '#45a0b3', '#000d34'];
    }
    // 选中的支路下标, 高亮选中的那条线
    const selectPointIndex = pointNameArr && pointNameArr.length > 0 ? pointNameArr[0].pointIndex : '';
    const HLNamesArr = HLNames.map((e, i) => {
      return {
        name: e,
        type: 'line',
        lineStyle: {
          type: 'solid',
          width: selectPointIndex === i ? 2 : 1,
        },
        label: {
          normal: {
            show: false,
          },
        },
        itemStyle: {
          opacity: 0,
        },
        z: selectPointIndex === i ? 2 : 1,
        yAxisIndex: 0,
        data: HLData[i],
      };
    });
    const filterDispersionRatio = deviceTenMin.filter(e => { //判定接收数据是否空值
      const hasDispersionRatio = e.dispersionRatio || e.dispersionRatio === 0; //有离散率数据
      const hasHLData = e.hLArr && e.hLArr.some(innerHL => innerHL || innerHL === 0);// 有组串数据
      return hasDispersionRatio || hasHLData;
    });
    const graphic = !tenMinChartLoading && chartsNodata(!(filterDispersionRatio.length === 0), theme);
    const option = {
      graphic: graphic,
      color: ['#3e97d1', ...this.HLColors],
      title: {
        text: '时序图',
        textStyle: {
          fontSize: 14,
        },
        left: 60,
      },
      legend: {
        data: ['离散率', ...HLNames],
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
        data: xTime,
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#d4d4d4',
          },
        },
      },
      yAxis: [
        {
          name: '电流(A)',
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        {
          name: '离散率(%)',
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
          data: dispersionRatio,
        },
        ...HLNamesArr,
      ],
    };
    deviceTenMin.length > 0 && (option.dataZoom = [
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
    confluenceChart.setOption(option);
    confluenceChart.resize();
  };

  render() {
    return (
      <div id="confluence_monitor_tenMin" style={{height: '335px', marginTop: '20px'}} />
    );
  }
}

export default ConfluenceTenMin;
