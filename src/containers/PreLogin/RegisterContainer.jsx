import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

class RegisterContainer extends Component {
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
        企业注册页面！
        <Button type={'primary'} onClick={()=>this.changePage('login')}> 登录页面 </Button>
        <Button type={'primary'} onClick={()=>this.changePage('joinIn')}> 加入企业 </Button>
        <Button type={'primary'} onClick={()=>this.changePage('forget')}> 忘记密码 </Button>
      </div>
    );
  }
}

export default RegisterContainer;
