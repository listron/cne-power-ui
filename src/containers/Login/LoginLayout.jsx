import React, { Component } from 'react';
import { connect } from 'react-redux';
import  InfoModal from '../../components/Login/InfoModal';
import { Link } from 'react-router-dom';
import styles from './loginLayout.scss';
import { loginAction } from './loginAction';
import PropTypes from 'prop-types';
import Login from './Login';
// import Register from './Register';
import JoinIn from './JoinIn';
import Forget from './Forget';
import ReactPlayer from 'react-player';
import {apiUrlReal} from '../../config/apiConfig';

class LoginLayout extends Component {
  static propTypes = {
    pageTab: PropTypes.string,
    changeLoginStore: PropTypes.func,
    resetLoginState: PropTypes.func,
    appDownload:PropTypes.bool,
  }

  state = {
    modalName: 'agreement', // agreement  contact
    showModal: false,
    appDownload: false //是否显示app下载二维码
  }

  componentWillUnmount() {
    this.props.resetLoginState();
  }

  backToLogin = () => {
    this.props.changeLoginStore({
      pageTab: 'login',
    })
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

  toAppDownload = (e) => {
    e.stopPropagation();
    this.setState({
      appDownload:true
    })
  }

  toDisableAppDownload = (e) => {
    e.stopPropagation();
    this.setState({
      appDownload:false
    })
  }

  hideInfoModal = (modalName) => {
    this.setState({
      modalName: 'agreement',
      showModal: false
    })
  }

  render() {
    const { pageTab, changeLoginStore } = this.props;
    const { modalName, showModal,appDownload} = this.state;
    const defaultLogo = `${apiUrlReal}/api/v3/images/app_download.png`;
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
        <div className={styles.right} onClick={(e)=>this.toDisableAppDownload(e)}>
          <div className={styles.rightContent}>
            <div className={styles.mainBox} >
              {pageTab === 'login' && <Login changeLoginStore={changeLoginStore} pageTab={pageTab} />}
              {/* {pageTab === 'register' && <Register changeLoginStore={changeLoginStore} pageTab={pageTab} />} */}
              {pageTab === 'joinIn' && <JoinIn changeLoginStore={changeLoginStore} toShowAgreement={this.toShowAgreement} />}
              {pageTab === 'forget' && <Forget changeLoginStore={changeLoginStore}/>}
          
              {appDownload  && pageTab === 'login' && <div className={styles.apk}> 
                 <div className={styles.a}>
                 手机扫一扫    
                 </div>
                 <img className={styles.b} src={defaultLogo} width="64px" height="64px" />
                 <div className={styles.c}>
                 下载app安装包        
                 </div>
              </div>}
              {pageTab === 'login' ? <div className={styles.bottomInfoAppDownload}>
                <span className={styles.agreement} onClick={this.toShowAgreement}>用户协议</span>
                <span className={styles.contact} onClick={this.toContact}>联系我们</span>
                <span className={styles.appdownload} onClick={(e)=>this.toAppDownload(e)}>移动端下载</span>
              </div> : <div className={styles.bottomInfo}>
                <span className={styles.agreement} onClick={this.toShowAgreement}>用户协议</span>
                <span className={styles.contact} onClick={this.toContact}>联系我们</span>
              </div>}
              
              {/* <div className={styles.contactUs}>
                <Link to="/userAgreement" >用户协议</Link>
                <Link to="/contactUs" >联系我们</Link>
              </div> */}
              <div className={styles.footerTitle}>
              京ICP备12030847号-2 © 2017-2020 北京动力协合科技有限公司        
              </div>
              <div className={styles.versionTitle}>
              V3.4.0.20190111        
              </div>
            </div>
            {showModal && <InfoModal
              hideInfoModal={this.hideInfoModal}
              modalName={modalName}
            />}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  pageTab: state.login.get('pageTab'),

});

const mapDispatchToProps = (dispatch) => ({
  changeLoginStore: params => dispatch({ type: loginAction.CHANGE_LOGIN_STORE_SAGA, params }),
  resetLoginState: params => dispatch({ type: loginAction.RESET_LOGIN_STORE_SAGA, params }),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginLayout);