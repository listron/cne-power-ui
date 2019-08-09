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
    // stopChartTimeMode: PropTypes.string,
    stopTypes: PropTypes.array,
    location: PropTypes.object,
    // stopElecType: PropTypes.string,
    stopTypesLoading: PropTypes.bool,
    // changeStore: PropTypes.func,
    // getStopTrend: PropTypes.func,
    // getStopTypes: PropTypes.func,
  }

  componentDidMount(){
    const { stopTypes } = this.props;
    stopTypes.length > 0 && this.renderChart(stopTypes);
  }

  componentWillReceiveProps(nextProps){
    const { stopTypesLoading, stopTypes } = nextProps;
    const preLoading = this.props.stopTypesLoading;
    if (preLoading && !stopTypesLoading) { // 请求完毕
      this.renderChart(stopTypes);
    } else if (!preLoading && stopTypesLoading) { // 请求中
      this.setChartLoading();
    }
  }

  setChartLoading = () => {
    console.log('loading');
  }

  sortChart = () => {

  }

  createSeries = (stopTypes = []) => {
    const dataAxis = [];
    const hourData = [];
    const genData = [];
    const countData = [];
    const series = [];
    stopTypes.forEach(e => {
      dataAxis.push(e.efficiencyDate);
      genData.push(e.stopLostGen);
      hourData.push(e.stopHour);
      countData.push(e.stopCount);
    });
    series[0] = {
      type: 'bar',
      data: genData,
      xAxisIndex: 0,
      yAxisIndex: 0,
    };
    series[1] = {
      type: 'bar',
      data: hourData,
      xAxisIndex: 1,
      yAxisIndex: 1,
    };
    series[2] = {
      type: 'bar',
      data: countData,
      xAxisIndex: 2,
      yAxisIndex: 2,
    };
    return { dataAxis, series };
  }

  getSearchInfo = () => {
    const { location } = this.props;
    const { search } = location;
    const infoStr = searchUtil(search).getValue('station');
    return JSON.parse(infoStr) || {};
  }

  renderChart = (stopTypes = []) => {
    const typesChart = echarts.init(this.typesRef);
    const { dataAxis, series } = this.createSeries(stopTypes);
    const option = {
      grid: [
        { ...getBaseGrid(), top: 40, height: 120 },
        { ...getBaseGrid(), top: 180, height: 120 },
        { ...getBaseGrid(), top: 340, height: 120 },
      ],
      xAxis: [
        { ...getBaseXAxis(dataAxis), gridIndex: 0 },
        { ...getBaseXAxis(dataAxis), gridIndex: 1 },
        { ...getBaseXAxis(dataAxis), gridIndex: 2 },
      ],
      yAxis: [
        { ...getBaseYAxis('电量(万kWh)'), gridIndex: 0 },
        { ...getBaseYAxis('时长(h)'), gridIndex: 1 },
        { ...getBaseYAxis('次数(h)'), gridIndex: 2 },
      ],
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
                  <span>${i === 0 ? '故障次数' : '故障时长'}</span>
                  <span>${e.value}</span>
                </span>`
              )).join('')}
            </div>
          </section>`;
        },
      },
      series,
    };
    typesChart.setOption(option);
    // trendChart.on('click', ({dataIndex}) => {
    //   const { stopChartTimeMode } = this.props;
    //   const chartTimeInfo = stopTrend[dataIndex] || {};
    //   const { efficiencyDate } = chartTimeInfo;
    //   const clickStart = moment(efficiencyDate).startOf(stopChartTimeMode);
    //   const clickEnd = moment(efficiencyDate).endOf(stopChartTimeMode);
    //   const searchParam = this.getSearchInfo();
    //   const { searchDates } = searchParam;
    //   const startTime = moment.max(clickStart, moment(searchDates[0])).format('YYYY-MM-DD');
    //   const endTime = moment.min(clickEnd, moment(searchDates[1])).format('YYYY-MM-DD');
    //   this.props.changeStore({ lostChartTime: efficiencyDate });
    //   this.props.getStopTypes({
    //     stationCodes: [searchParam.searchCode],
    //     deviceFullcodes: searchParam.searchDevice,
    //     startTime,
    //     endTime,
    //   });
    // });
  }

  render() {
    const { stopChartTimeMode } = this.props;
    const { sortType } = this.state;
    // faultName	String	故障名称
    // faultTypeId	string	故障类型id
    // stopCount	Integer	故障次数
    // stopHour	string	故障时长
    // stopLostGen	string	损失电量（kw）
    return (
      <div className={styles.stopTrend}>
        <div className={styles.top}>
          <span className={styles.title}>
            停机时长及次数
          </span>
          <span className={styles.handle}>
            <span className={styles.eachHandle}>
              <span className={styles.text}>选择排序</span>
              <Select
                onChange={this.sortChart}
                style={{width: '150px'}}
                value={sortType}
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

