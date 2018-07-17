

import React, { Component } from 'react';
import { Radio, Button } from 'antd';
import PropTypes from 'prop-types';
// import EnterpriseSearch from './EnterpriseSearch';
// import EnterpriseTable from './EnterpriseTable';
import styles from './departmentMain.scss'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

//部门主页面。包含搜索组件，表格组件，分页及操作组件；
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

  searchEnterprise = ({enterpriseName,enterprisePhone}) => {//名称+电话 搜索企业
    const {filterStatus,sort,ascend,currentPage,pageSize} = this.props;
    this.props.getEnterpriseList({
      filterStatus,
      enterpriseName,
      enterprisePhone,
      sort,
      ascend,
      currentPage,
      pageSize,
    });
  }


  render(){
    const { changeEnterpriseStore, filterStatus } = this.props;
    return (
      <div className={styles.departmentMain}>
        这个是主要表格区域啊！
        <Button onClick={()=>this.props.changeDepartmentStore({showPage: 'add'})}>点击切换至新增页</Button>
        <Button onClick={()=>this.props.changeDepartmentStore({showPage: 'edit'})}>点击切换至编辑页</Button>
        <Button onClick={()=>this.props.changeDepartmentStore({showPage: 'detail'})}>点击切换至详情页</Button>
        {/* <Button onClick={()=>changeEnterpriseStore({showPage:'detail'})}  type="primary" >请展示详情</Button>
        <Button onClick={()=>changeEnterpriseStore({showPage: 'edit'})}  type="primary" >请展示新增编辑企业信息的按钮</Button>
        <div className={styles.enterpriseStatus}>
          <span className={styles.statusText}>状态</span>
          <RadioGroup onChange={this.selectStatus} className={styles.radioGroup} value={filterStatus}>
            <RadioButton value={2}>全部</RadioButton>
            <RadioButton value={0}>启用</RadioButton>
            <RadioButton value={1}>禁用</RadioButton>
          </RadioGroup>
        </div>
        <EnterpriseSearch searchEnterprise={this.searchEnterprise} />
        <EnterpriseTable {...this.props} /> */}
      </div>
    )
  }
}

export default DepartmentMain;
