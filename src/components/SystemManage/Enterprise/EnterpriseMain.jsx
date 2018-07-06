

import React, { Component } from 'react';
import { Radio } from 'antd';
import PropTypes from 'prop-types';
import EnterpriseSearch from './EnterpriseSearch';
import EnterpriseTable from './EnterpriseTable';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class EnterpriseMain extends Component {
  static propTypes = {
    enterpriseList: PropTypes.array,
    selectedEnterprise: PropTypes.array,
  }

  constructor(props){
    super(props);
  }

  selectStatus = (e) => {
    console.log(e.target.value)
  }

  render(){
    const { enterpriseList, selectedEnterprise } = this.props;
    return (
      <div>
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
