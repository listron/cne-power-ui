import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import searchUtil from '../../../../utils/searchUtil';
import { runAchieveAction } from './runAchieveReducer';
import RunSearch from '../../../../components/HighAnalysis/Achievement/RunAchieve/RunSearch/RunSearch';
import RunSequenceChart from '../../../../components/HighAnalysis/Achievement/RunAchieve/RunSequenceChart/RunSequenceChart';
import RunScatterChart from '../../../../components/HighAnalysis/Achievement/RunAchieve/RunScatterChart/RunScatterChart';

import styles from './runAchieve.scss';

class RunAchieve extends Component {

  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    hourOptionValue: PropTypes.string,
    getSequenceChart: PropTypes.func,
    getFirstChart: PropTypes.func,
    getSecondChart: PropTypes.func,
    getThirdChart: PropTypes.func,
    getFourthChart: PropTypes.func,
    changeStore: PropTypes.func,
    pointTime: PropTypes.number,
    // 第一个散点图坐标
    firstChartXAxis: PropTypes.string,
    firstChartYAxis: PropTypes.string,
    firstHideZero: PropTypes.number,

    // 第二个散点图坐标
    secondChartXAxis: PropTypes.string,
    secondChartYAxis: PropTypes.string,
    secondHideZero: PropTypes.number,

    // 第三个散点图坐标
    thirdChartXAxis: PropTypes.string,
    thirdChartYAxis: PropTypes.string,
    thirdHideZero: PropTypes.number,

    // 第四个散点图坐标
    fourthChartXAxis: PropTypes.string,
    fourthChartYAxis: PropTypes.string,
    fourthHideZero: PropTypes.number,
  };

  componentDidMount() {
    const {
      location: {
        search,
      },
    } = this.props;
    const groupInfoStr = searchUtil(search).getValue('run');
    if(groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      this.queryParamsFunc(groupInfo);
    }
  }

  componentWillReceiveProps (nextProps) {
    const {
      location: {
        search: nextSearch,
      },
      pointTime: nextPointTime,
    } = nextProps;
    const {
      location: {
        search,
      },
      pointTime,
    } = this.props;
    const groupNextInfoStr = searchUtil(nextSearch).getValue('run');
    const groupInfoStr = searchUtil(search).getValue('run');
    // 判断地址栏发生变化
    const infoStrFlag = groupNextInfoStr && groupNextInfoStr !== groupInfoStr;
    if (infoStrFlag) {
      const groupInfo = groupNextInfoStr ? JSON.parse(groupNextInfoStr) : {};
      this.queryParamsFunc(groupInfo);
      if(nextPointTime && nextPointTime === pointTime) {
        // 第三个图表
        this.thirdChartFunc(groupInfo);
      }
    }
  }

  // 统一请求
  queryParamsFunc = (groupInfo) => {
    const {
      hourOptionValue,
      getSequenceChart,
      getFirstChart,
      getSecondChart,
      getFourthChart,
      changeStore,
      // 第一个散点图坐标
      firstChartXAxis,
      firstChartYAxis,
      firstHideZero,
      // 第二个散点图坐标
      secondChartXAxis,
      secondChartYAxis,
      secondHideZero,
      // 第四个散点图坐标
      fourthChartXAxis,
      fourthChartYAxis,
      fourthHideZero,
    } = this.props;
    const {
      searchDevice,
      searchDates,
    } = groupInfo;
    // 基础参数
    const basisParams = {
      startTime: moment(searchDates[0]).utc().format(),
      endTime: moment(searchDates[1]).add(1, 'days').utc().format(),
      deviceFullcodes: searchDevice,
    };
    // 时序图
    const hourParams = {
      ...basisParams,
      codes: [`${hourOptionValue}-value`],
    };
    // 第一个散点图
    const firstParams = {
      ...basisParams,
      codes: [`${firstChartXAxis}-xAxis-${firstHideZero}`, `${firstChartYAxis}-yAxis-${firstHideZero}`],
    };
    // 第二个散点图
    const secondParams = {
      ...basisParams,
      codes: [`${secondChartXAxis}-xAxis-${secondHideZero}`, `${secondChartYAxis}-yAxis-${secondHideZero}`],
    };
    // 第四个散点图
    const fourthParams = {
      ...basisParams,
      codes: [`${fourthChartXAxis}-xAxis-${fourthHideZero}`, `${fourthChartYAxis}-yAxis-${fourthHideZero}`],
    };
    const startTime = moment(searchDates[0]).format('YYYY-MM');
    const endTime = searchDates[1];
    const rangeMonths = this.getAllMonths(startTime, endTime);

    changeStore({
      allMonths: rangeMonths,
      checkedMonths: rangeMonths,
    });
    // 请求接口
    getSequenceChart(hourParams);
    getFirstChart(firstParams);
    getSecondChart(secondParams);
    getFourthChart(fourthParams);
  };

  thirdChartFunc = (groupInfo) => {
    const {
      getThirdChart,
      // 第三个散点图坐标
      thirdChartXAxis,
      thirdChartYAxis,
      thirdHideZero,
    } = this.props;
    const {
      searchDevice,
      searchDates,
    } = groupInfo;
    // 基础参数
    const basisParams = {
      startTime: moment(searchDates[0]).utc().format(),
      endTime: moment(searchDates[1]).add(1, 'days').utc().format(),
      deviceFullcodes: searchDevice,
    };
    // 第三个散点图
    const thirdParams = {
      ...basisParams,
      codes: [`${thirdChartXAxis}-xAxis-${thirdHideZero}`, `${thirdChartYAxis}-yAxis-${thirdHideZero}`],
    };
    getThirdChart(thirdParams);
  };

  getAllMonths = (startTime, endTime) => {
    if (moment(startTime).isBefore(endTime, 'day') || moment(startTime).isSame(endTime, 'day')) {
      let configTime = moment(startTime);
      const allMonths = [configTime.format('YYYY-MM')];
      while(configTime.isBefore(endTime, 'M')){
        configTime = configTime.add(1, 'M');
        allMonths.push(configTime.format('YYYY-MM'));
      }
      return allMonths;
    }
    return [];
  };

  render() {
    return (
      <div className={styles.runAchieve}>
        <RunSearch
          thirdChartFunc={this.thirdChartFunc}
          {...this.props}
        />
        <RunSequenceChart {...this.props} />
        <RunScatterChart
          thirdChartFunc={this.thirdChartFunc}
          queryParamsFunc={this.queryParamsFunc}
          {...this.props}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveRun.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  getDevices: payload => dispatch({ type: runAchieveAction.getDevices, payload }),
  getSequenceChart: payload => dispatch({ type: runAchieveAction.getSequenceChart, payload }),
  getFirstChart: payload => dispatch({ type: runAchieveAction.getFirstChart, payload }),
  getSecondChart: payload => dispatch({ type: runAchieveAction.getSecondChart, payload }),
  getThirdChart: payload => dispatch({ type: runAchieveAction.getThirdChart, payload }),
  getFourthChart: payload => dispatch({ type: runAchieveAction.getFourthChart, payload }),
  changeStore: payload => dispatch({ type: runAchieveAction.changeStore, payload }),
  getPointsInfo: payload => dispatch({ type: runAchieveAction.getPointsInfo, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RunAchieve);
