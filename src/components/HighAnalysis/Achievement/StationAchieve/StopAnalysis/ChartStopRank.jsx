import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Select, message } from 'antd';
import moment from 'moment';
import { getBaseGrid, getBaseYAxis, getBaseXAxis } from './chartBaseOption';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './stop.scss';
const { Option } = Select;

class ChartStopRank extends Component {

  static propTypes = {
    stopElecType: PropTypes.string,
    stopChartTime: PropTypes.string,
    stopChartTimeMode: PropTypes.string,
    stopTopStringify: PropTypes.string,
    stopHandleInfo: PropTypes.array,
    stopChartTypes: PropTypes.object,
    stopChartDevice: PropTypes.object,
    changeStore: PropTypes.func,
    stopRank: PropTypes.array,
    stopRankLoading: PropTypes.bool,
    getStopTrend: PropTypes.func,
    getStopTypes: PropTypes.func,
  }

  state = {
    sortType: 'deviceName',
    modeArr: [],
    zoomRange: [0, 100],
  }

  componentDidMount(){
    const { stopRank = [] } = this.props;
    const { sortType } = this.state;
    stopRank.length > 0 && this.renderChart(stopRank, sortType);
  }

  componentWillReceiveProps(nextProps){
    const { stopRankLoading, stopRank, stopChartDevice } = nextProps;
    const preLoading = this.props.stopRankLoading;
    const { sortType } = this.state;
    if (preLoading && !stopRankLoading) { // 请求完毕
      this.renderChart(stopRank, sortType, stopChartDevice);
    } else if (!preLoading && stopRankLoading) { // 请求中
      this.setChartLoading();
    }
  }

  sortChart = (value) => {
    const { stopRank, stopChartDevice } = this.props;
    this.setState({ sortType: value }, () => {
      this.renderChart(stopRank, value, stopChartDevice);
    });
  }

  sortRank = (rankList, sortType = 'deviceName') => {
    const sortedList = [...rankList].sort((a, b) => {
      if (sortType === 'deviceName') {
        return a[sortType] && b[sortType] && a[sortType].localeCompare(b[sortType]);
      }
      return b[sortType] - a[sortType];
    });
    return sortedList;
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
    const rankChart = this.rankRef && echarts.getInstanceByDom(this.rankRef);
    rankChart && rankChart.showLoading();
  }

  createSeries = (stopRank = [], stopChartDevice) => {
    const dataAxis = [];
    const countData = [];
    const hourData = [];
    const series = [];
    const modeSet = new Set();
    stopRank.forEach(e => {
      const { deviceModeName, deviceName } = e || {};
      dataAxis.push(deviceName);
      modeSet.add(deviceModeName);
    });
    const modeArr = [...modeSet];
    stopRank.forEach(e => {
      const { deviceModeName, stopCount, stopHour, deviceFullcode } = e || {};
      const colorIndex = modeArr.indexOf(deviceModeName);
      hourData.push({
        name: deviceModeName,
        value: stopHour,
        itemStyle: {
          color: new echarts.graphic.LinearGradient( 0, 0, 0, 1, [
            {offset: 0, color: this.barColor[colorIndex][0]},
            {offset: 1, color: this.barColor[colorIndex][1]},
          ]),
          opacity: (stopChartDevice && deviceFullcode !== stopChartDevice.deviceFullcode) ? 0.4 : 1,
        },
      });
      countData.push(stopCount);
    });
    series[0] = {
      type: 'bar',
      barWidth: '10px',
      data: hourData,
    };
    series[1] = {
      type: 'line',
      data: countData,
      yAxisIndex: 1,
      lineStyle: {
        normal: {
          color: '#f9b600',
          width: 2,
          shadowColor: 'rgba(0,0,0,0.20)',
          shadowBlur: 3,
          shadowOffsetY: 3,
        },
      },
    };
    this.setState({ modeArr });
    return { dataAxis, series };
  }

  chartHandle = ({dataIndex}, sortedStopRank, chart) => {
    const { stopHandleInfo } = this.props;
    const handleLength = stopHandleInfo.length;
    const deviceIndex = stopHandleInfo.indexOf('device');
    const lastCheck = stopHandleInfo[handleLength - 1];
    if (handleLength === 2 && deviceIndex === -1) { // 已选别的两个指标， 直接返回。
      return;
    }

    if (handleLength === 2 && deviceIndex === 0) { // 已选两级指标, 设备为第一级
      message.info( `请先取消${lastCheck === 'time' ? '时间' : '停机类型'}选择, 再选择设备` );
      return;
    }

    const { sortType } = this.state;
    const { stopElecType, stopChartDevice, stopChartTypes, stopTopStringify } = this.props;
    const selectedDevice = sortedStopRank[dataIndex] || {};
    const searchParam = JSON.parse(stopTopStringify) || {};
    const [startTime, endTime] = this.getTimeRange(searchParam.date);
    const cancelSelect = stopChartDevice && selectedDevice.deviceFullcode === stopChartDevice.deviceFullcode;
    const tmpDeviceResult = cancelSelect ? null : selectedDevice;

    const param = {
      stationCodes: [searchParam.code],
      deviceFullcodes: cancelSelect ? searchParam.device : [selectedDevice.deviceFullcode],
      startTime,
      endTime,
      parentFaultId: stopElecType,
    };
    this.setState({
      zoomRange: this.getZoomRange(chart),
    }, () => this.renderChart(sortedStopRank, sortType, tmpDeviceResult));
    const deviceBothEnd = handleLength === 2 && deviceIndex === 1; // 两级指标: 二级为设备
    const deviceAdd = handleLength === 1 && deviceIndex === -1; // 一级指标: 非设备
    if (deviceBothEnd || deviceAdd) { //  => 变两级指标, 请求受影响单图表。
      let tmpHandleInfo = [...stopHandleInfo];
      deviceAdd && tmpHandleInfo.push('device');
      cancelSelect && (tmpHandleInfo = tmpHandleInfo.filter(e => e!== 'device'));
      this.props.changeStore({
        stopChartDevice: tmpDeviceResult,
        stopHandleInfo: tmpHandleInfo,
      });
      stopHandleInfo[0] === 'time' ? this.props.getStopTypes({
        ...param,
      }) : this.props.getStopTrend({
        ...param,
        faultId: stopChartTypes.faultId,
      });
    }
    const queryBoth = (handleLength === 1 && deviceIndex === 0) || handleLength === 0;
    if (queryBoth) { // 选中一个一级指标: 设备 或者 未选中任何指标 => 请求两个图表数据。
      this.props.changeStore({
        stopChartDevice: tmpDeviceResult,
        stopHandleInfo: cancelSelect ? [] : ['device'],
      });
      this.props.getStopTypes({ ...param });
      this.props.getStopTrend({ ...param });
    }
  }

  getTimeRange = (date = []) => { // 根据两个时间取交集
    const { stopChartTime, stopChartTimeMode } = this.props;
    let [startTime, endTime] = date;
    if (stopChartTime) { // 已有时间选择。
      const recordStart = moment(stopChartTime).startOf(stopChartTimeMode);
      const recordEnd = moment(stopChartTime).endOf(stopChartTimeMode);
      startTime = moment.max(recordStart, moment(startTime)).format('YYYY-MM-DD');
      endTime = moment.min(recordEnd, moment(endTime)).format('YYYY-MM-DD');
    }
    return [startTime, endTime];
  }

  getZoomRange = (chartInstance = {}) => { // 获取实例的zoom起止位置。
    const { dataZoom = [] } = chartInstance.getOption && chartInstance.getOption() || {};
    const zoomInfo = dataZoom[0] || {};
    const { start = 0, end = 100 } = zoomInfo;
    return [start, end];
  }

  getTitle = () => {
    const titleTexts = [];
    const { stopChartTypes, stopChartTime, stopHandleInfo } = this.props;
    const baseText = {
      time: stopChartTime ? `${stopChartTime}-` : '',
      types: stopChartTypes ? `${stopChartTypes.faultName}-` : '',
    };
    stopHandleInfo.find((e, i) => {
      baseText[e] && titleTexts.push(baseText[e]);
      return e === 'device';
    });
    titleTexts.push('风机停机时长及次数');
    return titleTexts.join('');
  }

  renderChart = (stopRank = [], sortType, stopChartDevice) => {
    const { zoomRange } = this.state;
    const rankChart = echarts.init(this.rankRef);
    const sortedStopRank = this.sortRank(stopRank, sortType);
    const { dataAxis, series } = this.createSeries(sortedStopRank, stopChartDevice);
    const option = {
      grid: getBaseGrid(),
      xAxis: getBaseXAxis(dataAxis),
      yAxis: [
        getBaseYAxis('停机时长(h)'),
        getBaseYAxis('故障次数(次)'),
      ],
      tooltip: {
        trigger: 'axis',
        padding: 0,
        formatter: (param) => {
          const { name, axisValue } = param && param[0] || {};
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>
              <span>${axisValue}</span>
              <span class=${styles.modeName}>${name}</span>
            </h3>
            <div class=${styles.info}>
              ${param.map((e, i) => (
                `<span class=${styles.eachItem}>
                  <span>${i === 0 ? '停机时长' : '停机次数'}</span>
                  <span>${dataFormats(e.value, '--', 2, true)}</span>
                </span>`
              )).join('')}
            </div>
          </section>`;
        },
      },
      series,
    };
    // const endPosition = 30 / stopRank.length >= 1 ? 100 : 3000 / stopRank.length;
    stopRank.length > 0 && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      start: zoomRange[0],
      end: zoomRange[1],
      showDetail: false,
      bottom: 15,
      height: 20,
    }, {
      type: 'inside',
      filterMode: 'empty',
      start: zoomRange[0],
      end: zoomRange[1],
    }]);
    rankChart.hideLoading();
    rankChart.setOption(option);
    rankChart.off('click');
    rankChart.on('click', (param) => this.chartHandle(param, sortedStopRank, rankChart ));
  }

  render() {
    const { sortType, modeArr } = this.state;
    return (
      <div className={styles.stopRank}>
        <div className={styles.top}>
          <span className={styles.title}>{this.getTitle()}</span>
          <span className={styles.handle}>
            <span className={styles.eachHandle}>
              <span className={styles.text}>选择排序</span>
              <Select
                onChange={this.sortChart}
                style={{width: '150px'}}
                value={sortType}
              >
                <Option value="deviceName">风机名称</Option>
                <Option value="stopHour">停机时长</Option>
                <Option value="stopCount">停机次数</Option>
              </Select>
            </span>
          </span>
        </div>
        <div className={styles.modes}>
          {modeArr.map((e, i) => (
            <span key={e} className={styles.eachMode}>
              <span className={styles.rect} style={{
                backgroundImage: `linear-gradient(-180deg, ${this.barColor[i][0]} 0%, ${this.barColor[i][1]} 100%)`,
                }} />
              <span className={styles.modeText}>{e}</span>
            </span>
          ))}
          <span className={styles.eachMode}>
            <span className={styles.line} />
            <span className={styles.modeText}>停机次数</span>
          </span>
        </div>
        <div className={styles.chart} ref={(ref)=> {this.rankRef = ref;}} />
      </div>
    );
  }
}

export default ChartStopRank;

