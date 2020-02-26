import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Modal, Input } from 'antd';
import CneButton from '@components/Common/Power/CneButton';
import { computeLength } from '../computeLength';
import styles from './passAlert.scss';

const { TextArea } = Input;
/** prototype params:
 * width 宽度
 * theme: string, 默认light主体色
  * onConfirm: func, 唯一输出函数(必须)
  * onCancel: func, 取消提示
  * tipClassname: object, 默认{}, 用于手动替换更变默认样式
  */
export default class PassAlert extends Component {
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
    };
  }

  onCancel = () => { // 取消按钮
    this.props.onCancel();
  };

  onConfirm = () => { // 确定按钮
    const { value } = this.state;
    this.props.onConfirm(value ? value.trim() : value);
  };

  onChange = e => {
    const num = computeLength(e.target.value);
    // 大于99
    if(num > 999) {
      return false;
    }
    this.setState({
      numberWord: computeLength(e.target.value),
      value: e.target.value,
    });
  };

  render() {
    const { value, numberWord } = this.state;
    const {
      visible, theme, tipClassname, width,
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
        wrapClassName={`${styles.passBox} ${styles[theme]} ${tipClassname || ''}`}
      >
        <div className={styles.passContentBox}>
          <div className={styles.passTitle}>
            验收通过
          </div>
          <div className={styles.passContent}>
            <span className={styles.passContentText}>验收意见</span>
            <TextArea
              value={value}
              onChange={this.onChange}
              placeholder="非必填，请输入..."
            />
            <p className={styles.passInfo}>
              <span>{numberWord}</span>
              <span>/999</span>
            </p>
          </div>
          <div className={styles.passBtn}>
            <div className={styles.passCancelBtn} onClick={this.onCancel}>
              取消
            </div>
            <CneButton
              onClick={this.onConfirm}
              style={{width: '92px'}}
            >
              确定
            </CneButton>
          </div>
        </div>
      </Modal>
    );
  }
}
