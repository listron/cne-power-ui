import React, { Component } from 'react';
import CneButton from '@components/Common/Power/CneButton';
import CneTips from '@components/Common/Power/CneTips';
// import PropTypes from 'prop-types';
import styles from './topSubmit.scss';



// addbaseInfo  验证的是 电站名称 工单描述
// addEventInfo  验证的是 缺陷类型       
//                         设备缺陷    设备类型 设备名称 缺陷级别 缺陷描述
//                         其他缺陷    缺陷描述
//  addEventInfo 两种验证 一种创建的时候，未解决  addEventInfo.length>0  处理记录
//                                    已解决  addEventInfo.length>0 && 处理记录
//                执行中  addEventInfo.length>0  未保存内容将不被提交，确认将此工单提交验收
//                                                  确认将此工单提交验收 

/**
 *
 * 提交 未解决   验证 addbaseInfo  addEventInfo addhandleList
 *    弹框提示  确认提交此工单
 * 提交验收  已解决  验证 addbaseInfo  addEventInfo  addhandleList
 *    弹框提示  确认提交此工单
 * 告警跳过来  派发  验证 addbaseInfo  addEventInf
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
*/

// 退回原因 驳回原因 验收意见

const process = {
  2: { name: '领取', tipText: '确认领取此工单' }, // 领取
  9: { name: '提交', tipText: '确认提交此工单' }, // 新建工单
  10: { name: '提交验收', tipText: '确认将此工单提交验收' }, // 新建工单
  11: { name: '提交验收', tipText: '确认将此工单提交验收' }, // 新建工单
  12: { name: '提交', tipText: '确认提交此工单' }, // 新建工单
  // 13: { name: '添加接单人', tipText: '确认提交此工单' }, // 添加接单人
  14: { name: '提交', tipText: '确认提交此工单' }, // 添加缺陷
  15: { name: '提交', tipText: '确认提交此工单' }, // 添加记录
  16: { name: '提交', tipText: '确认提交此工单' }, // 添加要求完成时间
  17: { name: '派发', tipText: '确认派发此工单' }, // 审核工单
  18: { name: '退回', tipText: '确认提交此工单' }, // 审核工单  已退回
  19: { name: '派发', tipText: '确认派发此工单' }, // 新建工单 告警
  20: { name: '修改工单说明', tipText: '确认提交此工单' }, // 修改工单说明
  21: { name: '编辑缺陷', tipText: '确认提交此工单' }, // 编辑缺陷
  22: { name: '提交', tipText: '确认提交此工单' }, // 提交工单
  23: { name: '编辑处理信息', tipText: '确认提交此工单' }, // 编辑处理信息
  24: { name: '删除', tipText: '确定要删除此工单' }, // 删除工单
  25: { name: '验收通过', tipText: '确认提交此工单' }, // 验收通过  验收通过建议
  26: { name: '驳回', tipText: '确认提交此工单' }, // 驳回  驳回原因
};


export default class DetailTopSubmit extends Component {

  static propTypes = {

  };

  state = {
    showTip: false,
    tipText: '',
  };

  onBackHandle = () => { // 返回按钮 => 根据状态, 根据操作权限 是否提示弹框 c 操作权限的在验收 审核的直接退出
    this.setState({
      showTip: true,
      tipText: '返回后修改内容将不会保存，确认返回吗',
    });
  }

  onCancelTip = () => {
    this.setState({
      showTip: false,
      tipText: '',
    });
  }

  onConfirmTip = () => {
    this.setState({
      showTip: false,
      tipText: '',
    });
  }




  render() {
    // const { allowedActions } = allowedActions || [];
    const { showTip, tipText } = this.state;
    const { docketId } = this.props;
    return (
      <React.Fragment>
        <div className={styles.topSubmit}>
          <div className={styles.detailTitle}>
            <i className="iconfont icon-gdxq" />
            <span className={styles.titleText}>{docketId && '工单详情' || '创建工单'}</span>
          </div>
          <div className={styles.handlePart}>
            <CneButton
              onClick={this.onSendBack}
              className={styles.handleButton}
              style={{ width: '92px' }}
            >
              退回
            </CneButton>
            <CneButton
              onClick={this.onPublish}
              className={styles.handleButton}
            >
              派发
            </CneButton>
            <i className="iconfont icon-fanhui" onClick={this.onBackHandle} />
          </div>
          <CneTips
            visible={showTip}
            width={260}
            onCancel={this.onCancelTip}
            onConfirm={this.onConfirmTip}
            tipText={tipText}
          />
        </div>
      </React.Fragment>
    );
  }
}
