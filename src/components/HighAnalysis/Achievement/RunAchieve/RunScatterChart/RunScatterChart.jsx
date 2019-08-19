

import React, { Component } from 'react';
import eCharts from 'echarts';
import { Switch, Checkbox, Icon, Select } from 'antd';
import styles from './runScatterChart.scss';

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;

export default class RunScatterChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checkedList: [],
    };
  }

  componentDidMount() {
    const { scatterChart } = this;
    const myChart1 = eCharts.init(scatterChart);
    myChart1.setOption(this.drawChart());
    // 控制联动的
  }


  drawChart = () => {
    // const a = [];
    // const b = [];
    // const c = [];
    // const d = [];
    // for(let i = 0; i < 15000; i++) {
    //   a.push([Math.floor(Math.random() * 13 + 1), Math.floor(Math.random() * 8 + 1)]);
    //   b.push([Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 7 + 1)]);
    //   c.push([Math.floor(Math.random() * 11 + 1), Math.floor(Math.random() * 9 + 1)]);
    //   d.push([Math.floor(Math.random() * 9 + 1), Math.floor(Math.random() * 14 + 1)]);
    // }
    const dataAll = [
      [
        [10.0, 8.04, '1'],
        [8.0, 6.95, '2'],
        [13.0, 7.58, '3'],
        [9.0, 8.81, '1'],
        [11.0, 8.33, '2'],
        [14.0, 9.96, '3'],
        [6.0, 7.24, '1'],
        [4.0, 4.26, '2'],
        [12.0, 10.84, '3'],
        [7.0, 4.82, '1'],
        [5.0, 5.68, '2'],
      ],
      [
        [10.0, 9.14, '1'],
        [8.0, 8.14, '2'],
        [13.0, 8.74, '3'],
        [9.0, 8.77, '1'],
        [11.0, 9.26, '2'],
        [14.0, 8.10, '3'],
        [6.0, 6.13, '1'],
        [4.0, 3.10, '2'],
        [12.0, 9.13, '3'],
        [7.0, 7.26, '1'],
        [5.0, 4.74, '2'],
      ],
      [
        [10.0, 7.46, '1'],
        [8.0, 6.77, '2'],
        [13.0, 12.74, '3'],
        [9.0, 7.11, '1'],
        [11.0, 7.81, '2'],
        [14.0, 8.84, '3'],
        [6.0, 6.08, '1'],
        [4.0, 5.39, '2'],
        [12.0, 8.15, '3'],
        [7.0, 6.42, '1'],
        [5.0, 5.73, '2'],
      ],
      [
        [8.0, 6.58, '1'],
        [8.0, 5.76, '2'],
        [8.0, 7.71, '3'],
        [8.0, 8.84, '1'],
        [8.0, 8.47, '2'],
        [8.0, 7.04, '3'],
        [8.0, 5.25, '1'],
        [19.0, 12.50, '2'],
        [8.0, 5.56, '3'],
        [8.0, 7.91, '1'],
        [8.0, 6.89, '2'],
      ],
    ];
    return {
      animation: false,
      grid: [
        {left: '5%', top: '80px', width: '30%', height: '300px'},
        {left: '47%', top: '80px', width: '30%', height: '300px'},
        {left: '5%', top: '500px', width: '30%', height: '300px'},
        {left: '47%', top: '500px', width: '30%', height: '300px'},
      ],
      toolbox: {
        top: '40px',
        right: '25px',
      },
      visualMap: {
        type: 'piecewise',
        categories: ['1', '2', '3'],
        outOfRange: {
          symbol: 'circle',
          color: '#cccccc',
        },
        top: '230px',
        right: '60px',
      },
      brush: {
        brushLink: 'all',
        xAxisIndex: [0, 1, 2, 3], // 只可以在坐标系中
        yAxisIndex: [0, 1, 2, 3], // 只可以在坐标系中
        inBrush: {
          opacity: 1,
        },
      },
      // tooltip: {
      //   formatter: '{a}: ({c})',
      // },
      xAxis: [
        {name: '功率(KW)', gridIndex: 0, min: 0, max: 20, splitLine: {show: false}},
        {name: '功率(KW)', gridIndex: 1, min: 0, max: 20, splitLine: {show: false}},
        {name: '功率(KW)', gridIndex: 2, min: 0, max: 20, splitLine: {show: false}},
        {name: '功率(KW)', gridIndex: 3, min: 0, max: 20, splitLine: {show: false}},
      ],
      yAxis: [
        {name: '功率(KW)', gridIndex: 0, min: 0, max: 15, splitLine: {show: false}},
        {name: '功率(KW)', gridIndex: 1, min: 0, max: 15, splitLine: {show: false}},
        {name: '功率(KW)', gridIndex: 2, min: 0, max: 15, splitLine: {show: false}},
        {name: '功率(KW)', gridIndex: 3, min: 0, max: 15, splitLine: {show: false}},
      ],
      series: [
        {
          name: 'I',
          type: 'scatter',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: dataAll[0],
        },
        {
          name: 'II',
          type: 'scatter',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: dataAll[1],
        },
        {
          name: 'III',
          type: 'scatter',
          xAxisIndex: 2,
          yAxisIndex: 2,
          data: dataAll[2],
        },
        {
          name: 'IV',
          type: 'scatter',
          xAxisIndex: 3,
          yAxisIndex: 3,
          data: dataAll[3],
        },
      ],
    };
  };

  handleChange = (value) => {
    console.log(value);
  };

  onChangeSwitch = () => {};

  onChangeGroup = (checkedList) => {
    this.setState({
      checkedList,
    });
  };

  onAllSwitch = () => {};

  render() {
    const { checkedList } = this.state;
    const timeData = ['2019.01', '2019.02', '2019.03', '2019.04', '2019.05', '2019.06', '2019.07', '2019.08', '2019.09', '2019.10', '2019.11', '2019.12', '2019.13', '2019.14'];
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
              <Switch defaultChecked onChange={this.onChangeSwitch} />
              <span>显示停机</span>
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
                options={timeData}
                value={checkedList}
                onChange={this.onChangeGroup}
              />
            </div>
            <div className={styles.allSwitch}>
              <Switch defaultChecked onChange={this.onAllSwitch} />
              <span>全部显示</span>
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
          <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
          <Icon type="swap" />
          <span className={styles.yAxis}>纵坐标</span>
          <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </div>
        <div className={styles.secCoordinate}>
          <span className={styles.xAxis}>横坐标</span>
          <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
          <Icon type="swap" />
          <span className={styles.yAxis}>纵坐标</span>
          <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </div>
        <div className={styles.thrCoordinate}>
          <span className={styles.xAxis}>横坐标</span>
          <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
          <Icon type="swap" />
          <span className={styles.yAxis}>纵坐标</span>
          <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </div>
        <div className={styles.fouCoordinate}>
          <span className={styles.xAxis}>横坐标</span>
          <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
          <Icon type="swap" />
          <span className={styles.yAxis}>纵坐标</span>
          <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </div>
      </div>
    );
  }
}
