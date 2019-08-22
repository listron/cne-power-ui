import React, { Component } from 'react';
import eCharts from 'echarts';
import axios from 'axios';
import PropTypes from 'prop-types';
import searchUtil from '../../../../../utils/searchUtil';

import styles from './groupAreaChart.scss';

export default class GroupAreaChart extends Component {

  static propTypes = {
    groupCapacityInfo: PropTypes.array,
    groupCapacityTime: PropTypes.number,
    groupCapacityLoading: PropTypes.bool,
    dataIndex: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    changeStore: PropTypes.func,
    location: PropTypes.object,
    getGroupTrendInfo: PropTypes.func,
    getGroupLostGenHour: PropTypes.func,
  };

  componentDidUpdate(prevProps) {
    const { groupChart } = this;
    const { groupCapacityTime, groupCapacityLoading, groupCapacityInfo, dataIndex } = this.props;
    const { groupCapacityTime: groupCapacityTimePrev, dataIndex: dataIndexPrev } = prevProps;
    const myChart = eCharts.init(groupChart);
    if (groupCapacityLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!groupCapacityLoading) {
      myChart.hideLoading();
    }
    if(groupCapacityTime && groupCapacityTime !== groupCapacityTimePrev || dataIndex !== '' && dataIndexPrev !== dataIndex) {
      eCharts.init(groupChart).clear();//清除
      const myChart = eCharts.init(groupChart);
      axios.get('/mapJson/China.json').then(response => {
        eCharts.registerMap('China', response.data);
        myChart.setOption(this.drawChart(groupCapacityInfo, dataIndex));
        myChart.on('click', (param) => this.chartHandle(param, groupCapacityInfo, myChart));
      });
    }
  }

  chartHandle = (params, groupCapacityInfo, myChart) => {
    console.log(params, 'params');
    const { dataIndex, data } = params;
    if(data) {
      const { changeStore, getGroupTrendInfo, getGroupLostGenHour, location: { search } } = this.props;
      const groupInfoStr = searchUtil(search).getValue('group');
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const {
        quota = [],
        stations = [],
        modesInfo = [],
        modes = [],
      } = groupInfo;
      const stationCodes = [];
      stations.forEach(cur => {
        if(cur.regionName === data.name){
          cur.stations && cur.stations.forEach(item => {
            stationCodes.push(item.stationCode);
          });
        }
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
        stationCodes,
        manufactorIds: modesInfo.map(cur => {
          return cur.value;
        }),
        deviceModes: modes,
      };
      changeStore({
        dataIndex: params.dataIndex, // 下标
        dataName: data.name, // 名称
        selectStationCode: stationCodes, // 保存单选区域的信息
      });
      myChart.setOption(this.drawChart(groupCapacityInfo, dataIndex));
      getGroupTrendInfo(paramsTrend);
      getGroupLostGenHour(paramsHour);
    }
  };

  drawChart = (data, dataIndex) => {
    const dataMap = data && data.map(cur => ({
      name: cur.regionName,
      value: [cur.longitude, cur.latitude, cur.stationCapacity / 1000],
    }));
    return {
      tooltip: {
        show: true,
        formatter: (params) => {
          return `<div>
            <span>${params.name}</span><br /><span>装机容量：</span><span>${params.data['value'][2] + 'MW' || '--'}</span>
          </div>`;
        },
      },
      geo: {
        map: 'China',
        layoutCenter: ['50%', '50%'],
        layoutSize: '100%',
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
          },
        },
        itemStyle: {
          normal: {
            areaColor: '#d8eef6',
            borderColor: '#fff',
            borderWidth: 1,
          },
          emphasis: {
            areaColor: '#b2e8fa',
          },
        },
      },
      series: [
        {
          name: '区域分布图',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: dataMap,
          symbolSize: 10,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          itemStyle: {
            normal: {
              color: function(params) {//柱子颜色
                const colorList = ['#C33531', '#EFE42A', '#64BD3D', '#EE9201', '#29AAE3', '#B74AE5', '#0AAF9F', '#E89589', '#16A085', '#4A235A', '#C39BD3 ', '#F9E79F', '#BA4A00', '#ECF0F1', '#616A6B', '#EAF2F8', '#4A235A', '#3498DB'];
                return dataIndex === '' ? colorList[params.dataIndex] : (dataIndex === params.dataIndex ? colorList[params.dataIndex] : '#cccccc');
              },
            },
            emphasis: {
              borderColor: '#fff',
              borderWidth: 1,
            },
          },
        },
      ],
    };
  };

  render() {
    return (
      <div className={styles.groupAreaChart}>
        <div className={styles.groupAreaTitle}>
          各区域分布图
        </div>
        <div className={styles.groupChartCenter} ref={ref => {this.groupChart = ref;}} />
      </div>
    );
  }
}
