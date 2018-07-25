import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import styles from './login.scss';
import { connect } from 'react-redux';
import JoinInForm from '../../components/Login/JoinInForm';
import { LoginAction } from '../../constants/actionTypes/loginAction';

class JoinIn extends Component {
  static propTypes = {
    changeLoginPage: PropTypes.func,
    isJoined: PropTypes.number,
    isExist: PropTypes.number,
    enterpriseName: PropTypes.string,
    enterpriseId: PropTypes.string,
    getEnterpriseInfo: PropTypes.func,
    loading: PropTypes.bool,
    sendCode: PropTypes.func,
    checkPhoneCode: PropTypes.func,
    joinEnterprise: PropTypes.func,
    isPhoneRegister: PropTypes.string,
    checkPhoneRegister: PropTypes.func,
    phoneCodeRegister: PropTypes.func,
    username: PropTypes.string,
    joinResult: PropTypes.number,
    pageTab: PropTypes.string,
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
<div className={styles.goLogin}>
  <span  onClick={()=>this.changePage('login')}> 登录 </span>
  <span>I</span>
  <span  onClick={()=>this.changePage('register')}> 注册企业 </span>
</div>

        <JoinInForm 
          loading={this.props.loading}
          isExist={this.props.isExist}
          enterpriseName={this.props.enterpriseName}
          enterpriseId={this.props.enterpriseId}
          getEnterpriseInfo={this.props.getEnterpriseInfo}
          sendCode={this.props.sendCode}
          checkPhoneCode={this.props.checkPhoneCode}
          isJoined={this.props.isJoined}
          joinEnterprise={this.props.joinEnterprise}
          isPhoneRegister={this.props.isPhoneRegister}
          // checkPhoneRegister={this.props.checkPhoneRegister}
          phoneCodeRegister={this.props.phoneCodeRegister}
          username={this.props.username}
          joinResult={this.props.joinResult}
          pageTab={this.props.pageTab}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.login.get('loading'),
  isExist: state.login.get('isExist'),
  isJoined: state.login.get('isJoined'),
  enterpriseName: state.login.getIn(['enterpriseInfo','enterpriseName']),
  enterpriseId: state.login.getIn(['enterpriseInfo','enterpriseId']),
  isPhoneRegister: state.login.get('isPhoneRegister'),
  username: state.login.get('username'),
  joinResult: state.login.get('joinResult'),
})

const mapDispatchToProps = (dispatch) => ({
  getEnterpriseInfo: params => dispatch({type: LoginAction.GET_ENTERPRISE_INFO_SAGA, params}),
  sendCode: params => dispatch({ type: LoginAction.SEND_CODE_SAGA, params}),
  checkPhoneCode: params => dispatch({ type: LoginAction.CHECK_CODE_SAGA, params}),
  joinEnterprise: params => dispatch({ type: LoginAction.JOIN_ENTERPRISE_SAGA, params}),
  // checkPhoneRegister: params => dispatch({ type: LoginAction.CHECK_PHONE_REGISTER_SAGA, params}),
  phoneCodeRegister: params => dispatch({ type: LoginAction.PHONE_CODE_REGISTER_SAGA, params}),
})

export default connect(mapStateToProps,mapDispatchToProps)(JoinIn);
