import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { getCurveBaseOption } from './curveBaseOption';
import styles from './curve.scss';

class DevicesChart extends Component {

  static propTypes = {
    curveDevices: PropTypes.object,
    curveDevicesLoading: PropTypes.bool,
    selectDevice: PropTypes.func,
  }

  componentDidMount(){
    const { curveDevices = {} } = this.props;
    const { actual = [] } = curveDevices;
    if (actual.length > 0) {
      this.renderChart(curveDevices);
    }
  }

  componentWillReceiveProps(nextProps){
    const { curveDevicesLoading, curveDevices } = nextProps;
    const preLoading = this.props.curveDevicesLoading;
    if (preLoading && !curveDevicesLoading) { // 请求完毕
      this.renderChart(curveDevices);
    } else if (!preLoading && curveDevicesLoading) { // 请求中
      this.setChartLoading();
    }
  }

  setChartLoading = () => {
    const devicesChart = this.devicesRef && echarts.getInstanceByDom(this.devicesRef);
    devicesChart && devicesChart.showLoading();
  }

  createSeires = (curveData = []) => curveData.map((e) => {
    const { devicePowerInfoVos = [], deviceName } = e || {};
    return {
      type: 'line',
      name: deviceName,
      data: devicePowerInfoVos.map((m = {}) => [m.windSpeed, m.power]),
    };
  })

  renderChart = (curveDevices) => {
    const devicesChart = echarts.init(this.devicesRef);
    const { actual = [], theory = [] } = curveDevices;
    const totalCurveData = actual.concat(theory.map(e => ({
      deviceName: '理论功率',
      ...e,
    })));
    const baseOption = getCurveBaseOption();
    baseOption.xAxis.type = 'value';
    baseOption.xAxis.name = '风速(m/s)';
    baseOption.yAxis.name = '功率(kW)';
    baseOption.xAxis.nameTextStyle.padding = [60, 0, 0, -60];
    const option = {
      ...baseOption,
      tooltip: {
        padding: 0,
        formatter: ({ seriesIndex, value = [] }) => {
          const lineInfo = totalCurveData[seriesIndex] || {};
          const { deviceName, modeName } = lineInfo;
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>
              <span>${deviceName || ''}</span>
            </h3>
            <div class=${styles.info}>
              <span class=${styles.eachItem}>
                <span>型号</span>
                <span class=${styles.modeName}>${modeName}</span>
              </span>
              <span class=${styles.eachItem}>
                <span>平均风速</span>
                <span>${value[0]}</span>
              </span>
              <span class=${styles.eachItem}>
                <span>平均功率</span>
                <span>${value[1]}</span>
              </span>
            </div>
          </section>`;
        },
      },
      series: this.createSeires(totalCurveData),
    };
    devicesChart.setOption(option);
    devicesChart.on('click', ({ seriesIndex }) => {
      const { deviceFullcode, deviceName } = totalCurveData[seriesIndex] || {};
      if (deviceFullcode) {
        this.props.selectDevice({ deviceFullcode, deviceName });
      }
    });
  }

  render() {
    return (
      <div className={styles.totalChart} ref={(ref)=> {this.devicesRef = ref;}} />
    );
  }
}

export default DevicesChart;

