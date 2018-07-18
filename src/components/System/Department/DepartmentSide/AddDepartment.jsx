

import React, { Component } from 'react';
import { Icon, Popconfirm } from 'antd';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';
// import EditForm from './EditForm';

class AddDepartment extends Component {
  static propTypes = {
    // loading: PropTypes.bool,
    // changeEnterpriseStore: PropTypes.func,
    // getEnterpriseDetail: PropTypes.func,
    // saveEnterpriseInfor: PropTypes.func,
    // enterpriseDetail: PropTypes.object,
  }

  constructor(props){
    super(props);
    this.state={
      
    }
  }
  // componentWillUnmount(){
  //   this.props.changeEnterpriseStore({
  //     showPage: 'detail',
  //   });
  // }

  // cancelEdit = () => {
  //   this.props.changeEnterpriseStore({
  //     showPage: 'detail',
  //   });
  // }

  render(){
    // const { enterpriseDetail,saveEnterpriseInfor, loading } = this.props;
    return (
      <div className={styles.addDepartment} >
        <div className={styles.editTop}>
          <span className={styles.text}>编辑</span>
          <Icon type="arrow-left" className={styles.backIcon} onConfirm={this.cancelEdit} />
        </div>
        <div className={styles.mainPart}>

        </div>
        {/* 
        <div className={styles.mainPart} >
          <EditForm enterpriseDetail={enterpriseDetail} enterpriseLogo={enterpriseLogo} saveEnterpriseInfor={saveEnterpriseInfor} loading={loading} />
        </div> */}
      </div>
    )
  }
}

export default AddDepartment;
