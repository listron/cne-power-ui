

import React, { Component } from 'react';
import { Input, Button } from 'antd';
import styles from './enterpriseList.scss';
import PropTypes from 'prop-types';


class EnterpriseSearch extends Component {
  static propTypes = {
    searchEnterprise: PropTypes.func
  }

  constructor(props){
    super(props);
    this.state = {
      enterpriseName: '',
      enterprisePhone: ''
    }
  }
  onEnterpriseSearch = () => {
    const {enterpriseName, enterprisePhone} = this.state;
    this.props.searchEnterprise({
      enterpriseName,
      enterprisePhone
    })
  }
  onEnterpriseReset = () => {
    this.props.searchEnterprise({
      enterpriseName:'',
      enterprisePhone:''
    })
    this.setState({
      enterpriseName: '',
      enterprisePhone: ''
    })
  }

  inputEnterpriseName = (e) => {
    this.setState({
      enterpriseName: e.target.value
    })
  }

  inputEnterprisePhone = (e) => {
    this.setState({
      enterprisePhone: e.target.value
    })
  }

  render(){
    const { enterpriseName, enterprisePhone } = this.state;
    return (
      <div className={styles.enterpriseSearch}>
          <span  className={styles.searchName}>企业名称</span>
          <Input placeholder="请输入企业名称" className={styles.searchNameInput} onChange={this.inputEnterpriseName} value={enterpriseName} />
          <span className={styles.seachPhone}>企业电话</span>
          <Input placeholder="请输入企业电话" className={styles.searchPhoneInput} onChange={this.inputEnterprisePhone} value={enterprisePhone} />         
          <Button className={styles.searchButton} onClick={this.onEnterpriseSearch}>查询</Button>  
          <span className={styles.clearButton}  onClick={this.onEnterpriseReset}>重置</span>         
      </div>
    )
  }
}

export default EnterpriseSearch;
