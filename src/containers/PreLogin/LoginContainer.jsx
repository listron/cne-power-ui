import React, { Component } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';

class LoginContainer extends Component {
  static propTypes = {
    changePreLoginPage: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }
  changePage = (pageTab) =>{
    this.props.changePreLoginPage({pageTab})
  }

  render() {
    return (
      <div>
        登录页面
        <Button type={'primary'} onClick={()=>this.changePage('register')}> 注册企业 </Button>
        <Button type={'primary'} onClick={()=>this.changePage('joinIn')}> 加入企业 </Button>
        <Button type={'primary'} onClick={()=>this.changePage('forget')}> 忘记密码 </Button>
      </div>
    );
  }
}

export default LoginContainer;
