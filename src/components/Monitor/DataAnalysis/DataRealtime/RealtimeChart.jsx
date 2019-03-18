import React, { Component } from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import styles from './realtimeStyle.scss';
import { dataFormat } from '../../../../utils/utilFunc';

class RealtimeChart extends Component {
  static propTypes = {
    chartLoading: PropTypes.bool,
    dataTime: PropTypes.string,
    queryParam: PropTypes.object,
    chartRealtime: PropTypes.object,
  }

  componentDidUpdate(prevProps) {
    const { chartRealtime, dataTime, queryParam = {} } = this.props;
    const { devicePoints = [] } = queryParam;
    const preTime = prevProps.dataTime;
    const preParam = prevProps.queryParam || {};
    const prePoints = preParam.devicePoints || [];
    const emptyRealTime = Object.keys(chartRealtime).length === 0;
    if (dataTime !== preTime || emptyRealTime) { // 数据重新请求后重绘。
      const reRender = prePoints.length !== devicePoints.length || emptyRealTime;
      this.renderChart(chartRealtime, reRender);
    }
  }

  xAxisCreate = (pointInfo) => pointInfo.map((e, i) => ({ // 基于测点数据生成各grid的x轴。
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
      show: i === pointInfo.length - 1,
      lineStyle: { color: '#666' }
    },
    splitLine: {
      lineStyle: {
        color: '#dfdfdf',
        type: 'dotted',
      } 
    },
  }));

  yAxisCreate = (pointInfo) => pointInfo.map((e, i) => ({ // 基于pointData生成多y轴
    type : 'value',
    gridIndex: i,
    axisLine: {
      lineStyle: {
        color: '#dfdfdf'
      },
    },
    axisLabel: {
      color: '#666',
      showMinLabel: i === pointInfo.length - 1 ? true : false,
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
    name: `${e.pointName}\n${e.pointUnit ? `(${e.pointUnit})` : ''}`,
    nameLocation: 'middle',
    nameGap: 72,
    nameTextStyle: {
      color: '#666',
    }
  }))

  gridCreate = (pointInfo) => pointInfo.map((e, i) => { // 基于数据生成各grid. grid固定高160
    const baseGridOption = {
      top: 10 + 160 * i,
      height: 160,
      left: 108,
      right: 40
    }
    if (i === pointInfo.length - 1) { // 最后一个grid
      return {
        ...baseGridOption,
        bottom: 60 + pointInfo.length * 24
      }
    } else {
      return baseGridOption
    }
  })

  legendSeriesCreate = (pointData) => { // 嵌套遍历生成相关的series 与legend;
    const series = [], legend = [];
    const pointNum = pointData.length;
    pointData.forEach((point, index) => {
      const { deviceInfo = [] } = point || {};
      const deviceNum = deviceInfo.length;
      deviceInfo.forEach((device, deviceIndex) => {
        const mapNumber = index * deviceNum + deviceIndex; // 属于所有数据中的顺序
        const lengendName = `${point.pointName}-${device.deviceName}`;
        const { pointValue = [] } = device || {};
        legend.push({
          top: 34 + 160 * pointNum + 24 * parseInt(mapNumber / 4),
          left: `${4 + (mapNumber % 4) * 23}%`,
          textStyle: {
            fontSize: 12,
            color: '#666',
          },
          data: [lengendName],
        });
        series.push({
          name: lengendName,
          xAxisIndex: index,
          yAxisIndex: index,
          type: 'line',
          data: pointValue
        });
      });
    })
    return { series, legend }
  }

  renderChart = (chartRealtime, reRender = false) => {
    const { chartLoading } = this.props;
    const chartDOM = document.getElementById('dataRealtimeChart');
    if (!chartDOM) { return; }
    reRender && echarts.dispose(chartDOM); // 重绘图形前需销毁实例。否则重绘失败。
    if (Object.keys(chartRealtime).length === 0) {
      return;
    }
    const realtimeChart = echarts.init(chartDOM);
    if (chartLoading) { // loading态控制。
      realtimeChart.showLoading();
    } else {
      realtimeChart.hideLoading();
    }
    const { pointTime = [], pointInfo = [] } = chartRealtime;
    const option = {
      tooltip: {
        trigger: 'axis',
        extraCssText: 'background-color: #fff; box-shadow:0 0 6px 0 rgba(0,0,0,0.3); border-radius:4px;',
        padding: 16,
        formatter: params => {
          return (
            `<div class=${styles.chartTool}>
              <div class=${styles.title}>${params[0].name}</div>
              ${params.map(e => `<div class=${styles.content}>
                <span class=${styles.itemStyle} style='color: ${e.color}'>○</span>
                <span class=${styles.text}>${e.seriesName}: </span>
                <span class=${styles.value}>${dataFormat(e.value)}</span>
              </div>`).join('')}
            </div>`
          )
        }
      },
      axisPointer: {
        link: {xAxisIndex: 'all'},
        type: 'line',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      grid: this.gridCreate(pointInfo),
      xAxis: this.xAxisCreate(pointInfo).map(e => ({ ...e, data: pointTime })),
      yAxis: this.yAxisCreate(pointInfo),
      ...this.legendSeriesCreate(pointInfo)
    };
    if (pointTime.length > 0 && pointInfo.length > 0) { // 有数据时，展示数据筛选条
      option.dataZoom = [{
        type: 'slider',
        start: 0,
        end: 100,
        left: 150,
        right: 150,
        filterMode: 'empty',
        xAxisIndex: pointInfo.map((e, i)=> i),
      },{
        type: 'inside',
        orient: 'horizontal',
        filterMode: 'empty',
        xAxisIndex: pointInfo.map((e, i)=> i),
      }]
    }
    console.log(pointInfo)
    console.log(option)
    realtimeChart.setOption(option);
  }

  render() {
    // height: 160 * 测点数 + top(10) + bottom(60) + 24 * 设备数。
    const { queryParam = {}, dataTime = null } = this.props;
    const { deviceFullCodes = [], devicePoints = [] } = queryParam;
    const calcHeight = 160 * devicePoints.length + 70 + 24 * Math.ceil((deviceFullCodes.length * devicePoints.length) / 4);
    const chartHeight = calcHeight > 300 ? calcHeight : 300; // 图表高度不小于300
    return (
      <section className={styles.realtimeChart}>
        <h4>
          <span className={styles.eachTitle} />
          <span className={styles.eachTitle}>各设备测点实时数据检测</span>
          <span className={styles.tipTitle}>
            <span>刷新时间: </span>
            <span className={styles.currentTime}>{dataTime || '暂无'}</span>
          </span>
        </h4>
        <div className={styles.innerChart} id="dataRealtimeChart" style={{ height: `${chartHeight}px`}} />
      </section>
    )
  }
}

export default RealtimeChart;