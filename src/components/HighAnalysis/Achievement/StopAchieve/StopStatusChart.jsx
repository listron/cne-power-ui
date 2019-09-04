
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import styles from './stopStatus.scss';

class StopStatusChart extends Component {

  static propTypes = {
    stopStatusList: PropTypes.array,
    stopStatusLoading: PropTypes.bool,
  }

  state = {
    stopTypes: [],
  }

  componentDidMount(){
    const { stopStatusList = [] } = this.props;
    stopStatusList.length > 0 && this.renderChart(stopStatusList);
  }

  // componentWillReceiveProps(nextProps){
  //   const { stopStatusLoading, stopStatusList } = nextProps;
  //   const preLoading = this.props.stopStatusLoading;
  //   if (preLoading && !stopStatusLoading) { // 请求完毕
  //     this.renderChart(stopStatusList);
  //   } else if (!preLoading && stopStatusLoading) { // 请求中
  //     this.setChartLoading();
  //   }
  // }

  componentDidUpdate(preProps){ // didupdate => 保证在dom高度动态更新后, 再基于新的dom进行渲染
    const { stopStatusLoading, stopStatusList } = this.props;
    const preLoading = preProps.stopStatusLoading;
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

  renderItem = (params, api) => { // param当前数据信息和坐标; api开发者调用方法集合
    const categoryIndex = api.value(0); // api.value取出dataItem值, api.value(0)取出当前dataItem第一个维度数值
    const start = api.coord([api.value(1), categoryIndex]); // api.coord进行坐标转换计算
    const end = api.coord([api.value(2), categoryIndex]);
    const height = api.size([0, 1])[1] * 0.6; // api.size得到坐标系上一段数值范围对应的长度 default: api.size([0, 1])[1] * 0.6;
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
    const preChart = echarts.getInstanceByDom(this.statusRef);
    preChart && preChart.dispose(); // 销毁，基于当前dom重新生成图表，保证自适应
    const statusChart = echarts.init(this.statusRef);
    const yAxisLabels = [], statusResult = [], fualtNameSet = new Set();
    lists.sort((b = {}, a = {}) => a.deviceName && a.deviceName.localeCompare(b.deviceName)).forEach((e, index) => { // 设备名排序
      const { deviceName, faultInfos = [] } = e || {};
      yAxisLabels.push(deviceName);
      faultInfos.forEach(m => {
        const {startTime, endTime, faultName, reason} = m || {};
        fualtNameSet.add(faultName);
        statusResult.push({
          name: faultName,
          value: [index, startTime, endTime, faultName, reason, deviceName],
          itemStyle: {
            color: this.stopColors[[...fualtNameSet].indexOf(faultName)],
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
        position: 'top',
        axisLine: {
          lineStyle: { color: '#666' },
        },
        axisLabel: {
          formatter: (value) => moment(value).format('YYYY.MM.DD'),
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
              <span>${value[5] || '--'}</span>
            </h3>
            <div class=${styles.info}>
              ${['开始时间', '结束时间', '停机类型', '停机原因'].map((e, index) => (`
              <span class=${styles.eachItem}>
                <span class=${styles.itemName}>${e}</span>
                <span class=${styles.itemValue}>${
                  index <= 1 ? moment(value[index + 1]).format('YYYY-MM-DD HH:mm:ss') : value[index + 1]
                }</span>
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
    // const endPosition = 30 / lists.length >= 1 ? 100 : 3000 / lists.length;
    lists.length > 0 && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      start: 0,
      end: 100,
      showDetail: false,
      bottom: 15,
      height: 20,
    }, {
      type: 'inside',
      filterMode: 'empty',
      start: 0,
      end: 100,
    }]);
    statusChart.hideLoading();
    this.setState({ stopTypes: [...fualtNameSet] });
    statusChart.clear();
    statusChart.setOption(option);
  }

  render() {
    const { stopTypes } = this.state;
    const { stopStatusList } = this.props;
    const height = stopStatusList.length * 20 + 240;
    return (
      <div className={styles.stopStatus}>
        <div className={styles.modes}>
          {stopTypes.map((e, i) => (
            <span key={e} className={styles.eachFault}>
              <span className={styles.rect} style={{
                backgroundImage: `linear-gradient(-180deg, ${this.stopColors[i]} 0%, ${this.stopColors[i]} 100%)`,
                }} />
              <span className={styles.modeText}>{e}</span>
            </span>
          ))}
        </div>
        <div className={styles.stautsChart} style={{height: `${height}px`}} ref={(ref)=> {this.statusRef = ref;}} />
      </div>
    );
  }
}

export default StopStatusChart;

