import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {hashHistory,Link} from 'react-router';
import {Form,Input,Button,notification,Icon,Avatar,Row,Col} from 'antd';
import {fetchRegister} from 'actions/common';
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
      phone:phone,
    })
  }

  componentDidMount() {
    // this.props.dispatch(fetchForget({ currentPage: 1 }))
  }



  render() {
    return (
      <div className="loginpagewrap">
            <img src="../images/logo.png" alt="logo"/>
            <a href="#" className="right">返回官网</a>
        <div className="box">
            <div className="title2">重置密码</div>
            <div className="avatar"><span className="icon-user"></span><p>京东方</p></div>
            <div className="loginWrap">
                <ForgetForm1 visible={this.state.form1} dispatch={this.props.dispatch} nextForm={this.nextForm}/>
                <ForgetForm2 visible={this.state.form2} dispatch={this.props.dispatch} phone={this.state.phone}/>
            </div>
        </div>
    </div>
    )
  }
}
const mapStateToProps = (state) => ({
  loginResponse: state.loginResponse  
});

const mapDispatchToProps = (dispatch) => ({
  // fetchPosts: () => dispatch({ type: GET_POSTS_SAGA })
});
export default connect(mapStateToProps, mapDispatchToProps)(Forget)
