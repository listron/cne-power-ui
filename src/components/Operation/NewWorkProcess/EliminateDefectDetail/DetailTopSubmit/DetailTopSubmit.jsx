import React, { Component } from 'react';
import CneButton from '@components/Common/Power/CneButton';
import CneTips from '@components/Common/Power/CneTips';
import PropTypes from 'prop-types';
import styles from './topSubmit.scss';
import { processIconFunc, localStateName } from '../../Common/processIconCode';
import RejectAlert from '../../Common/RejectAlert/RejectAlert';
import PassAlert from '../../Common/PassAlert/PassAlert';





/**
 *
 * 提交 未解决   验证 addbaseInfo  addEventInfo addhandleList
 *    弹框提示  确认提交此工单
 * 提交验收  已解决  验证 addbaseInfo  addEventInfo  addhandleList
 *    弹框提示  确认提交此工单
 * 告警跳过来  派发  验证 addbaseInfo  addEventInfo
 *    弹框提示  确认派发此工单
 * 审核   派发  退回  派发   验证 addbaseInfo  addEventInfo   退回 不验证
 *    派发  弹框提示  确认派发此工单   退回 退回原因
 * 退回   提交  删除  提交   验证 addbaseInfo  addEventInfo addhandleList
 *    弹框提示  确认提交此工单
 *    删除  确定要删除此工单
 * 领取   不验证
 *    弹框提示  确认领取此工单
 * 执行  提交验收  验证 addhandleList 存在一条 提示 不存在 不验证
 *    弹框提示  确认将此工单提交验收
 * 验收  驳回 验收通过  验证 eventStatus   存在一个未解决则为驳回
 *    弹框提示  验收意见 驳回原因
 * 驳回  提交验收  和执行中验证  addhandleList
 *    弹框提示  确认将此工单提交验收
 *
 * 
 * '待审核': 'review',
    '已退回': 'return',
    '待领取': 'receive',
    '执行中': 'execute',
    '待验收': 'accept',
    '已结单': 'complete',
 * 
 * 
 * 提交 验证  addbaseInfo  addEventInfo addhandleList
 * 派发 验证  addbaseInfo  addEventInfo addhandleList
 * 审核 派发  派发  可以修改工单描述   接单人也可以修改
 *     退回  不验证
 * 退回 验证  addbaseInfo  addEventInfo addhandleList
 * 领取 不验证 但是接单人是可以修改的
 * 执行 验证  处理信息自己验证 但是需要判断 addhandleList.length
 * 验收 验证 驳回和 验收通过 需要验证  eventStatus  eventStatus.map(e=>e.eventState) .!some(e=>!e) 是否全选 .some(e=>e===2) 是否存在未解决的
*/

/** 
 * actionCode
 * 提交 9 12 22
 * 提交验收 10 11
 * 派发 17 19 
 * 退回 18
 * 删除 24
 * 领取 2
 * 执行 5
 * 驳回 26
 * 验收通过 25
*/

const process = {
  2: { name: '领取', tipText: '确认领取此工单' }, // 领取
  9: { name: '提交', tipText: '确认提交此工单' }, // 新建工单
  10: { name: '提交验收', tipText: '确认将此工单提交验收' }, // 新建工单
  11: { name: '提交验收', tipText: '确认将此工单提交验收' }, // 新建工单
  5: { name: '提交验收', tipText: '确认将此工单提交验收' }, // 执行工单 
  12: { name: '提交', tipText: '确认提交此工单' }, // 新建工单
  17: { name: '派发', tipText: '确认派发此工单' }, // 审核工单
  18: { name: '退回', tipText: '确认提交此工单' }, // 审核工单  已退回
  19: { name: '派发', tipText: '确认派发此工单' }, // 新建工单 告警
  22: { name: '提交', tipText: '确认提交此工单' }, // 提交工单
  24: { name: '删除', tipText: '确定要删除此工单' }, // 删除工单
  25: { name: '验收通过', modal: 'reject' }, // 验收通过  验收通过建议
  26: { name: '驳回', modal: 'reject' }, // 驳回  驳回原因
};

export default class DetailTopSubmit extends Component {
  static propTypes = {
    changeStore: PropTypes.func,
    allowedActions: PropTypes.array,

  };

  constructor() {
    super();
    this.state = {
      func: null,
      status: 'return', // 驳回和退回
      requiredVisiable: false, // 驳回和退回
      params: {}, // 驳回和退回 提交需要的参数
      showTip: false, // 提示按钮
      tipText: '',
      passVisible: false,
    };
  }

  onBackHandle = () => { // 返回按钮 => 根据状态, 根据操作权限 是否提示弹框 c 操作权限的在验收 审核的直接退出
    this.setState({
      showTip: true,
      tipText: '返回后修改内容将不会保存，确认返回吗',
      func: () => {
        const { location, history } = this.props;
        const { pathname } = location;
        history.push(`${pathname}?page=list`);
      },
    });
  }

  handleCheck = (handleInfo) => { // 校验 执行不需要校验 提交的时候需要验证  创建或者是退回的时候需要验证
    const { handleDesc, isChangePart, partName, isCoordinate, coordinateDesc } = handleInfo;
    if (!handleDesc || (isChangePart && !partName) || (isCoordinate && !coordinateDesc)) {
      return false;
    }
    return true;
  }

  baseInfoCheck = (addbaseInfo, initStationCode) => { // 基本信息校验
    // 工单描述在后期可能被修改，所以两个来的地方不一样
    const { docketDesc, stationCode } = addbaseInfo;
    if (!(stationCode || initStationCode) || !docketDesc) {
      return false;
    }
    return true;
  }

  evnetInfoCheck = (eventInfo) => { // 缺陷事件校验 单个
    const { defectTypeCode, deviceTypeCode, deviceFullcode, eventDesc } = eventInfo;
    console.log('eventInfo', eventInfo);
    if (defectTypeCode === 0) { // 其他缺陷
      if (!eventDesc) {
        return false;
      }
      return true;
    }
    if (defectTypeCode === 1) { // 设备缺陷
      if (!deviceTypeCode || !deviceFullcode || !eventDesc) {
        return false;
      }
      return true;
    }
    return false;
  }

  allChecked = () => { // 三个都需要验证 创建 退回
    const { addbaseInfo, addEventInfo, addhandleList, stationCode } = this.props;
    const base = this.baseInfoCheck(addbaseInfo, stationCode);
    const event = !addEventInfo.some(e => !this.evnetInfoCheck(e)); // 是否全部检验完成
    const handle = !addhandleList.some(e => !this.handleCheck(e));
    return base && event && handle;
  }

  createButton = (code, func, disabled) => { // 创建按钮
    const { allowedActions } = this.props;
    const dis = typeof disabled === 'boolean' && { disabled: disabled } || {};
    return allowedActions.filter(e => code.includes(e.actionCode)).map(e => { // 提交
      if (!e.isPermission) {
        return (<CneButton
          onClick={() => this[func](e)}
          className={styles.handleButton}
          style={{ width: '92px' }}
          color-code={e.actionColorCode}
          key={e.actionCode}
          {...dis}
        >
          <i className={`${processIconFunc(e.actionIcon)}`}></i> <span className={styles.actionName}>{e.actionName}</span>
        </CneButton >);
      }
    });
  }

  crete = (e) => { // 创建工单
    const { addbaseInfo, addEventInfo, addhandleList, isFinish, stationCode, docketId } = this.props;
    const { location, history } = this.props;
    const { pathname } = location;
    this.props.changeStore({ isVertify: true });
    const flag = this.allChecked();
    if (flag) {
      const params = {
        ...addbaseInfo,
        docketId,
        stationCode,
        events: addEventInfo,
        handles: addhandleList,
        actionCode: e.actionCode,
      };
      this.setState({
        func: () => this.props.createDefect({
          params,
          callback: (docketId) => {
            history.push(`${pathname}?page=defectDetail&docketId=${docketId}`);
          },
        }),
        showTip: true,
        tipText: process[+e.actionCode].tipText,
      });
    }
  }

  verify = (e) => { // 审核 派发
    const { docketId, stateId, addbaseInfo, stationCode } = this.props;
    const { planEndTime, addUsers } = addbaseInfo;
    const flag = true;
    // const flag=true = this.baseInfoCheck(addbaseInfo, stationCode);
    if (flag) {
      const params = {
        docketId,
        stateId,
        actionCode: e.actionCode,
        planEndTime,
        addUsers,
      };
      this.setState({
        func: () => this.props.verifyDocket(params),
        showTip: true,
        tipText: process[+e.actionCode].tipText,
      });
    }
  }

  return = (e) => { // 审核 退回
    const { docketId, stateId } = this.props;
    const params = {
      docketId,
      actionCode: e.actionCode,
      stateDesc: '',
      stateId,
    };
    this.setState({
      status: 'return',
      requiredVisiable: true,
      params,
      func: (params) => this.props.returnDocket(params),
    });
  }

  delete = (e) => { // 删除
    const { docketId } = this.props;
    const params = {
      docketId,
    };
    this.setState({
      func: () => this.props.deleteDocket(params),
      showTip: true,
      tipText: process[+e.actionCode].tipText,
    });

  }

  receive = (e) => { // 领取
    const { docketId, stateId, addbaseInfo } = this.props;
    const { docketDesc = '' } = addbaseInfo;
    const params = {
      docketId,
      actionCode: e.actionCode,
      docketDesc,
      stateId,
    };
    this.setState({
      func: () => this.props.receiveDocket(params),
      showTip: true,
      tipText: process[+e.actionCode].tipText,
    });
  }

  execute = (e) => { // 执行 提交验收
    const { docketId, stateId, addhandleList } = this.props;
    let tipText = '确认将此工单提交验收';
    if (addhandleList.length > 0) {
      tipText = '为保存内容不会被提交，确认将此工单提交验收';
    }
    const params = {
      docketId,
      actionCode: e.actionCode,
      stateId,
    };
    this.setState({
      func: () => {
        this.props.submitAction(params);
        this.props.changeStore({ addhandleList: [] });
      },
      showTip: true,
      tipText,
    });
  }

  accept = (e) => { // 验收工单 验收通过
    const { docketId, stateId, eventStatus } = this.props;
    const params = {
      docketId,
      actionCode: e.actionCode,
      stateId,
      events: eventStatus.map(e => { return { eventId: e.eventId, eventState: e.eventState }; }),
      handleDesc: null,
    };
    this.setState({
      passVisible: true,
      params,
      func: (params) => this.props.acceptanceDocket(params),
    });
  }

  reject = (e) => { // 验收工单 驳回
    const { docketId, stateId, eventStatus } = this.props;
    const params = {
      docketId,
      actionCode: e.actionCode,
      stateId,
      events: eventStatus.map(e => { return { eventId: e.eventId, eventState: e.eventState }; }),
      handleDesc: null,
    };
    this.setState({
      status: 'reject',
      requiredVisiable: true,
      params,
      func: (params) => this.props.acceptanceDocket(params),
    });
  }

  onConfirmTip = () => { // 确定提示框
    const { func } = this.state;
    this.setState({
      showTip: false,
      tipText: '',
    });
    func();
  }

  onConfirmReject = (value, callBack) => { // 退回 驳回 同意提示
    const { status, func, params } = this.state;
    if (status === 'return') { // 退回
      func({ ...params, handleDesc: value });
      callBack();
    }
    if (status === 'reject') {
      func({ ...params, handleDesc: value });
      callBack();
    }
    this.setState({
      requiredVisiable: false,
    });
  }

  onConfirmPass = (value, callBack) => {
    const { func, params } = this.state;
    func({ ...params, handleDesc: value });
    callBack();
    this.setState({
      passVisible: false,
    });
  }

  render() {
    const { showTip, tipText, status, requiredVisiable, passVisible } = this.state;
    const { docketId, allowedActions, eventStatus = [] } = this.props;
    const acceptStuatus = !eventStatus.map(e => e.eventState).some(e => !e);
    const rejectStatu = eventStatus.map(e => e.eventState).some(e => e === 2);
    return (
      <React.Fragment>
        <div className={styles.topSubmit}>
          <div className={styles.detailTitle}>
            <i className="iconfont icon-gdxq" />
            <span className={styles.titleText}>{docketId && '工单详情' || '创建工单'}</span>
          </div>
          <div className={styles.handlePart}>
            {/* 新建  */}
            {this.createButton(['9', '10', '11', '12', '22'], 'crete')}
            {/* 审核 派发 */}
            {this.createButton(['17'], 'verify')}
            {/* 退回 */}
            {this.createButton(['18'], 'return')}
            {/* 删除 */}
            {this.createButton(['24'], 'delete')}
            {/* 领取 */}
            {this.createButton(['2'], 'receive')}
            {/* 执行 提交验收 */}
            {this.createButton(['5'], 'execute')}
            {/* 验收通过 */}
            {this.createButton(['25'], 'accept', !(acceptStuatus && !rejectStatu))}
            {/* 驳回 */}
            {this.createButton(['26'], 'reject', !(acceptStuatus && rejectStatu))}
            <i className="iconfont icon-fanhui" onClick={this.onBackHandle} />
          </div>
          <CneTips
            visible={showTip}
            width={260}
            onCancel={() => this.setState({ showTip: false, tipText: '' })}
            onConfirm={this.onConfirmTip}
            tipText={tipText}
          />
          <PassAlert
            visible={passVisible}
            width={450}
            onCancel={() => this.setState({ passVisible: false })}
            onConfirm={this.onConfirmPass}
          />
          <RejectAlert
            reasonName={status === 'return' && '退回' || '驳回'}
            visible={requiredVisiable}
            width={450}
            onCancel={() => this.setState({ requiredVisiable: false })}
            onConfirm={this.onConfirmReject}
          />
        </div>
      </React.Fragment>
    );
  }
}
