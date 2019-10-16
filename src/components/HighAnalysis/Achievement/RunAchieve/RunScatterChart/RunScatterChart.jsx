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
    checkedMonths: PropTypes.array,
    allMonths: PropTypes.array,
    pointsInfo: PropTypes.array,
    changeStore: PropTypes.func,
    location: PropTypes.object,
    queryParamsFunc: PropTypes.func,
    thirdChartFunc: PropTypes.func,
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
      const firstDataFilter = this.filterTimeFunc(firstChartData, checkedMonths);
      const secondDataFilter = this.filterTimeFunc(secondChartData, checkedMonths);
      const thirdDataFilter = this.filterTimeFunc(thirdChartData, checkedMonths);
      const FourthDataFilter = this.filterTimeFunc(fourthChartData, checkedMonths);
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
          firstData.push([
            this.formatNumberFunc(item.xAxis),
            this.formatNumberFunc(item.yAxis),
            moment(item.time).format('YYYY-MM-DD HH:mm:ss'),
            cur.deviceName,
          ]);
        });
    });
    const secondData = [];
    secondChartData.forEach(cur => {
      cur.dataList && cur.dataList.forEach(item => {
        secondData.push([
          this.formatNumberFunc(item.xAxis),
          this.formatNumberFunc(item.yAxis),
          moment(item.time).format('YYYY-MM-DD HH:mm:ss'),
          cur.deviceName,
        ]);
      });
    });
    const thirdData = [];
    thirdChartData.forEach(cur => {
      cur.dataList && cur.dataList.forEach(item => {
        thirdData.push([
          this.formatNumberFunc(item.xAxis),
          this.formatNumberFunc(item.yAxis),
          moment(item.time).format('YYYY-MM-DD HH:mm:ss'),
          cur.deviceName,
        ]);
      });
    });
    const fourthData = [];
    fourthChartData.forEach(cur => {
      cur.dataList && cur.dataList.forEach(item => {
        fourthData.push([
          this.formatNumberFunc(item.xAxis),
          this.formatNumberFunc(item.yAxis),
          moment(item.time).format('YYYY-MM-DD HH:mm:ss'),
          cur.deviceName,
        ]);
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
        // 表示 目标系列 的视觉样式。
        target: {
          outOfRange: {
            symbol: 'circle',
            color: 'transparent',
          },
          inRange: {
            color: ['#00cdff', '#ff6cee', '#ff9000'],
          },
        },
        // 表示 visualMap-piecewise 本身的视觉样式。
        controller: {
          outOfRange: {
            symbol: 'circle',
            color: '#cccccc',
          },
          inRange: {
            color: ['#00cdff', '#ff6cee', '#ff9000'],
          },
        },
        align: 'left',
        hoverLink: false,
        top: '230px',
        right: '45px',
      },
      brush: {
        brushLink: 'all',
        xAxisIndex: [0, 1, 2, 3],
        yAxisIndex: [0, 1, 2, 3],
        inBrush: {
          opacity: 1,
        },
        outOfBrush: {
          opacity: 0.2,
          colorLightness: 0.8, // 颜色的明暗度
        },
        throttleType: 'debounce',
        throttleDelay: 300,
      },
      tooltip: {
        formatter: (params) => {
          const { seriesName, data } = params;
          return `<div>
              <span>${data[2] || '--'}</span><br /><span>${`${seriesName.split('VS')[0]}：${data[0] || '--'}`}</span><br /><span>${`${seriesName.split('VS')[1]}：${data[1] || '--'}`}</span>
        </div>`;
        },
      },
      xAxis: [
        {name: `${firstXAxisName}（${firstXAxisUnit || ''}）`.replace(/(.{6})/g, '$1'+'\n'), gridIndex: 0, min: minNum, splitLine: {show: false}, axisLine: {onZero: false}},
        {name: `${secondXAxisName}（${secondXAxisUnit || ''}）`.replace(/(.{6})/g, '$1'+'\n'), gridIndex: 1, min: minNum, splitLine: {show: false}, axisLine: {onZero: false}},
        {name: `${thirdXAxisName}（${thirdXAxisUnit || ''}）`.replace(/(.{6})/g, '$1'+'\n'), gridIndex: 2, min: minNum, splitLine: {show: false}, axisLine: {onZero: false}},
        {name: `${fourthXAxisName}（${fourthXAxisUnit || ''}）`.replace(/(.{6})/g, '$1'+'\n'), gridIndex: 3, min: minNum, splitLine: {show: false}, axisLine: {onZero: false}},
      ],
      yAxis: [
        {name: `${firstYAxisName}（${firstYAxisUnit || ''}）`, gridIndex: 0, min: minNum, splitLine: {show: false}, axisLine: {onZero: false}},
        {name: `${secondYAxisName}（${secondYAxisUnit || ''}）`, gridIndex: 1, min: minNum, splitLine: {show: false}, axisLine: {onZero: false}},
        {name: `${thirdYAxisName}（${thirdYAxisUnit || ''}）`, gridIndex: 2, min: minNum, splitLine: {show: false}, axisLine: {onZero: false}},
        {name: `${fourthYAxisName}（${fourthYAxisUnit || ''}）`, gridIndex: 3, min: minNum, splitLine: {show: false}, axisLine: {onZero: false}},
      ],
      series: [
        {
          name: `${firstXAxisName}VS${firstYAxisName}`,
          type: 'scatter',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: firstData.reverse(),
          progressive: 0,
          symbolSize: 3,
        },
        {
          name: `${secondXAxisName}VS${secondYAxisName}`,
          type: 'scatter',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: secondData.reverse(),
          progressive: 0,
          symbolSize: 3,
        },
        {
          name: `${thirdXAxisName}VS${thirdYAxisName}`,
          type: 'scatter',
          xAxisIndex: 2,
          yAxisIndex: 2,
          data: thirdData.reverse(),
          progressive: 0,
          symbolSize: 3,
        },
        {
          name: `${fourthXAxisName}VS${fourthYAxisName}`,
          type: 'scatter',
          xAxisIndex: 3,
          yAxisIndex: 3,
          data: fourthData.reverse(),
          progressive: 0,
          symbolSize: 3,
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
      pointsInfo,
      firstHideZero,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${value}-xAxis-${firstHideZero}`, `${firstChartYAxis}-yAxis-${firstHideZero}`],
      };
      pointsInfo && pointsInfo.forEach(cur => {
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
      pointsInfo,
      firstHideZero,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${firstChartXAxis}-xAxis-${firstHideZero}`, `${value}-yAxis-${firstHideZero}`],
      };
      pointsInfo && pointsInfo.forEach(cur => {
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
      pointsInfo,
      secondHideZero,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${value}-xAxis-${secondHideZero}`, `${secondChartYAxis}-yAxis-${secondHideZero}`],
      };
      pointsInfo && pointsInfo.forEach(cur => {
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
      pointsInfo,
      secondHideZero,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${secondChartXAxis}-xAxis-${secondHideZero}`, `${value}-yAxis-${secondHideZero}`],
      };
      pointsInfo && pointsInfo.forEach(cur => {
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
      pointsInfo,
      thirdHideZero,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${value}-xAxis-${thirdHideZero}`, `${thirdChartYAxis}-yAxis-${thirdHideZero}`],
      };
      pointsInfo && pointsInfo.forEach(cur => {
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
      pointsInfo,
      thirdHideZero,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${thirdChartXAxis}-xAxis-${thirdHideZero}`, `${value}-yAxis-${thirdHideZero}`],
      };
      pointsInfo && pointsInfo.forEach(cur => {
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
      pointsInfo,
      fourthHideZero,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${value}-xAxis-${fourthHideZero}`, `${fourthChartYAxis}-yAxis-${fourthHideZero}`],
      };
      pointsInfo && pointsInfo.forEach(cur => {
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
      pointsInfo,
      fourthHideZero,
    } = this.props;
    // 发送请求
    const groupInfoStr = searchUtil(search).getValue('run');
    if (groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basisParams = this.basisParamsFunc(groupInfo);
      const params = {
        ...basisParams,
        codes: [`${fourthChartXAxis}-xAxis-${fourthHideZero}`, `${value}-yAxis-${fourthHideZero}`],
      };
      pointsInfo && pointsInfo.forEach(cur => {
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
      changeStore,
      queryParamsFunc,
      thirdChartFunc,
      location: {search},
    } = this.props;
    changeStore({
      firstHideZero: checked ? 0 : 1,
      secondHideZero: checked ? 0 : 1,
      thirdHideZero: checked ? 0 : 1,
      fourthHideZero: checked ? 0 : 1,
    });
    this.setState({
      minNum: checked ? null : 0,
    }, () => {
      const groupInfoStr = searchUtil(search).getValue('run');
      if (groupInfoStr) {
        // 请求接口
        const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
        queryParamsFunc(groupInfo);
        thirdChartFunc(groupInfo);
      }
    });
  };

  onChangeGroup = (checkedList) => {
    const { scatterChart } = this;
    const {
      changeStore,
      firstChartData,
      secondChartData,
      thirdChartData,
      fourthChartData,
    } = this.props;
    const firstDataFilter = this.filterTimeFunc(firstChartData, checkedList);
    const secondDataFilter = this.filterTimeFunc(secondChartData, checkedList);
    const thirdDataFilter = this.filterTimeFunc(thirdChartData, checkedList);
    const FourthDataFilter = this.filterTimeFunc(fourthChartData, checkedList);
    changeStore({
      checkedMonths: checkedList,
    });
    eCharts.init(scatterChart).clear();//清除
    const myChart = eCharts.init(scatterChart);
    myChart.setOption(this.drawChart(firstDataFilter, secondDataFilter, thirdDataFilter, FourthDataFilter));
  };

  onAllSwitch = (checked) => {
    const { scatterChart } = this;
    const {
      changeStore,
      firstChartData,
      secondChartData,
      thirdChartData,
      fourthChartData,
      allMonths,
    } = this.props;
    const firstDataFilter = this.filterTimeFunc(firstChartData, checked ? allMonths : []);
    const secondDataFilter = this.filterTimeFunc(secondChartData, checked ? allMonths : []);
    const thirdDataFilter = this.filterTimeFunc(thirdChartData, checked ? allMonths : []);
    const FourthDataFilter = this.filterTimeFunc(fourthChartData, checked ? allMonths : []);
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
  // 处理option没有value，直接显示name
  valueFlagFunc = (value, name) => {
    const { pointsInfo } = this.props;
    // 判断是否存在测点
    const valueFlag = pointsInfo.map(cur => (cur.name)).includes(value);
    return valueFlag ? value : name;
  };

  nameFormatFunc = (name) => {
    // 超出10个字，显示9个字...
    return name.length > 10 ? name.substring(0, 9) + '...' : name;
  };

  render() {
    const { minNum } = this.state;
    const {
      pointsInfo,
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
    const firstXAxisOption = pointsInfo && pointsInfo.map(cur => {
      return (
        <Option title={cur.name} key={`${cur.value}-${cur.name}`} value={cur.value}>{this.nameFormatFunc(cur.name)}</Option>
      );
    });
    const firstYAxisOption = pointsInfo && pointsInfo.map(cur => {
      return (
        <Option title={cur.name} key={`${cur.value}-${cur.name}`} value={cur.value}>{this.nameFormatFunc(cur.name)}</Option>
      );
    });
    const secondXAxisOption = pointsInfo && pointsInfo.map(cur => {
      return (
        <Option title={cur.name} key={`${cur.value}-${cur.name}`} value={cur.value}>{this.nameFormatFunc(cur.name)}</Option>
      );
    });
    const secondYAxisOption = pointsInfo && pointsInfo.map(cur => {
      return (
        <Option title={cur.name} key={`${cur.value}-${cur.name}`} value={cur.value}>{this.nameFormatFunc(cur.name)}</Option>
      );
    });
    const thirdXAxisOption = pointsInfo && pointsInfo.map(cur => {
      return (
        <Option title={cur.name} key={`${cur.value}-${cur.name}`} value={cur.value}>{this.nameFormatFunc(cur.name)}</Option>
      );
    });
    const thirdYAxisOption = pointsInfo && pointsInfo.map(cur => {
      return (
        <Option title={cur.name} key={`${cur.value}-${cur.name}`} value={cur.value}>{this.nameFormatFunc(cur.name)}</Option>
      );
    });
    const fourthXAxisOption = pointsInfo && pointsInfo.map(cur => {
      return (
        <Option title={cur.name} key={`${cur.value}-${cur.name}`} value={cur.value}>{this.nameFormatFunc(cur.name)}</Option>
      );
    });
    const fourthYAxisOption = pointsInfo && pointsInfo.map(cur => {
      return (
        <Option title={cur.name} key={`${cur.value}-${cur.name}`} value={cur.value}>{this.nameFormatFunc(cur.name)}</Option>
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
          <Select dropdownMatchSelectWidth={false} value={this.valueFlagFunc(firstChartXAxis, firstXAxisName)} style={{ width: 120 }} onChange={this.firstXAxisChange}>
            {firstXAxisOption}
          </Select>
          <Icon type="swap" onClick={this.firstChartExchange} />
          <span className={styles.yAxis}>纵坐标</span>
          <Select dropdownMatchSelectWidth={false} value={this.valueFlagFunc(firstChartYAxis, firstYAxisName)} style={{ width: 120 }} onChange={this.firstYAxisChange}>
            {firstYAxisOption}
          </Select>
        </div>
        <div className={styles.secCoordinate}>
          <span className={styles.xAxis}>横坐标</span>
          <Select dropdownMatchSelectWidth={false} value={this.valueFlagFunc(secondChartXAxis, secondXAxisName)} style={{ width: 120 }} onChange={this.secondXAxisChange}>
            {secondXAxisOption}
          </Select>
          <Icon type="swap" onClick={this.secondChartExchange} />
          <span className={styles.yAxis}>纵坐标</span>
          <Select dropdownMatchSelectWidth={false} value={this.valueFlagFunc(secondChartYAxis, secondYAxisName)} style={{ width: 120 }} onChange={this.secondYAxisChange}>
            {secondYAxisOption}
          </Select>
        </div>
        <div className={styles.thrCoordinate}>
          <span className={styles.xAxis}>横坐标</span>
          <Select dropdownMatchSelectWidth={false} value={this.valueFlagFunc(thirdChartXAxis, thirdXAxisName)} style={{ width: 120 }} onChange={this.thirdXAxisChange}>
            {thirdXAxisOption}
          </Select>
          <Icon type="swap" onClick={this.thirdChartExchange} />
          <span className={styles.yAxis}>纵坐标</span>
          <Select dropdownMatchSelectWidth={false} value={this.valueFlagFunc(thirdChartYAxis, thirdYAxisName)} style={{ width: 120 }} onChange={this.thirdYAxisChange}>
            {thirdYAxisOption}
          </Select>
        </div>
        <div className={styles.fouCoordinate}>
          <span className={styles.xAxis}>横坐标</span>
          <Select dropdownMatchSelectWidth={false} value={this.valueFlagFunc(fourthChartXAxis, fourthXAxisName)} style={{ width: 120 }} onChange={this.fourthXAxisChange}>
            {fourthXAxisOption}
          </Select>
          <Icon type="swap" onClick={this.fourthChartExchange} />
          <span className={styles.yAxis}>纵坐标</span>
          <Select dropdownMatchSelectWidth={false} value={this.valueFlagFunc(fourthChartYAxis, fourthYAxisName)} style={{ width: 120 }} onChange={this.fourthYAxisChange}>
            {fourthYAxisOption}
          </Select>
        </div>
      </div>
    );
  }
}
