import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { message } from 'antd';
import { GET_COMPINFO_SAGA,LOGIN_SAGA } from '../../constants/actionTypes/Login';
import LoginForm from '../../components/Login/LoginForm';
import styles from './style.scss';
import PropTypes from 'prop-types';

class Login extends Component {
  static propTypes = {
    fetchCompanyInfo: PropTypes.func,
    error: PropTypes.string,
    fetchLogin:PropTypes.func,
    domain: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
    };
  }

  componentWillMount() {
    // const domain = document.domain.split('.')[0];    
    const domian = 'test';
    this.props.fetchCompanyInfo(domian);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.error&&!this.props.error){
      message.error(nextProps.error);
    }
  }

  render() {
    let name=this.props.domain.get('name');
    let logo=this.props.domain.get('logo');
    return (
      <div className="loginpagewrap">
        <img src={logo?logo:"/img/cnelogo.png"} alt="logo" />
        <a href="#" className="right">返回官网</a>
        <div className="box">
          <div className="title">登录</div>
          <div className="triangle"></div>
          <div className="avatar"><span className="icon-user"></span><p>{name&&name}</p></div>
          <div className="loginWrap">
            <LoginForm fetchLogin={this.props.fetchLogin} company={name} />
            <Link className="loginFormForgot" to="/forget">忘记密码</Link>      
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  domain: state.login.get('domain'),
  error: state.login.get('error'),
});

const mapDispatchToProps = (dispatch) => ({
  fetchCompanyInfo: (parmas) => dispatch({type: GET_COMPINFO_SAGA, parmas: parmas}),
  fetchLogin:(parmas) => dispatch({type: LOGIN_SAGA, parmas: parmas})
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
