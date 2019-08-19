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
    dataSelect: PropTypes.string,
    changeStore: PropTypes.func,
    getTrendInfo: PropTypes.func,
    location: PropTypes.object,
  };

  componentDidUpdate(prevProps) {
    const { areaChart } = this;
    const { capacityTime, capacityLoading, capacityInfo, dataSelect } = this.props;
    const { capacityTime: capacityTimePrev } = prevProps;
    const myChart = eCharts.init(areaChart);
    if (capacityLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!capacityLoading) {
      myChart.hideLoading();
    }
    if(capacityTime && capacityTime !== capacityTimePrev) {
      eCharts.init(areaChart).clear();//清除
      const myChart = eCharts.init(areaChart);
      myChart.setOption(this.drawChart(capacityInfo, dataSelect));
      myChart.on('click', (param) => this.chartHandle(param, capacityInfo, myChart));
    }
  }

  chartHandle = (params, capacityInfo, myChart) => {
    const { changeStore, dataSelect, getTrendInfo, location: { search }} = this.props;
    const { data } = params;
    const groupInfoStr = searchUtil(search).getValue('area');
    const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
    const {
      quota = [],
      stations = [],
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
    changeStore({
      dataSelect: params.name,
      selectStationCode: stationCodes, // 保存单选区域的信息
    });
    myChart.setOption(this.drawChart(capacityInfo, dataSelect));
    getTrendInfo(paramsTrend);
  };


  drawChart = (data, dataSelect) => {
    const childrenArr = data.map(cur => {
      const obj = {};
      obj.name = cur.stationName;
      obj.value = cur.stationCapacity;
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
          normal: {
            // color:['#07a6ba','#4bc0c9','#3b56d9','#dbbb32','03ecef','#8648e7','#0fb2db']
            color: function(params) {//柱子颜色
              const colorList = ['#C33531', '#EFE42A', '#64BD3D', '#EE9201', '#29AAE3', '#B74AE5', '#0AAF9F', '#E89589', '#16A085', '#4A235A', '#C39BD3 ', '#F9E79F', '#BA4A00', '#ECF0F1', '#616A6B', '#EAF2F8', '#4A235A', '#3498DB'];
              return dataSelect === '' ? colorList[params.name] : (dataSelect === params.name ? colorList[params.name] : '#cccccc');
            },
          },
          borderWidth: 1,
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
