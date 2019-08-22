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
    getIndicatorsList: PropTypes.func,
    hourOptionValue: PropTypes.string,
    getSequenceChart: PropTypes.func,
    getFirstChart: PropTypes.func,
    getSecondChart: PropTypes.func,
    getThirdChart: PropTypes.func,
    getFourthChart: PropTypes.func,
    changeStore: PropTypes.func,
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

  componentDidMount() {
    const {
      location: {
        search,
      },
      getIndicatorsList,
    } = this.props;
    const groupInfoStr = searchUtil(search).getValue('run');
    if(groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      this.queryParamsFunc(groupInfo);
    }
    // 获取指标接口
    getIndicatorsList();
  }

  // 统一请求
  queryParamsFunc = (groupInfo) => {
    const {
      hourOptionValue,
      getSequenceChart,
      getFirstChart,
      getSecondChart,
      getThirdChart,
      getFourthChart,
      changeStore,
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
    const {
      searchDevice,
      searchDates,
    } = groupInfo;
    // 基础参数
    const basisParams = {
      startTime: moment(searchDates[0]).utc().format(),
      endTime: moment(searchDates[1]).utc().format(),
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
      codes: [`${firstChartXAxis}-xAxis`, `${firstChartYAxis}-yAxis`],
    };
    // 第二个散点图
    const secondParams = {
      ...basisParams,
      codes: [`${secondChartXAxis}-xAxis`, `${secondChartYAxis}-yAxis`],
    };
    // 第三个散点图
    const thirdParams = {
      ...basisParams,
      codes: [`${thirdChartXAxis}-xAxis`, `${thirdChartYAxis}-yAxis`],
    };
    // 第四个散点图
    const fourthParams = {
      ...basisParams,
      codes: [`${fourthChartXAxis}-xAxis`, `${fourthChartYAxis}-yAxis`],
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
    getThirdChart(thirdParams);
    getFourthChart(fourthParams);
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
        <RunSearch {...this.props} />
        <RunSequenceChart {...this.props} />
        <RunScatterChart {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveRun.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  getDevices: payload => dispatch({ type: runAchieveAction.getDevices, payload }),
  getIndicatorsList: payload => dispatch({ type: runAchieveAction.getIndicatorsList, payload }),
  getSequenceChart: payload => dispatch({ type: runAchieveAction.getSequenceChart, payload }),
  getFirstChart: payload => dispatch({ type: runAchieveAction.getFirstChart, payload }),
  getSecondChart: payload => dispatch({ type: runAchieveAction.getSecondChart, payload }),
  getThirdChart: payload => dispatch({ type: runAchieveAction.getThirdChart, payload }),
  getFourthChart: payload => dispatch({ type: runAchieveAction.getFourthChart, payload }),
  changeStore: payload => dispatch({ type: runAchieveAction.changeStore, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RunAchieve);
