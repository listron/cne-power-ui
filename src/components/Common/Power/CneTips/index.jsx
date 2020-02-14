import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'antd';
import CneButton from '../CneButton';
import styles from './index.scss';

/** prototype params:
  * mode: string, 默认'confirm', 公用提示语弹框模式- 'confirm'包含确认/取消; 'warning'仅含确定-表示对警告已确定知悉, 'cancel'仅含取消-表示对错误/误操作被迫取消;
  * tipText: string/React Component, 所展示的提示语(必需)或组件
 * theme: string, 默认light主体色
  * onConfirm: func, 唯一输出函数(必须)
  * onCancel: func, 取消提示
  * tipClassname: object, 默认{}, 用于手动替换更变默认样式
 * style: 部分手写部分样式
  * confirmText: string, 默认'确定', 有特别需求更变确认按钮文字时使用
  * cancelText: string, 默认'取消', 有特别需求更变取消按钮文字时使用
  */

export default class CneTips extends Component {
  static propTypes = {
    mode: PropTypes.string,
    visible: PropTypes.bool,
    tipText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    theme: PropTypes.string,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    tipClassname: PropTypes.string,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    width: PropTypes.number,
  };

  static defaultProps = {
    mode: 'confirm',
    visible: false,
    theme: 'light',
    confirmText: '确定',
    cancelText: '取消',
  };

  onCancel = () => { // 取消按钮
    this.props.onCancel();
  };

  onConfirm = () => { // 确定按钮
    this.props.onConfirm();
  };

  render() {
    const {
      mode, visible, theme, tipText, cancelText, confirmText, tipClassname, width,
    } = this.props;
    const defaultModalProps = {
      footer: null,
      closable: false,
      maskClosable: false,
      maskStyle: {backgroundColor: 'rgba(153,153,153,0.2)'},
    };
    width && (defaultModalProps.width = width);
    return (
      <Modal
        {...defaultModalProps}
        onOk={this.onConfirm}
        onCancel={this.onCancel}
        visible={visible}
        wrapClassName={`${styles.cneTipsBox} ${styles[theme]} ${tipClassname || ''}`}
      >
        <div className={styles.cneTips}>
          <div className={styles.tipsContent}>
            <strong className={styles.icon}>!</strong>
            <span className={styles.tipText}>{tipText}</span>
          </div>
          <div className={styles.operationHandle}>
            {['confirm', 'cancel'].includes(mode) && <span
              className={styles.cancelHandler}
              onClick={this.onCancel}
            >{cancelText}</span>}
            {['confirm', 'warning'].includes(mode) && <CneButton
              className={styles.confirmBtn}
              onClick={this.onConfirm}
              style={{width: '92px'}}
            >
              {confirmText}
            </CneButton>}
          </div>
        </div>
      </Modal>
    );
  }
}
