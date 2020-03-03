
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './planFilter.scss';

class CheckedConditionHandler extends PureComponent {

  static propTypes = {
    stations: PropTypes.array,
    planParams: PropTypes.object,
    planListPageParams: PropTypes.object,
    changeStore: PropTypes.func,
    getWorkPlanList: PropTypes.func,
  };

  planTypes = [
    { label: '巡视计划', value: 100 },
    { label: '抄表计划', value: 200 },
  ]

  circleTypes = [
    { label: '每天', value: 152 },
    { label: '每周', value: 153 },
    { label: '每月', value: 154 },
    { label: '每季度', value: 155 },
    { label: '每年', value: 156 },
    { label: '一次', value: 151 },
    { label: '半年', value: 157 },
  ]

  statusInfo = [
    { label: '启用', value: 1 },
    { label: '停用', value: 2 },
    { label: '删除', value: 3 },
  ]

  deletePlanType = (code) => this.conditionFilter(code, 'planTypeCode') // 移除plantType

  deleteStation = (code) => this.conditionFilter(code, 'stationCodes') // 移除选中电站

  deleteCircle = (code) => this.conditionFilter(code, 'cycleTypeCode') // 移除周期

  deleteStatus = (code) => this.conditionFilter(code, 'planStatus') // 移除启用状态

  clearCondition = () => this.onConditionQuery({ // 筛选条件清空
    planTypeCode: [],
    stationCodes: [],
    cycleTypeCode: [],
    planStatus: [],
  })

  conditionFilter = (code, conditionKey) => {
    const { planParams = {} } = this.props;
    const filterResult = planParams[conditionKey].filter(e => e !== code);
    this.onConditionQuery({ [conditionKey]: filterResult });
  }

  onConditionQuery = (conditionValue) => {
    const { planParams, planListPageParams } = this.props;
    const newPlanParams = { ...planParams, ...conditionValue };
    const newPageParams = {
      ...planListPageParams,
      pageNum: 1,
      pageSize: 10,
    };
    this.props.changeStore({ // 修改参数
      planParams: newPlanParams,
      planListPageParams: newPageParams,
    });
    this.props.getWorkPlanList({ // 请求列表
      ...newPlanParams,
      ...newPageParams,
    });
  }

  render(){
    const { planParams, stations } = this.props;
    const { planTypeCode = [], stationCodes = [], cycleTypeCode = [], planStatus = [] } = planParams;
    const hasCondition = planTypeCode.length > 0 || stationCodes.length > 0 || cycleTypeCode.length > 0 || planStatus.length > 0;
    return (
      hasCondition ? <div className={styles.checkedConditionHandler}>
        <div className={styles.checkedHandlerTip}>已选</div>
        <div className={styles.checkedTagBox}>
          {planTypeCode.length > 0 && planTypeCode.map(e => {
            const typeInfo = this.planTypes.find(type => type.value === e) || {};
            return (
              <span onClick={() =>this.deletePlanType(e)} className={styles.eachTag} key={`${typeInfo.label}_${e}`}>
                <span>{typeInfo.label || '--'}</span>
                <Icon type="close" />
              </span>
            );
          })}
          {stationCodes.length > 0 && stationCodes.map(e => {
            const stationInfo = stations.find(station => station.stationCode === e) || {};
            return (
              <span onClick={() =>this.deleteStation(e)} className={styles.eachTag} key={`${stationInfo.stationName}_${e}`}>
                <span>{stationInfo.stationName || '--'}</span>
                <Icon type="close" />
              </span>
            );
          })}
          {cycleTypeCode.length > 0 && cycleTypeCode.map(e => {
            const circleInfo = this.circleTypes.find(type => type.value === e) || {};
            return (
              <span onClick={() =>this.deleteCircle(e)} className={styles.eachTag} key={`${circleInfo.label}_${e}`}>
                <span>{circleInfo.label || '--'}</span>
                <Icon type="close" />
              </span>
            );
          })}
          {planStatus.length > 0 && planStatus.map(e => {
            const currentStatus = this.statusInfo.find(type => type.value === e) || {};
            console.log(this.statusInfo, currentStatus)
            return (
              <span onClick={() =>this.deleteStatus(e)} className={styles.eachTag} key={`${currentStatus.label}_${e}`}>
                <span>{currentStatus.label || '--'}</span>
                <Icon type="close" />
              </span>
            );
          })}
          <span className={styles.clearAll} onClick={this.clearCondition}>清空条件</span>
        </div>
      </div>: <span></span>
    );
  }
}

export default CheckedConditionHandler;
