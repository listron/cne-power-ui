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
    quotaInfo: PropTypes.array,
  };

  componentDidMount(){
    // 若是上级页面下钻进入 => search中的area与之前记录有变化。
    const { search } = this.props.location;
    const { groupTimeStatus } = this.props;
    const groupInfoStr = searchUtil(search).getValue('group');
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
    return {
      startTime: data.dates[0],
      endTime: data.dates[1],
      stationCodes: data.searchCode,
    };
  };

  titleFunc = () => {
    const { quotaInfo } = this.props;
    const { search } = this.props.location;
    const groupInfoStr = searchUtil(search).getValue('group');
    if(groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const { quota = [] } = groupInfo;
      // 默认指标分析
      let qutaName = ''; //  根据quota的value值遍历名称
      quotaInfo.forEach(cur => {
        // 有没有子集
        if(quota[1] === cur.value) {
          cur.children.forEach(item => {
            if(quota[0] === item.value) {
              qutaName = item.label;
            }
          });
          return false;
        }
        if(quota[0] === cur.value) {
          qutaName = cur.label;
        }
      });
      return qutaName;
    }
    return '--';
  };

  render() {
    return (
      <div style={{width: '100%'}}>
        <GroupSearch {...this.props} />
        <div className={styles.groupChartBox}>
          <div className={styles.chartTop}>
            <GroupAreaChart {...this.props} />
            <GroupStationChart titleFunc={this.titleFunc()} {...this.props} />
          </div>
          <div className={styles.chartBottom}>
            <GroupTrendChart titleFunc={this.titleFunc()} {...this.props} />
            <GroupLossChart titleFunc={this.titleFunc()} {...this.props} />
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
  changeStore: payload => dispatch({type: groupAchieveAction.changeStore, payload}),
  getGroupModesInfo: payload => dispatch({type: groupAchieveAction.getGroupModesInfo, payload}),
  getGroupCapacity: payload => dispatch({type: groupAchieveAction.getGroupCapacity, payload}),
  getGroupRank: payload => dispatch({type: groupAchieveAction.getGroupRank, payload}),
  getGroupTrendInfo: payload => dispatch({type: groupAchieveAction.getGroupTrendInfo, payload}),
  getGroupLostGenHour: payload => dispatch({type: groupAchieveAction.getGroupLostGenHour, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupAchieve);
