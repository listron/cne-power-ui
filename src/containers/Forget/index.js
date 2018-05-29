import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import ForgetForm1 from '../../components/Login/ForgetForm1';
import ForgetForm2 from '../../components/Login/ForgetForm2'
import PropTypes from 'prop-types';

class Forget extends Component {
  static propTypes = {
    domain: PropTypes.object,
  }
  constructor(props, context) {
    super(props)
    this.state = {
      showForm1: true
    }
    this.onNext = this.onNext.bind(this);
  }

  onNext() {
    this.setState({
      showForm1: false
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
            {this.state.showForm1?<ForgetForm1 onNext={this.onNext} />:null}
            <Link className="loginFormForgot" to="/login" style={{display:this.state.form1}}>去登录</Link>
            {!this.state.showForm1?<ForgetForm2 />:null}
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
