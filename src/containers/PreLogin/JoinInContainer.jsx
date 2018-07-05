import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

class JoinInContainer extends Component {
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
        加入企业页面！！！！
        <Button type={'primary'} onClick={()=>this.changePage('login')}> 登录页面 </Button>
        <Button type={'primary'} onClick={()=>this.changePage('register')}> 注册企业 </Button>
        <Button type={'primary'} onClick={()=>this.changePage('forget')}> 忘记密码 </Button>
      </div>
    );
  }
}

export default JoinInContainer;
