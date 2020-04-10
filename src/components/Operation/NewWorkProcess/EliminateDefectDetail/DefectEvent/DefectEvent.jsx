import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DefectEventDetail from './DefectEventDetail.jsx';
import DefectEventEdit from './DefectEventEdit';

export default class DefectEvent extends Component {
  static propTypes = {
    eventInfos: PropTypes.array,
    eventStatus: PropTypes.array,
    warnEventInfos: PropTypes.array,
    edit: PropTypes.bool,
    allowedActions: PropTypes.array,
    addEventInfo: PropTypes.array,
    defectLevelList: PropTypes.array,
    isVertify: PropTypes.bool,
    stationCode: PropTypes.number,
    changeStore: PropTypes.func,
    docketId: PropTypes.string,
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
    const { allowedActions, docketId } = this.props;
    if (this.exchangeActioncode(allowedActions, '21')) { // 创建缺陷的时候可以删除的按钮
      const { warnEventInfos, changeStore } = this.props;
      const filterwarnEventInfo = warnEventInfos.filter(e => e.diagWarningId !== value);
      changeStore({ warnEventInfos: filterwarnEventInfo });
    } else { // 领取的时候删除缺陷事件
      this.prop.delEvent({ docketId, eventId: value });
    }
  }

  addEventChange = (value) => { // 添加缺陷
    const { index, ...rest } = value;
    const { addEventInfo } = this.props;
    const curIndex = addEventInfo.findIndex(e => e.index === index);
    addEventInfo[curIndex] = { ...addEventInfo[curIndex], ...rest };
    this.props.changeStore({ addEventInfo });
  }

  deladdEvent = (record) => { // 删除添加的告警时间
    const { index } = record;
    const { addEventInfo } = this.props;
    const curIndex = addEventInfo.findIndex(e => e.index === index);
    addEventInfo.splice(curIndex, 1);
    this.props.changeStore({ addEventInfo });
  }

  render() {
    const { eventInfos, warnEventInfos, edit, allowedActions, addEventInfo = [], deviceTypes, stationCode, isVertify, defectLevelList } = this.props;
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
              stationCode={stationCode}
              isVertify={isVertify}
              delRight={this.exchangeActioncode(allowedActions, '21') && addEventInfo.length > 1}
              defectLevelList={defectLevelList}
            />);
        })
        }
        {!edit && newEventInfo.map(list => {
          return (
            <DefectEventDetail
              defectMessage={list}
              key={list.eventId || list.diagWarningId}
              delRight={this.exchangeActioncode(allowedActions, '21') && newEventInfo.length > 1}
              allowedOpr={this.exchangeActioncode(allowedActions, '26')}
              eventChange={this.eventChange}
              delChange={this.delEvent}
              defectLevelList={defectLevelList}
            />
          );
        })}
      </React.Fragment>

    );
  }
}
