import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

class JoinIn extends Component {
  static propTypes = {
    changeLoginPage: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }
  changePage = (pageTab) =>{
    this.props.changeLoginPage({pageTab})
  }
  render() {

    return (
      <div>
        加入企业页面！！！！
        <Button type={'primary'} onClick={()=>this.changePage('login')}> 登录页面 </Button>
        <Button type={'primary'} onClick={()=>this.changePage('register')}> 注册企业 </Button>
      </div>
    );
  }
}

export default JoinIn;
