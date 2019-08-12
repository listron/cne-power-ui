import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import searchUtil from '../../../../utils/searchUtil';
import { groupAchieveAction } from './groupAchieveReducer';
import GroupSearch from '../../../../components/HighAnalysis/Achievement/GroupAchieve/GroupSearch/GroupSearch';
import GroupAreaChart from '../../../../components/HighAnalysis/Achievement/GroupAchieve/GroupAreaChart/GroupAreaChart';
import GroupStationChart from '../../../../components/HighAnalysis/Achievement/GroupAchieve/GroupStationChart/GroupStationChart';
import GroupTrendChart from '../../../../components/HighAnalysis/Achievement/GroupAchieve/GroupTrendChart/GroupTrendChart';
import GroupLossChart from '../../../../components/HighAnalysis/Achievement/GroupAchieve/GroupLossChart/GroupLossChart';

import styles from './groupAchieve.scss';

class GroupAchieve extends Component {

  static propTypes = {
    topStringify: PropTypes.string,
    history: PropTypes.object,
    location: PropTypes.object,
    getGroupCapacity: PropTypes.func,
    getGroupRank: PropTypes.func,
    getGroupTrendInfo: PropTypes.func,
    getGroupLostGenHour: PropTypes.func,
    groupTimeStatus: PropTypes.string,
  };

  componentDidMount(){
    // 若是上级页面下钻进入 => search中的area与之前记录有变化。
    const { search } = this.props.location;
    const { groupTimeStatus } = this.props;
    const groupInfoStr = searchUtil(search).getValue('group');
    console.log(groupInfoStr, '====');
    if(groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const basicParams = this.basicParams(groupInfo);
      const {
        stations = [],
        modes = [],
        quota = [],
        modesInfo = [],
      } = groupInfo;
      // 默认指标分析
      const quotaValue = quota[1] || quota[0];
      const paramsCapacity = {
        ...basicParams,
        deviceModes: modes,
        regionName: stations.map(cur => {return cur.regionName;}),
        manufactorIds: modesInfo.map(cur => {
          return cur.value;
        }),
      };
      const paramsRank = {
        ...basicParams,
        indicatorCode: quotaValue,
      };
      const paramsTrend = {
        ...basicParams,
        regionName: paramsCapacity.regionName,
        indicatorCode: quotaValue,
        type: groupTimeStatus, // 默认按月
      };
      const paramsHour = {
        ...basicParams,
        manufactorIds: paramsCapacity.manufactorIds,
        deviceModes: paramsCapacity.deviceModes,
      };
      this.props.getGroupCapacity(paramsCapacity);
      this.props.getGroupRank(paramsRank);
      this.props.getGroupTrendInfo(paramsTrend);
      this.props.getGroupLostGenHour(paramsHour);
    }
  }

  componentWillReceiveProps(nextProps){ // search中的area字符串对比, 不同 => 解析+请求图表数据.
    const nextSearch = nextProps.location.search;
    const { search } = this.props.location;
    const { groupTimeStatus } = this.props;
    const groupNextInfoStr = searchUtil(nextSearch).getValue('group');
    const groupInfoStr = searchUtil(search).getValue('group');
    // 发生变化
    if (groupNextInfoStr && groupNextInfoStr !== groupInfoStr) {
      const groupInfo = groupNextInfoStr ? JSON.parse(groupNextInfoStr) : {};
      const basicParams = this.basicParams(groupInfo);
      const {
        stations = [],
        modes = [],
        quota = [],
        modesInfo = [],
      } = groupInfo;
      // 默认指标分析
      const quotaValue = quota[1] || quota[0];
      const paramsCapacity = {
        ...basicParams,
        deviceModes: modes,
        regionName: stations.map(cur => {return cur.regionName;}),
        manufactorIds: modesInfo.map(cur => {
          return cur.value;
        }),
      };
      const paramsRank = {
        ...basicParams,
        indicatorCode: quotaValue,
      };
      const paramsTrend = {
        ...basicParams,
        regionName: paramsCapacity.regionName,
        indicatorCode: quotaValue,
        type: groupTimeStatus, // 默认按月
      };
      const paramsHour = {
        ...basicParams,
        manufactorIds: paramsCapacity.manufactorIds,
        deviceModes: paramsCapacity.deviceModes,
      };
      this.props.getGroupCapacity(paramsCapacity);
      this.props.getGroupRank(paramsRank);
      this.props.getGroupTrendInfo(paramsTrend);
      this.props.getGroupLostGenHour(paramsHour);
    }
  }

  // 基本-公共参数
  basicParams = (data) => {
    const { stations = [] } = data.stations || {};
    const stationCode = stations.map(cur => {
      return cur.stationCode;
    });
    return {
      startTime: data.dates[0],
      endTime: data.dates[1],
      stationCodes: stationCode,
    };
  };

  render() {
    return (
      <div style={{width: '100%'}}>
        <GroupSearch {...this.props} />
        <div className={styles.groupChartBox}>
          <div className={styles.chartTop}>
            <GroupAreaChart {...this.props} />
            <GroupStationChart {...this.props} />
          </div>
          <div className={styles.chartBottom}>
            <GroupTrendChart {...this.props} />
            <GroupLossChart {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveGroup.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  getGroupModesInfo: payload => dispatch({type: groupAchieveAction.getGroupModesInfo, payload}),
  getGroupCapacity: payload => dispatch({type: groupAchieveAction.getGroupCapacity, payload}),
  getGroupRank: payload => dispatch({type: groupAchieveAction.getGroupRank, payload}),
  getGroupTrendInfo: payload => dispatch({type: groupAchieveAction.getGroupTrendInfo, payload}),
  getGroupLostGenHour: payload => dispatch({type: groupAchieveAction.getGroupLostGenHour, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupAchieve);
