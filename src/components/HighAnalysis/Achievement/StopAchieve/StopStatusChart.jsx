
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import styles from './stopStatus.scss';

class StopStatusChart extends Component {

  static propTypes = {
    stopStatusList: PropTypes.array,
    stopStatusLoading: PropTypes.bool,
  }

  componentDidMount(){
    const { stopStatusList = [] } = this.props;
    stopStatusList.length > 0 && this.renderChart(stopStatusList);
  }

  componentWillReceiveProps(nextProps){
    const { stopStatusLoading, stopStatusList } = nextProps;
    const preLoading = this.props.stopStatusLoading;
    if (preLoading && !stopStatusLoading) { // 请求完毕
      this.renderChart(stopStatusList);
    } else if (!preLoading && stopStatusLoading) { // 请求中
      this.setChartLoading();
    }
  }

  stopColors = ['#a42b2c', '#ff6cee', '#f8e71c', '#2564cc', '#b8e986']

  setChartLoading = () => {
    const statusChart = this.statusRef && echarts.getInstanceByDom(this.statusRef);
    statusChart && statusChart.showLoading();
  }

  // const stopStatusList = [1, 2, 3, 4, 5, 6, 7].map(e => ({
  //   deviceFullcode: `${e}M${e * e}MM${e * 2}`,
  //   deviceName: `A${e}_FE${e * 2}`,
  //   faultInfos: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(m => ({
  //     startTime: moment('2018-01-01').add(m, 'month').format('YYYY-MM-DD'),
  //     endTime: moment('2018-01-01').add(m, 'month').add(e + parseInt(10 * Math.random(), 10), 'day').format('YYYY-MM-DD'),
  //     faultName: faultNames[m] || '风机故障',
  //     reason: `${e}故障的描述啊，详情啊${m}, hahhahaha ${m + e * m + m ** m}`,
  //   })),
  // }));

  renderItem = (params, api) => { // param当前数据信息和坐标; api开发者调用方法集合
    const categoryIndex = api.value(0); // api.value取出dataItem值, api.value(0)取出当前dataItem第一个维度数值
    const start = api.coord([api.value(1), categoryIndex]); // api.coord进行坐标转换计算
    const end = api.coord([api.value(2), categoryIndex]);
    const height = 20; // api.size得到坐标系上一段数值范围对应的长度 default: api.size([0, 1])[1] * 0.6;
    const rectShape = echarts.graphic.clipRectByRect({
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height,
    }, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height,
    });
    return rectShape && {
        type: 'rect',
        shape: rectShape,
        style: api.style(), // 得到series定义的样式信息
    };
  }

  renderChart = (lists) => {
    const statusChart = echarts.init(this.statusRef);
    const yAxisLabels = [], statusResult = [];
    lists.forEach((e, index) => {
      const { deviceName, faultInfos = [] } = e || {};
      yAxisLabels.push(deviceName);
      faultInfos.forEach(m => {
        const {startTime, endTime, faultName, reason} = m || {};
        statusResult.push({
          name: faultName,
          value: [index, startTime, endTime, faultName, reason],
          itemStyle: {
            normal: {
              color: this.stopColors[parseInt(Math.random() * 5, 10)],
              opacity: 0.8,
            },
          },
        });
      });
    });
    const option = {
      grid: {
        containLabel: true,
        left: 48,
        right: 48,
      },
      legend: {
        data: ['风机故障', '计划停机', '变电故障', '场外因素', '其他损失'].map(e => ({
          name: e,
        })),
      },
      xAxis: {
        type: 'time',
        axisLine: {
          lineStyle: { color: '#666' },
        },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      yAxis: {
        axisLine: {
          lineStyle: { color: '#666' },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        data: yAxisLabels,
      },
      tooltip: {
        padding: 0,
        formatter: (param) => {
          const { data } = param || {};
          const { value = [] } = data || {};
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>
              <span>${value[3] || '--'}</span>
            </h3>
            <div class=${styles.info}>
              ${['开始时间', '结束时间', '停机类型', '停机原因'].map((e, index) => (`
              <span class=${styles.eachItem}>
                <span class=${styles.itemName}>${e}</span>
                <span class=${styles.itemValue}>${value[index + 1]}</span>
              </span>
              `)).join('')}
            </div>
          </section>`;
        },
      },
      series: [{
        type: 'custom',
        renderItem: this.renderItem,
        encode: {
          x: [1, 2],
          y: 0,
        },
        data: statusResult,
      }],
    };
    const endPosition = 30 / lists.length >= 1 ? 100 : 3000 / lists.length;
    lists.length > 0 && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      start: 0,
      end: endPosition,
      showDetail: false,
      bottom: 15,
      height: 20,
    }, {
      type: 'inside',
      filterMode: 'empty',
      start: 0,
      end: endPosition,
    }]);
    statusChart.hideLoading();
    statusChart.setOption(option);
  }

  render() {
    const { stopStatusList } = this.props;
    const height = stopStatusList.length * 20 + 240;
    return (
      <div className={styles.stautsChart} style={{height: `${height}px`}} ref={(ref)=> {this.statusRef = ref;}} />
    );
  }
}

export default StopStatusChart;

