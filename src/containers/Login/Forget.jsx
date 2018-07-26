import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import styles from './login.scss';
import ForgetForm from '../../components/Login/ForgetForm';
import { LoginAction } from '../../constants/actionTypes/loginAction';
import { connect } from 'react-redux';
class Forget extends Component {
  static propTypes = {
    changeLoginStore: PropTypes.func,
    sendCode: PropTypes.func,
    showConfirmPassword: PropTypes.bool,
    checkPhoneCode: PropTypes.func,
    resetPassword: PropTypes.func,
    phoneNum: PropTypes.string,
    phoneCodeRegister: PropTypes.func,
    pageTab: PropTypes.string,
  }
  constructor(props) {
    super(props);
  }
  changePage = (pageTab) =>{
    this.props.changeLoginStore({pageTab, registerStep: 1, joinStep: 1})
  }

  render() {

    return (
      <div className={styles.forgetPassword}>
        <div className={styles.goLogin}>
          <span  onClick={()=>this.changePage('login')}> 登录 </span>
          <span>I</span>
          <span  onClick={()=>this.changePage('register')}> 注册企业 </span>
        </div>
        <ForgetForm
          sendCode={this.props.sendCode}
          showConfirmPassword={this.props.showConfirmPassword}
          checkPhoneCode={this.props.checkPhoneCode}
          resetPassword={this.props.resetPassword}
          phoneNum={this.props.phoneNum}
          phoneCodeRegister={this.props.phoneCodeRegister}
          pageTab={this.props.pageTab}
        />
        <div className={styles.contactUs}>
          <span>用户协议</span>
          <span>联系我们</span>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  showConfirmPassword: state.login.get('showConfirmPassword'),
  phoneNum: state.login.get('phoneNum'),
})

const mapDispatchToProps = (dispatch) => ({
  sendCode: params => dispatch({ type: LoginAction.SEND_CODE_SAGA, params}),
  checkPhoneCode: params => dispatch({ type: LoginAction.CHECK_CODE_SAGA, params}),
  resetPassword: params => dispatch({ type: LoginAction.RESET_PASSWORD_SAGA, params }),
  phoneCodeRegister: params => dispatch({ type: LoginAction.PHONE_CODE_REGISTER_SAGA, params}),
})

export default connect(mapStateToProps,mapDispatchToProps)(Forget);
