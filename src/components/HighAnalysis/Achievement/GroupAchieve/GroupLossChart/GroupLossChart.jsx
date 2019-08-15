import React, { Component } from 'react';
import {Button} from 'antd';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import searchUtil from '../../../../../utils/searchUtil';

import styles from './groupLossChart.scss';

export default class GroupLossChart extends Component {

  static propTypes = {
    groupLostGenHourInfo: PropTypes.object,
    groupLoseLoading: PropTypes.bool,
    groupLostTime: PropTypes.number,
    location: PropTypes.object,
    history: PropTypes.object,
  };

  componentDidUpdate(prevProps) {
    const { groupLossChart } = this;
    const { groupLostTime, groupLoseLoading, groupLostGenHourInfo } = this.props;
    const { lostTime: lostTimePrev } = prevProps;
    const myChart = eCharts.init(groupLossChart);
    if (groupLoseLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!groupLoseLoading) {
      myChart.hideLoading();
    }
    if(groupLostTime && groupLostTime !== lostTimePrev) {
      eCharts.init(groupLossChart).clear();//清除
      const myChart = eCharts.init(groupLossChart);
      myChart.setOption(this.drawChart(groupLostGenHourInfo));
    }
  }

  drawChart = (data) => {
    const { dataArr, basicArr } = data;
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
          var tar = params[1];
          return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
        },
      },
      grid: {
        top: '10%',
        bottom: '10%',
      },
      xAxis: {
        type: 'category',
        splitLine: {show: false},
        data: ['应发小时', '降容损失', '风机故障', '变电故障', '场外因素', '计划停机', '其他损失', '实发小时'],
        axisLabel: {
          interval: 0,
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '小时数（h）',
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '辅助',
          type: 'bar',
          barWidth: 10,
          stack: '总量',
          itemStyle: {
            normal: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)',
            },
            emphasis: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)',
            },
          },
          data: basicArr,
        },
        {
          name: '生活费',
          type: 'bar',
          barWidth: 10,
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top',
            },
          },
          data: dataArr,
        },
      ],
    };
  };

  toAreaPage = () => { // 携带选中信息进入区域页面
    // 页面路径参数结构/{pathKey}?pages=['group','area']&group={a:1,b:2}&area={c:1,d:4}&station={e:2,ff:12};
    // 其中group, area, station后面的选中内容为JSON.stringify后的字符串
    // const { location, history } = this.props;
    // const { search } = location || {};
    // const areaInfo = {a: Math.random(), b: Math.random};
    // // 新的search: pages参数不变, area参数变为选中项内容集合
    // const newSearch = searchUtil(search).replace({ area: JSON.stringify(areaInfo) }).stringify(); // 删除search中页面的记录信息
    // history.push(`/analysis/achievement/analysis/group?${newSearch}`);
  };

  render() {
    return (
      <div className={styles.groupLossBox}>
        <div className={styles.groupLossTitle}>
          <span>损失电量分解图</span>
          <Button onClick={this.toAreaPage}>查看区域</Button>
        </div>
        <div className={styles.groupLossCenter} ref={ref => {this.groupLossChart = ref;}} />
      </div>
    );
  }
}
