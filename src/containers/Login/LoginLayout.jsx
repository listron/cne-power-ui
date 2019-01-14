import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './loginLayout.scss';
import { loginAction } from './loginAction';
import PropTypes from 'prop-types';
import Login from './Login';
// import Register from './Register';
import JoinIn from './JoinIn';
import Forget from './Forget';
import ReactPlayer from 'react-player';

class LoginLayout extends Component {
  static propTypes = {
    pageTab: PropTypes.string,
    changeLoginStore: PropTypes.func,
    resetLoginState: PropTypes.func,
  }

  constructor(props) {
    super(props);
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

  render() {
    const { pageTab, changeLoginStore } = this.props;
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
        <div className={styles.right}>
          <div className={styles.rightContent}>
            <div className={styles.mainBox}>
              {pageTab === 'login' && <Login changeLoginStore={changeLoginStore} pageTab={pageTab} />}
              {/* {pageTab === 'register' && <Register changeLoginStore={changeLoginStore} pageTab={pageTab} />} */}
              {pageTab === 'joinIn' && <JoinIn changeLoginStore={changeLoginStore} />}
              {pageTab === 'forget' && <Forget changeLoginStore={changeLoginStore} />}
              <div className={styles.contactUs}>
                <Link to="/userAgreement" >用户协议</Link>
                <Link to="/contactUs" >联系我们</Link>
              </div>
              <div className={styles.footerTitle}>
              京ICP备12030847号-2 © 2017-2019 北京动力协合科技有限公司        
              </div>
              <div className={styles.versionTitle}>
              V3.4.0.20190111        
              </div>
            </div>

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
