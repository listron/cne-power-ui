import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FilterConditions from '@components/Common/FilterConditions/FilterCondition';
import styles from './eventListPage.scss';

class DiagnoseFilter extends Component {
  static propTypes = {
    pageKey: PropTypes.string,
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
    eventstatus: PropTypes.array,
    listParams: PropTypes.object,
  }

  filterConditionChange = (conditions) => {
    console.log(conditions);
  }

  eventTypeInfo = {
    alarm: 'alarmEventtypes',
    diagnose: 'diagnEventtypes',
    data: 'dataEventtypes',
  }

  render() {
    const { stations, deviceTypes, eventstatus, pageKey, listParams } = this.props;
    const eventTypesData = this.props[this.eventTypeInfo[pageKey]] || [];
    const options = [
      { name: '电站名称', type: 'stationName', typeName: 'stationCode', data: stations },
      { name: '设备类型', type: 'radioSelect', typeName: 'deviceTypeCode', rules: ['deviceTypeName', 'deviceTypeCode'], data: deviceTypes },
      { name: '发生时间', type: 'time', typeName: 'rangeTimes' },
      { name: '告警事件', type: 'radioSelect', typeName: 'eventCode', rules: ['eventName', 'eventCode'], data: eventTypesData },
      { name: '事件状态', type: 'radioSelect', typeName: 'eventStatus', parentName: 'parentName', rules: ['statusName', 'statusCode'], data: eventstatus },
      { name: '归档事件', type: 'switch', typeName: 'finished' },
    ];
    const { stationCode, deviceTypeCode, rangeTimes, eventCode, eventStatus, finished } = listParams;
    return (
      <div className={styles.diagnoseFilter} >
        <FilterConditions
          onChange={this.filterConditionChange}
          option={options}
          value={{
            stationCode,
            deviceTypeCode,
            rangeTimes,
            eventCode,
            eventStatus,
            finished,
          }}
        />
      </div>
    );
  }
}

export default DiagnoseFilter;
