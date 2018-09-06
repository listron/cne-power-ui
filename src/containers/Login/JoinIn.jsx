import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './loginLayout.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import JoinInForm from '../../components/Login/JoinInForm';
import { loginAction } from '../../constants/actionTypes/loginAction';

class JoinIn extends Component {
  static propTypes = {
    changeLoginStore: PropTypes.func,
    enterpriseName: PropTypes.string,
    enterpriseId: PropTypes.string,
    getEnterpriseInfo: PropTypes.func,
    loading: PropTypes.bool,
    sendCode: PropTypes.func,
    joinEnterprise: PropTypes.func,
    phoneCodeRegister: PropTypes.func,
    joinResult: PropTypes.number,
    pageTab: PropTypes.string,
    joinStep: PropTypes.number,
    enterpriseIdToken: PropTypes.string,
    phoneNum: PropTypes.string,
    error: PropTypes.object,
    history: PropTypes.object,
    importUser: PropTypes.bool,
    enterpriseLogo: PropTypes.string,
    userEnterpriseStatus: PropTypes.number,
    enterpriseInfo: PropTypes.object,
    resetPassword: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }
  changePage = (pageTab) =>{
    this.props.changeLoginStore({pageTab, registerStep: 1, joinStep: 1,enterpriseId: ''})
  }

  render() {
    return (
      <div className={styles.joinInContent} >
        <div className={styles.goLogin}>
          <span  onClick={()=>this.changePage('login')}> 登录 </span>
          <span>|</span>
          <span  onClick={()=>this.changePage('register')}> 注册 </span>
        </div>
        <JoinInForm  {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  enterpriseName: state.login.getIn(['enterpriseInfo','enterpriseName']),
  enterpriseLogo: state.login.getIn(['enterpriseInfo','enterpriseLogo']),
  enterpriseId: state.login.getIn(['enterpriseInfo','enterpriseId']),
  enterpriseIdToken: state.login.get('enterpriseId'),//命名enterpriseIdToken区别于info里获取的enterpriseId
  enterpriseInfo: state.login.get('enterpriseInfo'),
  joinResult: state.login.get('joinResult'),
  joinStep: state.login.get('joinStep'),
  phoneNum: state.login.get('phoneNum'),
  error: state.login.get('error'),
  importUser: state.login.get('importUser'),
  inviteValid: state.login.get('inviteValid'),
  userEnterpriseStatus: state.login.get('userEnterpriseStatus'),
  username: state.login.getIn(['loginData','username']),
  importEnterpriseName: state.login.getIn(['loginData','enterpriseName']),
  importEnterpriseLogo: state.login.getIn(['loginData','enterpriseLogo']),
  importEnterpriseId: state.login.getIn(['loginData','enterpriseId']),
  tmpAuthData: state.login.getIn(['loginData','access_token']),
})

const mapDispatchToProps = (dispatch) => ({
  getEnterpriseInfo: params => dispatch({type: loginAction.GET_ENTERPRISE_INFO_SAGA, params}),
  sendCode: params => dispatch({ type: loginAction.SEND_CODE_SAGA, params}),
  joinEnterprise: params => dispatch({ type: loginAction.JOIN_ENTERPRISE_SAGA, params}),
  phoneCodeRegister: params => dispatch({ type: loginAction.PHONE_CODE_REGISTER_SAGA, params}),
  resetPassword: params => dispatch({ type: loginAction.RESET_PASSWORD_SAGA, params }),
  
})

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(JoinIn));
