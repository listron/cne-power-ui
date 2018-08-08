

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';
import styles from './role.scss';
import RoleEditForm from './RoleEditForm';
import WarningTip from '../../../Common/WarningTip';

class RoleEdit extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    changeRoleStore: PropTypes.func,
    getMenuList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    }
  }

  componentDidMount() {
    this.props.getMenuList();
  }

  onCancelEdit = () => {
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
    this.props.changeRoleStore({showPage: 'list'});   
  }

  render(){
    const { showWarningTip, warningTipText } = this.state;
    return (
      <div className={styles.roleSide}>
      {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.roleEdit}>
          <div className={styles.editTop}>
            <span className={styles.text}>{this.props.showPage==='create'?'新建':'编辑'}</span>
            <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
          </div>
          <div className={styles.editPart} >
            {this.props.showPage!=='list'&&<RoleEditForm {...this.props} />}
          </div>
        </div>
      </div>
    );
  }
}

export default RoleEdit;
