import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import { Radio } from 'antd';
import searchUtil from '../../../../../utils/searchUtil';
import {dataFormats} from '../../../../../utils/utilFunc';

import styles from './looseLineChart.scss';

export default class LooseLineChart extends Component {

  static propTypes = {
    releaseType: PropTypes.string,
    deviceName: PropTypes.string,
    releaseRendData: PropTypes.array,
    releaseRendLoading: PropTypes.bool,
    releaseRendTime: PropTypes.number,
    location: PropTypes.object,
    getReleaseRend: PropTypes.func,
    changeStore: PropTypes.func,
    rankDevice: PropTypes.string,
  };

  componentDidUpdate(prevProps) {
    const { looseLineChart } = this;
    const { releaseRendData, releaseRendLoading, releaseRendTime } = this.props;
    const { releaseRendTime: releaseRendTimePrev } = prevProps;
    const myChart = eCharts.init(looseLineChart);
    if (releaseRendLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!releaseRendLoading) {
      myChart.hideLoading();
    }
    if(releaseRendTime && releaseRendTime !== releaseRendTimePrev) {
      eCharts.init(looseLineChart).clear();//清除
      const myChart = eCharts.init(looseLineChart);
      myChart.setOption(this.drawChart(releaseRendData));
    }
  }

  drawChart = (releaseRendData) => {
    return {
      tooltip: {
        trigger: 'axis',
        padding: 0,
        formatter: (param) => {
          const { axisValue } = param && param[0] || {};
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>
              <span class=${styles.titleText}>${axisValue}</span>
            </h3>
            <div class=${styles.info}>
              ${param.sort((a, b) => a.seriesIndex - b.seriesIndex).map(({seriesIndex, value}) => (
            `<span class=${styles.eachItem}>
                  <span>${seriesIndex === 0 ? '解缆时长：' : '解缆次数：'}</span>
                  <span>${dataFormats(value, '--', 2, true)}</span>
                </span>`
          )).join('')}
            </div>
          </section>`;
        },
      },
      xAxis: [{
        data: releaseRendData && releaseRendData.map(cur => (cur.efficiencyDate)),
        gridIndex: 0,
        containLabel: false,
        axisTick: { show: false },
        axisLabel: { show: false },
      }, {
        data: releaseRendData && releaseRendData.map(cur => (cur.efficiencyDate)),
        axisTick: { show: false },
        containLabel: false,
        gridIndex: 1,
      }],
      yAxis: [{
        name: '解缆时长（h）',
        splitLine: {show: false},
        gridIndex: 0,
      }, {
        name: '解缆次数（次）',
        splitLine: {show: false},
        gridIndex: 1,
      }],
      grid: [{
        bottom: '60%',
      }, {
        top: '60%',
      }],
      axisPointer: {
        link: {xAxisIndex: 'all'},
      },
      series: [{
        type: 'line',
        showSymbol: false,
        lineStyle: {
          color: '#2564cc',
          shadowColor: 'rgba(0,0,0,0.20)',
          shadowBlur: 3,
          shadowOffsetY: 3,
        },
        itemStyle: {
          color: '#2564cc',
        },
        data: releaseRendData && releaseRendData.map(cur => (cur.releaseDuration)),
      }, {
        type: 'line',
        showSymbol: false,
        lineStyle: {
          color: '#f9b600',
          shadowColor: 'rgba(0,0,0,0.20)',
          shadowBlur: 3,
          shadowOffsetY: 3,
        },
        itemStyle: {
          color: '#f9b600',
        },
        data: releaseRendData && releaseRendData.map(cur => (cur.releaseNum)),
        xAxisIndex: 1,
        yAxisIndex: 1,
      }],
    };
  };

  handleStatusChange = (e) => {
    const {
      location: {search},
      getReleaseRend,
      changeStore,
      rankDevice,
    } = this.props;
    const actuatorInfoStr = searchUtil(search).getValue('actuator');
    if(actuatorInfoStr) {
      const actuatorInfo = actuatorInfoStr ? JSON.parse(actuatorInfoStr) : {};
      const {
        searchCode,
        searchDates,
        searchDevice,
      } = actuatorInfo;
      const params = {
        stationCode: searchCode,
        deviceFullCodes: rankDevice ? [rankDevice] : searchDevice,
        startTime: searchDates[0],
        endTime: searchDates[1],
        type: e.target.value,
      };
      changeStore({
        releaseType: e.target.value,
      });
      getReleaseRend(params);
    }
  };

  render() {
    const { releaseType, deviceName } = this.props;
    return (
      <div className={styles.looseLineChart}>
        <div className={styles.looseLineTitle}>
          <span>
            {deviceName ? `${deviceName}-每月解缆时长及次数` : '每月解缆时长及次数'}
          </span>
          <Radio.Group value={releaseType} buttonStyle="solid" onChange={this.handleStatusChange}>
            <Radio.Button value="1">按日</Radio.Button>
            <Radio.Button value="2">按月</Radio.Button>
            <Radio.Button value="3">按年</Radio.Button>
          </Radio.Group>
        </div>
        <div className={styles.chartBox}>
          <div className={styles.modes} style={{top: '30px'}}>
            <span className={styles.eachMode}>
              <span className={styles.lineHour} />
              <span className={styles.modeText}>解缆时长</span>
            </span>
          </div>
          <div className={styles.modes} style={{top: '190px'}}>
            <span className={styles.eachMode}>
              <span className={styles.lineCount} />
              <span className={styles.modeText}>解缆次数</span>
            </span>
          </div>
          <div ref={ref => {this.looseLineChart = ref;}} className={styles.looseLineCenter} />
        </div>
      </div>
    );
  }
}
