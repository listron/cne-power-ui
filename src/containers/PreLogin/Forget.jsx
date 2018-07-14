import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import ForgetForm from '../../components/PreLogin/ForgetForm';
import { PreLoginAction } from '../../constants/actionTypes/preLoginAction';
import { connect } from 'react-redux';
class ForgetContainer extends Component {
  static propTypes = {
    changePreLoginPage: PropTypes.func,
    sendCode: PropTypes.func,
    phoneCheck: PropTypes.number,
    checkPhoneCode: PropTypes.func,
    resetPassword: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }
  changePage = (pageTab) =>{
    this.props.changePreLoginPage({pageTab})
  }

  render() {

    return (
      <div>
        忘记密码页面！
        <Button type={'primary'} onClick={()=>this.changePage('login')}> 登录页面 </Button>
        <Button type={'primary'} onClick={()=>this.changePage('register')}> 注册企业 </Button>
        <ForgetForm
          sendCode={this.props.sendCode}
          phoneCheck={this.props.phoneCheck}
          checkPhoneCode={this.props.checkPhoneCode}
          resetPassword={this.props.resetPassword}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  phoneCheck: state.preLogin.loginReducer.get('phoneCheck'),
})

const mapDispatchToProps = (dispatch) => ({
  sendCode: params => dispatch({ type: PreLoginAction.SEND_CODE_SAGA, params}),
  checkPhoneCode: params => dispatch({ type: PreLoginAction.CHECK_CODE_SAGA, params}),
  resetPassword: params => dispatch({ type: PreLoginAction.RESET_PASSWORD_SAGA, params }),
})

export default connect(mapStateToProps,mapDispatchToProps)(ForgetContainer);
