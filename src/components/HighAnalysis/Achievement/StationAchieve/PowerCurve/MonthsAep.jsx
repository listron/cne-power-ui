import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Select } from 'antd';
import { getPartsOption } from './curveBaseOption';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './curve.scss';
const { Option } = Select;

class MonthsAep extends Component {

  static propTypes = {
    curveDeviceName: PropTypes.string,
    curveMonthAep: PropTypes.array,
    curveMonthAepLoading: PropTypes.bool,
  }

  state = {
    sortName: 'efficiencyDate', // windSpeed, aep;
  }

  componentDidMount(){
    const { curveMonthAep = [] } = this.props;
    const { sortName } = this.state;
    curveMonthAep.length > 0 && this.renderChart(curveMonthAep, sortName);
  }

  componentWillReceiveProps(nextProps){
    const { curveMonthAepLoading, curveMonthAep } = nextProps;
    const { sortName } = this.state;
    const preLoading = this.props.curveMonthAepLoading;
    if (preLoading && !curveMonthAepLoading) { // 请求完毕
      this.renderChart(curveMonthAep, sortName);
    } else if (!preLoading && curveMonthAepLoading) { // 请求中
      this.setChartLoading();
    }
  }

  setChartLoading = () => {
    const aepChart = this.aepRef && echarts.getInstanceByDom(this.aepRef);
    aepChart && aepChart.showLoading();
  }

  sortMonthAes = (data = [], sorter) => {
    return [...data].sort((a, b) => {
      if(sorter === 'efficiencyDate') {
        return a[sorter] && b[sorter] && a[sorter].localeCompare(b[sorter]);
      }
      return b[sorter] - a[sorter];
    });
  }

  sortChart = (sortName) => {
    const { curveMonthAep = [] } = this.props;
    this.setState({ sortName });
    this.renderChart(curveMonthAep, sortName);
  }

  createSeires = (sortedAepData) => {
    const xData = [], aepData = [], speedData = [];
    sortedAepData.forEach(e => {
      const { efficiencyDate, windSpeed, aep } = e || {};
      xData.push(efficiencyDate);
      aepData.push(dataFormats(aep) / 10000);
      speedData.push(windSpeed);
    });
    const series = [{
      type: 'bar',
      barWidth: '10px',
      itemStyle: {
        color: new echarts.graphic.LinearGradient( 0, 0, 0, 1, [
          {offset: 0, color: '#f95071' },
          {offset: 1, color: '#f47a37' },
        ]),
      },
      data: aepData,
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
    return { series, xData };
  }

  renderChart = (curveMonthAep, sortName) => {
    const aepChart = echarts.init(this.aepRef);
    const sortedAepData = this.sortMonthAes(curveMonthAep, sortName);
    const { series, xData } = this.createSeires(sortedAepData);
    const option = {
      grid: {
        top: 30,
        ...getPartsOption('grid'),
        bottom: 40,
        left: 35,
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
          const { axisValue } = param && param[0] || {};
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>
              <span>${axisValue || ''}</span>
            </h3>
            <div class=${styles.info}>
              ${param.map((e) => (
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
    const endPosition = 30 / sortedAepData.length >= 1 ? 100 : 3000 / sortedAepData.length;
    sortedAepData.length > 0 && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      showDetail: false,
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
  }

  render() {
    const { curveDeviceName } = this.props;
    const { sortName } = this.state;
    return (
      <section className={styles.aep}>
        <h3 className={styles.aepTop}>
          <span className={styles.aepText}>{curveDeviceName || '--'}各月AEP及平均风速</span>
          <span>
            <span className={styles.sorterText}>选择排序</span>
            <Select
              onChange={this.sortChart}
              style={{width: '200px'}}
              value={sortName}
            >
              <Option value="efficiencyDate">月份</Option>
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

export default MonthsAep;

