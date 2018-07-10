

import React, { Component } from 'react';
import { Radio, Button } from 'antd';
import PropTypes from 'prop-types';
import EnterpriseSearch from './EnterpriseSearch';
import EnterpriseTable from './EnterpriseTable';
import styles from './enterprise.scss'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class EnterpriseMain extends Component {
  static propTypes = {
    enterpriseList: PropTypes.array,
    selectedEnterprise: PropTypes.array,
    changeEnterpriseAttr: PropTypes.func,
    getEnterpriseList: PropTypes.func,

    filterStatus: PropTypes.number, 
    enterpriseName: PropTypes.string, 
    enterprisePhone: PropTypes.string,
    sort: PropTypes.string, 
    ascend: PropTypes.bool,
    currentPage: PropTypes.number, 
    pageSize: PropTypes.number, 
  }

  constructor(props){
    super(props);
  }

  selectStatus = (e) => {
    const filterStatus = e.target.value;
    const {enterpriseName,enterprisePhone,sort,ascend,currentPage,pageSize} = this.props;
    this.props.changeEnterpriseAttr({filterStatus});
    this.props.getEnterpriseList({
      enterpriseName,
      enterprisePhone,
      sort,
      ascend,
      currentPage,pageSize,
      filterStatus
    });
  }

  searchEnterprise = ({enterpriseName,enterprisePhone}) => {
    console.log(enterpriseName,enterprisePhone)
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
    const { enterpriseList, selectedEnterprise,changeEnterpriseAttr, filterStatus, getEnterpriseList } = this.props;
    return (
      <div className={styles.enterpriseMain}>
        <Button onClick={()=>changeEnterpriseAttr({showPage:'detail'})}  type={'primary'} >请展示详情</Button>
        <Button onClick={()=>changeEnterpriseAttr({showPage: 'edit'})}  type={'primary'} >请展示新增编辑企业信息的按钮</Button>
        <div className={styles.enterpriseStatus}>
          <span className={styles.statusText}>状态</span>
          <RadioGroup onChange={this.selectStatus} className={styles.radioGroup} value={filterStatus}>
            <RadioButton value={0}>全部</RadioButton>
            <RadioButton value={1}>启用</RadioButton>
            <RadioButton value={2}>禁用</RadioButton>
          </RadioGroup>
        </div>
        <EnterpriseSearch searchEnterprise={this.searchEnterprise} />
        <EnterpriseTable enterpriseList={enterpriseList} selectedEnterprise={selectedEnterprise} getEnterpriseList={getEnterpriseList} />
      </div>
    )
  }
}

export default EnterpriseMain;
