
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.scss';

/** prototype params:
 * mode: string, 默认'confirm', 公用提示语弹框模式- 'confirm'包含确认/取消; 'warning'仅含确定;
 * tipText: string, 所展示的提示语(必需)
 * onConfirm: func, 唯一输出函数(必须)
 * onCancel: func, 取消提示
 * value: any, 唯一输入, 展示弹框前输入的最新处理信息; 用于配合onConfirm使用;
 * tipClassname: object, 默认{}, 用于手动替换更变默认样式
 * confirmText: string, 默认'确定', 有特别需求更变确认按钮文字时使用
 * cancelText: string, 默认'取消', 有特别需求更变取消按钮文字时使用
 */

 /** state params
  * isTipShow: bool, 默认false, 弹框是否展示
  */

export default class CneTips extends Component {
  static propTypes = {
    mode: PropTypes.string,
    tipText: PropTypes.string,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    value: PropTypes.any,
    tipClassname: PropTypes.object,
    getMapStation: PropTypes.func,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
  }

  state = {
    isTipShow: false,
  }

  render(){
    return (
      <div></div>
    );
  }
}






















