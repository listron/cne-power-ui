import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';

import styles from './groupStationChart.scss';
import searchUtil from "../../../../../utils/searchUtil";

export default class GroupStationChart extends Component {

  static propTypes = {
    groupRankInfo: PropTypes.array,
    groupRankTime: PropTypes.number,
    groupRankLoading: PropTypes.bool,
    dataIndex: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    changeStore: PropTypes.func,
    getGroupTrendInfo: PropTypes.func,
    location: PropTypes.object,
    titleFunc: PropTypes.string,
  };

  componentDidUpdate(prevProps) {
    const { groupSortChart } = this;
    const { groupRankTime, groupRankLoading, groupRankInfo, dataIndex } = this.props;
    const { groupRankTime: rankTimePrev, dataIndex: dataIndexPrev } = prevProps;
    const myChart = eCharts.init(groupSortChart);
    if (groupRankLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!groupRankLoading) {
      myChart.hideLoading();
    }
    if(groupRankTime && groupRankTime !== rankTimePrev || dataIndex !== '' && dataIndexPrev !== dataIndex) {
      eCharts.init(groupSortChart).clear();//清除
      const myChart = eCharts.init(groupSortChart);
      myChart.setOption(this.drawChart(groupRankInfo, dataIndex));
      myChart.on('click', (param) => this.chartHandle(param, groupRankInfo, myChart));
    }
  }

  chartHandle = (params, groupCapacityInfo, myChart) => {
    const { dataIndex, name } = params;
    const { changeStore, getGroupTrendInfo, location: { search } } = this.props;
    const groupInfoStr = searchUtil(search).getValue('group');
    const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
    const {
      quota = [],
      stations = [],
    } = groupInfo;
    const stationCodes = [];
    stations.forEach(cur => {
      if(cur.regionName === name){
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
    changeStore({
      dataIndex: params.dataIndex, // 下标
      selectStationCode: stationCodes, // 保存单选区域的信息
    });
    myChart.setOption(this.drawChart(groupCapacityInfo, dataIndex));
    getGroupTrendInfo(paramsTrend);
  };

  drawChart = (data, dataIndex) => {
    const { titleFunc } = this.props;
    const twoBar = [{ // 实发
      data: data && data.map(cur => (cur.indicatorData.actualGen)),
      type: 'bar',
      barWidth: 10,
      itemStyle: {
        normal: {
          // color:['#07a6ba','#4bc0c9','#3b56d9','#dbbb32','03ecef','#8648e7','#0fb2db']
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
    }, {// 应发
      data: data && data.map(cur => (cur.indicatorData.theoryGen)),
      type: 'bar',
      barWidth: 10,
      itemStyle: {
        normal: {
          color: '#cccccc',
        },
        emphasis: {
          borderColor: '#fff',
          borderWidth: 1,
        },
      },
    }];
    const oneBar = [{
      data: data && data.map(cur => (cur.indicatorData.value)),
      type: 'bar',
      barWidth: 10,
      itemStyle: {
        barBorderRadius: [5, 5, 0, 0],
        normal: {
          // color:['#07a6ba','#4bc0c9','#3b56d9','#dbbb32','03ecef','#8648e7','#0fb2db']
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
    }];
    const seriesData = titleFunc === '利用小时数' ? twoBar : oneBar;
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        position: function (pt) {
          return [pt[0], '10%'];
        },
        formatter: (params) => {
          if(titleFunc === '利用小时数') {
            return `<div>
            <span>${params[0].name}</span><br /><span>实发小时数：</span><span>${params[0].value || '--'}</span><br /><span>应发小时数：</span><span>${params[1].value || '--'}</span>
          </div>`;
          }
          return `<div>
            <span>${titleFunc || '--'}</span><br /><span>${params[0].name}</span><span>${params[0].value || '--'}</span>
          </div>`;
        },
      },
      xAxis: [
        {
          type: 'category',
          data: data && data.map(cur => {
            return cur.regionName || '--';
          }),
          axisLabel: {
            interval: 0,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: titleFunc,
          min: 0,
          splitLine: {
            show: false,
          },
        },
      ],
      dataZoom: [{
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
        textStyle: false,
      }],
      series: seriesData,
    };
  };

  render() {
    const { titleFunc } = this.props;
    return (
      <div className={styles.groupSortBox}>
        <div className={styles.groupSortTitle}>
          {`各电站${titleFunc || '--'}排名`}
        </div>
        <div className={styles.groupSortChartCenter} ref={ref => {this.groupSortChart = ref;}} />
      </div>
    );
  }
}
