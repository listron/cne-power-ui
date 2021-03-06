import React, { Component } from 'react';
import eCharts from 'echarts';
import PropTypes from 'prop-types';
import { message } from 'antd';
import {hiddenNoData, showNoData} from '../../../../../constants/echartsNoData';
import searchUtil from '../../../../../utils/searchUtil';
import { dataFormats } from '../../../../../utils/utilFunc';

import styles from './stationPBAChart.scss';

export default class StationPBAChart extends Component {

  static propTypes = {
    indicatorRankInfo: PropTypes.array,
    rankTime: PropTypes.number,
    rankLoading: PropTypes.bool,
    changeStore: PropTypes.func,
    getTrendInfo: PropTypes.func,
    getLostGenHour: PropTypes.func,
    dataIndex: PropTypes.string,
    location: PropTypes.object,
    qutaName: PropTypes.string,
    stationColorData: PropTypes.object,
    unitName: PropTypes.string,
    pointLength: PropTypes.number,
    queryParamsFunc: PropTypes.func,
    selectTime: PropTypes.string,
  };

  componentDidUpdate(prevProps) {
    const { sortChart } = this;
    const { rankTime, rankLoading, indicatorRankInfo, dataIndex } = this.props;
    const { rankTime: rankTimePrev, dataIndex: dataIndexPrev } = prevProps;
    const myChart = eCharts.init(sortChart);
    if (rankLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!rankLoading) {
      myChart.hideLoading();
    }
    if(rankTime && rankTime !== rankTimePrev || dataIndex !== '' && dataIndexPrev !== dataIndex) {
      eCharts.init(sortChart).clear();//清除
      const myChart = eCharts.init(sortChart);
      myChart.setOption(this.drawChart(indicatorRankInfo, dataIndex));
      myChart.off('click');
      myChart.on('click', (param) => this.chartHandle(param, indicatorRankInfo, myChart));
    }
  }

  chartHandle = (params, indicatorRankInfo, myChart) => {
    const { selectTime, changeStore, dataIndex, getTrendInfo, getLostGenHour, location: { search }} = this.props;
    if(selectTime) {
      return message.info('请先取消下方事件选择, 再选择电站');
    }
    const { name } = params;
    const groupInfoStr = searchUtil(search).getValue('area');
    const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
    const {
      quota = [],
      stations = [],
      modes = [],
      modesInfo = [],
    } = groupInfo;
    const stationCodes = [];
    stations.forEach(cur => {
      cur.stations && cur.stations.forEach(item => {
        if(name === item.stationName) {
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
    // 判断点击
    if(params.name && params.name !== dataIndex) {
      changeStore({
        dataIndex: params.name,
        dataName: name,
        selectStationCode: stationCodes, // 保存单选区域的信息
      });
      myChart.setOption(this.drawChart(indicatorRankInfo, name));
      getTrendInfo(paramsTrend);
      getLostGenHour(paramsHour);
    }
    //判断再次点击
    if (params.name && params.name === dataIndex) {
      changeStore({
        dataIndex: '', // 选中信息
        selectStationCode: [], // 选中电站信息
        selectTime: '', // 选中时间
        dataName: '', // 保存选择区域名称
      });
      myChart.setOption(this.drawChart(indicatorRankInfo, ''));
      this.props.queryParamsFunc(groupInfo);
    }
  };

  // 处理数值
  dataFormatFunc = (unitName, indicatorData, paramStr) => {
    // 1.是否是百分比显示
    // 2.判断字段是否有值
    if(!indicatorData) {
      return null;
    }
    if(unitName === '%') {
      if(indicatorData[paramStr] === null){
        return null;
      }
      return indicatorData[paramStr] * 100;
    }
    return indicatorData[paramStr];
  };

  drawChart = (data, dataIndex) => {
    const { qutaName, stationColorData, unitName, pointLength } = this.props;
    // 颜色为空
    if(JSON.stringify(stationColorData) === '{}') {
      return {};
    }
    const twoBar = [{ // 实发
      data: data && data.map(cur => (this.dataFormatFunc(unitName, cur.indicatorData, 'actualGen'))),
      type: 'bar',
      barWidth: 10,
      itemStyle: {
        normal: {
          color: function(params) {//柱子颜色
            return dataIndex === '' ? new eCharts.graphic.LinearGradient( 0, 0, 0, 1, [
              {offset: 0, color: stationColorData[params.name] && stationColorData[params.name][0]},
              {offset: 1, color: stationColorData[params.name] && stationColorData[params.name][1]},
            ]) : (dataIndex === params.name ? new eCharts.graphic.LinearGradient( 0, 0, 0, 1, [
              {offset: 0, color: stationColorData[params.name] && stationColorData[params.name][0]},
              {offset: 1, color: stationColorData[params.name] && stationColorData[params.name][1]},
            ]) : '#cccccc');
          },
        },
        emphasis: {
          borderColor: '#fff',
          borderWidth: 1,
        },
      },
    }, {// 应发
      data: data && data.map(cur => (this.dataFormatFunc(unitName, cur.indicatorData, 'theoryGen'))),
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
      data: data && data.map(cur => (this.dataFormatFunc(unitName, cur.indicatorData, 'value'))),
      type: 'bar',
      barWidth: 10,
      itemStyle: {
        barBorderRadius: [5, 5, 0, 0],
        normal: {
          color: function(params) {//柱子颜色
            return dataIndex === '' ? new eCharts.graphic.LinearGradient( 0, 0, 0, 1, [
              {offset: 0, color: stationColorData[params.name] && stationColorData[params.name][0]},
              {offset: 1, color: stationColorData[params.name] && stationColorData[params.name][1]},
            ]) : (dataIndex === params.name ? new eCharts.graphic.LinearGradient( 0, 0, 0, 1, [
              {offset: 0, color: stationColorData[params.name] && stationColorData[params.name][0]},
              {offset: 1, color: stationColorData[params.name] && stationColorData[params.name][1]},
            ]) : '#cccccc');
          },
        },
        emphasis: {
          borderColor: '#fff',
          borderWidth: 1,
        },
      },
    }];
    const seriesData = qutaName === '利用小时数' ? twoBar : oneBar;
    return {
      graphic: !data || data.length === 0 ? showNoData : hiddenNoData,
      grid: {
        height: '300px',
      },
      tooltip: {
        trigger: 'axis',
        triggerEvent: true,
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params) => {
          if(qutaName === '利用小时数') {
            return `<div>
            <span>${params[0].name}</span><br /><span>实发小时数：</span><span>${dataFormats(params[0].value, '--', pointLength, true)}</span><br /><span>应发小时数：</span><span>${dataFormats(params[1].value, '--', pointLength, true)}</span>
          </div>`;
          }
          return `<div>
            <span>${qutaName || '--'}</span><br /><span>${params[0].name}：</span><span>${dataFormats(params[0].value, '--', pointLength, true)}</span>
          </div>`;
        },
      },
      xAxis: [
        {
          type: 'category',
          data: data && data.map(cur => {
            return cur.stationName || '--';
          }),
          axisLabel: {
            interval: 0,
            formatter: function(val){
              const strs = val.split(''); //字符串数组
              let str = '';
              for (let i = 0, s; s = strs[i++];) { //遍历字符串数组
                str += s;
                if (!(i % 4)) str += '\n';
              }
              return str;
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: `${qutaName}（${unitName}）`,
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
          top: '400px',
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
    const { qutaName } = this.props;
    return (
      <div className={styles.stationSortBox}>
        <div className={styles.stationSortTitle}>
          {`各电站${qutaName}排名`}
        </div>
        <div className={styles.stationSortChartCenter} ref={ref => {this.sortChart = ref;}} />
      </div>
    );
  }
}
