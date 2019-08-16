import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import { Select } from 'antd';
import searchUtil from '../../../../../utils/searchUtil';
import { getBaseGrid, getBaseYAxis, getBaseXAxis } from './chartBaseOption';
import styles from './stop.scss';
const { Option } = Select;

class ChartStopTypes extends Component {

  static propTypes = {
    stopChartTime: PropTypes.string,
    stopChartTimeMode: PropTypes.string,
    stopTypes: PropTypes.array,
    location: PropTypes.object,
    lostChartTime: PropTypes.string,
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
  }

  componentDidMount(){
    const { stopTypes } = this.props;
    const { sortName } = this.state;
    stopTypes.length > 0 && this.renderChart(stopTypes, sortName);
  }

  componentWillReceiveProps(nextProps){
    const { stopTypesLoading, stopTypes } = nextProps;
    const preLoading = this.props.stopTypesLoading;
    if (preLoading && !stopTypesLoading) { // 请求完毕
      const { sortName } = this.state;
      this.renderChart(stopTypes, sortName);
    } else if (!preLoading && stopTypesLoading) { // 请求中
      this.setChartLoading();
    }
  }

  setChartLoading = () => {
    const typesChart = this.typesRef && echarts.getInstanceByDom(this.typesRef);
    typesChart && typesChart.showLoading();
  }

  sortChange = (sortName) => {
    const { stopTypes } = this.props;
    this.setState({ sortName }, () => this.renderChart(stopTypes, sortName));
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

  createSeries = (sortedTypes = []) => {
    const dataAxis = [];
    const hourData = [];
    const genData = [];
    const countData = [];
    let series = [];
    sortedTypes.forEach(e => {
      dataAxis.push(e.faultName);
      genData.push(e.stopLostGen);
      hourData.push(e.stopHour);
      countData.push(e.stopCount);
    });
    series = [
      {
        ...this.createBaseBar(genData, ['#e024f2', '#bd10e0']),
        xAxisIndex: 0,
        yAxisIndex: 0,
      }, {
        ...this.createBaseBar(hourData, ['#df7789', '#bc4251']),
        xAxisIndex: 1,
        yAxisIndex: 1,
      }, {
        ...this.createBaseBar(countData, ['#f2b75f', '#e08031']),
        xAxisIndex: 2,
        yAxisIndex: 2,
      },
    ];
    return { dataAxis, series };
  }

  getSearchInfo = () => {
    const { location } = this.props;
    const { search } = location;
    const infoStr = searchUtil(search).getValue('station');
    return JSON.parse(infoStr) || {};
  }

  handleChart = ({ dataIndex }, sortedTypes, chart) => {
    const { stopElecType, stopChartTypes, stopChartDevice, stopChartTime, stopChartTimeMode } = this.props;
    const curFaultInfo = sortedTypes[dataIndex] || {};
    const searchParam = this.getSearchInfo();
    const deviceFullcodes = stopChartDevice ? [stopChartDevice.deviceFullcode] : searchParam.searchDevice;
    let [startTime, endTime] = searchParam.searchDates;
    if (stopChartTime) { // 已有时间选择。
      const recordStart = moment(stopChartTime).startOf(stopChartTimeMode);
      const recordEnd = moment(stopChartTime).endOf(stopChartTimeMode);
      startTime = moment.max(recordStart, moment(startTime)).format('YYYY-MM-DD');
      endTime = moment.min(recordEnd, moment(endTime)).format('YYYY-MM-DD');
    }
    let faultInfo = {};
    if (stopChartTypes && stopChartTypes.faultTypeId === curFaultInfo.faultTypeId) { // 取消选中
      this.props.changeStore({ stopChartTypes: null });
    } else {
      faultInfo = { faultId: curFaultInfo.faultTypeId };
      this.props.changeStore({ stopChartTypes: curFaultInfo });
    }
    const param = {
      stationCodes: [searchParam.searchCode],
      deviceFullcodes,
      startTime,
      endTime,
      parentFaultId: stopElecType,
      ...faultInfo,
    };
    this.props.getStopRank({ ...param });
    this.props.getStopTrend({ ...param });
  }

  renderChart = (stopTypes = [], sortName) => {
    const typesChart = echarts.init(this.typesRef);
    const sortedTypes = this.sortChart(stopTypes, sortName);
    const { dataAxis, series } = this.createSeries(sortedTypes);
    const option = {
      grid: [
        { ...getBaseGrid(), top: 30, height: 90 },
        { ...getBaseGrid(), top: 160, height: 90 },
        { ...getBaseGrid(), top: 290, height: 90 },
      ],
      xAxis: [
        { ...getBaseXAxis(dataAxis), gridIndex: 0 },
        { ...getBaseXAxis(dataAxis), gridIndex: 1 },
        { ...getBaseXAxis(dataAxis), gridIndex: 2 },
      ],
      yAxis: [
        { ...getBaseYAxis('电量(万kWh)'), gridIndex: 0, min: 0 },
        { ...getBaseYAxis('时长(h)'), gridIndex: 1, min: 0 },
        { ...getBaseYAxis('次数(h)'), gridIndex: 2, min: 0 },
      ],
      axisPointer: {
        link: {xAxisIndex: 'all'},
      },
      tooltip: {
        trigger: 'axis',
        padding: 0,
        formatter: (param) => {
          const { axisValue } = param && param[0] || {};
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>
              <span>${axisValue}</span>
            </h3>
            <div class=${styles.info}>
              ${param.map((e, i) => (
                `<span class=${styles.eachItem}>
                  <span>${['停机电量', '停机时长', '停机次数'][i]}</span>
                  <span>${e.value}</span>
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
      height: 20,
    }, {
      type: 'inside',
      filterMode: 'empty',
    }]);
    typesChart.setOption(option);
    typesChart.on('click', (param) => this.chartHandle(param, sortedTypes, typesChart));
  }

  render() {
    const { stopChartDevice, stopChartTime } = this.props;
    const { sortName } = this.state;
    const stopDeviceText = stopChartDevice ? `${stopChartDevice.deviceName}-` : '';
    const stopTimeText = stopChartTime ? `${stopChartTime}-` : '';
    return (
      <div className={styles.stopTrend}>
        <div className={styles.top}>
          <span className={styles.title}>
            {stopDeviceText}{stopTimeText}停机时长及次数
          </span>
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
        <div className={styles.chart} ref={(ref)=> {this.typesRef = ref;}} />
      </div>
    );
  }
}

export default ChartStopTypes;

