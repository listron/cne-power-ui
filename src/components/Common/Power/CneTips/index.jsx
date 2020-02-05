
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal } from 'antd';
import styles from './index.scss';
import Cookie from 'js-cookie';

/** prototype params:
 * mode: string, 默认'confirm', 公用提示语弹框模式- 'confirm'包含确认/取消; 'warning'仅含确定;
 * tipText: string, 所展示的提示语(必需)
 * onConfirm: func, 唯一输出函数(必须)
 * onCancel: func, 取消提示
 * value: any, 唯一输入, 展示弹框前输入的最新处理信息; 用于配合onConfirm使用;
 * tipClassname: object, 默认{}, 用于手动替换更变默认样式
 * confirmText: string, 默认'确定', 有特别需求更变确认按钮文字时使用
 * cancelText: string, 默认'取消', 有特别需求更变取消按钮文字时使用
 */

 /** state params
  * isTipShow: bool, 默认false, 弹框是否展示
  */

export default class CneTips extends Component {
  static propTypes = {
    mode: PropTypes.string,
    tipText: PropTypes.string,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    value: PropTypes.any,
    tipClassname: PropTypes.object,
    getMapStation: PropTypes.func,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    style: PropTypes.object,
  }

  static defaultProps = {
     mode: 'confirm',
     confirmText: '确定',
     cancelText: '取消',
     tipClassname: {},
     style: { width: '210px'},
  }

  state = {
    isTipShow: false,
  }

  onCancel = () => { // 取消按钮
    this.props.onCancel();
  }

  onConfirm = () => { // 确定按钮
    this.props.onConfirm();
  }

  render(){
    const { mode, tipText, cancelText, confirmText, tipClassname, style } = this.props;
    const theme = Cookie.get('theme') || 'light';
    return (
      <React.Fragment>
        <Modal
          onOk={this.onConfirm}
          onCancel={this.onCancel}
          visible={true}
          footer={null}
          closable={false}
          maskClosable={false}
          maskStyle={{ backgroundColor: 'rgba(153,153,153,0.2)' }}
          wrapClassName={`${styles.cneTipsBox} ${styles[theme]}`}
          width={JSON.stringify(tipClassname) === '{}' ? style.width : tipClassname.width}
        >
          <div className={styles.cneTips} style={{ ...style, ...tipClassname }}>
            <div className={styles.tipsContent}>
              <Icon type="exclamation-circle-o" className={styles.icon} />
              <span className={styles.tipText}>{tipText}</span>
            </div>

            <div className={styles.operationHandle}>
              {(mode === 'confirm') && <span className={styles.cancelText} onClick={this.onCancel}>{cancelText}</span>}
              <span className={styles.confirmBtn} onClick={this.onConfirm}>
                <span className={styles.confirmText}>{confirmText}</span>
              </span>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}























