import React, { Component } from 'react';
import {Radio} from 'antd';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import moment from 'moment';
import searchUtil from '../../../../../utils/searchUtil';
import {dataFormat} from '../../../../../utils/utilFunc';

import styles from './groupTrendChart.scss';

export default class GroupTrendChart extends Component {

  static propTypes = {
    groupTrendInfo: PropTypes.array,
    groupTrendTime: PropTypes.number,
    groupTrendLoading: PropTypes.bool,
    location: PropTypes.object,
    getGroupTrendInfo: PropTypes.func,
    groupTimeStatus: PropTypes.string,
    selectStationCode: PropTypes.array,
    titleFunc: PropTypes.string,
    changeStore: PropTypes.func,
    getGroupLostGenHour: PropTypes.func,
    dataName: PropTypes.string,
    unitName: PropTypes.string,
    pointLength: PropTypes.number,
  };

  componentDidUpdate(prevProps) {
    const { groupTrendChart } = this;
    const { groupTrendTime, groupTrendLoading, groupTrendInfo } = this.props;
    const { groupTrendTime: trendTimePrev } = prevProps;
    const myChart = eCharts.init(groupTrendChart);
    if (groupTrendLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!groupTrendLoading) {
      myChart.hideLoading();
    }
    if(groupTrendTime && groupTrendTime !== trendTimePrev) {
      eCharts.init(groupTrendChart).clear();//清除
      const myChart = eCharts.init(groupTrendChart);
      myChart.setOption(this.drawChart(groupTrendInfo));
      myChart.off('click');
      myChart.on('click', (param) => this.chartHandle(param));
    }
  }


  chartHandle = (params) => {
    const { selectStationCode, changeStore, getGroupLostGenHour, groupTimeStatus } = this.props;
    if(selectStationCode.length > 0) {
      const { search } = this.props.location;
      const groupInfoStr = searchUtil(search).getValue('group');
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const {
        modes = [],
        modesInfo = [],
        dates,
      } = groupInfo;
      const dateFormatArr = this.dateFormat(dates, params.name, groupTimeStatus);
      const paramsHour = {
        startTime: dateFormatArr[0],
        endTime: dateFormatArr[1],
        stationCodes: groupInfo.searchCode,
        manufactorIds: modesInfo.map(cur => {
        return cur.value;
      }),
        deviceModes: modes,
      };
      changeStore({
        selectTime: params.name,
      });
      getGroupLostGenHour(paramsHour);
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

  drawChart = (data) => {
    const { titleFunc, unitName, pointLength } = this.props;

    const oneLine = [{
      name: titleFunc,
      type: 'line',
      barWidth: '10',
      itemStyle: {
        color: '#f9b600',
      },
      data: data && data.map(cur => {
        return dataFormat(unitName === '%' ? cur.indicatorData.value * 100 : cur.indicatorData.value, '--', 2);
      }),
    },
  ];

    const twoLine = [{
      name: titleFunc,
      type: 'line',
      itemStyle: {
        color: '#f9b600',
      },
      data: data && data.map(cur => {
        return dataFormat(unitName === '%' ? cur.indicatorData.actualGen * 100 : cur.indicatorData.actualGen, '--', 2);
      }),
    }, {
      name: titleFunc,
      type: 'line',
      itemStyle: {
        color: '#f5d5bb',
      },
      data: data && data.map(cur => {
        return dataFormat(unitName === '%' ? cur.indicatorData.theoryGen * 100 : cur.indicatorData.theoryGen, '--', 2);
      }),
    }];
    const seriesData = titleFunc === '利用小时数' ? twoLine : oneLine;
    return {
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        },
        formatter: (params) => {
          if(titleFunc === '利用小时数') {
            return `<div>
            <span>${params[0].name}</span><br /><span>实发小时数：</span><span>${dataFormat(params[0].value, '--', pointLength)}${unitName}</span><br /><span>应发小时数：</span><span>${dataFormat(params[1].value, '--', pointLength)}${unitName}</span>
          </div>`;
          }
          return `<div>
            <span>${titleFunc || '--'}</span><br /><span>${params[0].name}：</span><span>${dataFormat(params[0].value, '--', pointLength)}${unitName}</span>
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
          name: `${titleFunc}（${unitName}）`,
          min: 0,
          max: unitName === '%' ? 100 : null,
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
      }],
      series: seriesData,
    };
  };

  // 切换日月年
  handleStatusChange = (e) => {
    const { getGroupTrendInfo, selectStationCode } = this.props;
    const { search } = this.props.location;
    const groupInfoStr = searchUtil(search).getValue('group');
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
      // 请求趋势数据
      getGroupTrendInfo(paramsTrend);
    }
  };

  render() {
    const { groupTimeStatus, titleFunc, dataName } = this.props;
    return (
      <div className={styles.groupTrendBox}>
        <div className={styles.groupTrendTitle}>
          <span>{dataName === '' ? `${titleFunc || '--'}趋势图` : `${dataName}-${titleFunc || '--'}趋势图`}</span>
          <Radio.Group value={groupTimeStatus} buttonStyle="solid" onChange={this.handleStatusChange}>
            <Radio.Button value="1">按日</Radio.Button>
            <Radio.Button value="2">按月</Radio.Button>
            <Radio.Button value="3">按年</Radio.Button>
          </Radio.Group>
        </div>
        <div className={styles.trendCenter} ref={ref => {this.groupTrendChart = ref;}} />
      </div>
    );
  }
}
