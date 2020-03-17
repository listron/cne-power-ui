import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FilterConditions from '@components/Common/FilterConditions/FilterCondition';
import styles from './eventListPage.scss';

class DiagnoseFilter extends Component {
  static propTypes = {
    pageKey: PropTypes.string,
    filterBoxType: PropTypes.string,
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
    allEventsStatus: PropTypes.array,
    listParams: PropTypes.object,
    listPage: PropTypes.object,
    stopCircleQueryList: PropTypes.func,
    getDiagnoseList: PropTypes.func,
    changeStore: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    getEventtypes: PropTypes.func,
  }

  filterConditionChange = (conditions) => {
    this.props.stopCircleQueryList(); // 停止当前页面定时请求
    const { listParams, listPage } = this.props;
    const preFinish = listParams.finished;
    const preStationCode = listParams.stationCode;
    const preDeviceTypeCode = listParams.deviceTypeCode;
    const { stationCode, deviceTypeCode, rangeTimes, eventCode, eventStatus, finished } = conditions;
    let changeType = 'normal'; // switch-归档切换; clear-清空; normal-筛选条件改变
    if (finished === '') { // 清空条件时独特的返回值
      changeType = 'clear';
    } else if (!preFinish === !!finished) { // 是否归档切换
      changeType = 'switch';
    }
    let newListParams = {}, newListPage = {};
    if (changeType === 'switch') { // 归档点击:重新请求列表,停止定时,其他条件清空
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
    } else {// 筛选条件点击或清空筛选条件 => 重新请求列表, 停止定时请求;
      const {eventType} = listParams;
      let tempDeviceTypeCode = deviceTypeCode;
      let tempEventCode = eventCode;
      if ((!preStationCode && stationCode.length > 0) ||
        (preStationCode && preStationCode.toString() != stationCode.toString())) {
        tempDeviceTypeCode = null;
        tempEventCode = null;
        if (stationCode.length === 0) { //把电站设备清成空串。 一定要清空，因为stationCode=[],设备要走deviceType分支
          this.props.changeStore({
            stationDeviceTypes: [],
          });
        }
        else {
          this.props.getStationDeviceTypes({
            stationCodes: stationCode.join(','),
          });
        }

        this.props.getEventtypes({eventType});
      }
      if (preDeviceTypeCode != deviceTypeCode) {
        tempEventCode = null;
        let param = {eventType};
        if (deviceTypeCode !== '') {
          param = {eventType, deviceTypeCode};
        }
        // console.log(param);
        this.props.getEventtypes(param);
      }
      const [startTime, endTime] = rangeTimes || [];
      newListParams = { // 列表请求参数: 电站, 设备类型, 发生时间, 告警事件, 事件状态, 归档事件, 
        ...listParams,
        stationCode,
        finished: preFinish,
        deviceTypeCode: tempDeviceTypeCode,
        eventCode: tempEventCode,
        eventStatus,
        startTime,
        endTime,
      };
      newListPage = { ...listPage };
    }
    this.props.changeStore({
      selectedRows: [],
      listParams: newListParams,
      listPage: newListPage,
    });
    this.props.getDiagnoseList({ ...newListParams, ...newListParams });
  }

  onFilterBoxTypeChange = ({ filterBoxType }) => { // 保存组件内的筛选条件显影控制同步
    this.props.changeStore({ filterBoxType });
  }

  eventTypeInfo = {
    alarm: 'alarmEventtypes',
    diagnose: 'diagnEventtypes',
    data: 'dataEventtypes',
  }

  eventTypeName = {
    [1]:'告警事件',
    [2]:'诊断事件',
    [3]:'数据事件',
  }

  render() {
    const { stations, deviceTypes, allEventsStatus, pageKey, listParams, filterBoxType, stationDeviceTypes} = this.props;
    const { stationCode, deviceTypeCode, startTime, endTime, eventCode, eventStatus, finished, eventType} = listParams;
    const eventTypesData = this.props[this.eventTypeInfo[pageKey]] || [];
    const statusArray = allEventsStatus.filter(e => e.statusType === (!!finished ? 2 : 1)); // statusType:1活动 2已归档
    const eventTypeName = this.eventTypeName[eventType] || '';
    const selDeviceTypes = !stationCode || stationCode.length === 0 ? deviceTypes : stationDeviceTypes;
    const pvStations = stations.filter(e => e.stationType === 1); // 只展示光伏电站
    const pvDeviceTypes = selDeviceTypes.filter(e => !e.stationType || [1, 2].includes(e.stationType)); // 只展示光伏设备类型;
    const options = [
      { name: '电站名称', type: 'stationName', typeName: 'stationCode', data: pvStations },
      { name: '设备类型', type: 'radioSelect', typeName: 'deviceTypeCode', rules: ['deviceTypeName', 'deviceTypeCode'], data: pvDeviceTypes },
      { name: '发生时间', type: 'time', typeName: 'rangeTimes' },
      { name:  eventTypeName, type: 'radioSelect', typeName: 'eventCode', rules: ['eventName', 'eventCode'], data: eventTypesData },
      { name: '事件状态', type: 'radioSelect', typeName: 'eventStatus', parentName: 'parentName', rules: ['statusName', 'statusCode'], data: statusArray },
      { name: '归档事件', type: 'switch', typeName: 'finished' },
    ];
    return (
      <div className={styles.diagnoseFilter} >
        <FilterConditions
          onChange={this.filterConditionChange}
          option={options}
          filterBoxType={filterBoxType}
          onFilterBoxTypeChange={this.onFilterBoxTypeChange}
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
