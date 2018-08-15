import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './loginLayout.scss';
import ForgetForm from '../../components/Login/ForgetForm';
import { loginAction } from '../../constants/actionTypes/loginAction';
import { connect } from 'react-redux';
class Forget extends Component {
  static propTypes = {
    changeLoginStore: PropTypes.func,
    sendCode: PropTypes.func,
    showResetPassword: PropTypes.number,
    resetPassword: PropTypes.func,
    phoneNum: PropTypes.string,
    phoneCodeRegister: PropTypes.func,
    pageTab: PropTypes.string,
    enterpriseId: PropTypes.string,
    username: PropTypes.string,
    checkCodeLogin: PropTypes.func,
    error: PropTypes.object,
  }
  constructor(props) {
    super(props);
  }
  changePage = (pageTab) =>{
    this.props.changeLoginStore({pageTab, registerStep: 1, joinStep: 1,enterpriseId: ''})
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
          showResetPassword={this.props.showResetPassword}
          resetPassword={this.props.resetPassword}
          phoneNum={this.props.phoneNum}
          phoneCodeRegister={this.props.phoneCodeRegister}
          pageTab={this.props.pageTab}
          enterpriseId={this.props.enterpriseId}
          username={this.props.username}
          checkCodeLogin={this.props.checkCodeLogin}
          error={this.props.error}
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
  showResetPassword: state.login.get('showResetPassword'),
  phoneNum: state.login.get('phoneNum'),
  enterpriseId: state.login.get('enterpriseId'),
  username: state.login.get('username'),
  error: state.login.get('error'),
})

const mapDispatchToProps = (dispatch) => ({
  sendCode: params => dispatch({ type: loginAction.SEND_CODE_SAGA, params}),
  resetPassword: params => dispatch({ type: loginAction.RESET_PASSWORD_SAGA, params }),
  checkCodeLogin: params => dispatch({ type: loginAction.CHECK_CODE_SAGA, params}),
  phoneCodeRegister: params => dispatch({ type: loginAction.PHONE_CODE_REGISTER_SAGA, params}),
})

export default connect(mapStateToProps,mapDispatchToProps)(Forget);
