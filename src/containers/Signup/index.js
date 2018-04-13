import React, { Component } from 'react';
import { Link,withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {Form,message} from 'antd';
import { GET_COMINFOSU_SAGA } from '../../constants/actionTypes/Login';
import LoginForm from '../../components/Login/LoginForm';
// import './base.scss';
import SignupForm1 from '../../components/Login/SignupForm1';
import SignupForm2 from '../../components/Login/SignupForm2';

class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      form1: "block",
      form2: "none",
    }
  }

  componentDidMount() {
    const linkCode = 'e7228d7fcc2d44a48981923e72bb27f2';
    this.props.fetchcCompanyInfo(linkCode);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.info.error&&!this.props.info.error){
      this.props.history.push('/404');      
    }
  }

  nextForm = (phone,captcha) => {
    this.setState({
      form1: "none",
      form2: "block",
      phone:phone,
      captcha:captcha,
    })
  }
  
  render() {
    const {
      name,
      logo
    }=this.props.info;
    return (
      <div className="loginpagewrap">
        <img src={logo?logo:"/img/cnelogo.png"} alt="logo"/>
        <a href="#" className="right">返回官网</a>
        <div className="box">
          <div className="title2">登录</div>
          <div className="avatar"><span className="icon-user"></span>{name&&name}</div>
          <div className="loginWrap">
            <SignupForm1 visible={this.state.form1} nextForm={this.nextForm}/>
            <Link className="loginFormForgot" to="/login">已有账号，去登录</Link>          
            <SignupForm2 visible={this.state.form2} phone={this.state.phone} captcha={this.state.captcha}/>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  info: state.login.info,
  // error:state.login.error,
  // msg:state.login.msg,
  // phone:state.login.phone,
});

const mapDispatchToProps = (dispatch) => ({
  fetchcCompanyInfo: (parmas) => dispatch({ type: 'GET_COMINFOSU_SAGA',parmas:parmas })
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signup))
