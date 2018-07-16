import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { connect } from 'react-redux';
import JoinInForm from '../../components/PreLogin/JoinInForm';
import { PreLoginAction } from '../../constants/actionTypes/preLoginAction';

class JoinInContainer extends Component {
  static propTypes = {
    changePreLoginPage: PropTypes.func,
    isJoined: PropTypes.number,
    isExist: PropTypes.number,
    enterpriseName: PropTypes.string,
    getEnterpriseInfo: PropTypes.func,
    loading: PropTypes.bool,
    sendCode: PropTypes.func,
    checkPhoneCode: PropTypes.func,
    joinEnterprise: PropTypes.func,
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
        加入企业页面！！！！
        <Button type={'primary'} onClick={()=>this.changePage('login')}> 登录页面 </Button>
        <Button type={'primary'} onClick={()=>this.changePage('register')}> 注册企业 </Button>
        <JoinInForm 
          loading={this.props.loading}
          // joinInStep={this.props.joinInStep}
          isExist={this.props.isExist}
          enterpriseName={this.props.enterpriseName}
          getEnterpriseInfo={this.props.getEnterpriseInfo}
          sendCode={this.props.sendCode}
          checkPhoneCode={this.props.checkPhoneCode}
          isJoined={this.props.isJoined}
          joinEnterprise={this.props.joinEnterprise}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.preLogin.joinInReducer.get('loading'),
  // joinInStep: state.preLogin.joinInReducer.get('joinInStep'),
  isExist: state.preLogin.joinInReducer.get('isExist'),
  isJoined: state.preLogin.joinInReducer.get('isJoined'),
  enterpriseName: state.preLogin.joinInReducer.getIn(['enterpriseInfo','enterpriseName']),
})

const mapDispatchToProps = (dispatch) => ({
  getEnterpriseInfo: params => dispatch({type: PreLoginAction.GET_ENTERPRISE_INFO_SAGA, params}),
  sendCode: params => dispatch({ type: PreLoginAction.SEND_CODE_SAGA, params}),
  checkPhoneCode: params => dispatch({ type: PreLoginAction.CHECK_CODE_SAGA, params}),
  joinEnterprise: params => dispatch({ type: PreLoginAction.JOIN_ENTERPRISE_SAGA, params})
})

export default connect(mapStateToProps,mapDispatchToProps)(JoinInContainer);
