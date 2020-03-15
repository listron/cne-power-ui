import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input } from 'antd';
import CneButton from '@components/Common/Power/CneButton';
import { computeLength } from '../computeLength';
import styles from './rejectAlert.scss';

const { TextArea } = Input;
/** prototype params:
 * width 宽度
 * theme: string, 默认light主体色
  * onConfirm: func, 唯一输出函数(必须)
  * onCancel: func, 取消提示
  * tipClassname: object, 默认{}, 用于手动替换更变默认样式
  */
export default class RejectAlert extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    theme: PropTypes.string,
    tipClassname: PropTypes.string,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    width: PropTypes.number,
  };

  static defaultProps = {
    visible: false,
    theme: 'light',
  };

  constructor(props) {
    super(props);
    this.state = {
      value: null,
      numberWord: 0,
      errorFlag: false,
    };
  }

  onCancel = () => { // 取消按钮
    this.props.onCancel();
  };

  onConfirm = () => { // 确定按钮
    const { value } = this.state;
    if (value && value.trim()) {
      return this.props.onConfirm(value, () => {
        this.setState({ value: null });
      });
    }
    return this.setState({
      errorFlag: true,
    });
  };

  onChange = e => {
    const num = computeLength(e.target.value);
    // 大于99
    if (num > 999) {
      return false;
    }
    this.setState({
      numberWord: computeLength(e.target.value),
      value: e.target.value,
      errorFlag: false,
    });
  };

  render() {
    const { value, numberWord, errorFlag } = this.state;
    const {
      visible, theme, tipClassname, width, resonName,
    } = this.props;
    const defaultModalProps = {
      footer: null,
      closable: false,
      maskClosable: false,
      maskStyle: { backgroundColor: 'rgba(153,153,153,0.2)' },
    };
    width && (defaultModalProps.width = width);
    return (
      <Modal
        {...defaultModalProps}
        onOk={this.onConfirm}
        onCancel={this.onCancel}
        visible={visible}
        wrapClassName={`${styles.rejectBox} ${styles[theme]} ${tipClassname || ''}`}
      >
        <div className={styles.rejectContentBox}>
          <div className={styles.rejectTitle}>
            {resonName || '驳回'}
          </div>
          <div className={styles.rejectContent}>
            <div className={styles.rejectTextBox}>
              <span className={styles.textImport}>*</span>
              <span className={styles.rejectContentText}>驳回原因</span>
            </div>
            <TextArea
              value={value}
              onChange={this.onChange}
              placeholder="请输入..."
            />
            <div className={styles.rejectInfo}>
              <div className={styles.rejectErrorInfo}>
                {errorFlag ? '*为必填项！' : ''}
              </div>
              <div>
                <span>{numberWord}</span>
                <span>/999</span>
              </div>
            </div>
          </div>
          <div className={styles.rejectBtn}>
            <div className={styles.rejectCancelBtn} onClick={this.onCancel}>
              取消
            </div>
            <CneButton
              onClick={this.onConfirm}
              style={{ width: '92px' }}
            >
              确定
            </CneButton>
          </div>
        </div>
      </Modal>
    );
  }
}
