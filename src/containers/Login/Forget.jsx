import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './loginLayout.scss';
import ForgetForm from '../../components/Login/ForgetForm';
import { loginAction } from './loginAction';
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
          {/* <span>|</span>
          <span  onClick={()=>this.changePage('register')}> 注册 </span> */}
        </div>
        <ForgetForm {...this.props} />
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
  tmpAuthData: state.login.getIn(['loginData','access_token']),
})

const mapDispatchToProps = (dispatch) => ({
  sendCode: params => dispatch({ type: loginAction.SEND_CODE_SAGA, params}),
  resetPassword: params => dispatch({ type: loginAction.RESET_PASSWORD_SAGA, params }),
  checkCodeLogin: params => dispatch({ type: loginAction.PHONE_CODE_LOGIN_SAGA, params}),
  phoneCodeRegister: params => dispatch({ type: loginAction.PHONE_CODE_REGISTER_SAGA, params}),
})

export default connect(mapStateToProps,mapDispatchToProps)(Forget);
