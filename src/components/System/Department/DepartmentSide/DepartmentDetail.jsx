

import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';

class DepartmentDetail extends Component {
  static propTypes = {
    changeDepartmentStore: PropTypes.func,
    // ignoreEnterpirseEdit: PropTypes.func,
    departmentDetail: PropTypes.object,
    // history: PropTypes.object
  }

  constructor(props){
    super(props);
    this.state = {
    }
  }

  render(){
    const { changeDepartmentStore, departmentDetail } = this.props;
    let userFullNames = departmentDetail.userFullNameData? departmentDetail.userFullNameData.map(e=>e.userFullName):[];
    let stationNames = departmentDetail.stationNameData? departmentDetail.stationNameData.map(e=>e.stationName):[];
    return (
      <div className={styles.departmentDetail}>
        <div className={styles.detailTop}>
          <Button className={styles.editButton} onClick={()=>changeDepartmentStore({showPage:'edit'})}>编辑</Button>
        </div>
        <div className={styles.departmentInfor} >
          <div>
            <span className={styles.promptTitle}>部门名称</span>{departmentDetail.departmentName} 
          </div>
          <div>
            <span className={styles.promptTitle}>所属部门</span>{departmentDetail.parentDepartmentName}
          </div>
          <div>
            <span className={styles.promptTitle}>成员</span>{userFullNames}
          </div>
          <div>
            <span className={styles.promptTitle}>负责电站</span>{stationNames}
          </div>
          <div>
            <span className={styles.promptTitle}>负责电站</span>{departmentDetail.enterpriseProfile}
          </div>
          <div>
            <span className={styles.promptTitle}>创建者</span>{departmentDetail.createUser}
          </div>
          <div>
            <span className={styles.promptTitle}>创建时间</span>{departmentDetail.createTime}
          </div>
          <div>
            <span className={styles.promptTitle}>最后修改人--接口没数据</span>{departmentDetail.createUser}
          </div>
          <div>
            <span className={styles.promptTitle}>最后修改时间--接口没数据</span>{departmentDetail.createTime}
          </div>
        </div>
      </div>
    )
  }
}

export default DepartmentDetail ;
