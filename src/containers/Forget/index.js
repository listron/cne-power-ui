import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { CHECK_CODE_SAGA ,SEND_CODE_SAGA} from '../../constants/actionTypes/Login';
import ForgetForm1 from '../../components/Login/ForgetForm1';
import ForgetForm2 from '../../components/Login/ForgetForm2'
import PropTypes from 'prop-types';
import {message} from 'antd';

class Forget extends Component {
  static propTypes = {
    domain: PropTypes.object,
    user: PropTypes.object,
    phone: PropTypes.object,
    code: PropTypes.object,
    error: PropTypes.string,
    isFetching: PropTypes.bool,
    sendCode: PropTypes.func,
    checkCode: PropTypes.func,
  }
  constructor(props, context) {
    super(props)
  }

  render() {
    let name = this.props.domain.get('name');
    let logo = this.props.domain.get('logo');
    return (
      <div className="loginpagewrap">
        <img src={logo?logo:"/img/cnelogo.png"} alt="logo" />
        <a href="#" className="right">返回官网</a>
        <div className="box">
          <div className="title2">重置密码</div>
          <div className="avatar"><span className="icon-user"></span>{name&&name}</div>
          <div className="loginWrap">
            {!this.props.phone.get('correct')?
              <ForgetForm1 
                error={this.props.error} 
                phone={this.props.phone} 
                code={this.props.code}
                sendCode={this.props.sendCode}
                checkCode={this.props.checkCode} />
              :null
            }
            {!this.props.phone.get('correct')?<Link className="loginFormForgot" to="/login">去登录</Link>:null}
            {this.props.phone.get('correct')?<ForgetForm2 />:null}
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
  code: state.login.get('code')
});

const mapDispatchToProps = (dispatch) => ({
  checkCode: (parmas) => dispatch({ type: CHECK_CODE_SAGA,parmas:parmas }),
  sendCode: (parmas) => dispatch({type: SEND_CODE_SAGA,parmas:parmas})
});
export default connect(mapStateToProps, mapDispatchToProps)(Forget)
