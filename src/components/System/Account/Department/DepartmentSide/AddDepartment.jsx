

import React, { Component } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';
import AddForm from './AddForm';
import WarningTip from '../../../../Common/WarningTip';
import Footer from '../../../../Common/Footer';

class AddDepartment extends Component {
  static propTypes = {
    changeDepartmentStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    };
  }

  cancelAdd = () => {
    this.setState({
      showWarningTip: true,
    });
  }
  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }
  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.props.changeDepartmentStore({ showPage: 'list' });
  }

  render() {
    const { showWarningTip, warningTipText } = this.state;
    return (
      <div className={styles.addDepartment} >
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.editTop}>
          <span className={styles.text}>新建</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.cancelAdd} />
        </div>
        <div className={styles.mainPart}>
          <AddForm {...this.props} />
        </div>
      </div>
    );
  }
}

export default AddDepartment;
