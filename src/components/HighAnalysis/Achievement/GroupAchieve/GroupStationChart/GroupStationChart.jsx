import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import searchUtil from '../../../../../utils/searchUtil';
import { dataFormat } from '../../../../../utils/utilFunc';

import styles from './groupStationChart.scss';
import {message} from "antd";

export default class GroupStationChart extends Component {

  static propTypes = {
    groupRankInfo: PropTypes.array,
    groupRankTime: PropTypes.number,
    groupRankLoading: PropTypes.bool,
    dataIndex: PropTypes.string,
    changeStore: PropTypes.func,
    getGroupTrendInfo: PropTypes.func,
    getGroupLostGenHour: PropTypes.func,
    location: PropTypes.object,
    titleFunc: PropTypes.string,
    areaColorData: PropTypes.object,
    unitName: PropTypes.string,
    pointLength: PropTypes.number,
    queryParamsFunc: PropTypes.func,
    selectTime: PropTypes.string,
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
      myChart.off('click');
      myChart.on('click', (param) => this.chartHandle(param, groupRankInfo, myChart));
    }
  }

  chartHandle = (params, groupRankInfo, myChart) => {
    const { name } = params;
    const { selectTime, changeStore, getGroupTrendInfo, dataIndex, getGroupLostGenHour, location: { search } } = this.props;
    if(selectTime) {
      return message.info('请先取消下方事件选择, 再选择区域');
    }
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
        dataIndex: name, // 下标
        dataName: name, // 名称
        selectStationCode: stationCodes, // 保存单选区域的信息
      });
      myChart.setOption(this.drawChart(groupRankInfo, name));
      getGroupTrendInfo(paramsTrend);
      getGroupLostGenHour(paramsHour);
    }

    //判断再次点击
    if(params.name && params.name === dataIndex) {
      changeStore({
        dataIndex: '', // 保存点击的下标
        selectStationCode: [], // 保存单选区域的信息
        selectTime: '', // 保存选择时间
        dataName: '', // 保存选择区域名称
      });
      myChart.setOption(this.drawChart(groupRankInfo, ''));
      this.props.queryParamsFunc(groupInfo);
    }
  };

  drawChart = (data, dataIndex) => {
    const { titleFunc, areaColorData, unitName, pointLength } = this.props;
    const twoBar = [{ // 实发
      data: data && data.map(cur => (dataFormat(unitName === '%' ? cur.indicatorData.actualGen * 100 : cur.indicatorData.actualGen, '--', 2))),
      type: 'bar',
      barWidth: 10,
      itemStyle: {
        normal: {
          color: function(params) {//柱子颜色
            return dataIndex === '' ? areaColorData[params.name] : (dataIndex === params.name ? areaColorData[params.name] : '#cccccc');
          },
        },
        emphasis: {
          borderColor: '#fff',
          borderWidth: 1,
        },
      },
    }, {// 应发
      data: data && data.map(cur => (dataFormat(unitName === '%' ? cur.indicatorData.theoryGen * 100 : cur.indicatorData.theoryGen, '--', 2))),
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
      data: data && data.map(cur => (dataFormat(unitName === '%' ? cur.indicatorData.value * 100 : cur.indicatorData.value, '--', 2))),
      type: 'bar',
      barWidth: 10,
      itemStyle: {
        barBorderRadius: [5, 5, 0, 0],
        normal: {
          color: function(params) {//柱子颜色
            return dataIndex === '' ? areaColorData[params.name] : (dataIndex === params.name ? areaColorData[params.name] : '#cccccc');
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
        formatter: (params) => {
          if(titleFunc === '利用小时数') {
            return `<div>
            <span>${params[0].name}</span><br /><span>实发小时数：</span><span>${dataFormat(params[0].value, '--', pointLength)}</span><br /><span>应发小时数：</span><span>${dataFormat(params[1].value, '--', pointLength)}</span>
          </div>`;
          }
          return `<div>
            <span>${titleFunc || '--'}</span><br /><span>${params[0].name}：</span><span>${dataFormat(params[0].value, '--', pointLength)}</span>
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
          name: `${titleFunc}（${unitName}）`,
          min: 0,
          splitLine: {
            show: false,
          },
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
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
          textStyle: false,
        },
      ],
      series: seriesData,
    };
  };

  render() {
    const { titleFunc } = this.props;
    return (
      <div className={styles.groupSortBox}>
        <div className={styles.groupSortTitle}>
          {`各区域${titleFunc || '--'}排名`}
        </div>
        <div className={styles.groupSortChartCenter} ref={ref => {this.groupSortChart = ref;}} />
      </div>
    );
  }
}
