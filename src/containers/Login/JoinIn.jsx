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
    isInvite: PropTypes.number,
  }
  constructor(props) {
    super(props);
  }
  changePage = (pageTab) =>{
    this.props.changeLoginStore({pageTab, registerStep: 1, joinStep: 1,enterpriseId: ''})
  }

  render() {
    return (
      <div>
        <div className={styles.goLogin}>
          <span  onClick={()=>this.changePage( 'login')}> 登录 </span>
          <span>I</span>
          <span  onClick={()=>this.changePage('register')}> 注册企业 </span>
        </div>
        <JoinInForm 
          enterpriseName={this.props.enterpriseName}
          enterpriseId={this.props.enterpriseId}
          getEnterpriseInfo={this.props.getEnterpriseInfo}
          sendCode={this.props.sendCode}
          joinEnterprise={this.props.joinEnterprise}
          phoneCodeRegister={this.props.phoneCodeRegister}
          pageTab={this.props.pageTab}
          joinStep={this.props.joinStep}
          changeLoginStore={this.props.changeLoginStore}
          enterpriseIdToken={this.props.enterpriseIdToken}
          phoneNum={this.props.phoneNum}
          error={this.props.error}
          history={this.props.history}
          isInvite={this.props.isInvite}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  enterpriseName: state.login.getIn(['enterpriseInfo','enterpriseName']),
  enterpriseId: state.login.getIn(['enterpriseInfo','enterpriseId']),
  enterpriseIdToken: state.login.get('enterpriseId'),//命名enterpriseIdToken区别于info里获取的enterpriseId
  joinResult: state.login.get('joinResult'),
  joinStep: state.login.get('joinStep'),
  phoneNum: state.login.get('phoneNum'),
  error: state.login.get('error'),
  isInvite: state.login.get('isInvite'),
})

const mapDispatchToProps = (dispatch) => ({
  getEnterpriseInfo: params => dispatch({type: loginAction.GET_ENTERPRISE_INFO_SAGA, params}),
  sendCode: params => dispatch({ type: loginAction.SEND_CODE_SAGA, params}),
  joinEnterprise: params => dispatch({ type: loginAction.JOIN_ENTERPRISE_SAGA, params}),
  phoneCodeRegister: params => dispatch({ type: loginAction.PHONE_CODE_REGISTER_SAGA, params}),
})

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(JoinIn));
