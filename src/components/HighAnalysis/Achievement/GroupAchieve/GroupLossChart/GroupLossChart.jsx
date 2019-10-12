import React, { Component } from 'react';
import {Button} from 'antd';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import searchUtil from '../../../../../utils/searchUtil';
import {hiddenNoData, showNoData} from '../../../../../constants/echartsNoData';
import {dataFormats} from '../../../../../utils/utilFunc';

import styles from './groupLossChart.scss';

const barColor = [
  ['#72c8ea', '#3e97d1'],
  ['#36c6ad', '#199475'],
  ['#ffb8c4', '#ff8291'],
  ['#df7789', '#bc4251'],
  ['#f2b75f', '#e08031'],
  ['#ffeecc', '#ffd99d'],
  ['#4c9de8', '#2564cc'],
  ['#058447', '#024d22'],
  ['#e024f2', '#bd10e0'],
  ['#8e89cc', '#3d369a'],
  ['#b8d876', '#69a920'],
  ['#d89a84', '#c05740'],
  ['#e07ea6', '#d73c66'],
  ['#bbc214', '#9aa812'],
  ['#b3afd4', '#54509e'],
  ['#cfbb58', '#aa851e'],
  ['#b694df', '#7d4fd5'],
  ['#d490d8', '#b142c0'],
  ['#e5a9b7', '#d55367'],
];

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
    const pointLength = 2;
    const { actualGen, theoryGen, detailList } = groupLostGenHourInfo;
    const xAxisName = detailList && detailList.map(cur => (cur.name)) || [];
    const xAxisBaseValue = detailList && detailList.map(cur => (cur.baseValue)) || [];
    const xAxisValue = detailList && detailList.map(cur => (dataFormats(cur.value, '--', pointLength, true))) || [];
    return {
      graphic: !actualGen && !theoryGen && (!detailList || detailList.length === 0) ? showNoData : hiddenNoData,
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
          var tar = params[1];
          return tar.name + '<br/>' + tar.seriesName + ' : ' + dataFormats(tar.value, '--', pointLength, true);
        },
      },
      grid: {
        top: '10%',
      },
      xAxis: {
        type: 'category',
        splitLine: {show: false},
        data: ['应发小时', ...xAxisName, '实发小时'],
        axisLabel: {
          interval: 0,
          formatter: (str = '') => { // 字段名称最少显示4个字
            const strArr = str.split('');
            const strLength = strArr.length;
            if (strLength > 4 && strLength <= 8) {
              strArr.splice(4, 0, '\n'); // 超过4个字折行
            }
            if (strLength > 8) { // 超过8个字则显示7个字，后跟…
              strArr.splice(7);
              strArr.push('...');
            }
            return strArr.join('');
          },
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '等效小时数（h）',
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
          cursor: 'default',
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
          name: '等效小时数',
          type: 'bar',
          barWidth: 10,
          stack: '总量',
          cursor: 'default',
          label: {
            normal: {
              show: true,
              position: 'top',
            },
          },
          data: [dataFormats(theoryGen, '--', pointLength, true), ...xAxisValue, dataFormats(actualGen, '--', pointLength, true)].map((cur, i) => ({
            value: cur,
            itemStyle: {
              color: new eCharts.graphic.LinearGradient( 0, 0, 0, 1, [
                {offset: 0, color: barColor[i][0]},
                {offset: 1, color: barColor[i][1]},
              ]),
            },
          })),
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
    console.log(pagesStr, 'pagesStr');
    console.log(pages, 'pages');
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
