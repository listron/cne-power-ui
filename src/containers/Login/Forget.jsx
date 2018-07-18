import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import ForgetForm from '../../components/Login/ForgetForm';
import { LoginAction } from '../../constants/actionTypes/loginAction';
import { connect } from 'react-redux';
class ForgetContainer extends Component {
  static propTypes = {
    changeLoginPage: PropTypes.func,
    sendCode: PropTypes.func,
    phoneCheck: PropTypes.number,
    checkPhoneCode: PropTypes.func,
    resetPassword: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }
  changePage = (pageTab) =>{
    this.props.changeLoginPage({pageTab})
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
  phoneCheck: state.login.get('phoneCheck'),
})

const mapDispatchToProps = (dispatch) => ({
  sendCode: params => dispatch({ type: LoginAction.SEND_CODE_SAGA, params}),
  checkPhoneCode: params => dispatch({ type: LoginAction.CHECK_CODE_SAGA, params}),
  resetPassword: params => dispatch({ type: LoginAction.RESET_PASSWORD_SAGA, params }),
})

export default connect(mapStateToProps,mapDispatchToProps)(ForgetContainer);
