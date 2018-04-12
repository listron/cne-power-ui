import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory,Link} from 'react-router-dom'
import {Form,Input,Button,notification,Icon,Avatar,Row,Col} from 'antd';
// import {fetchRegister} from 'actions/common'
import SignupForm1 from '../../components/Login/SignupForm1';
import SignupForm2 from '../../components/Login/SignupForm2';
// import axios from 'axios';
// const api  = "http://10.10.24.56:8080";
// import {axiosPost} from '../utils'
// import actions from '../actions/common';

// @connect((state, props) => ({
//   config: state.config,
//   register: state.Register,
// }), )

class Signup extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props)
    this.state = {
      form1: "block",
      form2: "none",
    }
  }

  // 组件已经加载到dom中
  componentDidMount() {
    const linkCode = 'e7228d7fcc2d44a48981923e72bb27f2';
    // this.props.dispatch(actions.fetchcCompanyInfo(linkCode));
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
    return (
       <div className="loginpagewrap">
            <img src={this.props.register&&this.props.register.enterpriseLogUrl?this.props.register.enterpriseLogUrl:"/img/logo.png"} alt="logo"/>
            <a href="http://www.cnecloud.com/" className="right">返回官网</a>
        <div className="box">
            <div className="title">登录</div>
            <div className="triangle"></div>
            <div className="avatar"><span className="icon-user"></span><p>{this.props.register&&this.props.register.enterpriseName?this.props.register.enterpriseName:''}</p></div>
            <div className="loginWrap">
              <SignupForm1 visible={this.state.form1} dispatch={this.props.dispatch} nextForm={this.nextForm}/>
              <Link className="loginFormForgot" to="/login">已有账号，去登录</Link>          
              <SignupForm2 visible={this.state.form2} dispatch={this.props.dispatch} phone={this.state.phone} captcha={this.state.captcha}/>
            </div>
        </div>
    </div>
    )
  }
}
const mapStateToProps = (state) => ({
  // posts: state.posts   // 合并的reducer
  // posts: state.posts.posts    // 单独的reducer
});

const mapDispatchToProps = (dispatch) => ({
  // fetchPosts: () => dispatch({ type: GET_POSTS_SAGA })
});
// const forms = Form.create({})(LoginForm);
export default Signup;
// export default connect(mapStateToProps, mapDispatchToProps)(Login);