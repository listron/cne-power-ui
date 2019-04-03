import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './loginLayout.scss';
import { loginAction } from './loginReducer';
import PropTypes from 'prop-types';
import Login from './LoginComponents/Login';
// import Register from './Register';
import JoinIn from './LoginComponents/JoinIn';
import Forget from './LoginComponents/Forget';
import InfoModal from './LoginComponents/InfoModal';
import ReactPlayer from 'react-player';

class LoginContainer extends Component {
  static propTypes = {
    pageTab: PropTypes.string, // 四页面关键字：login登录, register注册, joinIn加入企业, forget忘记密码,
    history: PropTypes.object,
    inviteUserLink: PropTypes.func,
    resetLoginState: PropTypes.func,
  }

  state = {
    modalName: 'agreement', // agreement  contact
    showModal: false
  }

  componentDidMount(){ // 被邀请的用户直接进入企业
    const { history } = this.props;
    const { search = '' } = history.location;
    if (search && search.split('=')[1]) {
      this.props.inviteUserLink({ // 获取邀请id直接进行加入企业
        linkId: search.split('=')[1]
      });
    }
  }

  componentWillUnmount() {
    this.props.resetLoginState();
  }

  playerVideoError = () => { // 媒体错误
    const videoPlayer = document.querySelector('#videoPlayer');
    videoPlayer.style.backgroundImage = 'url(/img/bigbg.png)';
    videoPlayer.style.backgroundPosition = 'center center';
    videoPlayer.style.backgroundSize = '100% 100%';
    videoPlayer.style.width = '100%';
    videoPlayer.style.height = '100%';
  }

  toShowAgreement = () => {
    this.setState({
      modalName: 'agreement',
      showModal: true
    })
  }

  toContact = () => {
    this.setState({
      modalName: 'contact',
      showModal: true
    })
  }

  hideInfoModal = (modalName) => {
    this.setState({
      modalName: 'agreement',
      showModal: false
    })
  }

  render() {
    const { pageTab } = this.props; // login登录, register注册, joinIn加入企业, forget忘记密码,
    const { modalName, showModal } = this.state;
    return (
      <div className={styles.loginLayout}>
        <ReactPlayer
          url="/video/01-1000.mp4" 
          id="videoPlayer"
          muted 
          autoPlay 
          loop
          playing={true} 
          className={styles.backgroundVideo}
          onError={this.playerVideoError}
          width="auto"
          height="auto" 
        />
        <div className={styles.center}>
          {pageTab === 'login' && <Login {...this.props} />}
          {/* {pageTab === 'register' && <Register changeLoginStore={changeLoginStore} pageTab={pageTab} />} */}
          {pageTab === 'joinIn' && <JoinIn {...this.props} />}
          {pageTab === 'forget' && <Forget {...this.props} />}
          <div className={styles.bottomInfo}>
            <span className={styles.agreement} onClick={this.toShowAgreement}>用户协议</span>
            <span className={styles.contact} onClick={this.toContact}>联系我们</span>
          </div>
          <div className={styles.footerTitle}>
            <p>京ICP备12030847号-2 © 2017-2019 北京动力协合科技有限公司</p>
            <p>V3.4.0.20190111</p>
          </div>
          {showModal && <InfoModal
            hideInfoModal={this.hideInfoModal}
            modalName={modalName}
          />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.login.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeLoginStore: payload => dispatch({ type: loginAction.CHANGE_LOGIN_STORE, payload }),
  resetLoginState: () => dispatch({ type: loginAction.LOGIN_STORE_RESET }),

  userNameLogin: payload => dispatch({ type: loginAction.userNameLogin, payload }), //  用户名+密码登录
  getVerificationCode: payload => dispatch({ type: loginAction.getVerificationCode, payload }), // 获取短信验证码
  phoneCodeLogin: payload => dispatch({ type: loginAction.phoneCodeLogin, payload }), // 手机号+密码登录
  phoneCodeRegister: payload => dispatch({ type: loginAction.phoneCodeRegister, payload }), // 检查手机号+验证码是否正确
  // checkEnterpriseDomain: payload => dispatch({ type: loginAction.checkEnterpriseDomain, payload }), // 检查域名是否有效
  // checkEnterpriseName: payload => dispatch({ type: loginAction.checkEnterpriseName, payload }), // 检查企业名是否已注册
  // registerEnterprise: payload => dispatch({ type: loginAction.registerEnterprise, payload }), // 注册企业 完善个人信息
  getEnterpriseInfo: payload => dispatch({ type: loginAction.getEnterpriseInfo, payload }), // 获取企业信息
  joinEnterprise: payload => dispatch({ type: loginAction.joinEnterprise, payload }), // 加入企业
  resetPassword: payload => dispatch({ type: loginAction.resetPassword, payload }), // 设置新密码
  inviteUserLink: payload => dispatch({ type: loginAction.inviteUserLink, payload }), // 邀请用户加入企业(获取邀请企业信息)
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
