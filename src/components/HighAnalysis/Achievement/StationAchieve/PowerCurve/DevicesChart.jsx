import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { getCurveBaseOption } from './curveBaseOption';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './curve.scss';

class DevicesChart extends Component {

  static propTypes = {
    curveTopStringify: PropTypes.string,
    activeDevice: PropTypes.string,
    curveDeviceFullcode: PropTypes.string,
    curveDevices: PropTypes.object,
    curveDevicesLoading: PropTypes.bool,
    changeStore: PropTypes.func,
    getCurveMonths: PropTypes.func,
    getCurveMonthAep: PropTypes.func,
    getCurveMonthPsd: PropTypes.func,
  }

  componentDidMount(){
    const { curveDevices = {}, activeDevice } = this.props;
    const { actual = [] } = curveDevices;
    if (actual.length > 0) {
      this.renderChart(curveDevices, activeDevice);
    }
  }

  componentWillReceiveProps(nextProps){
    const { curveDevicesLoading, curveDevices, activeDevice } = nextProps;
    const preLoading = this.props.curveDevicesLoading;
    const getQueryData = preLoading && !curveDevicesLoading;
    const activeChange = activeDevice !== this.props.activeDevice;
    if (getQueryData || activeChange) { // 请求完毕
      this.renderChart(curveDevices, activeDevice);
    } else if (!preLoading && curveDevicesLoading) { // 请求中
      this.setChartLoading();
    }
  }

  setChartLoading = () => {
    const devicesChart = this.devicesRef && echarts.getInstanceByDom(this.devicesRef);
    devicesChart && devicesChart.showLoading();
  }

  createSeires = (curveData = [], activeDevice) => curveData.map((e) => {
    const { devicePowerInfoVos = [], deviceName, deviceFullcode } = e || {};
    const opacity = (activeDevice && activeDevice !== deviceFullcode && deviceName !== '理论功率') ? 0.4 : 1;
    const curveSeries = {
      type: 'line',
      smooth: true,
      name: deviceName,
      data: devicePowerInfoVos.map((m = {}) => [m.windSpeed, m.power]).sort((a, b) => a[0] - b[0]),
      itemStyle: { opacity },
      lineStyle: { opacity },
    };
    deviceName === '理论功率' && (curveSeries.lineStyle = {color: 'red'});
    return curveSeries;
  })

  deviceHandle = ({ seriesIndex }, totalCurveData, devicesChart) => {
    const { deviceFullcode, deviceName } = totalCurveData[seriesIndex] || {};
    if (deviceFullcode) {
      const { curveTopStringify, activeDevice, curveDeviceFullcode } = this.props;
      let queryInfo = {};
      try {
        queryInfo = JSON.parse(curveTopStringify) || {};
      } catch (error) { console.log(error); }
      const param = {
        stationCodes: [queryInfo.code],
        deviceFullcodes: [deviceFullcode],
        startTime: queryInfo.date[0],
        endTime: queryInfo.date[1],
      };
      const activeRenderCode = (activeDevice && activeDevice === deviceFullcode) ? null : deviceFullcode;
      this.props.changeStore({
        curveDeviceName: deviceName,
        curveDeviceFullcode: deviceFullcode,
        activeDevice: activeRenderCode,
      });
      (activeRenderCode && activeRenderCode !== curveDeviceFullcode) && ( // 改变设备时再请求
        this.props.getCurveMonths(param),
        this.props.getCurveMonthAep(param),
        this.props.getCurveMonthPsd(param)
      );
    }
  }

  renderChart = (curveDevices, activeDevice) => {
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
                <span>${dataFormats(value[0], '--', 2, true)}</span>
              </span>
              <span class=${styles.eachItem}>
                <span>平均功率</span>
                <span>${dataFormats(value[1], '--', 2, true)}</span>
              </span>
            </div>
          </section>`;
        },
      },
      series: this.createSeires(totalCurveData, activeDevice),
    };
    totalCurveData.length > 0 && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      start: 0,
      end: 100,
      showDetail: false,
      height: 20,
      bottom: 10,
    }, {
      type: 'inside',
      filterMode: 'empty',
      start: 0,
      end: 100,
    }]);
    devicesChart.hideLoading();
    devicesChart.clear();
    devicesChart.setOption(option);
    devicesChart.off('click');
    devicesChart.on('click', (param) => this.deviceHandle(param, totalCurveData, devicesChart));
  }

  render() {
    return (
      <section className={styles.leftCurve}>
        <h3>各机组功率曲线</h3>
        <div className={styles.totalChart} ref={(ref)=> {this.devicesRef = ref;}} />
      </section>
    );
  }
}

export default DevicesChart;

