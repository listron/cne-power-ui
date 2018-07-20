

import React, { Component } from 'react';
import { Icon, Popconfirm } from 'antd';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';
import EditForm from './EditForm';

class AddDepartment extends Component {
  static propTypes = {
    changeDepartmentStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state={
      
    }
  }

  editApartment = () => {
    this.props.changeDepartmentStore({showPage: 'list'});
  }

  render(){
    return (
      <div className={styles.addDepartment} >
        <div className={styles.editTop}>
          <span className={styles.text}>编辑</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.editApartment} />
        </div>
        <div className={styles.mainPart}>
          <EditForm {...this.props} /> 
        </div>
      </div>
    )
  }
}

export default AddDepartment;
