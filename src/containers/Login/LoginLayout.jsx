import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './loginLayout.scss';
import { loginAction } from '../../constants/actionTypes/loginAction';
import PropTypes from 'prop-types';
import Login from './Login';
import Register from './Register';
import JoinIn from './JoinIn';
import Forget from './Forget';
import Contact from '../../components/Login/Contact';
import Agreement from '../../components/Login/Agreement';

class LoginLayout extends Component {
  static propTypes = {
    pageTab: PropTypes.string,
    changeLoginStore: PropTypes.func,
    resetLoginState: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  componentWillUnmount(){
    this.props.resetLoginState();
  }

  backToLogin = () => {
    this.props.changeLoginStore({
      pageTab: 'login',
    })
  }

  render() {
    const {pageTab, changeLoginStore} = this.props;
    return (

      <div className={styles.loginLayout}>
        <div className={styles.left}>
          <div className={styles.logoImg}>
            <div className={styles.loginImg}>
              <div className={styles.logo}>
                <div className={styles.pic}><img src={require('../../../assets/img/logo_power.png')} alt="" /></div>
                <h3>智慧能源运维平台</h3>
              </div>
              <img className={styles.bgPic} src={require('../../../assets/img/bg_01.png')} />
              <span className={styles.comRegisterInfo}>京ICP备12030847号-2 © 2017-2018 北京动力协合科技有限公司</span>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.rightContent}>
            <div className={styles.mainBox}>
              {pageTab === 'login' && <Login changeLoginStore={changeLoginStore} pageTab={pageTab} />}
              {pageTab === 'register' && <Register changeLoginStore={changeLoginStore} pageTab={pageTab} />}
              {pageTab === 'joinIn' && <JoinIn changeLoginStore={changeLoginStore} />}
              {pageTab === 'forget' && <Forget changeLoginStore={changeLoginStore} />}
              {pageTab === 'contact' && <Contact backToLogin={this.backToLogin} />}
              {pageTab === 'agreement' && <Agreement backToLogin={this.backToLogin} />}
            </div>
            {(pageTab === 'contact' || pageTab === 'agreement') || 
              <div className={styles.contactUs}>
                <Link to="/userAgreement" target="_blank">用户协议</Link>
                <Link to="/contactUs" target="_blank">联系我们</Link>
              </div>
            }
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
