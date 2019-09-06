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
    dataName: PropTypes.string,
    changeStore: PropTypes.func,
  };

  componentDidMount(){
    // 若是上级页面下钻进入 => search中的area与之前记录有变化。
    const { search } = this.props.location;
    const groupInfoStr = searchUtil(search).getValue('group');
    if(groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      // 判断如果电站为空不请求
      if(groupInfo.searchCode && groupInfo.searchCode.length > 0) {
        this.queryParamsFunc(groupInfo);
      }
    }
    // 右键重置图表
    // 去掉默认的contextmenu事件，否则会和右键事件同时出现。
    document.oncontextmenu = (e) => {
      e.preventDefault();
    };
    // 鼠标右击
    document.getElementsByTagName('body')[0].onmousedown = e => {
      if (e.button === 2) {
        const { dataName, changeStore } = this.props;
        // 判断如果选中过区域可以重置图表
        if(dataName !== '') {
          const { search } = this.props.location;
          const groupInfoStr = searchUtil(search).getValue('group');
          const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
          changeStore({
            dataIndex: '', // 保存点击的下标
            selectStationCode: [], // 保存单选区域的信息
            selectTime: '', // 保存选择时间
            dataName: '', // 保存选择区域名称
          });
          this.queryParamsFunc(groupInfo);
        }
      }
    };
  }

  componentWillReceiveProps(nextProps){ // search中的area字符串对比, 不同 => 解析+请求图表数据.
    const nextSearch = nextProps.location.search;
    const { search } = this.props.location;
    const groupNextInfoStr = searchUtil(nextSearch).getValue('group');
    const groupInfoStr = searchUtil(search).getValue('group');
    // 发生变化
    if (groupNextInfoStr && groupNextInfoStr !== groupInfoStr) {
      const groupInfo = groupNextInfoStr ? JSON.parse(groupNextInfoStr) : {};
      // 判断如果电站为空不请求
      if(groupInfo.searchCode && groupInfo.searchCode.length > 0) {
        this.queryParamsFunc(groupInfo);
      }
    }
  }

  queryParamsFunc = (groupInfo) => {
    const { groupTimeStatus } = this.props;
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
      deviceModes: modes.map(cur => (cur.split('-')[1])),
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
  };

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

  //选中选择指标名字
  unitName = () => {
    const { quotaInfo } = this.props;
    const { search } = this.props.location;
    const groupInfoStr = searchUtil(search).getValue('group');
    if(groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const { quota = [] } = groupInfo;
      // 默认指标分析
      let unitName = ''; //  根据quota的value值遍历名称
      quotaInfo.forEach(cur => {
        // 有没有子集
        if(quota[1] === cur.value) {
          cur.children.forEach(item => {
            if(quota[0] === item.value) {
              unitName = item.unit;
            }
          });
          return false;
        }
        if(quota[0] === cur.value) {
          unitName = cur.unit;
        }
      });
      return unitName;
    }
    return '-';
  };

  pointLength = () => {
    const { quotaInfo } = this.props;
    const { search } = this.props.location;
    const groupInfoStr = searchUtil(search).getValue('group');
    if(groupInfoStr) {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      const { quota = [] } = groupInfo;
      // 默认指标分析
      let pointLength = 0; //  根据quota的value值遍历名称
      quotaInfo.forEach(cur => {
        // 有没有子集
        if(quota[1] === cur.value) {
          cur.children.forEach(item => {
            if(quota[0] === item.value) {
              pointLength = item.pointLength;
            }
          });
          return false;
        }
        if(quota[0] === cur.value) {
          pointLength = cur.pointLength;
        }
      });
      return pointLength;
    }
    return 0;
  };

  render() {
    return (
      <div style={{width: '100%'}}>
        <GroupSearch queryParamsFunc={this.queryParamsFunc} {...this.props} />
        <div className={styles.groupChartBox}>
          <div className={styles.chartTop}>
            <GroupAreaChart queryParamsFunc={this.queryParamsFunc} {...this.props} />
            <GroupStationChart
              titleFunc={this.titleFunc()}
              unitName={this.unitName()}
              pointLength={this.pointLength()}
              queryParamsFunc={this.queryParamsFunc}
              {...this.props} />
          </div>
          <div className={styles.chartBottom}>
            <GroupTrendChart
              titleFunc={this.titleFunc()}
              unitName={this.unitName()}
              pointLength={this.pointLength()}
              {...this.props}
            />
            <GroupLossChart
              pointLength={this.pointLength()}
              {...this.props}
            />
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
