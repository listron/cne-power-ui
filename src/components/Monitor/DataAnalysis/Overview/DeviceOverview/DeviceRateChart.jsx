import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Icon } from 'antd';
import { dataFormats } from '@utils/utilFunc';
import { hiddenNoData, showNoData } from '@constants/echartsNoData';
import styles from './device.scss';

class DeviceRateChart extends PureComponent {
  static propTypes = {
    theme: PropTypes.string,
    devicesData: PropTypes.object,
    deveiceLoading: PropTypes.bool,
    deviceFilterName: PropTypes.string,
    changeOverviewStore: PropTypes.func,
  }

  state = {
    sortType: 'up', // up升序, down降序 默认设备名称升序排列
  }

  componentDidMount() {
    const { sortType } = this.state;
    const { devicesData, theme } = this.props;
    const { deviceData = [] } = devicesData;
    deviceData.length > 0 && this.drawChart(sortType, deviceData, theme);
  }

  componentWillReceiveProps(nextProps) {
    const { sortType } = this.state;
    const { devicesData, deveiceLoading, theme } = nextProps;
    const preLoading = this.props.deveiceLoading;
    if (preLoading && !deveiceLoading) { // 请求完毕
      const { deviceData = [] } = devicesData;
      this.drawChart(sortType, deviceData, theme);
    } else if (!preLoading && deveiceLoading) { // 请求中
      this.setChartLoading();
    }
  }

  chartColors = {
    light: {
      font: '#353535',
      axis: '#d4d4d4',
      bar: '#199475',
    },
    dark: {
      font: '#00f0ff',
      axis: '#3b55aa',
      bar: '#99cc32',
    },
  }

  setChartLoading = () => {
    const rateChart = this.rateRef && echarts.getInstanceByDom(this.rateRef);
    if (rateChart) {
      // this.timerStart = new Date();
      rateChart.clear();
      rateChart.showLoading();
      // setTimeout(() => this.chartLoading(), 200);
    }
  }

  // chartLoading = () => {
  //   const { deveiceLoading } = this.props;
  //   this.timerEnd = new Date();
  //   console.log(this.timerEnd - this.timerStart);
  //   console.log(deveiceLoading)
  //   deveiceLoading && echarts.getInstanceByDom(this.rateRef).showLoading();
  // }

  upSorter = () => this.sortChart('up')

  downSorter = () => this.sortChart('down')

  sortChart = (value) => {
    const { sortType } = this.state;
    if (sortType === value) { // 相同不处理
      return;
    }
    const { devicesData, theme } = this.props;
    const { deviceData } = devicesData;
    // const sortResult = value === sortType ? null : value; // 连击取消排序, 否则正常排序
    this.setState({ sortType: value });
    this.drawChart(value, deviceData, theme);
  }

  drawChart = (sortType, deviceData, theme) => {
    const rateChart = echarts.init(this.rateRef);
    // const sortedData = sortType ? [...deviceData].sort((a, b) => {
    //   const sortSign = sortType === 'up' ? 1 : -1;
    //   return (a.completeRate - b.completeRate) * sortSign;
    // }) : deviceData;
    const sortedData = [...deviceData].sort((a, b) => {
      const sortSign = sortType === 'up' ? 1 : -1;
      return a.deviceSortName && a.deviceSortName.localeCompare(b.deviceSortName) * sortSign;
    });
    const dataAxis = [], rateData = [];
    sortedData.forEach(e => {
      const { deviceName, completeRate } = e;
      dataAxis.push(deviceName);
      rateData.push(completeRate);
    });
    const { font = '#353535', axis = '#d4d4d4', bar = '#199475' } = this.chartColors[theme] || {};
    const option = {
      graphic: !deviceData || deviceData.length === 0 ? showNoData : hiddenNoData,
      grid: {
        top: 20,
        bottom: 50,
        left: 50,
        right: 0,
      },
      xAxis: {
        data: dataAxis,
        axisLabel: {
          textStyle: {
            color: font,
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: axis,
          },
        },
      },
      yAxis: {
        splitNumber: 2,
        axisLine: {
          lineStyle: {
            color: axis,
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: font,
          },
        },
        nameTextStyle: {
          color: font,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        padding: 0,
        formatter: (param = []) => {
          const { name, value } = param[0] || {};
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>${name}</h3>
            <div class=${styles.info}>
              <span class=${styles.round}></span>
              <span class=${styles.infoText}>设备数据完整率</span>
              <span class=${styles.rateValue}>${dataFormats(value, '--', 2, true)}%</span>
            </div>
          </section>`;
        },
      },
      series: [{
        type: 'bar',
        barWidth: '14px',
        // cursor: 'default',
        itemStyle: {
          color: bar,
        },
        data: rateData,
      }],
    };
    const showZoom = deviceData.length > 20;
    const zoomStart = 0;
    const zoomEnd = 20 / deviceData.length > 1 ? 100 : 2000 / deviceData.length;
    showZoom && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      start: zoomStart,
      end: zoomEnd,
      showDetail: false,
      bottom: 8,
      height: 16,
    }, {
      type: 'inside',
      filterMode: 'empty',
      start: zoomStart,
      end: zoomEnd,
    }]);
    rateChart.hideLoading();
    rateChart.setOption(option);
    rateChart.on('click', ({ name }) => {
      const { deviceFilterName } = this.props;
      let result = name;
      if (deviceFilterName === name) {
        result = null;
      }
      this.props.changeOverviewStore({ deviceFilterName: result });
    });
  }

  render() {
    const { sortType } = this.state;
    const { devicesData } = this.props;
    const { total } = devicesData;
    const activeIcon = '#199475';
    return (
      <div className={styles.deviceRate}>
        <div className={styles.total}>
          <div className={styles.num}>{dataFormats(total, '--', 2, true)}%</div>
          <div className={styles.text}>设备数据完整率平均值</div>
        </div>
        {/* <Spin spinning={true} size="large" delay={400} className={styles.spinStyle} /> */}
        <div className={styles.chart} ref={(ref) => { this.rateRef = ref; }} />
        <div className={styles.sorter}>
          <Icon type="caret-up" style={{ color: sortType === 'up' ? activeIcon : '#999' }} onClick={this.upSorter} />
          <Icon type="caret-down" style={{ color: sortType === 'down' ? activeIcon : '#999' }} onClick={this.downSorter} />
        </div>
      </div>
    );
  }
}

export default DeviceRateChart;
