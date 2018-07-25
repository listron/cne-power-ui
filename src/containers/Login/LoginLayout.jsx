import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './login.scss';
import { LoginAction } from '../../constants/actionTypes/loginAction';
import PropTypes from 'prop-types';
import Login from './Login';
import Register from './Register';
import JoinIn from './JoinIn';
import Forget from './Forget';

class LoginLayout extends Component {
  static propTypes = {
    pageTab: PropTypes.string,
    changeLoginPage: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }

  render() {
    const { pageTab, changeLoginPage } = this.props;
    return (
      <div className={styles.preLogin}>
        <div className={styles.preLoginImg}>
          <div className={styles.logo}>
            <div className={styles.pic}> <img src= {require('../../../assets/img/logo_power.png')} alt=""/></div>
            <h3>智慧能源运维平台</h3>
          </div>
          <img className={styles.bgPic}  src={require('../../../assets/img/bg_01.png')} />
          <span className={styles.comRegisterInfo}>京ICP备12030847号-2 © 2017-2018 北京动力协合科技有限公司</span>

        </div>
        <div className={styles.preLoginContent}>
          {pageTab==='login' && <Login changeLoginPage={changeLoginPage} pageTab={pageTab} />}
          {pageTab==='register' && <Register changeLoginPage={changeLoginPage} pageTab={pageTab} />}
          {pageTab==='joinIn' && <JoinIn changeLoginPage={changeLoginPage} />}
          {pageTab==='forget' && <Forget changeLoginPage={changeLoginPage} />}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  pageTab: state.login.get('pageTab'),

});

const mapDispatchToProps = (dispatch) => ({
  changeLoginPage: params => dispatch({ type: LoginAction.CHANGE_LOGIN_STORE_SAGA, params }),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginLayout);
