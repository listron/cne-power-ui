

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';
import styles from './role.scss';
import RoleEditForm from './RoleEditForm';

class RoleEdit extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    changeRoleStore: PropTypes.func,
    getMenuList: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getMenuList();
  }

  onCancelEdit = () => {
    this.props.changeRoleStore({showPage: 'list'});
  }

  render(){
    return (
      <div className={styles.roleSide}>
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
