import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon } from 'antd';
import WarningTip from '../../../../components/Common/WarningTip';

import styles from './deviceSide.scss';
import AddDeviceForm from './AddDeviceForm';


class AddDevice extends Component {
  static propTypes = {
    changeDeviceManageStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    }
  }
  onWarningTipShow = () => {
    this.setState({
      showWarningTip: true,
    })
  }
  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
    this.props.changeDeviceManageStore({
      showPage: 'list',
    });

  }

  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
  }
  render() {
    const { showWarningTip, warningTipText } = this.state;
    return (
      <div className={styles.addDevice}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.editTop}>
          <span className={styles.text}>新增</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onWarningTipShow} />
        </div>
        <AddDeviceForm {...this.props} />
      </div>
    )
  }
}
export default (AddDevice)