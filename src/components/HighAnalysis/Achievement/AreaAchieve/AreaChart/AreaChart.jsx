import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import { message } from 'antd';
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
    stationColorData: PropTypes.object,
    getDeviceType: PropTypes.func,
    queryParamsFunc: PropTypes.func,
    selectTime: PropTypes.string,
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
      myChart.off('click');
      myChart.on('click', (param) => this.chartHandle(param, capacityInfo, myChart));
    }
  }

  chartHandle = (params, capacityInfo, myChart) => {
    const { selectTime, changeStore, getTrendInfo, dataIndex, getLostGenHour, getDeviceType, location: { search }} = this.props;
    if(selectTime) {
      return message.info('请先取消下方事件选择, 再选择电站');
    }
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
      deviceModes: modes.map(cur => (cur.split('-')[1])),
      manufactorIds: modesInfo.map(cur => {
        return cur.value;
      }),
      stationCodes,
    };
    //判断点击
    if(params.name && params.name !== dataIndex) {
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
    //判断再次点击
    if(params.name && params.name === dataIndex) {
      changeStore({
        dataIndex: '', // 选中信息
        selectStationCode: [], // 选中电站信息
        selectTime: '', // 选中时间
        dataName: '', // 保存选择区域名称
      });
      myChart.setOption(this.drawChart(capacityInfo, ''));
      this.props.queryParamsFunc(groupInfo);
    }
  };


  drawChart = (data, dataIndex) => {
    const { stationColorData } = this.props;
    function colorFunc(stationName) {
      return dataIndex === '' ? stationColorData[stationName] : (dataIndex === stationName ? stationColorData[stationName] : '#cccccc');
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
