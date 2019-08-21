

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import { Switch, Checkbox, Icon, Select } from 'antd';
import styles from './runScatterChart.scss';

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;

export default class RunScatterChart extends Component {

  static propTypes = {
    indicatorsList: PropTypes.array,
    checkedMonths: PropTypes.array,
    allMonths: PropTypes.array,
    changeStore: PropTypes.func,
    firstChartLoading: PropTypes.bool,
    firstChartTime: PropTypes.number,
    firstChartData: PropTypes.array,
    secondChartLoading: PropTypes.bool,
    secondChartTime: PropTypes.number,
    secondChartData: PropTypes.array,
    thirdChartLoading: PropTypes.bool,
    thirdChartTime: PropTypes.number,
    thirdChartData: PropTypes.array,
    fourthChartLoading: PropTypes.bool,
    fourthChartTime: PropTypes.number,
    fourthChartData: PropTypes.array,
    // 第一个散点图坐标
    firstChartXAxis: PropTypes.string,
    firstChartYAxis: PropTypes.string,

    // 第二个散点图坐标
    secondChartXAxis: PropTypes.string,
    secondChartYAxis: PropTypes.string,

    // 第三个散点图坐标
    thirdChartXAxis: PropTypes.string,
    thirdChartYAxis: PropTypes.string,

    // 第四个散点图坐标
    fourthChartXAxis: PropTypes.string,
    fourthChartYAxis: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      minNum: 0, // 显示停机
    };
  }

  componentDidUpdate(prevProps) {
    const { scatterChart } = this;
    const {
      firstChartTime,
      secondChartTime,
      thirdChartTime,
      fourthChartTime,
      firstChartLoading,
      firstChartData,
      secondChartData,
      thirdChartData,
      fourthChartData,
      secondChartLoading,
      thirdChartLoading,
      fourthChartLoading,
    } = this.props;
    const {
      firstChartTime: firstChartTimePrev,
      secondChartTime: secondChartTimePrev,
      thirdChartTime: thirdChartTimePrev,
      fourthChartTime: fourthChartTimePrev,
    } = prevProps;
    const myChart = eCharts.init(scatterChart);
    if (firstChartLoading || secondChartLoading || thirdChartLoading || fourthChartLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!firstChartLoading || !secondChartLoading || !thirdChartLoading || !fourthChartLoading) {
      myChart.hideLoading();
    }
    if(firstChartTime && firstChartTime !== firstChartTimePrev || secondChartTime && secondChartTime !== secondChartTimePrev || thirdChartTime && thirdChartTime !== thirdChartTimePrev || fourthChartTime && fourthChartTime !== fourthChartTimePrev) {
      eCharts.init(scatterChart).clear();//清除
      const myChart = eCharts.init(scatterChart);
      myChart.setOption(this.drawChart(firstChartData, secondChartData, thirdChartData, fourthChartData));
    }
  }

  formatNumberFunc = (number) => {
    return number ? Number(number).toFixed(2) : number;
  };


  drawChart = (firstChartData, secondChartData, thirdChartData, fourthChartData) => {
    const { minNum } = this.state;
    const firstData = [];
      firstChartData.forEach(cur => {
        cur.dataList && cur.dataList.forEach(item => {
          firstData.push([this.formatNumberFunc(item.xAxis), this.formatNumberFunc(item.yAxis), cur.deviceName]);
        });
    });
    const secondData = [];
    secondChartData.forEach(cur => {
      cur.dataList && cur.dataList.forEach(item => {
        secondData.push([this.formatNumberFunc(item.xAxis), this.formatNumberFunc(item.yAxis), cur.deviceName]);
      });
    });
    const thirdData = [];
    thirdChartData.forEach(cur => {
      cur.dataList && cur.dataList.forEach(item => {
        thirdData.push([this.formatNumberFunc(item.xAxis), this.formatNumberFunc(item.yAxis), cur.deviceName]);
      });
    });
    const fourthData = [];
    fourthChartData.forEach(cur => {
      cur.dataList && cur.dataList.forEach(item => {
        fourthData.push([this.formatNumberFunc(item.xAxis), this.formatNumberFunc(item.yAxis), cur.deviceName]);
      });
    });
    console.log(firstData, 'firstData');
    return {
      animation: false,
      grid: [
        {left: '5%', top: '80px', width: '30%', height: '300px'},
        {left: '47%', top: '80px', width: '30%', height: '300px'},
        {left: '5%', top: '500px', width: '30%', height: '300px'},
        {left: '47%', top: '500px', width: '30%', height: '300px'},
      ],
      toolbox: {
        show: true,
        top: '40px',
        right: '25px',
        feature: {
          brush: {
            type: ['rect', 'polygon', 'keep', 'clear'],
          },
        },
      },
      visualMap: {
        type: 'piecewise',
        categories: firstChartData && firstChartData.map(cur => (cur.deviceName)),
        outOfRange: {
          symbol: 'circle',
          color: '#cccccc',
        },
        top: '230px',
        right: '60px',
      },
      brush: {
        brushLink: 'all',
        xAxisIndex: [0, 1, 2, 3],
        yAxisIndex: [0, 1, 2, 3],
        inBrush: {
          opacity: 1,
        },
      },
      // tooltip: {
      //   formatter: '{a}: ({c})',
      // },
      xAxis: [
        {name: '功率(KW)', gridIndex: 0, min: minNum, splitLine: {show: false}},
        {name: '功率(KW)', gridIndex: 1, min: minNum, splitLine: {show: false}},
        {name: '功率(KW)', gridIndex: 2, min: minNum, splitLine: {show: false}},
        {name: '功率(KW)', gridIndex: 3, min: minNum, splitLine: {show: false}},
      ],
      yAxis: [
        {name: '功率(KW)', gridIndex: 0, min: minNum, splitLine: {show: false}},
        {name: '功率(KW)', gridIndex: 1, min: minNum, splitLine: {show: false}},
        {name: '功率(KW)', gridIndex: 2, min: minNum, splitLine: {show: false}},
        {name: '功率(KW)', gridIndex: 3, min: minNum, splitLine: {show: false}},
      ],
      series: [
        {
          name: 'I',
          type: 'scatter',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: firstData,
        },
        {
          name: 'II',
          type: 'scatter',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: secondData,
        },
        {
          name: 'III',
          type: 'scatter',
          xAxisIndex: 2,
          yAxisIndex: 2,
          data: thirdData,
        },
        {
          name: 'IV',
          type: 'scatter',
          xAxisIndex: 3,
          yAxisIndex: 3,
          data: fourthData,
        },
      ],
    };
  };

  handleChange = (value) => {
    console.log(value);
  };

  onChangeSwitch = (checked) => {
    const {
      firstChartData,
      secondChartData,
      thirdChartData,
      fourthChartData,
    } = this.props;
    this.setState({
      minNum: checked ? null : 0,
    }, () => {
      const { scatterChart } = this;
      eCharts.init(scatterChart).clear();//清除
      const myChart = eCharts.init(scatterChart);
      myChart.setOption(this.drawChart(firstChartData, secondChartData, thirdChartData, fourthChartData));
    });
  };

  onChangeGroup = (checkedList) => {
    const { changeStore } = this.props;
    changeStore({
      checkedMonths: checkedList,
    });
  };

  onAllSwitch = (checked) => {
    const { allMonths, changeStore } = this.props;
    changeStore({
      checkedMonths: checked ? allMonths : [],
    });
  };

  render() {
    const { minNum } = this.state;
    const {
      indicatorsList,
      checkedMonths,
      allMonths,
      // 第一个散点图坐标
      firstChartXAxis,
      firstChartYAxis,
      // 第二个散点图坐标
      secondChartXAxis,
      secondChartYAxis,
      // 第三个散点图坐标
      thirdChartXAxis,
      thirdChartYAxis,
      // 第四个散点图坐标
      fourthChartXAxis,
      fourthChartYAxis,
    } = this.props;
    const firstXAxisOption = indicatorsList && indicatorsList.map(cur => {
      return (
        <Option key={`${cur.value}-${cur.name}`} value={cur.value}>{cur.name}</Option>
      );
    });
    const firstYAxisOption = indicatorsList && indicatorsList.map(cur => {
      return (
        <Option key={`${cur.value}-${cur.name}`} value={cur.value}>{cur.name}</Option>
      );
    });
    const secondXAxisOption = indicatorsList && indicatorsList.map(cur => {
      return (
        <Option key={`${cur.value}-${cur.name}`} value={cur.value}>{cur.name}</Option>
      );
    });
    const secondYAxisOption = indicatorsList && indicatorsList.map(cur => {
      return (
        <Option key={`${cur.value}-${cur.name}`} value={cur.value}>{cur.name}</Option>
      );
    });
    const thirdXAxisOption = indicatorsList && indicatorsList.map(cur => {
      return (
        <Option key={`${cur.value}-${cur.name}`} value={cur.value}>{cur.name}</Option>
      );
    });
    const thirdYAxisOption = indicatorsList && indicatorsList.map(cur => {
      return (
        <Option key={`${cur.value}-${cur.name}`} value={cur.value}>{cur.name}</Option>
      );
    });
    const fourthXAxisOption = indicatorsList && indicatorsList.map(cur => {
      return (
        <Option key={`${cur.value}-${cur.name}`} value={cur.value}>{cur.name}</Option>
      );
    });
    const fourthYAxisOption = indicatorsList && indicatorsList.map(cur => {
      return (
        <Option key={`${cur.value}-${cur.name}`} value={cur.value}>{cur.name}</Option>
      );
    });
    return (
      <div className={styles.runScatterChart}>
        <div className={styles.sequenceChart} ref={ref => {this.scatterChart = ref;}} />
        <div className={styles.sequenceSidebar}>
          <div className={styles.selectTitle}>
            选择数据
          </div>
          <div className={styles.paramsSelect}>
            <span>参数选择</span>
            <div className={styles.switchBox}>
              <Switch checked={minNum === null} onChange={this.onChangeSwitch} />
              <span>{minNum === null ? '显示' : '隐藏'}停机</span>
            </div>
          </div>
          <div className={styles.devicesSelect}>
            选择机组
          </div>
          <div className={styles.timeSelect}>
            <span>选择月份</span>
            <div className={styles.checkBox}>
              <CheckboxGroup
                style={{height: '250px', overflowY: 'auto'}}
                options={allMonths}
                value={checkedMonths}
                onChange={this.onChangeGroup}
              />
            </div>
            <div className={styles.allSwitch}>
              <Switch checked={checkedMonths.length > 0} onChange={this.onAllSwitch} />
              <span>全部{checkedMonths.length === 0 ? '隐藏' : '显示'}</span>
            </div>
          </div>
        </div>
        <div className={styles.firChartTitle}>
          风速VS功率
        </div>
        <div className={styles.secChartTitle}>
          风速VS功率
        </div>
        <div className={styles.thrChartTitle}>
          风速VS功率
        </div>
        <div className={styles.fouChartTitle}>
          风速VS功率
        </div>
        <div className={styles.firCoordinate}>
          <span className={styles.xAxis}>横坐标</span>
          <Select value={firstChartXAxis} style={{ width: 120 }} onChange={this.handleChange}>
            {firstXAxisOption}
          </Select>
          <Icon type="swap" />
          <span className={styles.yAxis}>纵坐标</span>
          <Select value={firstChartYAxis} style={{ width: 120 }} onChange={this.handleChange}>
            {firstYAxisOption}
          </Select>
        </div>
        <div className={styles.secCoordinate}>
          <span className={styles.xAxis}>横坐标</span>
          <Select value={secondChartXAxis} style={{ width: 120 }} onChange={this.handleChange}>
            {secondXAxisOption}
          </Select>
          <Icon type="swap" />
          <span className={styles.yAxis}>纵坐标</span>
          <Select value={secondChartYAxis} style={{ width: 120 }} onChange={this.handleChange}>
            {secondYAxisOption}
          </Select>
        </div>
        <div className={styles.thrCoordinate}>
          <span className={styles.xAxis}>横坐标</span>
          <Select value={thirdChartXAxis} style={{ width: 120 }} onChange={this.handleChange}>
            {thirdXAxisOption}
          </Select>
          <Icon type="swap" />
          <span className={styles.yAxis}>纵坐标</span>
          <Select value={thirdChartYAxis} style={{ width: 120 }} onChange={this.handleChange}>
            {thirdYAxisOption}
          </Select>
        </div>
        <div className={styles.fouCoordinate}>
          <span className={styles.xAxis}>横坐标</span>
          <Select value={fourthChartXAxis} style={{ width: 120 }} onChange={this.handleChange}>
            {fourthXAxisOption}
          </Select>
          <Icon type="swap" />
          <span className={styles.yAxis}>纵坐标</span>
          <Select value={fourthChartYAxis} style={{ width: 120 }} onChange={this.handleChange}>
            {fourthYAxisOption}
          </Select>
        </div>
      </div>
    );
  }
}
