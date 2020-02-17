import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FilterConditions from '@components/Common/FilterConditions/FilterCondition';
import styles from './eventListPage.scss';

class DiagnoseFilter extends Component {
  static propTypes = {
    pageKey: PropTypes.string,
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
    allEventsStatus: PropTypes.array,
    listParams: PropTypes.object,
    listPage: PropTypes.object,
    stopCircleQueryList: PropTypes.func,
    getDiagnoseList: PropTypes.func,
    changeStore: PropTypes.func,
  }

  filterConditionChange = (conditions) => {
    this.props.stopCircleQueryList(); // 停止当前页面定时请求
    const { listParams, listPage } = this.props;
    const preFinish = listParams.finished;
    const { stationCode, deviceTypeCode, rangeTimes, eventCode, eventStatus, finished } = conditions;
    const finishChange = !preFinish === !!finished; // 是否归档切换
    let newListParams = {}, newListPage = {};
    if (finishChange) { // 归档点击 => 重新请求列表, 停止定时请求; 其他条件清空
      newListParams = {
        ...listParams,
        finished: finished ? 1 : 0, // 1归档事件, 0非归档事件
        stationCode: null, // 电站编码
        deviceTypeCode: null, // 设备类型编码
        eventCode: null, // 标准事件编码
        eventStatus: null, // 事件状态编码
        eventLevel: null, // 事件级别
        startTime: null, //  起始时间
        endTime: null, // 终止事件
      };
      newListPage = { // 归档: 发生时间 降序; 非归档默认以事件状态 降序
        pageNum: 1, // 页码
        pageSize: 10, // 页容量
        sortField: finished ? 'beginTime' : 'eventStatus',
        sortMethod: 'desc', // 排序方式 asc升序 + desc降序
      };
    } else {// 筛选条件点击 => 重新请求列表, 停止定时请求;
      const [startTime, endTime] = rangeTimes || [];
      newListParams = { // 列表请求参数: 电站, 设备类型, 发生时间, 告警事件, 事件状态, 归档事件, 
        ...listParams,
        stationCode,
        finished: preFinish,
        deviceTypeCode,
        eventCode,
        eventStatus,
        startTime,
        endTime,
      };
      newListPage = { ...listPage };
    }
    this.props.changeStore({ listParams: newListParams, listPage: newListPage });
    this.props.getDiagnoseList({ ...newListParams, ...newListParams });
  }

  eventTypeInfo = {
    alarm: 'alarmEventtypes',
    diagnose: 'diagnEventtypes',
    data: 'dataEventtypes',
  }

  render() {
    const { stations, deviceTypes, allEventsStatus, pageKey, listParams } = this.props;
    const { stationCode, deviceTypeCode, startTime, endTime, eventCode, eventStatus, finished } = listParams;
    const eventTypesData = this.props[this.eventTypeInfo[pageKey]] || [];
    const statusArray = allEventsStatus.filter(e => e.statusType === (!!finished ? 2 : 1)); // statusType:1活动 2已归档
    const pvStations = stations.filter(e => e.stationType === 1); // 只展示光伏电站
    const pvDeviceTypes = deviceTypes.filter(e => [1, 2].includes(e.stationType)); // 只展示光伏设备类型;
    const options = [
      { name: '电站名称', type: 'stationName', typeName: 'stationCode', data: pvStations },
      { name: '设备类型', type: 'radioSelect', typeName: 'deviceTypeCode', rules: ['deviceTypeName', 'deviceTypeCode'], data: pvDeviceTypes },
      { name: '发生时间', type: 'time', typeName: 'rangeTimes' },
      { name: '告警事件', type: 'radioSelect', typeName: 'eventCode', rules: ['eventName', 'eventCode'], data: eventTypesData },
      { name: '事件状态', type: 'radioSelect', typeName: 'eventStatus', parentName: 'parentName', rules: ['statusName', 'statusCode'], data: statusArray },
      { name: '归档事件', type: 'switch', typeName: 'finished' },
    ];
    return (
      <div className={styles.diagnoseFilter} >
        <FilterConditions
          onChange={this.filterConditionChange}
          option={options}
          value={{
            stationCode: stationCode && stationCode.length > 0 ? stationCode : [],
            deviceTypeCode,
            rangeTimes: [startTime, endTime],
            eventCode,
            eventStatus,
            finished: !!finished,
          }}
        />
      </div>
    );
  }
}

export default DiagnoseFilter;
