

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
  }

  constructor(props){
    super(props);
  }

  selectStatus = (e) => {
    console.log(e.target.value)
  }


  render(){
    const { enterpriseList, selectedEnterprise,changeEnterpriseAttr } = this.props;
    return (
      <div className={styles.enterpriseMain}>
        <Button onClick={()=>changeEnterpriseAttr({showPage:'detail'})}  type={'primary'} >请展示详情</Button>
        <Button onClick={()=>changeEnterpriseAttr({showPage: 'edit'})}  type={'primary'} >请展示新增编辑企业信息的按钮</Button>
        <div>
          <span>状态</span>
          <RadioGroup onChange={this.selectStatus}>
            <RadioButton value={0}>全部</RadioButton>
            <RadioButton value={1}>启用</RadioButton>
            <RadioButton value={2}>禁用</RadioButton>
          </RadioGroup>
        </div>
        <EnterpriseSearch />
        <EnterpriseTable enterpriseList={enterpriseList} selectedEnterprise={selectedEnterprise} />
      </div>
    )
  }
}

export default EnterpriseMain;
