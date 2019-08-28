import React, {Component} from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import moment from 'moment';
import {Checkbox, Icon, Select, Switch} from 'antd';
import searchUtil from '../../../../../utils/searchUtil';
import { dataFormat } from '../../../../../utils/utilFunc';

import styles from './runScatterChart.scss';

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;

export default class RunScatterChart extends Component {

  static propTypes = {
    indicatorsList: PropTypes.array,
    checkedMonths: PropTypes.array,
    allMonths: PropTypes.array,
    changeStore: PropTypes.func,
    location: PropTypes.object,
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
    firstXAxisName: PropTypes.string,
    firstXAxisUnit: PropTypes.string,
    firstYAxisName: PropTypes.string,
    firstYAxisUnit: PropTypes.string,
    getFirstChart: PropTypes.func,

    // 第二个散点图坐标
    secondChartXAxis: PropTypes.string,
    secondChartYAxis: PropTypes.string,
    secondXAxisName: PropTypes.string,
    secondXAxisUnit: PropTypes.string,
    secondYAxisName: PropTypes.string,
    secondYAxisUnit: PropTypes.string,
    getSecondChart: PropTypes.func,

    // 第三个散点图坐标
    thirdChartXAxis: PropTypes.string,
    thirdChartYAxis: PropTypes.string,
    thirdXAxisName: PropTypes.string,
    thirdXAxisUnit: PropTypes.string,
    thirdYAxisName: PropTypes.string,
    thirdYAxisUnit: PropTypes.string,
    getThirdChart: PropTypes.func,

    // 第四个散点图坐标
    fourthChartXAxis: PropTypes.string,
    fourthChartYAxis: PropTypes.string,
    fourthXAxisName: PropTypes.string,
    fourthXAxisUnit: PropTypes.string,
    fourthYAxisName: PropTypes.string,
    fourthYAxisUnit: PropTypes.string,
    getFourthChart: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      minNum: 0, // 显示停机
    };
  }

  componentDidUpdate(prevProps) {
    const { scatterChart } = this;
    const { minNum } = this.state;
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
      checkedMonths,
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
      let firstDataFilter = this.filterTimeFunc(firstChartData, checkedMonths);
      let secondDataFilter = this.filterTimeFunc(secondChartData, checkedMonths);
      let thirdDataFilter = this.filterTimeFunc(thirdChartData, checkedMonths);
      let FourthDataFilter = this.filterTimeFunc(fourthChartData, checkedMonths);
      // 过滤小于0的数据 且选中的时间
      if(minNum === 0) {
        firstDataFilter = this.filterDataFunc(firstDataFilter, checkedMonths);
        secondDataFilter = this.filterDataFunc(secondDataFilter, checkedMonths);
        thirdDataFilter = this.filterDataFunc(thirdDataFilter, checkedMonths);
        FourthDataFilter = this.filterDataFunc(FourthDataFilter, checkedMonths);
      }
      myChart.setOption(this.drawChart(firstDataFilter, secondDataFilter, thirdDataFilter, FourthDataFilter));
    }
  }

  formatNumberFunc = (number) => {
    return dataFormat(number, '--', 2);
  };


  drawChart = (firstChartData, secondChartData, thirdChartData, fourthChartData) => {
    const { minNum } = this.state;
    const {
      firstXAxisName,
      firstXAxisUnit,
      firstYAxisName,
      firstYAxisUnit,
      secondXAxisName,
      secondXAxisUnit,
      secondYAxisName,
      secondYAxisUnit,
      thirdXAxisName,
      thirdXAxisUnit,
      thirdYAxisName,
      thirdYAxisUnit,
      fourthXAxisName,
      fourthXAxisUnit,
      fourthYAxisName,
      fourthYAxisUnit,
    } = this.props;
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
        // outOfRange: {
        //   symbol: 'circle',
        //   color: '#cccccc',
        // },
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
        outOfBrush: {
          color: '#cccccc',
        },
        throttleType: 'debounce',
        throttleDelay: 300,
      },
      // tooltip: {
      //   formatter: '{a}: ({c})',
      // },
      xAxis: [
        {name: `${firstXAxisName}（${firstXAxisUnit}）`, gridIndex: 0, min: minNum, splitLine: {show: false}},
        {name: `${secondXAxisName}（${secondXAxisUnit}）`, gridIndex: 1, min: minNum, splitLine: {show: false}},
        {name: `${thirdXAxisName}（${thirdXAxisUnit}）`, gridIndex: 2, min: minNum, splitLine: {show: false}},
        {name: `${fourthXAxisName}（${fourthXAxisUnit}）`, gridIndex: 3, min: minNum, splitLine: {show: false}},
      ],
      yAxis: [
        {name: `${firstYAxisName}（${firstYAxisUnit}）`, gridIndex: 0, min: minNum, splitLine: {show: false}},
        {name: `${secondYAxisName}（${secondYAxisUnit}）`, gridIndex: 1, min: minNum, splitLine: {show: false}},
        {name: `${thirdYAxisName}（${thirdYAxisUnit}）`, gridIndex: 2, min: minNum, splitLine: {show: false}},
        {name: `${fourthYAxisName}（${fourthYAxisUnit}）`, gridIndex: 3, min: minNum, splitLine: {show: false}},
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

  // 第一个图x轴
  firstXAxisChange = (value) => {
    const {
      getFirstChart,
      location: {
        search,
      },
      firstChartYAxis,
      changeStore,
      indicatorsList,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${value}-xAxis`, `${firstChartYAxis}-yAxis`],
      };
      indicatorsList && indicatorsList.forEach(cur => {
        if (value === cur.value) {
          changeStore({
            firstXAxisName: cur.name,
            firstXAxisUnit: cur.unitName,
            firstChartXAxis: value,
          });
        }
      });
      getFirstChart(params);
    }
  };

  // 第一个图y轴
  firstYAxisChange = (value) => {
    const {
      getFirstChart,
      location: {
        search,
      },
      firstChartXAxis,
      changeStore,
      indicatorsList,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${firstChartXAxis}-xAxis`, `${value}-yAxis`],
      };
      indicatorsList && indicatorsList.forEach(cur => {
        if (value === cur.value) {
          changeStore({
            firstYAxisName: cur.name,
            firstYAxisUnit: cur.unitName,
            firstChartYAxis: value,
          });
        }
      });
      getFirstChart(params);
    }
  };

  // 第二个图x轴
  secondXAxisChange = (value) => {
    const {
      getSecondChart,
      location: {
        search,
      },
      secondChartYAxis,
      changeStore,
      indicatorsList,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${value}-xAxis`, `${secondChartYAxis}-yAxis`],
      };
      indicatorsList && indicatorsList.forEach(cur => {
        if (value === cur.value) {
          changeStore({
            secondXAxisName: cur.name,
            secondXAxisUnit: cur.unitName,
            secondChartXAxis: value,
          });
        }
      });
      getSecondChart(params);
    }
  };

  // 第二个图y轴
  secondYAxisChange = (value) => {
    const {
      getSecondChart,
      location: {
        search,
      },
      secondChartXAxis,
      changeStore,
      indicatorsList,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${secondChartXAxis}-xAxis`, `${value}-yAxis`],
      };
      indicatorsList && indicatorsList.forEach(cur => {
        if (value === cur.value) {
          changeStore({
            secondYAxisName: cur.name,
            secondYAxisUnit: cur.unitName,
            secondChartYAxis: value,
          });
        }
      });
      getSecondChart(params);
    }
  };

  // 第三个图x轴
  thirdXAxisChange = (value) => {
    const {
      getThirdChart,
      location: {
        search,
      },
      thirdChartYAxis,
      changeStore,
      indicatorsList,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${value}-xAxis`, `${thirdChartYAxis}-yAxis`],
      };
      indicatorsList && indicatorsList.forEach(cur => {
        if (value === cur.value) {
          changeStore({
            thirdXAxisName: cur.name,
            thirdXAxisUnit: cur.unitName,
            thirdChartXAxis: value,
          });
        }
      });
      getThirdChart(params);
    }
  };

  // 第三个图y轴
  thirdYAxisChange = (value) => {
    const {
      getThirdChart,
      location: {
        search,
      },
      thirdChartXAxis,
      changeStore,
      indicatorsList,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${thirdChartXAxis}-xAxis`, `${value}-yAxis`],
      };
      indicatorsList && indicatorsList.forEach(cur => {
        if (value === cur.value) {
          changeStore({
            thirdYAxisName: cur.name,
            thirdYAxisUnit: cur.unitName,
            thirdChartYAxis: value,
          });
        }
      });
      getThirdChart(params);
    }
  };

  // 第四个图x轴
  fourthXAxisChange = (value) => {
    const {
      getFourthChart,
      location: {
        search,
      },
      fourthChartYAxis,
      changeStore,
      indicatorsList,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${value}-xAxis`, `${fourthChartYAxis}-yAxis`],
      };
      indicatorsList && indicatorsList.forEach(cur => {
        if (value === cur.value) {
          changeStore({
            fourthXAxisName: cur.name,
            fourthXAxisUnit: cur.unitName,
            fourthChartXAxis: value,
          });
        }
      });
      getFourthChart(params);
    }
  };

  // 第四个图y轴
  fourthYAxisChange = (value) => {
    const {
      getFourthChart,
      location: {
        search,
      },
      fourthChartXAxis,
      changeStore,
      indicatorsList,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${fourthChartXAxis}-xAxis`, `${value}-yAxis`],
      };
      indicatorsList && indicatorsList.forEach(cur => {
        if (value === cur.value) {
          changeStore({
            fourthYAxisName: cur.name,
            fourthYAxisUnit: cur.unitName,
            fourthChartYAxis: value,
          });
        }
      });
      getFourthChart(params);
    }
  };

  // 第一个图交互坐标
  firstChartExchange = () => {
    const {
      getFirstChart,
      location: {
        search,
      },
      firstChartYAxis,
      firstChartXAxis,
      firstXAxisName,
      firstXAxisUnit,
      firstYAxisName,
      firstYAxisUnit,
      changeStore,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${firstChartYAxis}-xAxis`, `${firstChartXAxis}-yAxis`],
      };
      // 信息互换
      changeStore({
        firstXAxisName: firstYAxisName,
        firstXAxisUnit: firstYAxisUnit,
        firstYAxisName: firstXAxisName,
        firstYAxisUnit: firstXAxisUnit,
        firstChartXAxis: firstChartYAxis,
        firstChartYAxis: firstChartXAxis,
      });
      getFirstChart(params);
    }
  };

  // 第二个图交互坐标
  secondChartExchange = () => {
    const {
      getSecondChart,
      location: {
        search,
      },
      secondChartYAxis,
      secondChartXAxis,
      secondXAxisName,
      secondXAxisUnit,
      secondYAxisName,
      secondYAxisUnit,
      changeStore,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${secondChartYAxis}-xAxis`, `${secondChartXAxis}-yAxis`],
      };
      // 信息互换
      changeStore({
        secondXAxisName: secondYAxisName,
        secondXAxisUnit: secondYAxisUnit,
        secondYAxisName: secondXAxisName,
        secondYAxisUnit: secondXAxisUnit,
        secondChartXAxis: secondChartYAxis,
        secondChartYAxis: secondChartXAxis,
      });
      getSecondChart(params);
    }
  };

  // 第三个图交互坐标
  thirdChartExchange = () => {
    const {
      getThirdChart,
      location: {
        search,
      },
      thirdChartYAxis,
      thirdChartXAxis,
      thirdXAxisName,
      thirdXAxisUnit,
      thirdYAxisName,
      thirdYAxisUnit,
      changeStore,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${thirdChartYAxis}-xAxis`, `${thirdChartXAxis}-yAxis`],
      };
      // 信息互换
      changeStore({
        thirdXAxisName: thirdYAxisName,
        thirdXAxisUnit: thirdYAxisUnit,
        thirdYAxisName: thirdXAxisName,
        thirdYAxisUnit: thirdXAxisUnit,
        thirdChartXAxis: thirdChartYAxis,
        thirdChartYAxis: thirdChartXAxis,
      });
      getThirdChart(params);
    }
  };

  // 第四个图交互坐标
  fourthChartExchange = () => {
    const {
      getFourthChart,
      location: {
        search,
      },
      fourthChartYAxis,
      fourthChartXAxis,
      fourthXAxisName,
      fourthXAxisUnit,
      fourthYAxisName,
      fourthYAxisUnit,
      changeStore,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${fourthChartYAxis}-xAxis`, `${fourthChartXAxis}-yAxis`],
      };
      // 信息互换
      changeStore({
        fourthXAxisName: fourthYAxisName,
        fourthXAxisUnit: fourthYAxisUnit,
        fourthYAxisName: fourthXAxisName,
        fourthYAxisUnit: fourthXAxisUnit,
        fourthChartXAxis: fourthChartYAxis,
        fourthChartYAxis: fourthChartXAxis,
      });
      getFourthChart(params);
    }
  };

  filterDataFunc = (data, timeArr) => {
    return data.map(cur => ({
      deviceName: cur.deviceName,
      dataList: cur.dataList.filter(item => {
        return item.xAxis > 0 && item.yAxis > 0 && timeArr.includes(moment(item.time).format('YYYY-MM'));
      }),
    }));
  };

  filterTimeFunc = (data, timeArr) => {
    return data.map(cur => ({
      deviceName: cur.deviceName,
      dataList: cur.dataList.filter(item => {
        return timeArr.includes(moment(item.time).format('YYYY-MM'));
      }),
    }));
  };


  onChangeSwitch = (checked) => {
    const {
      firstChartData,
      secondChartData,
      thirdChartData,
      fourthChartData,
      checkedMonths,
    } = this.props;
    let firstDataFilter = this.filterTimeFunc(firstChartData, checkedMonths);
    let secondDataFilter = this.filterTimeFunc(secondChartData, checkedMonths);
    let thirdDataFilter = this.filterTimeFunc(thirdChartData, checkedMonths);
    let FourthDataFilter = this.filterTimeFunc(fourthChartData, checkedMonths);
    // 过滤小于0的数据 且选中的时间
    if(!checked) {
      firstDataFilter = this.filterDataFunc(firstDataFilter, checkedMonths);
      secondDataFilter = this.filterDataFunc(secondDataFilter, checkedMonths);
      thirdDataFilter = this.filterDataFunc(thirdDataFilter, checkedMonths);
      FourthDataFilter = this.filterDataFunc(FourthDataFilter, checkedMonths);
    }
    this.setState({
      minNum: checked ? null : 0,
    }, () => {
      const { scatterChart } = this;
      eCharts.init(scatterChart).clear();//清除
      const myChart = eCharts.init(scatterChart);
      myChart.setOption(this.drawChart(firstDataFilter, secondDataFilter, thirdDataFilter, FourthDataFilter));
    });
  };

  onChangeGroup = (checkedList) => {
    const { scatterChart } = this;
    const { minNum } = this.state;
    const {
      changeStore,
      firstChartData,
      secondChartData,
      thirdChartData,
      fourthChartData,
    } = this.props;
    let firstDataFilter = this.filterTimeFunc(firstChartData, checkedList);
    let secondDataFilter = this.filterTimeFunc(secondChartData, checkedList);
    let thirdDataFilter = this.filterTimeFunc(thirdChartData, checkedList);
    let FourthDataFilter = this.filterTimeFunc(fourthChartData, checkedList);
    // 过滤小于0的数据 且选中的时间
    if(minNum === 0) {
      firstDataFilter = this.filterDataFunc(firstDataFilter, checkedList);
      secondDataFilter = this.filterDataFunc(secondDataFilter, checkedList);
      thirdDataFilter = this.filterDataFunc(thirdDataFilter, checkedList);
      FourthDataFilter = this.filterDataFunc(FourthDataFilter, checkedList);
    }
    changeStore({
      checkedMonths: checkedList,
    });
    eCharts.init(scatterChart).clear();//清除
    const myChart = eCharts.init(scatterChart);
    myChart.setOption(this.drawChart(firstDataFilter, secondDataFilter, thirdDataFilter, FourthDataFilter));
  };

  onAllSwitch = (checked) => {
    const { scatterChart } = this;
    const { minNum } = this.state;
    const {
      changeStore,
      firstChartData,
      secondChartData,
      thirdChartData,
      fourthChartData,
      allMonths,
    } = this.props;
    let firstDataFilter = this.filterTimeFunc(firstChartData, checked ? allMonths : []);
    let secondDataFilter = this.filterTimeFunc(secondChartData, checked ? allMonths : []);
    let thirdDataFilter = this.filterTimeFunc(thirdChartData, checked ? allMonths : []);
    let FourthDataFilter = this.filterTimeFunc(fourthChartData, checked ? allMonths : []);
    // 过滤小于0的数据 且选中的时间
    if(minNum === 0) {
      firstDataFilter = this.filterDataFunc(firstDataFilter, checked ? allMonths : []);
      secondDataFilter = this.filterDataFunc(secondDataFilter, checked ? allMonths : []);
      thirdDataFilter = this.filterDataFunc(thirdDataFilter, checked ? allMonths : []);
      FourthDataFilter = this.filterDataFunc(FourthDataFilter, checked ? allMonths : []);
    }
    changeStore({
      checkedMonths: checked ? allMonths : [],
    });
    eCharts.init(scatterChart).clear();//清除
    const myChart = eCharts.init(scatterChart);
    myChart.setOption(this.drawChart(firstDataFilter, secondDataFilter, thirdDataFilter, FourthDataFilter));
  };

  basisParamsFunc = (groupInfo) => {
    const {
      searchDevice,
      searchDates,
    } = groupInfo;
    // 基础参数
    return {
      startTime: moment(searchDates[0]).utc().format(),
      endTime: moment(searchDates[1]).utc().format(),
      deviceFullcodes: searchDevice,
    };
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
      firstXAxisName,
      firstYAxisName,
      // 第二个散点图坐标
      secondChartXAxis,
      secondChartYAxis,
      secondXAxisName,
      secondYAxisName,
      // 第三个散点图坐标
      thirdChartXAxis,
      thirdChartYAxis,
      thirdXAxisName,
      thirdYAxisName,
      // 第四个散点图坐标
      fourthChartXAxis,
      fourthChartYAxis,
      fourthXAxisName,
      fourthYAxisName,
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
          {`${firstXAxisName}VS${firstYAxisName}`}
        </div>
        <div className={styles.secChartTitle}>
          {`${secondXAxisName}VS${secondYAxisName}`}
        </div>
        <div className={styles.thrChartTitle}>
          {`${thirdXAxisName}VS${thirdYAxisName}`}
        </div>
        <div className={styles.fouChartTitle}>
          {`${fourthXAxisName}VS${fourthYAxisName}`}
        </div>
        <div className={styles.firCoordinate}>
          <span className={styles.xAxis}>横坐标</span>
          <Select value={firstChartXAxis} style={{ width: 120 }} onChange={this.firstXAxisChange}>
            {firstXAxisOption}
          </Select>
          <Icon type="swap" onClick={this.firstChartExchange} />
          <span className={styles.yAxis}>纵坐标</span>
          <Select value={firstChartYAxis} style={{ width: 120 }} onChange={this.firstYAxisChange}>
            {firstYAxisOption}
          </Select>
        </div>
        <div className={styles.secCoordinate}>
          <span className={styles.xAxis}>横坐标</span>
          <Select value={secondChartXAxis} style={{ width: 120 }} onChange={this.secondXAxisChange}>
            {secondXAxisOption}
          </Select>
          <Icon type="swap" onClick={this.secondChartExchange} />
          <span className={styles.yAxis}>纵坐标</span>
          <Select value={secondChartYAxis} style={{ width: 120 }} onChange={this.secondYAxisChange}>
            {secondYAxisOption}
          </Select>
        </div>
        <div className={styles.thrCoordinate}>
          <span className={styles.xAxis}>横坐标</span>
          <Select value={thirdChartXAxis} style={{ width: 120 }} onChange={this.thirdXAxisChange}>
            {thirdXAxisOption}
          </Select>
          <Icon type="swap" onClick={this.thirdChartExchange} />
          <span className={styles.yAxis}>纵坐标</span>
          <Select value={thirdChartYAxis} style={{ width: 120 }} onChange={this.thirdYAxisChange}>
            {thirdYAxisOption}
          </Select>
        </div>
        <div className={styles.fouCoordinate}>
          <span className={styles.xAxis}>横坐标</span>
          <Select value={fourthChartXAxis} style={{ width: 120 }} onChange={this.fourthXAxisChange}>
            {fourthXAxisOption}
          </Select>
          <Icon type="swap" onClick={this.fourthChartExchange} />
          <span className={styles.yAxis}>纵坐标</span>
          <Select value={fourthChartYAxis} style={{ width: 120 }} onChange={this.fourthYAxisChange}>
            {fourthYAxisOption}
          </Select>
        </div>
      </div>
    );
  }
}
