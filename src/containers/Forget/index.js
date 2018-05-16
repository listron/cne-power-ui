import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {hashHistory,Link} from 'react-router-dom';
import {Form,Input,Button,notification,Icon,Avatar,Row,Col} from 'antd';
// import {fetchRegister} from 'actions/common';
import ForgetForm1 from '../../components/Login/ForgetForm1';
import ForgetForm2 from '../../components/Login/ForgetForm2'

// const FormItem = Form.Item
// const api  = "http://10.10.24.56:8080";


class Forget extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props)
    this.state = {
      form1: "block",
      form2: "none",
    }
  }

  nextForm = (phone) => {
    this.setState({
      form1: "none",
      form2: "block",
    })
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
          <div className="title2">重置密码</div>
          <div className="avatar"><span className="icon-user"></span>{name&&name}</div>
          <div className="loginWrap">
            <ForgetForm1  visible={this.state.form1} nextForm={this.nextForm}/>
            <Link className="loginFormForgot" to="/login" style={{display:this.state.form1}}>去登录</Link>
            <ForgetForm2 visible={this.state.form2}/>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  domain: state.login.domain,
  error:state.login.error,
  msg:state.login.msg,
  // phone:state.login.phone,
});

const mapDispatchToProps = (dispatch) => ({
  // fetchPosts: () => dispatch({ type: GET_POSTS_SAGA })
});
export default connect(mapStateToProps, mapDispatchToProps)(Forget)
