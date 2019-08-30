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
    dataIndex: PropTypes.string,
    changeStore: PropTypes.func,
    location: PropTypes.object,
    getGroupTrendInfo: PropTypes.func,
    getGroupLostGenHour: PropTypes.func,
    colorData: PropTypes.object,
    queryParamsFunc: PropTypes.func,
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
        myChart.off('click');
        myChart.on('click', (param) => this.chartHandle(param, groupCapacityInfo, myChart));
      });
    }
  }

  chartHandle = (params, groupCapacityInfo, myChart) => {
    const { data } = params;
    if(data) {
      const { changeStore, dataIndex, getGroupTrendInfo, getGroupLostGenHour, location: { search } } = this.props;
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
        deviceModes: modes.map(cur => (cur.split('-')[1])),
      };
      //判断点击
      if(params.name && params.name !== dataIndex) {
        changeStore({
          dataIndex: params.name, // 下标
          dataName: data.name, // 名称
          selectStationCode: stationCodes, // 保存单选区域的信息
        });
        myChart.setOption(this.drawChart(groupCapacityInfo, dataIndex));
        getGroupTrendInfo(paramsTrend);
        getGroupLostGenHour(paramsHour);
      }

      //判断点击
      if(params.name && params.name === dataIndex) {
        changeStore({
          dataIndex: '', // 保存点击的下标
          selectStationCode: [], // 保存单选区域的信息
          selectTime: '', // 保存选择时间
          dataName: '', // 保存选择区域名称
        });
        myChart.setOption(this.drawChart(groupCapacityInfo, ''));
        this.props.queryParamsFunc(groupInfo);
      }
    }
  };

  drawChart = (data, dataIndex) => {
    const { colorData } = this.props;
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
                return dataIndex === '' ? colorData[params.name] : (dataIndex === params.name ? colorData[params.name] : '#cccccc');
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
