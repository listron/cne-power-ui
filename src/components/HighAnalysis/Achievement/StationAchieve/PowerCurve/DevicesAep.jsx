import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Select, Tooltip } from 'antd';
import { dataFormats } from '../../../../../utils/utilFunc';
import { getPartsOption } from './curveBaseOption';
import styles from './curve.scss';
const { Option } = Select;

class DevicesAep extends Component {

  static propTypes = {
    curveTopStringify: PropTypes.string,
    curveDeviceFullcode: PropTypes.string,
    activeDevice: PropTypes.string,
    curveDevicesAep: PropTypes.array,
    curveDevicesAepLoading: PropTypes.bool,
    changeStore: PropTypes.func,
    getCurveMonths: PropTypes.func,
    getCurveMonthAep: PropTypes.func,
    getCurveMonthPsd: PropTypes.func,
  }

  state = {
    modeArr: [],
    sortName: 'deviceName', // windSpeed, aep;
  }

  componentDidMount(){
    const { curveDevicesAep = [], activeDevice } = this.props;
    const { sortName } = this.state;
    curveDevicesAep.length > 0 && this.renderChart(curveDevicesAep, sortName, activeDevice);
  }

  componentWillReceiveProps(nextProps){
    const { curveDevicesAepLoading, curveDevicesAep, activeDevice } = nextProps;
    const { sortName } = this.state;
    const preLoading = this.props.curveDevicesAepLoading;
    const getQueryData = preLoading && !curveDevicesAepLoading;
    const activeChange = activeDevice !== this.props.activeDevice;
    if (getQueryData || activeChange) { // 请求完毕
      this.renderChart(curveDevicesAep, sortName, activeDevice);
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
    this.setState({ sortName });
    this.renderChart(curveDevicesAep, sortName);
  }

  createSeires = (sortedAepData, activeDevice) => {
    const xData = [], aspData = [], speedData = [], modes = new Set();
    sortedAepData.forEach(e => {
      const { deviceName, windSpeed, aep, deviceModeName, deviceFullcode } = e || {};
      modes.add(deviceModeName);
      xData.push(deviceName);
      const colorIndex = [...modes].indexOf(deviceModeName);
      aspData.push({
        value: dataFormats(aep) / 10000,
        name: deviceModeName,
        itemStyle: {
          color: new echarts.graphic.LinearGradient( 0, 0, 0, 1, [
            {offset: 0, color: this.barColor[colorIndex][0] },
            {offset: 1, color: this.barColor[colorIndex][1] },
          ]),
          opacity: (activeDevice && activeDevice !== deviceFullcode) ? 0.4 : 1,
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
    this.setState({ modeArr: [...modes] });
    return { series, xData };
  }

  deviceHandle = ({ dataIndex }, sortedAepData, chart) => {
    const { deviceFullcode, deviceName } = sortedAepData[dataIndex] || {};
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

  renderChart = (curveDevicesAep, sortName, activeDevice) => {
    const aepChart = echarts.init(this.aepRef);
    const sortedAepData = this.sortDeviceAes(curveDevicesAep, sortName);
    const { series, xData } = this.createSeires(sortedAepData, activeDevice);
    const option = {
      grid: {
        top: 30,
        ...getPartsOption('grid'),
        left: 35,
        bottom: 40,
      },
      xAxis: {
        ...getPartsOption('xAxis'),
        data: xData,
      },
      yAxis: [
        { ...getPartsOption('yAxis'), name: 'AEP(万kWh)' },
        { ...getPartsOption('yAxis'), name: '风速(m/s)' },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
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
                  <span>${dataFormats(e.value, '--', 2, true)}</span>
                </span>`
              )).join('')}
            </div>
          </section>`;
        },
      },
      series,
    };
    // const endPosition = 30 / curveDevicesAep.length >= 1 ? 100 : 3000 / curveDevicesAep.length;
    curveDevicesAep.length > 0 && (option.dataZoom = [{
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
    aepChart.hideLoading();
    aepChart.setOption(option);
    aepChart.off('click');
    aepChart.on('click', (param) => this.deviceHandle(param, sortedAepData, aepChart));
  }

  render() {
    const { sortName, modeArr } = this.state;
    return (
      <section className={styles.aep}>
        <h3 className={styles.aepTop}>
          <span>
            <span className={styles.aepText}>各机组AEP及平均风速</span>
            <Tooltip title="AEP指利用拟合功率曲线估算的风电机组年理论发电量" placement="top">
              <span className={styles.curveTip}>i</span>
            </Tooltip>
          </span>
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
        <div className={styles.modes}>
          {modeArr.map((e, i) => (
            <span key={e} className={styles.eachMode}>
              <span className={styles.rect} style={{
                backgroundImage: `linear-gradient(-180deg, ${this.barColor[i][0]} 0%, ${this.barColor[i][1]} 100%)`,
                }} />
              <span className={styles.modeText}>{e} AEP</span>
            </span>
          ))}
          <span className={styles.eachMode}>
            <span className={styles.line} />
            <span className={styles.modeText}>风速</span>
          </span>
        </div>
        <div className={styles.aepChart} ref={(ref)=> {this.aepRef = ref;}} />
      </section>
    );
  }
}

export default DevicesAep;

