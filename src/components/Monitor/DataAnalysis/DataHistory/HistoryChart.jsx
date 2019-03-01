import React, { Component } from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './historyStyle.scss';
import { dataFormat } from '../../../../utils/utilFunc';

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
      top: 10 + 160 * i,
      height: 160,
      left: 90,
      right: 40
    }
    if (i === pointData.length - 1) { // 最后一个grid
      return {
        ...baseGridOption,
        bottom: 60 + Math.ceil(deviceInfo.length * pointData.length / 4) * 24
      }
    } else {
      return baseGridOption
    }
  })

  legendSeriesCreate = (pointData, deviceInfo) => { // 嵌套遍历生成相关的series 与legend;
    const series = [], legend = [];
    const deviceNum = deviceInfo.length || 0;
    const pointNum = pointData.length || 0;
    pointData.forEach((point, index) => {
      deviceInfo.forEach((device, deviceIndex) => {
        const mapNumber = index * deviceNum + deviceIndex; // 属于所有数据中的顺序
        const lengendName = `${point.pointName}${device.deviceName}`;
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
    // height: 160 * 测点数 + top(10) + bottom(60) + 24 * 数据指示条行数。
    const { queryParam } = this.props;
    const { deviceFullCode, devicePoint, timeInterval } = queryParam;
    const calcHeight = 160 * devicePoint.length + 70 + 24 * Math.ceil((deviceFullCode.length * devicePoint.length) / 4);
    const chartHeight = calcHeight > 300 ? calcHeight : 300; // 图表高度不小于300
    return (
      <section className={styles.historyChart}>
        <h4>
          <span className={styles.eachTitle} />
          <span className={styles.eachTitle}>各设备测点历史数据趋势图</span>
          <span className={styles.tipTitle}>数据为{timeInterval === 10 ? '平均值' : '瞬时值'}</span>
        </h4>
        <div className={styles.innerChart} id="dataHistoryChart" style={{ height: `${chartHeight}px`}} />
      </section>
      
    )
  }
}

export default HistoryChart;