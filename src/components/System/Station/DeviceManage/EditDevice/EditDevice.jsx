import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from '../deviceSide.scss';
import { Button, Input, Form, Select, DatePicker, Icon } from 'antd';
import WarningTip from '../../../../../components/Common/WarningTip';
import EditDeviceForm from './EditDeviceForm';

class EditDevice extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    }
  }
  render() {
    const { showWarningTip, warningTipText, } = this.state;
    return (
      <div className={styles.editDevice}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.editTop}>
          <span className={styles.text}>编辑</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onWarningTipShow} />
        </div>
        <EditDeviceForm {...this.props} />
      </div>
    )
  }
}
export default (EditDevice)