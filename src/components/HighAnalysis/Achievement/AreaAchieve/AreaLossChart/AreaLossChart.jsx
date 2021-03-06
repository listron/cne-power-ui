import React, { Component } from 'react';
import eCharts from 'echarts';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import searchUtil from '../../../../../utils/searchUtil';
import {hiddenNoData, showNoData} from '../../../../../constants/echartsNoData';
import { dataFormats } from '../../../../../utils/utilFunc';

import styles from './areaLossChart.scss';

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

export default class AreaLossChart extends Component {

  static propTypes = {
    lostGenHourInfo: PropTypes.object,
    loseLoading: PropTypes.bool,
    lostTime: PropTypes.number,
    selectTime: PropTypes.string,
    dataName: PropTypes.string,
    selectStationCode: PropTypes.array,
    location: PropTypes.object,
    history: PropTypes.object,
    deviceData: PropTypes.array,
  };

  componentDidUpdate(prevProps) {
    const { lossChart } = this;
    const { lostTime, loseLoading, lostGenHourInfo } = this.props;
    const { lostTime: lostTimePrev } = prevProps;
    const myChart = eCharts.init(lossChart);
    if (loseLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!loseLoading) {
      myChart.hideLoading();
    }
    if(lostTime && lostTime !== lostTimePrev) {
      eCharts.init(lossChart).clear();//清除
      const myChart = eCharts.init(lossChart);
      myChart.setOption(this.drawChart(lostGenHourInfo));
    }
  }

  drawChart = (lostGenHourInfo) => {
    const pointLength = 2;
    const { actualGen, theoryGen, detailList } = lostGenHourInfo;
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

  toLostAnalysis = () => {
    // 页面路径参数结构/{pathKey}?pages=['group','area']&group={a:1,b:2}&area={c:1,d:4}&station={e:2,ff:12};
    // 其中group, area, station后面的选中内容为JSON.stringify后的字符串
    // searchCode, modes, dates, quota, stations, modesInfo,
    const { location, history, selectStationCode, deviceData } = this.props;
    const { search } = location || {};
    const groupInfoStr = searchUtil(search).getValue('area');
    const pagesStr = searchUtil(search).getValue('pages');
    let pages = pagesStr;
    if(!pagesStr) {
      pages = 'area_station';
    }
    if(pagesStr) {
      if(!pagesStr.split('_').includes('station')) {
        pages = `${pagesStr}_station`;
      }
    }
    // {"code":73,"device":["73M101M34M1","73M101M34M2","73M101M34M10"],"date":["2018-08-23","2019-08-23"],"quota":"100"}
    const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
    const {
      modes,
      dates,
      quota,
    } = groupInfo;
    const device = []; // 筛选选中机型下面的设备型号
    deviceData && deviceData.forEach(cur => {
      modes && modes.forEach(item => {
        if(cur.deviceModeCode === item) {
          cur.devices && cur.devices.forEach(e => {
            device.push(e.deviceFullcode);
          });
        }
      });
    });
    // 指标
    const quotaValue = quota[1] || quota[0];
    const stationInfo = {
      code: Number(selectStationCode.toString()),
      device,
      date: dates,
      quota: quotaValue,
    };
    // 新的search: pages参数不变, area参数变为选中项内容集合
    const newSearch = searchUtil(search).replace({ station: JSON.stringify(stationInfo), pages }).stringify(); // 删除search中页面的记录信息
    history.push(`/analysis/achievement/analysis/station?${newSearch}`);
  };

  titleName = () => {
    const {selectTime, dataName } = this.props;
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
      <div className={styles.areaLossBox}>
        <div className={styles.areaLossTitle}>
          <span>{this.titleName()}</span>
          <Button disabled={selectStationCode.length === 0} onClick={this.toLostAnalysis}>根源分析</Button>
        </div>
        <div className={styles.areaLossCenter} ref={ref => {this.lossChart = ref;}} />
      </div>
    );
  }
}
