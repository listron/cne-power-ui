

import React, { Component } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';
import AddForm from './AddForm';

class AddDepartment extends Component {
  static propTypes = {
    changeDepartmentStore: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  cancelAdd = () => {
    this.props.changeDepartmentStore({showPage: 'list'});
  }

  render(){
    return (
      <div className={styles.addDepartment} >
        <div className={styles.editTop}>
          <span className={styles.text}>新建</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.cancelAdd} />
        </div>
        <div className={styles.mainPart}>
          <AddForm {...this.props} /> 
        </div>
      </div>
    )
  }
}

export default AddDepartment;
