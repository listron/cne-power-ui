import React, { Component } from 'react';
import { Link,withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { GET_COMPINFO_SU_SAGA, SEND_CODE_SAGA, CHECK_CODE_SAGA, SIGNUP_SAGA } from '../../constants/actionTypes/Login';
import SignupForm1 from '../../components/Login/SignupForm1';
import SignupForm2 from '../../components/Login/SignupForm2';
import PropTypes from 'prop-types';

class Signup extends Component {
  static propTypes = {
    fetchcCompanyInfo: PropTypes.func,
    domain:PropTypes.object,
    phone: PropTypes.object,
    code: PropTypes.object,
    error: PropTypes.string,
    history:PropTypes.object,
    checkPhone:PropTypes.func,
    checkCode:PropTypes.func,
    getSignup:PropTypes.func,
    isFetching: PropTypes.bool,
    count: PropTypes.number,
    user:PropTypes.object
  }
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const linkCode = 'e7228d7fcc2d44a48981923e72bb27f2';
    this.props.fetchcCompanyInfo(linkCode);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.error && !this.props.error){
      this.props.history.push('/404');      
    }
  }
  
  render() {
    const name = this.props.domain.get('name');
    const logo = this.props.domain.get('logo');
    return (
      <div className="loginpagewrap">
        <img src={logo?logo:"/img/cnelogo.png"} alt="logo" />
        <a href="#" className="right">返回官网</a>
        <div className="box">
          <div className="title2">登录</div>
          <div className="avatar"><span className="icon-user"></span>{name&&name}</div>
          <div className="loginWrap">
            {!this.props.phone.get('correct')?<SignupForm1 
              checkPhone={this.props.checkPhone}
              checkCode={this.props.checkCode}
              phone={this.props.phone}
              isFetching={this.props.isFetching}
              code={this.props.code}
              error={this.props.error}
              count={this.props.count}
            />:null}
            {!this.props.phone.get('correct')?<Link  className="loginFormForgot" to="/login">已有账号，去登录</Link>:null }   
            {this.props.phone.get('correct')?<SignupForm2 
              error={this.props.error}
              isFetching={this.props.isFetching}
              phone={this.props.phone}
              code={this.props.code}
              user={this.props.user}
              getSignup={this.props.getSignup}
            />:null}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  domain: state.login.get('domain'),
  user: state.login.get('user'),
  isFetching: state.login.get('isFetching'),
  error:state.login.get('error'),
  phone: state.login.get('phone'),
  code: state.login.get('code'),
  count: state.login.get('count')
});

const mapDispatchToProps = (dispatch) => ({
  fetchcCompanyInfo: parmas => dispatch({ type: GET_COMPINFO_SU_SAGA,parmas }),
  checkPhone: parmas => dispatch({ type: SEND_CODE_SAGA,parmas }),
  checkCode: parmas => dispatch({type: CHECK_CODE_SAGA,parmas}),
  getSignup: parmas => dispatch({ type: SIGNUP_SAGA,parmas }),
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signup))
