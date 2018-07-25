

import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';

class DepartmentDetail extends Component {
  static propTypes = {
    departmentData: PropTypes.array,
    changeDepartmentStore: PropTypes.func,
    onShowSideChange: PropTypes.func,
    departmentDetail: PropTypes.object,
  }

  constructor(props){
    super(props);
    this.state = {
    }
  }

  onShowSideChange = ({showSidePage}) => {
    this.props.onShowSideChange({showSidePage:'edit'});
    this.props.changeDepartmentStore({showPage: 'edit'});
  }
  
  setDepartmentUser = () => {
    console.log(this.props.departmentDetail);
  }

  setDepartmentStation = () => {
    console.log(this.props.departmentDetail);
  }

  preDepartment = () =>{
    const { departmentDetail, departmentData } = this.props;
    console.log(departmentDetail);
    console.log(departmentData);
  }

  nextDepartment = () => {
    const { departmentDetail, departmentData } = this.props;
    console.log(departmentDetail);
    console.log(departmentData);
  }

  render(){
    const { departmentDetail } = this.props;
    let userFullNames = (departmentDetail.userFullNameData && departmentDetail.userFullNameData.length > 0 )? departmentDetail.userFullNameData.map(e=>e.userFullName).join(','):' -- ';
    let stationNames = (departmentDetail.stationNameData && departmentDetail.stationNameData.length > 0 )? departmentDetail.stationNameData.map(e=>e.stationName).join(','):' -- ';
    return (
      <div className={styles.departmentDetail}>
        <div className={styles.detailTop}>
          <Button className={styles.editButton} onClick={()=>this.onShowSideChange({showSidePage:'eidt'})}>编辑</Button>
          <span className={styles.handleArea} >
            <Icon type="arrow-up" className={styles.previous} title="上一个" onClick={this.preDepartment} />
            <Icon type="arrow-down" className={styles.next} title="下一个" onClick={this.nextDepartment} />
            <Icon type="arrow-left" className={styles.backIcon} onClick={this.cancelAdd} />
          </span>
        </div>
        <div className={styles.departmentInfor} >
          <div>
            <span className={styles.title}>部门名称</span>
            <span className={styles.value}>{departmentDetail.departmentName}</span> 
          </div>
          <div>
            <span className={styles.title}>所属部门</span>
            <span className={styles.value}>{departmentDetail.parentDepartmentName}</span> 
          </div>
          <div>
            <span className={styles.title}>成员</span>
            <span className={styles.value}>{userFullNames}</span> 
            <Button className={styles.setting} onClick={this.setDepartmentUser}>设置</Button>
          </div>
          <div>
            <span className={styles.title}>负责电站</span>
            <span className={styles.value}>{stationNames}</span> 
            <Button className={styles.setting} onClick={this.setDepartmentStation} >设置</Button>
          </div>
          <div>
            <span className={styles.title}>负责电站</span>
            <span className={styles.value}>{departmentDetail.enterpriseProfile}</span> 
          </div>
          <div>
            <span className={styles.title}>创建者</span>
            <span className={styles.value}>{departmentDetail.createUser}</span> 
          </div>
          <div>
            <span className={styles.title}>创建时间</span>
            <span className={styles.value}>{departmentDetail.createTime}</span> 
          </div>
          <div>
            <span className={styles.title}>最后修改人</span>
            <span className={styles.value}>{departmentDetail.updateUser}</span> 
          </div>
          <div>
            <span className={styles.title}>最后修改时间</span>
            <span className={styles.value}>{departmentDetail.updateTime}</span> 
          </div>
        </div>
      </div>
    )
  }
}

export default DepartmentDetail ;
