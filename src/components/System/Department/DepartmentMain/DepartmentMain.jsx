

import React, { Component } from 'react';
import { Radio, Button } from 'antd';
import PropTypes from 'prop-types';
import DepartmentSearch from './DepartmentSearch';
// import EnterpriseTable from './EnterpriseTable';
import styles from './departmentMain.scss'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

//部门主页面。部门查询组件，分页及表格组件；
class DepartmentMain extends Component {
  static propTypes = {
    // selectedEnterprise: PropTypes.array,
    changeDepartmentStore: PropTypes.func,
    // getEnterpriseList: PropTypes.func,

    // filterStatus: PropTypes.number, 
    // enterpriseName: PropTypes.string, 
    // enterprisePhone: PropTypes.string,
    // sort: PropTypes.string, 
    // ascend: PropTypes.bool,
    // currentPage: PropTypes.number, 
    // pageSize: PropTypes.number, 
  }

  constructor(props){
    super(props);
  }

  selectStatus = (e) => {//状态筛选
    const filterStatus = e.target.value;
    const {enterpriseName,enterprisePhone,sort,ascend,currentPage,pageSize} = this.props;
    this.props.changeEnterpriseStore({filterStatus});
    this.props.getEnterpriseList({
      enterpriseName,
      enterprisePhone,
      sort,
      ascend,
      currentPage,
      pageSize,
      filterStatus
    });
  }

  searchDepartment = ({departmentName,parentDepartmentName,stationName}) => {//部门搜索
    console.log({departmentName,parentDepartmentName,stationName})
    // const {filterStatus,sort,ascend,currentPage,pageSize} = this.props;
    // this.props.getEnterpriseList({
    //   filterStatus,
    //   enterpriseName,
    //   enterprisePhone,
    //   sort,
    //   ascend,
    //   currentPage,
    //   pageSize,
    // });
  }


  render(){
    const { changeEnterpriseStore, filterStatus } = this.props;
    return (
      <div className={styles.departmentMain}>
        这个是主要表格区域啊！
        <Button onClick={()=>this.props.changeDepartmentStore({showPage: 'add'})}>点击切换至新增页</Button>
        <Button onClick={()=>this.props.changeDepartmentStore({showPage: 'edit'})}>点击切换至编辑页</Button>
        <Button onClick={()=>this.props.changeDepartmentStore({showPage: 'detail'})}>点击切换至详情页</Button>
        <DepartmentSearch searchDepartment={this.searchDepartment} />        
        {/* 
        <EnterpriseTable {...this.props} /> */}
      </div>
    )
  }
}

export default DepartmentMain;
