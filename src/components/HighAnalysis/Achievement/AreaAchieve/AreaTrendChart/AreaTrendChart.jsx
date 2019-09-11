import React, { Component } from 'react';
import eCharts from 'echarts';
import { Radio, message } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import {hiddenNoData, showNoData} from '../../../../../constants/echartsNoData';
import searchUtil from '../../../../../utils/searchUtil';
import { dataFormat } from '../../../../../utils/utilFunc';

import styles from './areaTrendChart.scss';

export default class AreaTrendChart extends Component {

  static propTypes = {
    trendInfo: PropTypes.array,
    trendTime: PropTypes.number,
    trendLoading: PropTypes.bool,
    timeStatus: PropTypes.string,
    getTrendInfo: PropTypes.func,
    location: PropTypes.object,
    selectStationCode: PropTypes.array,
    qutaName: PropTypes.string,
    changeStore: PropTypes.func,
    getLostGenHour: PropTypes.func,
    dataName: PropTypes.string,
    unitName: PropTypes.string,
    pointLength: PropTypes.number,
    selectTime: PropTypes.string,
  };

  constructor(props){
    super(props);
    // 初始化dataZoom位置
    this.paramsStart = 0;
    this.paramsEnd = 100;
  }

  componentDidUpdate(prevProps) {
    const { trendChart } = this;
    const { trendTime, trendLoading, trendInfo, selectTime } = this.props;
    const { trendTime: trendTimePrev } = prevProps;
    const myChart = eCharts.init(trendChart);
    if (trendLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!trendLoading) {
      myChart.hideLoading();
    }
    if(trendTime && trendTime !== trendTimePrev) {
      // 初始化dataZoom位置
      this.paramsStart = 0;
      this.paramsEnd = 100;
      eCharts.init(trendChart).clear();//清除
      const myChart = eCharts.init(trendChart);
      myChart.setOption(this.drawChart(trendInfo, selectTime));
      myChart.off('click');
      myChart.on('click', (param) => this.chartHandle(myChart, trendInfo, param));
      myChart.off('datazoom');
      myChart.on('datazoom', (params) => {
        this.paramsStart = params.start;
        this.paramsEnd = params.end;
      });
    }
  }

  chartHandle = (myChart, trendInfo, params) => {
    const { selectTime, selectStationCode, changeStore, getLostGenHour, timeStatus } = this.props;
    if(selectStationCode.length === 0) {
      return message.info('先选择电站后，才能对时间进行操作');
    }
    if(selectStationCode.length > 0) {
      const { search } = this.props.location;
      const groupInfoStr = searchUtil(search).getValue('area');
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const {
        modes = [],
        modesInfo = [],
        dates,
      } = groupInfo;
      const dateFormatArr = this.dateFormat(dates, params.name, timeStatus);
      const paramsHour = {
        startTime: dateFormatArr[0],
        endTime: dateFormatArr[1],
        stationCodes: selectStationCode,
        manufactorIds: modesInfo.map(cur => {
          return cur.value;
        }),
        deviceModes: modes.map(cur => (cur.split('-')[1])),
      };
      // 判断点击
      if(params.name && params.name !== selectTime) {
        changeStore({
          selectTime: params.name,
        });
        myChart.setOption(this.drawChart(trendInfo, params.name));
        getLostGenHour(paramsHour);
      }
      //判断再次点击
      if(params.name && params.name === selectTime) {
        changeStore({
          selectTime: '',
        });
        getLostGenHour({
          ...paramsHour,
          startTime: dates[0],
          endTime: dates[1],
        });
        myChart.setOption(this.drawChart(trendInfo, ''));
      }
    }
  };

  dateFormat = (dates, time, type) => {
    // 日
    if(type === '1') {
      return [time, time];
    }
    // 月
    if(type === '2') {
      let selectStart = moment(time).startOf('month').format('YYYY-MM-DD');
      let selectEnd = moment(time).endOf('month').format('YYYY-MM-DD');
      // 如果选择的时间比筛选的时间还早
      if(selectStart < dates[0]) {
        selectStart = dates[0];
      }
      if(selectEnd > dates[1]) {
        selectEnd = dates[1];
      }
      return [selectStart, selectEnd];
    }
    // 年
    if(type === '3') {
      let selectStart = moment(time).startOf('year').format('YYYY-MM-DD');
      let selectEnd = moment(time).endOf('year').format('YYYY-MM-DD');
      // 如果选择的时间比筛选的时间还早
      if(selectStart < dates[0]) {
        selectStart = dates[0];
      }
      if(selectEnd > dates[1]) {
        selectEnd = dates[1];
      }
      return [selectStart, selectEnd];
    }
  };

  drawChart = (data, selectTime) => {
    const { qutaName, unitName, pointLength } = this.props;
    // 选中的颜色
    function colorFunc(time) {
      if(selectTime) {
        return selectTime && selectTime === time ? '#f9b600' : '#f5d5bb';
      }
      return '#f9b600';
    }

    const oneLine = [{
      name: qutaName,
      type: 'line',
      barWidth: '10',
      lineStyle: {
        opacity: selectTime ? 0.2 : 1,
        color: '#f9b600',
        width: 2,
        shadowColor: 'rgba(0,0,0,0.20)',
        shadowBlur: 3,
        shadowOffsetY: 3,
      },
      data: data && data.map(cur => ({
        value: unitName === '%' ? (cur.indicatorData.value === null ? null : cur.indicatorData.value * 100) : cur.indicatorData.value,
        symbolSize: selectTime && cur.efficiencyDate === selectTime ? 12 : 8,
        itemStyle: {
          color: colorFunc(cur.efficiencyDate),
        },
      })),
    },
    ];

    const twoLine = [{
      name: qutaName,
      type: 'line',
      lineStyle: {
        opacity: selectTime ? 0.2 : 1,
        color: '#f9b600',
        width: 2,
        shadowColor: 'rgba(0,0,0,0.20)',
        shadowBlur: 3,
        shadowOffsetY: 3,
      },
      data: data && data.map(cur => ({
        value: unitName === '%' ? (cur.indicatorData.actualGen === null ? null : cur.indicatorData.actualGen * 100) : cur.indicatorData.actualGen,
        symbolSize: selectTime && cur.efficiencyDate === selectTime ? 12 : 8,
        itemStyle: {
          color: colorFunc(cur.efficiencyDate),
        },
      })),
    }, {
      name: qutaName,
      type: 'line',
      lineStyle: {
        opacity: selectTime ? 0.2 : 1,
        color: '#f5d5bb',
        width: 2,
        shadowColor: 'rgba(0,0,0,0.20)',
        shadowBlur: 3,
        shadowOffsetY: 3,
      },
      data: data && data.map(cur => ({
        value: unitName === '%' ? (cur.indicatorData.theoryGen === null ? null : cur.indicatorData.theoryGen * 100) : cur.indicatorData.theoryGen,
        symbolSize: selectTime && cur.efficiencyDate === selectTime ? 12 : 8,
        itemStyle: {
          color: colorFunc(cur.efficiencyDate),
        },
      })),
    }];
    const seriesData = qutaName === '利用小时数' ? twoLine : oneLine;
    return {
      graphic: !data || data.length === 0 ? showNoData : hiddenNoData,
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        },
        formatter: (params) => {
          if(qutaName === '利用小时数') {
            return `<div>
            <span>${params[0].name}</span><br /><span>实发小时数：</span><span>${dataFormat(params[0].value, '--', pointLength)}</span><br /><span>应发小时数：</span><span>${dataFormat(params[1].value, '--', pointLength)}</span>
          </div>`;
          }
          return `<div>
            <span>${qutaName || '--'}</span><br /><span>${params[0].name}：</span><span>${dataFormat(params[0].value, '--', pointLength)}</span>
          </div>`;
        },
      },
      grid: {
        top: '10%',
      },
      xAxis: [
        {
          type: 'category',
          data: data && data.map(cur => {
            return cur.efficiencyDate || '--';
          }),
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: `${qutaName}（${unitName}）`,
          min: 0,
          max: unitName === '%' ? 100 : null,
          splitLine: {
            show: false,
          },
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          start: this.paramsStart,
          end: this.paramsEnd,
        },
        {
          start: this.paramsStart,
          end: this.paramsEnd,
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


  // 切换日月年
  handleStatusChange = (e) => {
    const { getTrendInfo, selectStationCode } = this.props;
    const { search } = this.props.location;
    const groupInfoStr = searchUtil(search).getValue('area');
    if(groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const {
        quota = [],
        dates = [],
        searchCode = [],
      } = groupInfo;
      // 默认指标分析
      const quotaValue = quota[1] || quota[0];
      const paramsTrend = {
        startTime: dates[0],
        endTime: dates[1],
        stationCodes: selectStationCode.length === 0 ? searchCode : selectStationCode,
        indicatorCode: quotaValue,
        type: e.target.value, // 默认按月
      };
      // 初始化dataZoom位置
      this.paramsStart = 0;
      this.paramsEnd = 100;
      // 请求趋势数据
      getTrendInfo(paramsTrend);
    }
  };

  render() {
    const { timeStatus, dataName, qutaName } = this.props;
    return (
      <div className={styles.areaTrendBox}>
        <div className={styles.areaTrendTitle}>
          <span>{dataName === '' ? `${qutaName || '--'}趋势图` : `${dataName}-${qutaName || '--'}趋势图`}</span>
          <Radio.Group value={timeStatus} buttonStyle="solid" onChange={this.handleStatusChange}>
            <Radio.Button value="1">按日</Radio.Button>
            <Radio.Button value="2">按月</Radio.Button>
            <Radio.Button value="3">按年</Radio.Button>
          </Radio.Group>
        </div>
        <div className={styles.trendCenter} ref={ref => {this.trendChart = ref;}} />
      </div>
    );
  }
}
