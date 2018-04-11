import React, { Component } from 'react';
import PropTypes from "prop-types";
import {Link,hashHistory, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {Form,message} from 'antd';
import { GET_COMINFO_SAGA,GET_LOGIN_SAGA } from '../../constants/actionTypes';
import LoginForm from '../../components/Login/LoginForm';
import {setCookie, getCookie} from '../../utils';
import './base.scss';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      phone:'',
    };
  }

  componentWillMount() {
    // const domain = document.domain.split('.')[0];    
    const domian = 'test';
    this.props.fetchCompanyInfo(`domian=${domian}`);
  }
  componentDidMount(){
    console.log(this.state);
  }


  handleSubmit = (values) => {
    this.setState({phone:values.phone});
    this.props.fetchLogin(values);
  }

  render() {
    const {
      name,
      logo
    }=this.props.domain;
    return (
      <div className="loginpagewrap">
        <img src={logo?logo:"/img/cnelogo.png"} alt="logo"/>
        <a href="#" className="right">返回官网</a>
        <div className="box">
          <div className="title">登录</div>
          <div className="triangle"></div>
          <div className="avatar"><span className="icon-user"></span><p>{name&&name}</p></div>
          <div className="loginWrap">
            <LoginForm handleSubmit={this.handleSubmit} company={name&&name}/>
            <Link className="loginFormForgot" to='/forget'>忘记密码</Link>      
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  domain: state.login.domain,
  // login:state.login.login,
  error:state.login.error,
  msg:state.login.msg,
});

const mapDispatchToProps = (dispatch) => ({
  fetchCompanyInfo: (parmas) => dispatch({type:'GET_COMINFO_SAGA',parmas:parmas}),
  fetchLogin:(parmas) => dispatch({type:'GET_LOGIN_SAGA',parmas})
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
