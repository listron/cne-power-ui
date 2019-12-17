import React, { Component } from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import styles from './realtimeStyle.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import moment from 'moment';

class RealtimeChart extends Component {
  static propTypes = {
    chartLoading: PropTypes.bool,
    chartTimeMoment: PropTypes.object,
    timeInterval: PropTypes.number,
    dataTime: PropTypes.string,
    queryParam: PropTypes.object,
    chartRealtime: PropTypes.object,
  }

  constructor(props){
    super(props);
    this.state = {
      datazoomStart: 0,
      datazoomEnd: 0,
    }
  }

  componentDidUpdate(prevProps) {
    const { chartRealtime, dataTime, queryParam = {}, chartLoading, timeInterval } = this.props;
    const { devicePoints = [] } = queryParam;
    const preTime = prevProps.dataTime;
    const preParam = prevProps.queryParam || {};
    const prePoints = preParam.devicePoints || [];
    const preLoading = prevProps.chartLoading;
    const emptyRealTime = Object.keys(chartRealtime).length === 0;
    const reRender = prePoints.length !== devicePoints.length || emptyRealTime;
    if (!preTime && dataTime) { // 第一次得到数据 => 计算默认的datazoom
      const maxValues = 30 * 60 / timeInterval; // 最大数据量。
      this.setState({
        datazoomStart: 20000 / maxValues ,
        datazoomEnd: 100,
      }, () => this.renderChart(chartRealtime, reRender))
    }else if (dataTime !== preTime || emptyRealTime || chartLoading !== preLoading) { // 数据重新请求后重绘。
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
        color: '#d4d4d4',
        type: 'dotted',
      } 
    },
  }));

  yAxisCreate = (pointInfo) => pointInfo.map((e, i) => ({ // 基于pointData生成多y轴
    type : 'value',
    gridIndex: i,
    axisLine: {
      lineStyle: {
        color: '#d4d4d4'
      },
    },
    axisLabel: {
      color: '#666',
      showMaxLabel: i === 0 ? true : false,
    },
    axisTick: {
      show: false
    },
    splitLine:{
      lineStyle: {
        color: '#d4d4d4',
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
      right: 40,
      show: true,
      borderColor: '#eee',
      backgroundColor: i % 2 === 1 ? '#eee' : 'transparent'
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
    const { datazoomStart, datazoomEnd } = this.state;
    const chartDOM = document.getElementById('dataRealtimeChart');
    
    if (!chartDOM) { return; }
    reRender && echarts.dispose(chartDOM); // 重绘图形前需销毁实例。否则重绘失败。 
    const realtimeChart = echarts.init(chartDOM);
    if (chartLoading) { // loading态控制。
      realtimeChart.showLoading();
      return;
    } else {
      realtimeChart.hideLoading();
    }
    if (Object.keys(chartRealtime).length === 0) {
      return;
    }
    const { pointTime = [], pointInfo = [] } = chartRealtime;
    const option = {
      tooltip: {
        trigger: 'axis',
        extraCssText: 'background-color: #fff; box-shadow:0 0 6px 0 rgba(0,0,0,0.3); border-radius:2px;',
        padding: 16,
        formatter: params => {
          return (
            `<div class=${styles.chartTool}>
              <div class=${styles.title}>${params[0].name}</div>
              ${params.map(e => `<div class=${styles.content}>
                <span class=${styles.itemStyle} style='color: ${e.color}'>○</span>
                <span class=${styles.text}>${e.seriesName}: </span>
                <span class=${styles.value}>${dataFormat(e.value, '--', 2)}</span>
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
      xAxis: this.xAxisCreate(pointInfo).map(e => ({
        ...e,
        data: pointTime.map(e => moment(e).format('HH:mm:ss')),
      })),
      yAxis: this.yAxisCreate(pointInfo),
      ...this.legendSeriesCreate(pointInfo)
    };
    pointTime.length > 0 && pointInfo.length > 0 && (option.dataZoom = [{ // 有数据时，展示数据筛选条 
        type: 'slider',
        start: datazoomStart,
        end: datazoomEnd,
        left: 80,
        right: 80,
        filterMode: 'empty',
        xAxisIndex: pointInfo.map((e, i)=> i),
      },{
        type: 'inside',
        orient: 'horizontal',
        filterMode: 'empty',
        xAxisIndex: pointInfo.map((e, i)=> i),
      }]);
    realtimeChart.on('datazoom',(datazoom) => {
      const { type, start, end, batch } = datazoom;
      if (type !== 'datazoom') {
        return;
      }
      if (start || end) { // 拖拽底部
        this.setState({
          datazoomStart: start,
          datazoomEnd: end,
        })
      } else if (batch && batch[0]) { // chart图中滚轮
        const zoomInfo = batch[0];
        this.setState({
          datazoomStart: zoomInfo.start,
          datazoomEnd: zoomInfo.end,
        })
      }
    })
    realtimeChart.setOption(option);
  }

  render() {
    // height: 160 * 测点数 + top(10) + bottom(60) + 24 * 设备数。
    // const { queryParam = {}, dataTime = null } = this.props;
    const { queryParam = {}, chartTimeMoment } = this.props;
    
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
            <span className={styles.currentTime}>
              {chartTimeMoment ? moment(chartTimeMoment).format('YYYY-MM-DD HH:mm:ss') : '暂无'}
            </span>
          </span>
        </h4>
        <div className={styles.innerChart} id="dataRealtimeChart" style={{ height: `${chartHeight}px`}} />
      </section>
    )
  }
}

export default RealtimeChart;