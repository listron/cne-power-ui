import React, { Component } from 'react';
import eCharts from 'echarts';
import { Radio } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';

import styles from './areaTrendChart.scss';
import {hiddenNoData, showNoData} from '../../../../../constants/echartsNoData';
import searchUtil from '../../../../../utils/searchUtil';

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
  };

  componentDidUpdate(prevProps) {
    const { trendChart } = this;
    const { trendTime, trendLoading, trendInfo } = this.props;
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
      eCharts.init(trendChart).clear();//清除
      const myChart = eCharts.init(trendChart);
      myChart.setOption(this.drawChart(trendInfo));
      myChart.on('click', (param) => this.chartHandle(param));
    }
  }

  chartHandle = (params) => {
    const { selectStationCode, changeStore, getLostGenHour, timeStatus } = this.props;
    console.log(selectStationCode, 'selectStationCode');
    if(selectStationCode.length > 0) {
      const { search } = this.props.location;
      const groupInfoStr = searchUtil(search).getValue('area');
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const {
        modes = [],
        modesInfo = [],
      } = groupInfo;
      // 格式化日月年的开始结束日期
      const timeFormat = {
        '1': [moment(params.name).startOf('d').format('YYYY-MM-DD'), moment(params.name).endOf('d').format('YYYY-MM-DD')],
        '2': [moment(params.name).startOf('m').format('YYYY-MM'), moment(params.name).endOf('m').format('YYYY-MM')],
        '3': [moment(params.name).startOf('y').format('YYYY'), moment(params.name).endOf('y').format('YYYY')],
      };
      const paramsHour = {
        startTime: timeFormat[timeStatus][0],
        endTime: timeFormat[timeStatus][1],
        stationCodes: groupInfo.searchCode,
        manufactorIds: modesInfo.map(cur => {
          return cur.value;
        }),
        deviceModes: modes,
      };
      changeStore({
        selectTime: params.name,
      });
      getLostGenHour(paramsHour);
    }
  };

  drawChart = (data) => {
    const { qutaName } = this.props;
    const oneLine = [{
      name: qutaName,
      type: 'line',
      barWidth: '10',
      data: data && data.map(cur => {
        return cur.indicatorData.value ? cur.indicatorData.value.toFixed(2) : '--';
      }),
    },
    ];

    const twoLine = [{
      name: qutaName,
      type: 'line',
      data: data && data.map(cur => {
        return cur.indicatorData.actualGen ? cur.indicatorData.actualGen.toFixed(2) : '--';
      }),
    }, {
      name: qutaName,
      type: 'line',
      data: data && data.map(cur => {
        return cur.indicatorData.theoryGen ? cur.indicatorData.theoryGen.toFixed(2) : '--';
      }),
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
          return `<div>
        <span>${params[0].name}</span><br />${params[0].marker}<span>PBA </span><span>${params[0].value}%</span>
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
          name: 'PBA',
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
      }],
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
        stations = [],
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
        regionName: [stations[0].regionName],
        indicatorCode: quotaValue,
        type: e.target.value, // 默认按月
      };
      // 请求趋势数据
      getTrendInfo(paramsTrend);
    }
  };

  render() {
    const { timeStatus } = this.props;
    return (
      <div className={styles.areaTrendBox}>
        <div className={styles.areaTrendTitle}>
          <span>PBA趋势图</span>
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
