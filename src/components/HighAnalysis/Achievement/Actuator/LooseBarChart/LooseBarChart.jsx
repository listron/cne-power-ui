import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import {Select} from 'antd';
import searchUtil from '../../../../../utils/searchUtil';
import {dataFormats} from '../../../../../utils/utilFunc';


import styles from './looseBarChart.scss';

const { Option } = Select;

export default class LooseBarChart extends Component {

  static propTypes = {
    releaseRankData: PropTypes.array,
    releaseRankTime: PropTypes.number,
    releaseRankLoading: PropTypes.bool,
    rankDevice: PropTypes.string,
    location: PropTypes.object,
    changeStore: PropTypes.func,
    queryParamsFunc: PropTypes.func,
    getYawRend: PropTypes.func,
    getReleaseRend: PropTypes.func,
    releaseType: PropTypes.string,
    yawType: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      modeArr: [],
      selectValue: 'deviceOrderName', // 默认选择排序字段
    };
    // 颜色
    this.barColor = [
      ['#72c8ea', '#3e97d1'],
      ['#36c6ad', '#199475'],
      ['#ffb8c4', '#ff8291'],
      ['#df7789', '#bc4251'],
      ['#f2b75f', '#e08031'],
      ['#ffeecc', '#ffd99d'],
      ['#4c9de8', '#2564cc'],
      ['#058447', '#024d22'],
      ['#e024f2', '#bd10e0'],
    ];
    // 初始化dataZoom位置
    this.paramsStart = 0;
    this.paramsEnd = 100;
  }

  componentDidUpdate(prevProps) {
    const { looseBarChart } = this;
    const { selectValue } = this.state;
    const { releaseRankTime, releaseRankLoading, releaseRankData, rankDevice } = this.props;
    const { releaseRankTime: releaseRankTimePrev, rankDevice: rankDevicePrev } = prevProps;
    const myChart = eCharts.init(looseBarChart);
    if (releaseRankLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!releaseRankLoading) {
      myChart.hideLoading();
    }
    if(releaseRankTime && releaseRankTime !== releaseRankTimePrev || rankDevice && rankDevice !== rankDevicePrev) {
      // 初始化dataZoom位置
      this.paramsStart = 0;
      this.paramsEnd = 100;
      eCharts.init(looseBarChart).clear();//清除
      const myChart = eCharts.init(looseBarChart);
      const filterData = this.filterDataFunc(releaseRankData, selectValue);
      myChart.setOption(this.drawChart(filterData, rankDevice));
      myChart.off('click');
      myChart.on('click', (param) => this.chartHandle(myChart, filterData, param));
      myChart.off('datazoom');
      myChart.on('datazoom', (params) => {
        this.paramsStart = params.start;
        this.paramsEnd = params.end;
      });
    }
  }

  chartHandle = (myChart, releaseRankData, param) => {
    const { name } = param;
    const {
      location: { search },
      changeStore,
      rankDevice,
      queryParamsFunc,
      getYawRend,
      getReleaseRend,
      yawType,
      releaseType,
    } = this.props;
    const actuatorInfoStr = searchUtil(search).getValue('actuator');
    const actuatorInfo = actuatorInfoStr ? JSON.parse(actuatorInfoStr) : {};
    const {
      searchCode,
      searchDates,
    } = actuatorInfo;
    // 选中的设备编码
    const selectDevice = name.split(' ')[1];
    // 选中的设备名称
    const deviceName = name.split(' ')[2];
    const paramsRank = {
      startTime: searchDates[0],
      endTime: searchDates[1],
      stationCode: searchCode,
      deviceFullCodes: [selectDevice],
    };
    //判断点击
    if(selectDevice && selectDevice !== rankDevice) {
      changeStore({
        rankDevice: selectDevice,
        deviceName,
      });
      myChart.setOption(this.drawChart(releaseRankData, selectDevice));
      getYawRend({...paramsRank, type: yawType});
      getReleaseRend({...paramsRank, type: releaseType});
    }
    //判断再次点击
    if(selectDevice && selectDevice === rankDevice) {
      changeStore({
        rankDevice: '',
        deviceName: '',
      });
      myChart.setOption(this.drawChart(releaseRankData, ''));
      queryParamsFunc(actuatorInfo);
    }
  };

  drawChart = (releaseRankData = [], rankDevice) => {
    // 柱状图
    const releaseBarData = [];
    // 折线图
    const releaseLineData = [];
    // x轴
    const dataAxis = [];
    // 设备类型
    const modeSet = new Set();
    releaseRankData && releaseRankData.forEach(e => {
      const { deviceModeName, deviceName } = e || {};
      dataAxis.push(deviceName);
      modeSet.add(deviceModeName);
    });
    const modeArr = [...modeSet];
    releaseRankData && releaseRankData.forEach(e => {
      const { deviceModeName, releaseDuration, releaseNum, deviceName, deviceFullcode } = e || {};
      const colorIndex = modeArr.indexOf(deviceModeName);
      releaseBarData.push({
        name: `${deviceModeName} ${deviceFullcode} ${deviceName}`,
        value: dataFormats(releaseDuration / 3600, '--', 2),
        itemStyle: {
          color: new eCharts.graphic.LinearGradient( 0, 0, 0, 1, [
            {offset: 0, color: this.barColor[colorIndex][0]},
            {offset: 1, color: this.barColor[colorIndex][1]},
          ]),
          opacity: (rankDevice && deviceFullcode !== rankDevice) ? 0.4 : 1,
        },
      });
      releaseLineData.push(releaseNum);
    });
    // 配置
    const baseChartParams = {
      axisLine: {
        lineStyle: {
          color: '#666666',
        },
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          color: '#666666',
        },
      },
    };
    this.setState({ modeArr });
    function contains(arrays, obj) {
      let i = arrays.length;
      while (i--) {
        if (arrays[i] === obj) {
          return i;
        }
      }
      return false;
    }
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        padding: 0,
        formatter: (params) => {
          const { name, axisValue } = params && params[0] || {};
          // 查找下标
          const indexNum = contains(modeArr, name.split(' ')[0]);
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>
              <span>${axisValue}</span>
              <span class=${styles.modeName}>${name.split(' ')[0]}</span>
            </h3>
            <div class=${styles.info}>
              ${params.map((e, i) => {
            const firColor = this.barColor[indexNum][0];
            const secColor = this.barColor[indexNum][1];
            return `<span class=${styles.eachItem}>
                  <span
                    style="background-image: linear-gradient(-180deg, ${firColor} 0%, ${secColor} 100%)"
                    class=${i === 0 ? styles.rectMode : styles.lineMode}
                  ></span>
                  <span>${i === 0 ? '解缆时长：' : '解缆次数：'}</span>
                  <span>${dataFormats(e.value, '--', 2, true)}</span>
                </span>`;
          }).join('')}
            </div>
          </section>`;
        },
      },
      grid: {
        left: '40px',
        right: '40px',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: dataAxis,
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '解缆时长（h）',
          min: 0,
          ...baseChartParams,
        },
        {
          type: 'value',
          name: '解缆次数（次）',
          min: 0,
          ...baseChartParams,
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
      series: [
        {
          name: '解缆时长',
          type: 'bar',
          barWidth: '10px',
          data: releaseBarData,
        },
        {
          name: '解缆次数',
          type: 'line',
          yAxisIndex: 1,
          lineStyle: {
            opacity: rankDevice ? 0.4 : 1,
            color: '#f9b600',
            width: 2,
            shadowColor: 'rgba(0,0,0,0.20)',
            shadowBlur: 3,
            shadowOffsetY: 3,
          },
          showSymbol: false,
          data: releaseLineData,
        },
      ],
    };
  };

  filterDataFunc = (data, sortName) => {
    return [...data].sort((a, b) => {
      if (sortName === 'deviceOrderName') {
        return a[sortName] && b[sortName] && a[sortName].localeCompare(b[sortName]);
      }
      return b[sortName] - a[sortName];
    });
  };

  handleChange = (value) => {
    const { releaseRankData } = this.props;
    // 初始化dataZoom位置
    this.paramsStart = 0;
    this.paramsEnd = 100;
    this.setState({
      selectValue: value,
    }, () => {
      const { looseBarChart } = this;
      eCharts.init(looseBarChart).clear();//清除
      const myChart = eCharts.init(looseBarChart);
      const filterData = this.filterDataFunc(releaseRankData, value);
      myChart.setOption(this.drawChart(filterData, ''));
    });
  };

  render() {
    const { modeArr, selectValue } = this.state;
    return (
      <div className={styles.looseBarChart}>
        <div className={styles.looseBarTop}>
          <span>各机组解缆时长及次数</span>
          <div className={styles.looseBarSort}>
            <span>选择排序</span>
            <Select value={selectValue} style={{ width: 200 }} onChange={this.handleChange}>
              <Option value="deviceOrderName">设备名称</Option>
              <Option value="releaseDuration">解缆时长</Option>
              <Option value="releaseNum">解缆次数</Option>
            </Select>
          </div>
        </div>
        <div className={styles.chartBox}>
          <div className={styles.modes}>
            {modeArr.map((e, i) => (
              <span key={e} className={styles.eachMode}>
              <span className={styles.rect} style={{
                backgroundImage: `linear-gradient(-180deg, ${this.barColor[i][0]} 0%, ${this.barColor[i][1]} 100%)`,
              }} />
              <span className={styles.modeText}>{e}</span>
            </span>
            ))}
            <span className={styles.eachMode}>
            <span className={styles.line} />
            <span className={styles.modeText}>解缆次数</span>
          </span>
          </div>
          <div ref={ref => {this.looseBarChart = ref;}} className={styles.looseBarCenter} />
        </div>
      </div>
    );
  }
}
