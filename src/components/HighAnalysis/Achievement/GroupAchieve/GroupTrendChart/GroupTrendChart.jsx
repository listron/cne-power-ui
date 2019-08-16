import React, { Component } from 'react';
import {Radio} from 'antd';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import moment from 'moment';
import searchUtil from '../../../../../utils/searchUtil';

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
      myChart.on('click', (param) => this.chartHandle(param, groupTrendInfo, myChart));
    }
  }


  chartHandle = (params, groupTrendInfo, myChart) => {
    const { selectStationCode, changeStore, getGroupLostGenHour, groupTimeStatus } = this.props;
    if(selectStationCode.length > 0) {
      const { search } = this.props.location;
      const groupInfoStr = searchUtil(search).getValue('group');
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
        startTime: timeFormat[groupTimeStatus][0],
        endTime: timeFormat[groupTimeStatus][1],
        stationCodes: groupInfo.searchCode,
        manufactorIds: modesInfo.map(cur => {
        return cur.value;
      }),
        deviceModes: modes,
      };
      console.log(params, 'params');
      changeStore({
        selectTime: params.name,
      });
      getGroupLostGenHour(paramsHour);
    }
  };

  drawChart = (data) => {
    const { titleFunc } = this.props;

    const oneLine = [{
        name: titleFunc,
        type: 'line',
        barWidth: '10',
        data: data && data.map(cur => {
          return cur.indicatorData.value ? cur.indicatorData.value.toFixed(2) : '--';
        }),
      },
    ];

    const twoLine = [{
      name: titleFunc,
      type: 'line',
      data: data && data.map(cur => {
        return cur.indicatorData.actualGen ? cur.indicatorData.actualGen.toFixed(2) : '--';
      }),
    }, {
      name: titleFunc,
      type: 'line',
      data: data && data.map(cur => {
        return cur.indicatorData.theoryGen ? cur.indicatorData.theoryGen.toFixed(2) : '--';
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
            <span>${params[0].name}</span><br /><span>实发小时数：</span><span>${params[1].value || '--'}</span><br /><span>应发小时数：</span><span>${params[0].value || '--'}</span>
          </div>`;
          }
          return `<div>
            <span>${titleFunc || '--'}</span><br /><span>${params[0].name}</span><span>${params[0].value || '--'}</span>
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
          max: 100,
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
    const { groupTimeStatus, titleFunc } = this.props;
    return (
      <div className={styles.groupTrendBox}>
        <div className={styles.groupTrendTitle}>
          <span>{`${titleFunc || '--'}趋势图`}</span>
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
