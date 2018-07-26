

import React, { Component } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';
import EditForm from './EditForm';
import WarningTip from '../../../Common/WarningTip';

class AddDepartment extends Component {
  static propTypes = {
    changeDepartmentStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    }
  }

  cancelEdit = () => {
    this.setState({
      showWarningTip: true,
    })
  }
  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
  }
  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
    this.props.changeDepartmentStore({showPage: 'list'});    
  }

  render(){
    const { showWarningTip, warningTipText } = this.state;
    return (
      <div className={styles.editDepartment} >
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}      
        <div className={styles.editTop}>
          <span className={styles.text}>编辑</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.cancelEdit} />
        </div>
        <div className={styles.mainPart}>
          <EditForm {...this.props} /> 
        </div>
      </div>
    )
  }
}

export default AddDepartment;
