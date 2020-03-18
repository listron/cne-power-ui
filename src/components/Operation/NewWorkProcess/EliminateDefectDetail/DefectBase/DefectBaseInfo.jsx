import React, { Component } from 'react';
import StationSelect from '@components/Common/StationSelect/index';
import ResponsorCheck from './ResponsorCheck';
import { DatePicker, Input } from 'antd';
import styles from './baseinfo.scss';
import PropTypes from 'prop-types';
import moment from 'moment';
const { TextArea } = Input;


/**  
 * baseInfo 基本信息
 * stations 电站列表
 * addbaseInfo 添加的基本信息
 * isVertify 是否在验证 
 * usernameList 电站下已有权限的人列表
 * stationCode 电站名称
 * editStation 电站是否处于编辑的状态 只有在新添加的，或者是才可以编辑
 * 
*/

export default class DefectBaseInfo extends Component {

  static propTypes = {
    changeStore: PropTypes.func,
    addbaseInfo: PropTypes.object,
    allowedActions: PropTypes.array,
    addAbleUser: PropTypes.func,
    getDeviceType: PropTypes.func,
    getBaseUsername: PropTypes.func,
    stations: PropTypes.array,
    usernameList: PropTypes.array,
    editStation: PropTypes.bool,
    baseInfo: PropTypes.object,
  };


  infoEditCreater = (status) => {
    // true代表对应的是编辑态;
    // 3 执行人 13 添加接单人 20 修改工单说明 16 修改时间
    const { allowedActions = [] } = this.props;
    return {
      isStationEdit: status,
      isExpectTimeEdit: this.exchangeStauts(allowedActions, '16'),
      isResponsorEdit: this.exchangeStauts(allowedActions, '3') || this.exchangeStauts(allowedActions, '13'),
      isDescEdit: this.exchangeStauts(allowedActions, '20'),
    };
  }


  exchangeStauts = (allActions, code) => {
    const cur = allActions.filter(e => e.actionCode === code);
    return cur.length > 0 && !cur[0].isPermission || false;
  }

  onStationSelected = (stations) => { // 电站选择
    const curStations = stations.length > 0 && stations[0];
    const { stationCode, stationName } = curStations;
    const { addbaseInfo } = this.props;
    addbaseInfo['stationCode'] = stationCode;
    addbaseInfo['stationName'] = stationName;
    this.props.getBaseUsername({ stationCode }); // 当前电站有权限的人
    this.props.getDeviceType({ stationCode }); // 获取当前电站下的设备类型
    this.props.changeStore({ addbaseInfo, stationCode });
  }

  onExpectTimeChange = (value) => { // 要求完成时间选择
    const planEndTime = value && moment(value).format('YYYY-MM-DD HH:mm:ss') || null;
    const { addbaseInfo } = this.props;
    addbaseInfo['planEndTime'] = planEndTime;
    this.props.changeStore({ addbaseInfo });
  }

  onDescChange = (e) => { // 描述信息更变
    const docketDesc = e.target.value;
    const { addbaseInfo } = this.props;
    addbaseInfo['docketDesc'] = docketDesc;
    this.props.changeStore({ addbaseInfo });
  }

  changePonsor = (userList) => { // 接单人或者是执行人添加
    const { addbaseInfo = {}, allowedActions, baseInfo } = this.props;
    if (this.exchangeStauts(allowedActions, '13')) { //  添加接单人
      const userArr = addbaseInfo['addUsers'] && [...addbaseInfo['addUsers'], ...userList] || userList;
      addbaseInfo['addUsers'] = userArr;
      this.props.changeStore({ addbaseInfo });
    }
    if (this.exchangeStauts(allowedActions, '3')) { //  添加执行人 直接走接口
      const initStateId = baseInfo.operUserInfo[0].stateId;
      this.props.addAbleUser({ actionCode: '3', ids: userList.map(e => e.userId).join(','), stateId: initStateId });
    }
  }

  errorTip = (value) => {
    const { isVertify, addbaseInfo = {} } = this.props;
    if (isVertify && !addbaseInfo[value]) {
      return 'error';
    }
  }

  initTip = (value) => {
    const { addbaseInfo = {} } = this.props;
    if (!addbaseInfo[value]) {
      return 'init';
    }
  }

  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  }

  render() {
    const { baseInfo = {}, stations, addbaseInfo = {}, isVertify, usernameList = [], stationCode, editStation = false } = this.props;
    // 额外接收外界参数, 用于调整编辑态输入框的状态(必填, 出错);
    const { isStationEdit, isExpectTimeEdit, isResponsorEdit, isDescEdit } = this.infoEditCreater(editStation);
    const timeFormat = 'YYYY-MM-DD HH:mm';
    const { operUserInfo = [], stationName } = baseInfo;
    const { addUsers = [], docketDesc = null, planEndTime = null } = addbaseInfo;
    const addStationCode = addbaseInfo.stationCode;
    const operableUserId = operUserInfo.length > 0 && operUserInfo[0].ableUserIds && operUserInfo[0].ableUserIds.split(',') || [];
    const curId = [...addUsers.map(e => e.userId), operableUserId];
    const filterUsernameList = usernameList.filter(cur => !curId.includes(`${cur.userId}`));
    const operableUserName = operUserInfo.length > 0 && operUserInfo[0].ableUsers && operUserInfo[0].ableUsers.split(',') || [];
    const curName = [...addUsers.map(e => e.userName), operableUserName];
    const curStationName = stations.filter(e => e.stationCode === stationCode);
    return (
      <div className={styles.defectBaseInfo}>
        <div className={styles.infoRow}>
          <div className={
            `${styles.firstInfoTitle} ${isStationEdit ? styles.require : ''}`
          }>电站名称 <span className={styles.star}>*</span></div>
          <div className={`${styles.infoContent} ${styles.stations}`}>
            {isStationEdit ? <StationSelect
              data={stations}
              onOK={this.onStationSelected}
              className={`${styles[this.errorTip('stationCode')]} ${styles[this.initTip('stationCode')]}`}
              value={[{ stationName: addbaseInfo.stationName, stationCode: addStationCode }]}
            /> : <div>{curStationName.length > 0 && curStationName[0].stationName || '--'}</div>}
          </div>
          <div className={styles.infoTitle}>工单类型</div>
          <div className={`${styles.infoContent} ${styles.types}`}>消缺工单</div>
        </div>
        <div className={styles.infoRow}>
          <div className={styles.firstInfoTitle}>创建人</div>
          <div className={`${styles.infoContent} ${styles.creater}`}>{baseInfo.createUser || '--'}</div>
          <div className={styles.infoTitle}>工单创建时间</div>
          <div className={`${styles.infoContent} ${styles.createTime}`}>
            {baseInfo.createTime && moment(baseInfo.createTime).format(timeFormat) || '--'}
          </div>
          <div className={
            `${styles.infoTitle} ${isExpectTimeEdit ? styles.require : ''}`
          }>要求完成时间</div>
          <div className={`${styles.infoContent} ${styles.expectTime}`}>
            {isExpectTimeEdit ? <DatePicker
              onChange={this.onExpectTimeChange}
              value={planEndTime && moment(planEndTime) || null}
              disabledDate={this.disabledDate}
              className={` ${styles[this.initTip('planEndTime')]}`}
            /> : <div> {baseInfo.planEndTime && moment(baseInfo.planEndTime).format(timeFormat) || '--'}</div>}
          </div>
        </div>
        <div className={styles.infoRow}>
          <div className={
            `${styles.firstInfoTitle} ${isResponsorEdit ? styles.require : ''}`
          }>{operUserInfo.length > 0 && operUserInfo[0].stateName || '接单人'}</div>
          <div className={`${styles.infoContent} ${styles.responsor}`}>
            <div>{curName.length > 0 && curName.join(',') || '--'}</div>
            {isResponsorEdit &&
              <ResponsorCheck
                usernameList={filterUsernameList}
                selelctedUser={this.changePonsor}
                disabled={(!stationCode && !addStationCode)}
              />}
          </div>
          <div className={styles.infoTitle}>验收人</div>
          <div className={`${styles.infoContent} ${styles.examiner}`}>{operUserInfo.length > 0 && operUserInfo[1].ableUsers || '--'}</div>
          <div className={styles.infoTitle}>实际完成时间</div>
          <div className={`${styles.infoContent} ${styles.finishTime}`}>
            {baseInfo.endTime && moment(baseInfo.endTime).format(timeFormat) || '--'}
          </div>
        </div>
        <div className={styles.descRow}>
          <div className={styles.firstInfoTitle}>
            <div className={styles.desc}>工单描述 <span className={styles.star}>*</span></div>
            <div className={styles.descTextNum}>0/999字</div>
          </div>
          <div className={styles.infoContent}>
            {isDescEdit ?
              <TextArea
                onChange={this.onDescChange}
                placeholder={'请描述，必填'}
                required={isVertify}
                value={docketDesc}
              /> : <div>{baseInfo.docketDesc}</div>}
          </div>
        </div>
      </div>
    );
  }
}
