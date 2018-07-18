

import React, { Component } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import DepartmentSearch from './DepartmentSearch';
import DepartmentTable from './DepartmentTable';
import styles from './departmentMain.scss'

//部门主页面。部门查询组件，分页及表格组件；
class DepartmentMain extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
    departmentSource: PropTypes.number,
    departmentName: PropTypes.string, 
    parentDepartmentName: PropTypes.string, 
    stationName: PropTypes.string, 
    sort: PropTypes.string, 
    ascend: PropTypes.bool, 
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    changeDepartmentStore: PropTypes.func,
    getDepartmentList: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  searchDepartment = ({departmentName,parentDepartmentName,stationName}) => {//部门搜索
    const params = {
      departmentSource: this.props.departmentSource,
      departmentName, 
      parentDepartmentName, 
      stationName, 
      sort: this.props.sort, 
      ascend: this.props.ascend, 
      pageNum: this.props.pageNum,
      pageSize: this.props.pageSize,
    }
    this.props.getDepartmentList(params)//请求部门列表
  }


  render(){
    return (
      <div className={styles.departmentMain}>
        这个是主要表格区域啊！
        <Button onClick={()=>this.props.changeDepartmentStore({showPage: 'add'})}>点击切换至新增页</Button>
        <Button onClick={()=>this.props.changeDepartmentStore({showPage: 'edit'})}>点击切换至编辑页</Button>
        <Button onClick={()=>this.props.changeDepartmentStore({showPage: 'detail'})}>点击切换至详情页</Button>
        <DepartmentSearch searchDepartment={this.searchDepartment} />    
        <DepartmentTable {...this.props} />    
      </div>
    )
  }
}

export default DepartmentMain;
