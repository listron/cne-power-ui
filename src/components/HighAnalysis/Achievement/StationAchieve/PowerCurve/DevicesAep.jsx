import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Select } from 'antd';
import { getPartsOption } from './curveBaseOption';
import styles from './curve.scss';
const { Option } = Select;

class DevicesAep extends Component {

  static propTypes = {
    curveTopStringify: PropTypes.string,
    curveDevicesAep: PropTypes.array,
    curveDevicesAepLoading: PropTypes.bool,
    changeStore: PropTypes.func,
    getCurveMonths: PropTypes.func,
    getCurveMonthAep: PropTypes.func,
    getCurveMonthPsd: PropTypes.func,
  }

  state = {
    sortName: 'deviceName', // windSpeed, aep;
  }

  componentDidMount(){
    const { curveDevicesAep = [] } = this.props;
    const { sortName } = this.state;
    curveDevicesAep.length > 0 && this.renderChart(curveDevicesAep, sortName);
  }

  componentWillReceiveProps(nextProps){
    const { curveDevicesAepLoading, curveDevicesAep } = nextProps;
    const { sortName } = this.state;
    const preLoading = this.props.curveDevicesAepLoading;
    if (preLoading && !curveDevicesAepLoading) { // 请求完毕
      this.renderChart(curveDevicesAep, sortName);
    } else if (!preLoading && curveDevicesAepLoading) { // 请求中
      this.setChartLoading();
    }
  }

  barColor = [
    ['#72c8ea', '#3e97d1'],
    ['#36c6ad', '#199475'],
    ['#ffb8c4', '#ff8291'],
    ['#df7789', '#bc4251'],
    ['#f2b75f', '#e08031'],
    ['#ffeecc', '#ffd99d'],
    ['#4c9de8', '#2564cc'],
    ['#058447', '#024d22'],
    ['#e024f2', '#bd10e0'],
  ]

  setChartLoading = () => {
    const aepChart = this.aepRef && echarts.getInstanceByDom(this.aepRef);
    aepChart && aepChart.showLoading();
  }

  sortDeviceAes = (data = [], sorter) => {
    return [...data].sort((a, b) => {
      if(sorter === 'deviceName') {
        return a[sorter] && b[sorter] && a[sorter].localeCompare(b[sorter]);
      }
      return b[sorter] - a[sorter];
    });
  }

  sortChart = (sortName) => {
    const { curveDevicesAep = [] } = this.props;
    this.renderChart(curveDevicesAep, sortName);
  }

  createSeires = (sortedAepData) => {
    const xData = [], aspData = [], speedData = [], modes = new Set();
    sortedAepData.forEach(e => {
      const { deviceName, windSpeed, aep, deviceModeName } = e || {};
      modes.add(deviceModeName);
      xData.push(deviceName);
      const colorIndex = [...modes].indexOf(deviceModeName);
      aspData.push({
        value: aep,
        name: deviceModeName,
        itemStyle: {
          color: new echarts.graphic.LinearGradient( 0, 0, 0, 1, [
            {offset: 0, color: this.barColor[colorIndex][0] },
            {offset: 1, color: this.barColor[colorIndex][1] },
          ]),
        },
      });
      speedData.push(windSpeed);
    });
    const series = [{
      type: 'bar',
      barWidth: '10px',
      data: aspData,
    }, {
      name: 'speed',
      type: 'line',
      data: speedData,
      yAxisIndex: 1,
      lineStyle: {
        normal: {
          color: '#00cdff',
          width: 2,
          shadowColor: 'rgba(0,0,0,0.20)',
          shadowBlur: 3,
          shadowOffsetY: 3,
        },
      },
    }];
    return { series, xData, modeArr: [...modes] };
  }

  deviceHandle = ({ seriesIndex }, sortedAepData, chart) => {
    const { deviceFullcode, deviceName } = sortedAepData[seriesIndex] || {};
    const { curveTopStringify } = this.props;
    const queryInfo = JSON.parse(curveTopStringify) || {};
    const param = {
      stationCodes: [queryInfo.searchCode],
      deviceFullcodes: [deviceFullcode],
      startTime: queryInfo.searchDates[0],
      endTime: queryInfo.searchDates[1],
    };
    this.props.changeStore({
      curveDeviceName: deviceName,
      curveDeviceFullcode: deviceFullcode,
    });
    this.props.getCurveMonths(param);
    this.props.getCurveMonthAep(param);
    this.props.getCurveMonthPsd(param);
  }

  renderChart = (curveDevicesAep, sortName) => {
    const aepChart = echarts.init(this.aepRef);
    const sortedAepData = this.sortDeviceAes(curveDevicesAep, sortName);
    const { series, xData } = this.createSeires(sortedAepData);
    const option = {
      grid: {
        top: 10,
        ...getPartsOption('grid'),
        bottom: 40,
      },
      xAxis: { ...getPartsOption('xAxis'), data: xData },
      yAxis: [
        { ...getPartsOption('yAxis'), name: 'AEP(万kWh)' },
        { ...getPartsOption('yAxis'), name: '风速(m/s)' },
      ],
      tooltip: {
        trigger: 'axis',
        padding: 0,
        formatter: (param) => {
          const { name, axisValue } = param && param[0] || {};
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>
              <span>${axisValue || ''}</span>
              <span class=${styles.modeName}>型号${name || ''}</span>
            </h3>
            <div class=${styles.info}>
              ${param.map((e, i) => (
                `<span class=${styles.eachItem}>
                  <span>${e.seriesIndex === 0 ? 'AEP' : '风速'}</span>
                  <span>${e.value}</span>
                </span>`
              )).join('')}
            </div>
          </section>`;
        },
      },
      series,
    };
    const endPosition = 30 / curveDevicesAep.length >= 1 ? 100 : 3000 / curveDevicesAep.length;
    curveDevicesAep.length > 0 && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      start: 0,
      end: endPosition,
      height: 20,
      bottom: 10,
    }, {
      type: 'inside',
      filterMode: 'empty',
      start: 0,
      end: endPosition,
    }]);
    aepChart.hideLoading();
    aepChart.setOption(option);
    aepChart.on('click', (param) => this.deviceHandle(param, sortedAepData, aepChart));
  }

  render() {
    const { sortName } = this.state;
    return (
      <section className={styles.aep}>
        <h3 className={styles.aepTop}>
          <span className={styles.aepText}>各机组AEP及平均风速</span>
          <span>
            <span className={styles.sorterText}>选择排序</span>
            <Select
              onChange={this.sortChart}
              style={{width: '200px'}}
              value={sortName}
            >
              <Option value="deviceName">风机名称</Option>
              <Option value="aep">AEP</Option>
              <Option value="windSpeed">风速</Option>
            </Select>
          </span>
        </h3>
        <div className={styles.aepChart} ref={(ref)=> {this.aepRef = ref;}} />
      </section>
    );
  }
}

export default DevicesAep;

