

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './role.scss';
import RoleEditForm from './RoleEditForm';
import WarningTip from '../../../Common/WarningTip';

class RoleEdit extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    changeRoleStore: PropTypes.func,
    getMenuList: PropTypes.func,
    getDefaultMenuList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
    };
  }

  componentDidMount() {
    this.props.getMenuList();
    this.props.getDefaultMenuList();
  }

  onCancelEdit = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '退出后信息无法保存!',
    });
  }

  onCancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }

  onConfirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.props.changeRoleStore({
      showPage: 'list',
      selectedRole: [],
    });
  }

  render() {
    const { showWarningTip, warningTipText } = this.state;
    return (
      <div className={styles.roleEdit}>
        {showWarningTip && <WarningTip onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <div className={styles.roleEditContent}>
          <div className={styles.editTop}>
            <span className={styles.text}>{this.props.showPage === 'create' ? '新建' : '编辑'}</span>
            <i className={`iconfont icon-fanhui ${styles.backIcon}`} onClick={this.onCancelEdit} />
          </div>
          <div className={styles.editPart} >
            {this.props.showPage !== 'list' && <RoleEditForm {...this.props} />}
          </div>
        </div>
      </div>
    );
  }
}

export default RoleEdit;
