import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import { Radio } from 'antd';
import searchUtil from '../../../../../utils/searchUtil';
import {dataFormats} from '../../../../../utils/utilFunc';

import styles from './yawLineChart.scss';

export default class YawLineChart extends Component {

  static propTypes = {
    yawType: PropTypes.string,
    deviceName: PropTypes.string,
    yawRendData: PropTypes.array,
    yawRendLoading: PropTypes.bool,
    yawRendTime: PropTypes.number,
    location: PropTypes.object,
    getYawRend: PropTypes.func,
    changeStore: PropTypes.func,
    rankDevice: PropTypes.string,
  };

  componentDidUpdate(prevProps) {
    const { yawLineChart } = this;
    const { yawRendData, yawRendLoading, yawRendTime } = this.props;
    const { yawRendTime: yawRendTimePrev } = prevProps;
    const myChart = eCharts.init(yawLineChart);
    if (yawRendLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!yawRendLoading) {
      myChart.hideLoading();
    }
    if(yawRendTime && yawRendTime !== yawRendTimePrev) {
      eCharts.init(yawLineChart).clear();//清除
      const myChart = eCharts.init(yawLineChart);
      myChart.setOption(this.drawChart(yawRendData));
    }
  }

  drawChart = (yawRendData) => {
    return {
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
              ${param.sort((a, b) => a.seriesIndex - b.seriesIndex).map(({seriesIndex, value}) => (
            `<span class=${styles.eachItem}>
                  <span class=${seriesIndex === 0 ? styles.firLine : styles.secLine}></span>
                  <span>${seriesIndex === 0 ? '偏航时长：' : '偏航次数：'}</span>
                  <span>${dataFormats(value, '--', 2, true)}</span>
                </span>`
          )).join('')}
            </div>
          </section>`;
        },
      },
      xAxis: [{
        data: yawRendData && yawRendData.map(cur => (cur.efficiencyDate)),
        gridIndex: 0,
        containLabel: false,
        axisTick: { show: false },
        axisLabel: { show: false },
      }, {
        data: yawRendData && yawRendData.map(cur => (cur.efficiencyDate)),
        axisTick: { show: false },
        containLabel: false,
        gridIndex: 1,
      }],
      yAxis: [{
        name: '偏航时长（h）',
        splitLine: {show: false},
        gridIndex: 0,
      }, {
        name: '偏航次数（次）',
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
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
          xAxisIndex: [0, 1],
        },
        {
          start: 0,
          end: 100,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
          xAxisIndex: [0, 1],
          textStyle: false,
        },
      ],
      series: [{
        type: 'line',
        lineStyle: {
          color: '#2564cc',
          shadowColor: 'rgba(0,0,0,0.20)',
          shadowBlur: 3,
          shadowOffsetY: 3,
        },
        itemStyle: {
          color: '#2564cc',
        },
        data: yawRendData && yawRendData.map(cur => (dataFormats(cur.yawDuration === null ? null : cur.yawDuration / 3600, '--', 2))),
      }, {
        type: 'line',
        lineStyle: {
          color: '#f9b600',
          shadowColor: 'rgba(0,0,0,0.20)',
          shadowBlur: 3,
          shadowOffsetY: 3,
        },
        itemStyle: {
          color: '#f9b600',
        },
        data: yawRendData && yawRendData.map(cur => (cur.yawNum)),
        xAxisIndex: 1,
        yAxisIndex: 1,
      }],
    };
  };

  handleStatusChange = (e) => {
    const {
      location: {search},
      getYawRend,
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
        yawType: e.target.value,
      });
      getYawRend(params);
    }
  };

  render() {
    const { yawType, deviceName } = this.props;
    return (
      <div className={styles.yawLineChart}>
        <div className={styles.yawLineTitle}>
          <span>
            {deviceName ? `${deviceName} - 偏航时长及次数趋势图` : '偏航时长及次数趋势图'}
          </span>
          <Radio.Group value={yawType} buttonStyle="solid" onChange={this.handleStatusChange}>
            <Radio.Button value="1">按日</Radio.Button>
            <Radio.Button value="2">按月</Radio.Button>
            <Radio.Button value="3">按年</Radio.Button>
          </Radio.Group>
        </div>
        <div className={styles.chartBox}>
          <div className={styles.modes} style={{top: '30px'}}>
            <span className={styles.eachMode}>
              <span className={styles.lineHour} />
              <span className={styles.modeText}>偏航时长</span>
            </span>
          </div>
          <div className={styles.modes} style={{top: '190px'}}>
            <span className={styles.eachMode}>
              <span className={styles.lineCount} />
              <span className={styles.modeText}>偏航次数</span>
            </span>
          </div>
          <div ref={ref => {this.yawLineChart = ref;}} className={styles.yawLineCenter} />
        </div>
      </div>
    );
  }
}
