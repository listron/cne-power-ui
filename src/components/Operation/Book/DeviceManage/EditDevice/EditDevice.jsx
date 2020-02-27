import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from '../deviceSide.scss';
import { Button, Input, Form, Select, DatePicker, Icon, Spin } from 'antd';
import WarningTip from '../../../../../components/Common/WarningTip';
import EditDeviceForm from './EditDeviceForm';

class EditDevice extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    };

  }
  backToList = () => {
    this.props.changeDeviceManageStore({ showPage: 'list' });
    this.props.onShowSideChange('list');
  }
  render() {
    const { showWarningTip, warningTipText } = this.state;
    const { detailloading } = this.props;
    return (
      <div className={styles.contentBox}>
        {detailloading ? <div className={styles.loadingStyle}> <Spin /></div> :
          <div className={styles.editDevice}>
            {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
            <div className={styles.editTop}>
              <span className={styles.text}>编辑</span>
              <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.backToList} />
            </div>
            <EditDeviceForm {...this.props} />
          </div>
        }
      </div>);
  }
}
export default (EditDevice)
  ;
