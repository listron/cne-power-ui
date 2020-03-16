import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectEvent.scss';
import DefectEventDetail from './DefectEventDetail.jsx';
import DefectEventEdit from './DefectEventEdit';





export default class DefectEvent extends Component {
  static propTypes = {
    actionCode: PropTypes.string,
    eventInfos: PropTypes.array,
    eventStatus: PropTypes.array,
    warnEventInfos: PropTypes.array,
    edit: PropTypes.bool,
    allowedActions: PropTypes.array,
    addEventInfo: PropTypes.array,
    changeStore: PropTypes.func,
  };

  exchangeActioncode = (allActions, code) => {
    const cur = allActions.filter(e => e.actionCode === code);
    return cur.length > 0 && !cur[0].isPermission || false;
  }


  eventChange = (value) => { // 缺陷事件 状态修改 详情
    const { eventId, eventState } = value;
    const { eventStatus, changeStore } = this.props;
    const index = eventStatus.filter(e => e.eventId === eventId)[0].key;
    eventStatus[index]['eventState'] = eventState;
    changeStore({ eventStatus });
  }

  delEvent = (value) => { // 删除告警 缺陷事件 (有两种状态 一种是直接删除，一种是走接口)
    const { warnEventInfos, changeStore } = this.props;
    const filterwarnEventInfo = warnEventInfos.filter(e => e.diagWarningId !== value);
    changeStore({ warnEventInfos: filterwarnEventInfo });
  }

  addEventChange = (value) => { // 添加缺陷
    const { index, ...rest } = value;
    const { addEventInfo } = this.props;
    addEventInfo[addEventInfo.length - index] = { ...addEventInfo[addEventInfo.length - index], ...rest };
    this.props.changeStore({ addEventInfo });
  }

  deladdEvent = (record) => {
    const { index } = record;
    const { addEventInfo } = this.props;
    addEventInfo.splice(addEventInfo.length - index, 1);
    this.props.changeStore({ addEventInfo });
  }

  render() {
    const { eventInfos, warnEventInfos, edit, allowedActions, addEventInfo = [], deviceTypes, stationCode, isVertify, getStationTypeDeviceModes, deviceModes } = this.props;
    const newEventInfo = [...eventInfos, ...warnEventInfos];
    return (
      <React.Fragment>
        {edit && addEventInfo.map(list => {
          return (
            <DefectEventEdit
              record={list}
              key={list.index}
              onChange={this.addEventChange}
              delChange={this.deladdEvent}
              deviceTypes={deviceTypes}
              deviceModes={deviceModes}
              stationCode={stationCode}
              isVertify={isVertify}
              getStationTypeDeviceModes={getStationTypeDeviceModes}
              del={this.exchangeActioncode(allowedActions, '21') && addEventInfo.length > 1}
            />
          );
        })
        }
        {!edit && newEventInfo.map(list => {
          return (
            <DefectEventDetail
              defectMessage={list}
              key={list.eventId || list.diagWarningId}
              del={this.exchangeActioncode(allowedActions, '21') && eventInfos.length > 0}
              allowedOpr={this.exchangeActioncode(allowedActions, '26')}
              eventChange={this.eventChange}
              delChange={this.delEvent}
            />
          );
        })}
      </React.Fragment>

    );
  }
}
