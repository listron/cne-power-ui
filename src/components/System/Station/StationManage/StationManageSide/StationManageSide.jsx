
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './stationSide.scss';
// import AddDepartment from './AddDepartment';
// import DepartmentDetail from './DepartmentDetail';
// import EditDepartment from './EditDepartment';
import Footer from '../../../../Common/Footer';

class StationManageSide extends Component {
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
        侧边问题啊！
        <Footer />
      </div>
    )
  }
}

export default StationManageSide;
