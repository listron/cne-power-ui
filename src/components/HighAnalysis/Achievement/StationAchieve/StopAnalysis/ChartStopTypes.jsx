import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import { Select, message } from 'antd';
import { dataFormats } from '../../../../../utils/utilFunc';
import { getBaseGrid, getBaseYAxis, getBaseXAxis } from './chartBaseOption';
import styles from './stop.scss';
const { Option } = Select;

class ChartStopTypes extends Component {

  static propTypes = {
    stopTopStringify: PropTypes.string,
    stopChartTime: PropTypes.string,
    stopChartTimeMode: PropTypes.string,
    stopTypes: PropTypes.array,
    stopHandleInfo: PropTypes.array,
    stopChartDevice: PropTypes.object,
    stopChartTypes: PropTypes.object,
    stopElecType: PropTypes.string,
    stopTypesLoading: PropTypes.bool,
    changeStore: PropTypes.func,
    getStopRank: PropTypes.func,
    getStopTrend: PropTypes.func,
  }

  state = {
    sortName: 'stopCount',
    zoomRange: [0, 100],
  }

  componentDidMount(){
    const { stopTypes, stopChartTypes } = this.props;
    const { sortName } = this.state;
    stopTypes.length > 0 && this.renderChart(stopTypes, sortName, stopChartTypes);
  }

  componentWillReceiveProps(nextProps){
    const { stopTypesLoading, stopTypes, stopChartTypes } = nextProps;
    const preLoading = this.props.stopTypesLoading;
    if (preLoading && !stopTypesLoading) { // 请求完毕
      const { sortName } = this.state;
      this.renderChart(stopTypes, sortName, stopChartTypes);
    } else if (!preLoading && stopTypesLoading) { // 请求中
      this.setChartLoading();
    }
  }

  barColor = [
    ['#e024f2', '#bd10e0'],
    ['#df7789', '#bc4251'],
    ['#f2b75f', '#e08031'],
  ]

  setChartLoading = () => {
    const typesChart = this.typesRef && echarts.getInstanceByDom(this.typesRef);
    typesChart && typesChart.showLoading();
  }

  sortChange = (sortName) => {
    const { stopTypes, stopChartTypes } = this.props;
    this.setState({ sortName }, () => this.renderChart(stopTypes, sortName, stopChartTypes));
  }

  sortChart = (stopTypes, sortName) => [...stopTypes].sort((a, b) => b[sortName] - a[sortName]);

  createBaseBar = (data, colors) => ({
    type: 'bar',
    barWidth: '10px',
    data,
    itemStyle: {
      color: new echarts.graphic.LinearGradient( 0, 0, 0, 1, [
        {offset: 0, color: colors[0]},
        {offset: 1, color: colors[1]},
      ]),
    },
  })

  createSeries = (sortedTypes = [], stopChartTypes) => {
    const dataAxis = [];
    const hourData = [];
    const genData = [];
    const countData = [];
    let series = [];
    sortedTypes.forEach(e => {
      const { faultId, faultName } = e;
      dataAxis.push(faultName);
      genData.push({
        value: dataFormats(e.stopLostGen) / 10000,
        itemStyle: {
          opacity: (stopChartTypes && faultId !== stopChartTypes.faultId) ? 0.4 : 1,
        },
      });
      hourData.push({
        value: e.stopHour,
        itemStyle: {
          opacity: (stopChartTypes && faultId !== stopChartTypes.faultId) ? 0.4 : 1,
        },
      });
      countData.push({
        value: e.stopCount,
        itemStyle: {
          opacity: (stopChartTypes && faultId !== stopChartTypes.faultId) ? 0.4 : 1,
        },
      });
    });
    series = [
      {
        ...this.createBaseBar(countData, this.barColor[0]),
        xAxisIndex: 0,
        yAxisIndex: 0,
      }, {
        ...this.createBaseBar(hourData, this.barColor[1]),
        xAxisIndex: 1,
        yAxisIndex: 1,
      }, {
        ...this.createBaseBar(genData, this.barColor[2]),
        xAxisIndex: 2,
        yAxisIndex: 2,
      },
    ];
    return { dataAxis, series };
  }

  chartHandle = ({ dataIndex }, sortedTypes, chart) => { // 'device', 'time', 'types'
    const { stopHandleInfo } = this.props;
    const handleLength = stopHandleInfo.length;
    const typesIndex = stopHandleInfo.indexOf('types');
    const lastCheck = stopHandleInfo[handleLength - 1];
    if (handleLength === 2 && typesIndex === -1) { // 已选别的两个指标， 直接返回。
      return;
    }

    if (handleLength === 2 && typesIndex === 0) { // 已选两级指标, 设备为第一级
      message.info( `请先取消${lastCheck === 'time' ? '时间' : '设备'}选择, 再选择停机类型` );
      return;
    }

    const { sortName } = this.state;
    const { stopElecType, stopChartTypes, stopChartDevice, stopTopStringify, stopChartTimeMode } = this.props;
    const curFaultInfo = sortedTypes[dataIndex] || {};
    let searchParam = {};
    try {
      searchParam = JSON.parse(stopTopStringify);
    } catch (error) { console.log(error); }
    const [startTime, endTime] = this.getTimeRange(searchParam.date);
    const cancelSelect = stopChartTypes && stopChartTypes.faultId === curFaultInfo.faultId;
    const tmpTypesResult = cancelSelect ? null : curFaultInfo;
    const param = {
      stationCodes: [searchParam.code],
      deviceFullcodes: stopChartDevice ? [stopChartDevice.deviceFullcode] : searchParam.device,
      startTime,
      endTime,
      parentFaultId: stopElecType,
      faultId: cancelSelect ? null : tmpTypesResult.faultId,
    };
    cancelSelect && (param.faultId = curFaultInfo.faultId);
    this.setState({
      zoomRange: this.getZoomRange(chart),
    }, () => this.renderChart(sortedTypes, sortName, tmpTypesResult));
    const typesBothEnd = handleLength === 2 && typesIndex === 1; // 两级指标: 二级为设备
    const typesAdd = handleLength === 1 && typesIndex === -1; // 一级指标: 非设备
    if (typesBothEnd || typesAdd) {
      let tmpHandleInfo = [...stopHandleInfo];
      typesAdd && tmpHandleInfo.push('types');
      cancelSelect && (tmpHandleInfo = tmpHandleInfo.filter(e => e!== 'types'));
      this.props.changeStore({
        stopChartTypes: tmpTypesResult,
        stopHandleInfo: tmpHandleInfo,
      });
      stopHandleInfo[0] === 'time' ? this.props.getStopRank({
        ...param,
      }) : this.props.getStopTrend({
        ...param,
        type: stopChartTimeMode,
      });
    }
    const queryBoth = (handleLength === 1 && typesIndex === 0) || handleLength === 0;
    if (queryBoth) { // 选中一个一级指标: 设备 或者 未选中任何指标 => 请求两个图表数据。
      this.props.changeStore({
        stopChartDevice: tmpTypesResult,
        stopHandleInfo: ['types'],
      });
      this.props.getStopRank({ ...param });
      this.props.getStopTrend({ ...param, type: stopChartTimeMode });
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
    const { stopChartTime, stopChartDevice, stopHandleInfo } = this.props;
    const baseText = {
      device: stopChartDevice ? `${stopChartDevice.deviceName}-` : '',
      time: stopChartTime ? `${stopChartTime}-` : '',
    };
    stopHandleInfo.find((e, i) => {
      baseText[e] && titleTexts.push(baseText[e]);
      return e === 'types';
    });
    titleTexts.push('各类停机次数、时长及损失电量');
    return titleTexts.join('');
  }

  renderChart = (stopTypes = [], sortName, stopChartTypes) => {
    const { zoomRange } = this.state;
    const typesChart = echarts.init(this.typesRef);
    const sortedTypes = this.sortChart(stopTypes, sortName);
    const { dataAxis, series } = this.createSeries(sortedTypes, stopChartTypes);
    const option = {
      grid: [
        { ...getBaseGrid(), top: 30, height: 85, containLabel: false, left: 40 },
        { ...getBaseGrid(), top: 155, height: 85, containLabel: false, left: 40 },
        { ...getBaseGrid(), top: 275, height: 85, containLabel: false, left: 40 },
      ],
      xAxis: [
        { ...getBaseXAxis(dataAxis), gridIndex: 0, axisLabel: { show: false } },
        { ...getBaseXAxis(dataAxis), gridIndex: 1, axisLabel: { show: false } },
        { ...getBaseXAxis(dataAxis), gridIndex: 2 },
      ],
      yAxis: [
        { ...getBaseYAxis('停机次数(次)'), gridIndex: 0, min: 0 },
        { ...getBaseYAxis('停机时长(h)'), gridIndex: 1, min: 0 },
        { ...getBaseYAxis('停机电量(万kWh)'), gridIndex: 2, min: 0 },
      ],
      axisPointer: {
        link: { xAxisIndex: 'all' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        padding: 0,
        formatter: (param) => {
          const { axisValue } = param && param[0] || {};
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>
              <span>${axisValue}</span>
            </h3>
            <div class=${styles.info}>
              ${param.sort((a, b) => a.seriesIndex - b.seriesIndex).map(({ seriesIndex, value }) => (
                `<span class=${styles.eachItem}>
                  <span>${['停机次数', '停机时长', '停机电量'][seriesIndex]}</span>
                  <span>${dataFormats(value / ([1, 1, 10000][seriesIndex]), '--', [0, 1, 4][seriesIndex], true)}</span>
                </span>`
              )).join('')}
            </div>
          </section>`;
        },
      },
      series,
    };
    typesChart.hideLoading();
    sortedTypes.length > 0 && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      bottom: 16,
      showDetail: false,
      start: zoomRange[0],
      end: zoomRange[1],
      height: 20,
    }, {
      type: 'inside',
      filterMode: 'empty',
      start: zoomRange[0],
      end: zoomRange[1],
      xAxisIndex: [0, 1, 2],
    }]);
    typesChart.setOption(option);
    typesChart.off('click');
    typesChart.on('click', (param) => this.chartHandle(param, sortedTypes, typesChart));
  }

  render() {
    const { sortName } = this.state;
    return (
      <div className={styles.stopTrend}>
        <div className={styles.top}>
          <span className={styles.title}>{this.getTitle()}</span>
          <span className={styles.handle}>
            <span className={styles.eachHandle}>
              <span className={styles.text}>选择排序</span>
              <Select
                onChange={this.sortChange}
                style={{width: '150px'}}
                value={sortName}
              >
                <Option value="stopCount">停机次数</Option>
                <Option value="stopHour">停机时长</Option>
                <Option value="stopLostGen">停机电量</Option>
              </Select>
            </span>
          </span>
        </div>
        {['停机次数', '停机时长', '停机电量'].map((e, i) => (
          <div key={e} className={styles.modes} style={{top: `${[55, 180, 300][i]}px`}}>
            <span className={styles.eachMode}>
              <span className={styles.rect} style={{
                backgroundImage: `linear-gradient(-180deg, ${this.barColor[i][0]} 0%, ${this.barColor[i][1]} 100%)`,
                }} />
              <span className={styles.modeText}>{e}</span>
            </span>
          </div>
        ))}
        <div className={styles.chart} ref={(ref)=> {this.typesRef = ref;}} />
      </div>
    );
  }
}

export default ChartStopTypes;

