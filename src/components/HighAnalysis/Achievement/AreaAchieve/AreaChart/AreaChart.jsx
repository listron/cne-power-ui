import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData.js';
import searchUtil from '../../../../../utils/searchUtil';

import styles from './areaChart.scss';

export default class AreaChart extends Component {

  static propTypes = {
    capacityInfo: PropTypes.array,
    capacityTime: PropTypes.number,
    capacityLoading: PropTypes.bool,
    dataIndex: PropTypes.string,
    changeStore: PropTypes.func,
    getTrendInfo: PropTypes.func,
    getLostGenHour: PropTypes.func,
    location: PropTypes.object,
    colorData: PropTypes.object,
    getDeviceType: PropTypes.func,
  };

  componentDidUpdate(prevProps) {
    const { areaChart } = this;
    const { capacityTime, capacityLoading, capacityInfo, dataIndex } = this.props;
    const { capacityTime: capacityTimePrev, dataIndex: dataIndexPrev } = prevProps;
    const myChart = eCharts.init(areaChart);
    if (capacityLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!capacityLoading) {
      myChart.hideLoading();
    }
    if(capacityTime && capacityTime !== capacityTimePrev || dataIndex !== '' && dataIndexPrev !== dataIndex) {
      eCharts.init(areaChart).clear();//清除
      const myChart = eCharts.init(areaChart);
      myChart.setOption(this.drawChart(capacityInfo, dataIndex));
      myChart.on('click', (param) => this.chartHandle(param, capacityInfo, myChart));
    }
  }

  chartHandle = (params, capacityInfo, myChart) => {
    const { changeStore, getTrendInfo, getLostGenHour, getDeviceType, location: { search }} = this.props;
    const { data } = params;
    const groupInfoStr = searchUtil(search).getValue('area');
    const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
    const {
      quota = [],
      stations = [],
      modesInfo =[],
      modes = [],
    } = groupInfo;
    const stationCodes = [];
    stations.forEach(cur => {
      cur.stations && cur.stations.forEach(item => {
        if(data.name === item.stationName) {
          stationCodes.push(item.stationCode);
        }
      });
    });
    // 默认指标分析
    const quotaValue = quota[1] || quota[0];
    const paramsTrend = {
      startTime: groupInfo.dates[0],
      endTime: groupInfo.dates[1],
      indicatorCode: quotaValue,
      type: '2', // 默认按月
      stationCodes,
    };
    const paramsHour = {
      startTime: groupInfo.dates[0],
      endTime: groupInfo.dates[1],
      deviceModes: modes,
      manufactorIds: modesInfo.map(cur => {
        return cur.value;
      }),
      stationCodes,
    };
    if(params.name) {
      changeStore({
        dataIndex: params.name,
        dataName: data.name,
        selectStationCode: stationCodes, // 保存单选区域的信息
      });
      myChart.setOption(this.drawChart(capacityInfo, params.name));
      getTrendInfo(paramsTrend);
      getLostGenHour(paramsHour);
      getDeviceType({stationCodes: stationCodes});
    }
  };


  drawChart = (data, dataIndex) => {
    const { colorData } = this.props;
    function colorFunc(stationName) {
      return dataIndex === '' ? colorData[stationName] : (dataIndex === stationName ? colorData[stationName] : '#cccccc');
    }
    const childrenArr = data.map(cur => {
      const obj = {};
      obj.name = cur.stationName;
      obj.value = cur.stationCapacity / 1000;
      obj.itemStyle = {
        color: colorFunc(cur.stationName),
      };
      return obj;
    });
    return {
      graphic: !data || data.length === 0 ? showNoData : hiddenNoData,
      series: [{
        type: 'treemap',
        top: '0%',
        left: '2%',
        right: '2%',
        bottom: '0%',
        roam: false,
        breadcrumb: {
          show: false,
        },
        itemStyle: {
          borderWidth: 1,
        },
        label: {
          formatter: '{b}\n{c}MW',
        },
        nodeClick: 'link',
        data: childrenArr,
      }],
    };
  };

  render() {
    return (
      <div className={styles.areaBox}>
        <div className={styles.areaBoxTitle}>
          各电站装机容量
        </div>
        <div className={styles.areaChartCenter} ref={ref => {this.areaChart = ref;}} />
      </div>
    );
  }
}
