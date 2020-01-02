import React, { Component } from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './pvHistoryStyle.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { Icon } from 'antd';

class PvHistoryChart extends Component {
  static propTypes = {
    chartLoading: PropTypes.bool,
    queryParam: PropTypes.object,
    chartTime: PropTypes.number,
    allHistory: PropTypes.object,
    historyType: PropTypes.string,
    changeHistoryStore: PropTypes.func,
  };

  componentDidMount() {
    const { allHistory, chartTime } = this.props;
    if (chartTime) {
      this.renderChart(allHistory);
    }
  }

  componentDidUpdate(prevProps) {
    const { allHistory, chartTime, chartLoading } = this.props;
    const preTime = prevProps.chartTime;
    const preLoading = prevProps.chartLoading;
    const preHistory = prevProps.allHistory;
    if (
      chartTime !== preTime // 数据更新
      || preLoading !== chartLoading // loading状态更新
      || (Object.keys(preHistory).length > 0 && Object.keys(allHistory).length === 0) // 手动清除数据。
    ) { // 数据重新请求后重绘。
      this.renderChart(allHistory);
    }
  }

  xAxisCreate = (pointData) => pointData.map((e, i) => ({ // 基于测点数据生成各grid的x轴。
    type: 'category',
    gridIndex: i,
    axisLine: {
      show: false,
      lineStyle: {
        color: '#353535',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: i === pointData.length - 1,
      lineStyle: { color: '#353535' },
    },
    splitLine: {
      lineStyle: {
        color: '#dfdfdf',
        type: 'dotted',
      },
    },
  }));

  yAxisCreate = (pointData) => pointData.map((e, i) => ({ // 基于pointData生成多y轴
    type: 'value',
    gridIndex: i,
    axisLine: {
      lineStyle: {
        color: '#dfdfdf',
      },
    },
    axisLabel: {
      color: '#353535',
      showMaxLabel: i === 0,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      lineStyle: {
        color: '#dfdfdf',
        type: 'dotted',
      },
    },
    name: `${e.pointName}\n${e.pointUnit ? `(${e.pointUnit})` : ''}`,
    nameLocation: 'middle',
    nameGap: 72,
    nameTextStyle: {
      color: '#353535',
    },
  }));

  gridCreate = (pointData, deviceInfo) => pointData.map((e, i) => { // 基于数据生成各grid. grid固定高160
    const baseGridOption = {
      top: 10 + 160 * i,
      height: 160,
      left: 108,
      right: 40,
      show: true,
      borderColor: '#eee',
      backgroundColor: i % 2 === 1 ? '#eee' : 'transparent',
    };
    if (i === pointData.length - 1) { // 最后一个grid
      return {
        ...baseGridOption,
        bottom: 60 + Math.ceil(deviceInfo.length * pointData.length / 4) * 24,
      };
    }
    return baseGridOption;

  });

  legendSeriesCreate = (pointData, deviceInfo) => { // 嵌套遍历生成相关的series 与legend;
    const series = [], legend = [];
    const deviceNum = deviceInfo.length >= 2 ? deviceInfo.length - 1 : (deviceInfo.length || 0);
    const pointNum = pointData.length || 0;
    const weatherStationPoint = []; // 气象站的测点
    const otherPoints = []; // 除气象站外其他测点

    pointData.forEach((point, index) => {
      const pointDeciceName = Object.keys(point.pointInfo).toString();
      const strIndex = pointDeciceName.indexOf('M', 0);
      const weatherStationId = pointDeciceName.substr(strIndex + 1, 3); // 截取出气象站的deviceCode
      if (weatherStationId === '203') {
        weatherStationPoint.push(point);
      }else{
        otherPoints.push(point);
      }
    });

    otherPoints.forEach((point, index) => {
      const pointDeciceName = Object.keys(point.pointInfo);
        deviceInfo.forEach((device, deviceIndex) => {
          if (pointDeciceName.includes(device.deviceCode)) {
            const mapNumber = index * deviceNum + deviceIndex; // 属于其他数据中的顺序
            const lengendName = `${point.pointName}-${device.deviceName}`;
            legend.push({
              top: 72 + 160 * pointNum + 24 * parseInt(mapNumber / 4, 0),
              left: `${4 + (mapNumber % 4) * 23}%`,
              textStyle: {
                fontSize: 12,
                color: '#353535',
              },
              data: [lengendName],
            });
            series.push({
              name: lengendName,
              xAxisIndex: index,
              yAxisIndex: index,
              type: 'line',
              symbol: 'circle',
              showSymbol: false,
              lineStyle: {
                width: 3,
              },
              data: point.pointInfo[device.deviceCode] || [],
            });
          }
        });
    });

    const preTotalNum = otherPoints.length * deviceNum;
    weatherStationPoint.forEach((weather, index) => {
      const pointDeciceName = Object.keys(weather.pointInfo);
      deviceInfo.forEach((device, deviceIndex) => {
        if (pointDeciceName.includes(device.deviceCode)) {
          const mapNumber = preTotalNum + index; // 属于气象站数据中的顺序
          const lengendName = `${weather.pointName}-${device.deviceName}`;
          legend.push({
            top: 72 + 160 * pointNum + 24 * parseInt(mapNumber / 4, 0),
            left: `${4 + (mapNumber % 4) * 23}%`,
            textStyle: {
              fontSize: 12,
              color: '#353535',
            },
            data: [lengendName],
          });
          series.push({
            name: lengendName,
            xAxisIndex: preTotalNum + index,
            yAxisIndex: preTotalNum + index,
            type: 'line',
            symbol: 'circle',
            showSymbol: false,
            lineStyle: {
              width: 3,
            },
            data: weather.pointInfo[device.deviceCode] || [],
          });
        }
      });
    });
    otherPoints.push(...weatherStationPoint);

    return { series, legend };
  };

  showChart = () => {
    this.selectHistoryType('chart');
  };

  showList = () => {
    this.selectHistoryType('list');
  };

  selectHistoryType = (historyType) => { // 切换图表展示类型 'chart'图 / 'list'表格
    const { changeHistoryStore } = this.props;
    changeHistoryStore({ historyType });
  };

  renderChart = (allHistory) => {
    const { chartLoading } = this.props;
    const chartDOM = document.getElementById('dataHistoryChart');
    if (!chartDOM) {
      return;
    }
    echarts.dispose(chartDOM); // 重绘图形前需销毁实例。否则重绘失败。
    const historyChart = echarts.init(chartDOM);
    if (chartLoading) { // loading态控制。
      historyChart.showLoading();
      return;
    }
    historyChart.hideLoading();

    if (Object.keys(allHistory).length === 0) { // 空数据销毁后，不进行处理
      return;
    }
    const { pointTime = [], deviceInfo = [], pointData = [] } = allHistory;
    const xAxisData = pointTime.map(e => moment(e).format('YYYY-MM-DD HH:mm:ss'));
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
          );
        },
      },
      axisPointer: {
        link: { xAxisIndex: 'all' },
        type: 'line',
        label: {
          backgroundColor: '#6a7985',
        },
      },
      grid: this.gridCreate(pointData, deviceInfo),
      xAxis: this.xAxisCreate(pointData).map(e => ({ ...e, data: xAxisData })),
      yAxis: this.yAxisCreate(pointData),
      ...this.legendSeriesCreate(pointData, deviceInfo),
    };
    if (pointTime.length > 0) { // 有数据时，展示数据筛选条
      option.dataZoom = [{
        type: 'slider',
        start: 0,
        end: 100,
        top: 160 * pointData.length + 34,
        left: 150,
        right: 150,
        filterMode: 'empty',
        xAxisIndex: pointData.map((e, i) => i),
      }, {
        type: 'inside',
        orient: 'horizontal',
        filterMode: 'empty',
        xAxisIndex: pointData.map((e, i) => i),
      }];
    }
    historyChart.setOption(option);
  };

  render() {
    // height: 160 * 测点数 + top(10) + bottom(80) + 24 * 数据指示条行数。
    const { queryParam, historyType, chartTime, allHistory } = this.props;
    const { pointData = [] } = allHistory;
    const { deviceFullCodes, devicePoints } = queryParam;
    const calcHeight = 160 * devicePoints.length + 90 + 24 * Math.ceil((deviceFullCodes.length * devicePoints.length) / 4);
    const chartHeight = calcHeight > 300 ? calcHeight : 300; // 图表高度不小于300
    return (
      <section className={styles.historyChart}>
        <h4>
          <div className={styles.tabIcons}>
            <i onClick={this.showChart} className={historyType === 'chart' ? `${styles.active} iconfont icon-drawing` : `${styles.normal} iconfont icon-drawing`} />
            <i onClick={this.showList} className={historyType === 'list' ? `${styles.active} iconfont icon-table` : `${styles.normal} iconfont icon-table`} />
          </div>
          <span className={styles.eachTitle}>各设备测点历史数据趋势图</span>
          <span className={styles.tipTitle}>数据为瞬时值</span>

        </h4>
        {(chartTime) ? <div className={styles.innerChart} id="dataHistoryChart" style={(pointData && pointData.length > 0) ? {height: `${chartHeight}px` } : {height: '0px' }} /> :
          <div className={styles.nodata}>
            <img width="223" height="164" src="/img/nodata.png" />
          </div>}
      </section>

    );
  }
}

export default PvHistoryChart;
