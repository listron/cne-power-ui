import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Select } from 'antd';
import { getCurveBaseOption } from './curveBaseOption';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './curve.scss';
const { Option } = Select;

class DevicesPsd extends Component {

  static propTypes = {
    curveTopStringify: PropTypes.string,
    curveDevicesPsd: PropTypes.array,
    curveDevicesPsdLoading: PropTypes.bool,
    changeStore: PropTypes.func,
    getCurveMonths: PropTypes.func,
    getCurveMonthAep: PropTypes.func,
    getCurveMonthPsd: PropTypes.func,
  }

  state = {
    modeArr: [],
    sortName: 'deviceName', // psd;
  }

  componentDidMount(){
    const { curveDevicesPsd = [] } = this.props;
    const { sortName } = this.state;
    curveDevicesPsd.length > 0 && this.renderChart(curveDevicesPsd, sortName);
  }

  componentWillReceiveProps(nextProps){
    const { curveDevicesPsdLoading, curveDevicesPsd } = nextProps;
    const { sortName } = this.state;
    const preLoading = this.props.curveDevicesPsdLoading;
    if (preLoading && !curveDevicesPsdLoading) { // 请求完毕
      this.renderChart(curveDevicesPsd, sortName);
    } else if (!preLoading && curveDevicesPsdLoading) { // 请求中
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
    const psdChart = this.psdRef && echarts.getInstanceByDom(this.psdRef);
    psdChart && psdChart.showLoading();
  }

  sortDevicePsd = (data = [], sorter) => {
    return [...data].sort((a, b) => {
      if(sorter === 'deviceName') {
        return a[sorter] && b[sorter] && a[sorter].localeCompare(b[sorter]);
      }
      return b[sorter] - a[sorter];
    });
  }

  sortChart = (sortName) => {
    const { curveDevicesPsd = [] } = this.props;
    this.setState({ sortName });
    this.renderChart(curveDevicesPsd, sortName);
  }

  createSeires = (sortedPsdData) => {
    const xData = [], psdData = [], modes = new Set();
    sortedPsdData.forEach(e => {
      const { deviceName, deviceModeName, psd } = e || {};
      modes.add(deviceModeName);
      xData.push(deviceName);
      const colorIndex = [...modes].indexOf(deviceModeName);
      psdData.push({
        value: dataFormats(psd) * 100,
        name: deviceModeName,
        itemStyle: {
          color: new echarts.graphic.LinearGradient( 0, 0, 0, 1, [
            {offset: 0, color: this.barColor[colorIndex][0] },
            {offset: 1, color: this.barColor[colorIndex][1] },
          ]),
        },
      });
    });
    const series = [{
      type: 'bar',
      barWidth: '10px',
      data: psdData,
    }];
    this.setState({ modeArr: [...modes] });
    return { series, xData };
  }

  deviceHandle = ({ seriesIndex }, sortedAepData, chart) => {
    const { deviceFullcode, deviceName } = sortedAepData[seriesIndex] || {};
    const { curveTopStringify } = this.props;
    let queryInfo = {};
    try {
      queryInfo = JSON.parse(curveTopStringify) || {};
    } catch (error) { null; }
    const param = {
      stationCodes: [queryInfo.code],
      deviceFullcodes: [deviceFullcode],
      startTime: queryInfo.date[0],
      endTime: queryInfo.date[1],
    };
    this.props.changeStore({
      curveDeviceName: deviceName,
      curveDeviceFullcode: deviceFullcode,
    });
    this.props.getCurveMonths(param);
    this.props.getCurveMonthAep(param);
    this.props.getCurveMonthPsd(param);
  }

  renderChart = (curveDevicesPsd, sortName) => {
    const psdChart = echarts.init(this.psdRef);
    const sortedPsdData = this.sortDevicePsd(curveDevicesPsd, sortName);
    const { series, xData } = this.createSeires(sortedPsdData);
    const baseOption = getCurveBaseOption();
    baseOption.xAxis.data = xData;
    baseOption.yAxis.name = 'PSD(%)';
    baseOption.grid.top = 30;
    baseOption.grid.bottom = 40;
    baseOption.grid.left = 35;
    const option = {
      ...baseOption,
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
                  <span>PSD</span>
                  <span>${dataFormats(e.value, '--', 2, true)}</span>
                </span>`
              )).join('')}
            </div>
          </section>`;
        },
      },
      series,
    };
    const endPosition = 30 / curveDevicesPsd.length >= 1 ? 100 : 3000 / curveDevicesPsd.length;
    curveDevicesPsd.length > 0 && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      start: 0,
      end: endPosition,
      showDetail: false,
      height: 20,
      bottom: 10,
    }, {
      type: 'inside',
      filterMode: 'empty',
      start: 0,
      end: endPosition,
    }]);
    psdChart.hideLoading();
    psdChart.setOption(option);
    psdChart.on('click', (param) => this.deviceHandle(param, sortedPsdData, psdChart));
  }

  render() {
    const { sortName, modeArr } = this.state;
    return (
      <section className={styles.aep}>
        <h3 className={styles.aepTop}>
          <span className={styles.aepText}>功率曲线聚合度PSD</span>
          <span>
            <span className={styles.sorterText}>选择排序</span>
            <Select
              onChange={this.sortChart}
              style={{width: '200px'}}
              value={sortName}
            >
              <Option value="deviceName">风机名称</Option>
              <Option value="psd">PSD</Option>
            </Select>
          </span>
        </h3>
        <div className={styles.modes}>
          {modeArr.map((e, i) => (
            <span key={e} className={styles.eachMode}>
              <span className={styles.rect} style={{
                backgroundImage: `linear-gradient(-180deg, ${this.barColor[i][0]} 0%, ${this.barColor[i][1]} 100%)`,
                }} />
              <span className={styles.modeText}>{e}</span>
            </span>
          ))}
        </div>
        <div className={styles.aepChart} ref={(ref)=> {this.psdRef = ref;}} />
      </section>
    );
  }
}

export default DevicesPsd;

