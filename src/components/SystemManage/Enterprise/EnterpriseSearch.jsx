

import React, { Component } from 'react';
import { Input, Button } from 'antd';
import PropTypes from 'prop-types';


class EnterpriseSearch extends Component {
  static propTypes = {

  }

  constructor(props){
    super(props);
  }


  render(){
    return (
      <div>
          <span>企业名称</span>
          <Input placeholder="请输入要查询的企业名称" />
          <span>企业电话</span>
          <Input placeholder="请输入要查询的企业电话" />
          <Button>重置</Button>          
          <Button>查询</Button>          
      </div>
    )
  }
}

export default EnterpriseSearch;
