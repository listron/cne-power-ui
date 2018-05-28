import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import ForgetForm1 from '../../components/Login/ForgetForm1';
import ForgetForm2 from '../../components/Login/ForgetForm2'
import PropTypes from 'prop-types';

class Forget extends Component {
  static propTypes = {
    domain:PropTypes.object,
  }
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
        <img src={logo?logo:"/img/cnelogo.png"} alt="logo" />
        <a href="#" className="right">返回官网</a>
        <div className="box">
          <div className="title2">重置密码</div>
          <div className="avatar"><span className="icon-user"></span>{name&&name}</div>
          <div className="loginWrap">
            <ForgetForm1  visible={this.state.form1} nextForm={this.nextForm} />
            <Link className="loginFormForgot" to="/login" style={{display:this.state.form1}}>去登录</Link>
            <ForgetForm2 visible={this.state.form2} />
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
