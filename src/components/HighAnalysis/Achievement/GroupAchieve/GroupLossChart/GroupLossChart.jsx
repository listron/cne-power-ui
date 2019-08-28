import React, { Component } from 'react';
import {Button} from 'antd';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import searchUtil from '../../../../../utils/searchUtil';
import {hiddenNoData, showNoData} from '../../../../../constants/echartsNoData';
import {dataFormat} from '../../../../../utils/utilFunc';

import styles from './groupLossChart.scss';

export default class GroupLossChart extends Component {

  static propTypes = {
    groupLostGenHourInfo: PropTypes.object,
    groupLoseLoading: PropTypes.bool,
    groupLostTime: PropTypes.number,
    location: PropTypes.object,
    history: PropTypes.object,
    selectStationCode: PropTypes.array,
    selectTime: PropTypes.string,
    dataName: PropTypes.string,
    pointLength: PropTypes.number,
  };

  componentDidUpdate(prevProps) {
    const { groupLossChart } = this;
    const { groupLostTime, groupLoseLoading, groupLostGenHourInfo } = this.props;
    const { groupLostTime: groupLostTimePrev } = prevProps;
    const myChart = eCharts.init(groupLossChart);
    if (groupLoseLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!groupLoseLoading) {
      myChart.hideLoading();
    }
    if(groupLostTime && groupLostTime !== groupLostTimePrev) {
      eCharts.init(groupLossChart).clear();//清除
      const myChart = eCharts.init(groupLossChart);
      myChart.setOption(this.drawChart(groupLostGenHourInfo));
    }
  }

  drawChart = (groupLostGenHourInfo) => {
    const pointLength = 1;
    const { actualGen, theoryGen, detailList } = groupLostGenHourInfo;
    const xAxisName = detailList && detailList.map(cur => (cur.name)) || [];
    const xAxisBaseValue = detailList && detailList.map(cur => (cur.baseValue)) || [];
    const xAxisValue = detailList && detailList.map(cur => (dataFormat(cur.value, '--', pointLength))) || [];
    return {
      graphic: !actualGen && !theoryGen && (!detailList || detailList.length === 0) ? showNoData : hiddenNoData,
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
          var tar = params[1];
          return tar.name + '<br/>' + tar.seriesName + ' : ' + dataFormat(tar.value, '--', pointLength) + 'h';
        },
      },
      grid: {
        top: '10%',
        bottom: '10%',
      },
      xAxis: {
        type: 'category',
        splitLine: {show: false},
        data: ['应发小时', ...xAxisName, '实发小时'],
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
          data: [0, ...xAxisBaseValue, 0],
        },
        {
          name: '小时数',
          type: 'bar',
          barWidth: 10,
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top',
            },
          },
          data: [dataFormat(theoryGen, '--', pointLength), ...xAxisValue, dataFormat(theoryGen, '--', pointLength)],
        },
      ],
    };
  };

  toAreaPage = () => { // 携带选中信息进入区域页面
    // 页面路径参数结构/{pathKey}?pages=['group','area']&group={a:1,b:2}&area={c:1,d:4}&station={e:2,ff:12};
    // 其中group, area, station后面的选中内容为JSON.stringify后的字符串
    // searchCode, modes, dates, quota, stations, modesInfo,
    const { location, history, selectStationCode } = this.props;
    const { search } = location || {};
    const groupInfoStr = searchUtil(search).getValue('group');
    const { pages: pagesStr } = searchUtil(search).parse();
    let pages = pagesStr;
    if(!pagesStr) {
      pages = 'group_area';
    }
    if(pagesStr) {
      if(!pagesStr.split('_').includes('area')) {
        pages = `${pagesStr}_area`;
      }
    }
    const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
    const resultStation = [];
    groupInfo.stations && groupInfo.stations.forEach(e => {
      const { stations = [], regionName } = e || {};
      const filteredStations = stations.filter(m => selectStationCode.includes(m.stationCode));
      if (filteredStations.length > 0) {
        resultStation.push({
          regionName,
          stations: filteredStations,
        });
      }
    });
    const areaInfo = {
      searchCode: selectStationCode,
      modes: groupInfo.modes,
      dates: groupInfo.dates,
      quota: groupInfo.quota,
      stations: resultStation,
      modesInfo: groupInfo.modesInfo,
    };
    // // 新的search: pages参数不变, area参数变为选中项内容集合
    const newSearch = searchUtil(search).replace({ area: JSON.stringify(areaInfo), pages }).stringify(); // 删除search中页面的记录信息
    history.push(`/analysis/achievement/analysis/area?${newSearch}`);
  };

  titleName = () => {
    const { selectTime, dataName } = this.props;
    if(dataName !== '' && selectTime !== '') {
      return `${dataName}-${selectTime}-损失电量分解图`;
    }
    if(dataName !== '' && selectTime === '') {
      return `${dataName}-损失电量分解图`;
    }
    return '损失电量分解图';
  };

  render() {
    const { selectStationCode } = this.props;
    return (
      <div className={styles.groupLossBox}>
        <div className={styles.groupLossTitle}>
          <span>{this.titleName()}</span>
          <Button disabled={selectStationCode.length === 0} onClick={this.toAreaPage}>查看区域</Button>
        </div>
        <div className={styles.groupLossCenter} ref={ref => {this.groupLossChart = ref;}} />
      </div>
    );
  }
}
