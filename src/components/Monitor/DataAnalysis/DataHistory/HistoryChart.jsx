import React, { Component } from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './historyStyle.scss';

class HistoryChart extends Component {
  static propTypes = {
    queryParam: PropTypes.object,
    chartTime: PropTypes.number,
    allHistory: PropTypes.object,
  }

  componentDidMount() {
    const { allHistory, chartTime } = this.props;
    if (chartTime) {
      this.renderChart(allHistory);
    }
  }

  componentDidUpdate(prevProps) {
    const { allHistory, chartTime } = this.props;
    const preTime = prevProps.chartTime;
    if (chartTime !== preTime) { // 数据重新请求后重绘。
      this.renderChart(allHistory);
    }
  }

  xAxisCreate = (pointData) => pointData.map((e, i) => ({ // 基于测点数据生成各grid的x轴。
    type : 'category',
    gridIndex: i,
    axisLine: {
      lineStyle: {
          color: '#666'
      },
    },
    axisTick: { 
      show: false 
    },
    axisLabel: { 
      show: i === pointData.length - 1,
      lineStyle: { color: '#666' }
    },
    splitLine: { 
      lineStyle: {
        color: '#dfdfdf',
        type: 'dotted',
      } 
    },
  }));

  yAxisCreate = (pointData) => pointData.map((e, i) => ({ // 基于pointData生成多y轴
    type : 'value',
    gridIndex: i,
    axisLine: {
      lineStyle: {
        color: '#dfdfdf'
      },
    },
    axisLabel: {
      color: '#666',
    },
    axisTick: {
      show: false
    },
    splitLine:{
      lineStyle: {
        color: '#dfdfdf',
        type: 'dotted',
      } 
    },
    name: `${e.pointName}\n(${e.pointUnit})`,
    nameLocation: 'middle',
    nameGap: 48,
    nameTextStyle: {
      color: '#666',
    }
  }))

  gridCreate = (pointData, deviceInfo) => pointData.map((e, i) => { // 基于数据生成各grid. grid固定高160
    const baseGridOption = {
      top: 70 + 160 * i,
      height: 160,
      left: 90,
      right: 40
    }
    if (i === pointData.length - 1) { // 最后一个grid
      return {
        ...baseGridOption,
        bottom: 60 + deviceInfo.length * 24
      }
    } else {
      return baseGridOption
    }
    
  })

  legendSeriesCreate = (pointData, deviceInfo) => { // 嵌套遍历生成相关的series 与legend;
    const series = [], legend = [];
    pointData.forEach((point, index) => {
      let eachLegend = [];
      deviceInfo.forEach((device, deviceIndex) => {
        const lengendName = `${device.deviceName}${point.pointName}`;
        eachLegend.push(lengendName);
        if (!legend[deviceIndex]) {
          legend[deviceIndex] = {
            bottom: 24 + (deviceInfo.length - 1 - deviceIndex) * 24,
            textStyle:{
              color: '#666',
            },
            data: [lengendName]
          }
        } else {
          legend[deviceIndex].data.push(lengendName)
        }
        series.push({
          name: lengendName,
          xAxisIndex: index,
          yAxisIndex: index,
          type: 'line',
          data: point.pointInfo[deviceIndex]
        });
      });
    })
    return { series, legend }
  }

  renderChart = (allHistory) => {
    const chartDOM = document.getElementById('dataHistoryChart');
    if (!chartDOM) { return; }
    echarts.dispose(chartDOM); // 重绘图形前需销毁实例。否则重绘失败。
    const historyChart = echarts.init(chartDOM);
    const { pointTime, deviceInfo, pointData } = allHistory;
    const xAxisData = pointTime.map(e => moment(e).format('YYYY-MM-DD HH:mm:ss'));
    const option = {
      tooltip: { trigger: 'axis', },
      axisPointer: {
        link: {xAxisIndex: 'all'},
        type: 'line',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      grid: this.gridCreate(pointData, deviceInfo),
      xAxis: this.xAxisCreate(pointData).map(e => ({ ...e, data: xAxisData })),
      yAxis: this.yAxisCreate(pointData),
      dataZoom:[{
        type: 'slider',
        start: 0,
        end: 100,
        bottom: 24 * deviceInfo.length + 24,
        left: 150,
        right: 150,
        filterMode: 'empty',
        xAxisIndex: pointData.map((e, i)=> i),
      },{
        type: 'inside',
        orient: 'horizontal',
        filterMode: 'empty',
        xAxisIndex: pointData.map((e, i)=> i),
      }],
      ...this.legendSeriesCreate(pointData, deviceInfo) // 
    };
    historyChart.setOption(option);
  }

  render() {
    // height: 150*测点数 + top(70) + bottom(60) + 24*设备数。
    const { queryParam } = this.props;
    const { deviceFullCode, devicePoint } = queryParam;
    const calcHeight = 150 * devicePoint.length + 130 + 24 * deviceFullCode.length;
    const chartHeight = calcHeight > 300 ? calcHeight : 300; // 图表高度不小于300
    return (
      <div id="dataHistoryChart" style={{ flex: '1', height: `${chartHeight}px`}} />
    )
  }
}

export default HistoryChart;