
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';
import AddDepartment from './AddDepartment';
import DepartmentDetail from './DepartmentDetail';
import EditDepartment from './EditDepartment';
import Footer from '../../../../Common/Footer';

class DepartmentSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
  }

  constructor(props){
    super(props);
  }

  render(){
    const { showSidePage } = this.props;
    return (
      <div className={styles.departmentSide}>
        { showSidePage === 'detail' && <DepartmentDetail {...this.props} /> }
        { showSidePage === 'add' && <AddDepartment {...this.props} /> }
        { showSidePage === 'edit' && <EditDepartment {...this.props} /> }
        <Footer />
      </div>
    )
  }
}

export default DepartmentSide;
