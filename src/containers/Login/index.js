// import React, {Component} from 'react';
// import axios from 'axios';
// import {bindActionCreators} from 'redux';
// import {connect} from 'react-redux';
// import {hashHistory,Link} from 'react-router';
// import {message} from 'antd';
// import {setCookie,axiosPost} from '../utils'
// import LoginForm from '../components/LoginForm'
// // import {fetchLogin,userInfo} from 'actions/common';
// import actions from '../actions/common';
// const api = "http://10.10.24.56:8080";

// @connect((state, props) => ({
//   login: state.Login,
//   // loginResponse: state.tabListResult,
// }))

// class Login extends Component {
//   // 初始化页面常量 绑定事件方法
//   constructor(props, context) {
//     super(props)
//     this.state = {
//       loading: false,
//       phone:'',
//     }
//     this.handleSubmit = this.handleSubmit.bind(this)
//   }

//   handleSubmit(values) {
//     this.setState({loading: true,phone:values.phone})
//     this.props.dispatch(actions.fetchLogin(values));
//   }

//   // 组件已经加载到dom中
//   componentDidMount() {
//     // const domain = document.domain.split('.')[0];
//     const domian = 'test';
//     axios.post(api+'/api/v3/enterprise/domainLogin',`domian=${domian}`)
//     .then((response)=>{
//       if(response.data.success){
//       setCookie('enterpriseId',response.data.result.enterpriseId)
//         this.setState({
//           company:response.data.result.enterpriseName,
//           logo:'',
//         })
//       }else{
//       }
//     })
//     .catch((error)=>{
//       message.error(error)
//     })
//   }
//   componentWillReceiveProps(nextProps){
//     console.log(nextProps.login)
//     if(nextProps.login.success){
//       setCookie('phone',this.state.phone)
//       setCookie('userName',nextProps.login.userName)
//       setCookie('userId',nextProps.login.userId)
//       hashHistory.push('/');
//     }else{
//       this.setState({loading: false})
//       message.warning(nextProps.login.msg);
//       // console.log(nextProps.login.msg)
//     }
//   }

//   render() {
//     return (
//       <LoginForm handleSubmit={this.handleSubmit} loading={this.state.loading} company={this.state.company}/>
//     )
//   }
// }

// // const mapStateToProps  = (state) => ({
// //     // posts: state.posts   // 合并的reducer
// //     login: state.Login    // 单独的reducer
// // });

// // const mapDispatchToProps = (dispatch) => ({
// //     fetchLogin: () => dispatch({ type: LoginReducers })
// // });
// export default Login;
// // export default connect(mapStateToProps, mapDispatchToProps)(Login);
import React, { Component } from 'react';
import { HashRouter, Switch, Route, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {Form} from 'antd';
import axios from 'axios';
import { GET_POSTS_SAGA } from '../../constants/actionTypes';
import LoginForm from '../../components/Login/LoginForm';
import './base.scss';

const FormItem = Form.Item;
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <LoginForm />
    );
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
export default Login;
// export default connect(mapStateToProps, mapDispatchToProps)(Login);
