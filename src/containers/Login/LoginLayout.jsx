import React, {Component} from 'react';
import {connect} from 'react-redux';
import styles from './loginLayout.scss';
import {loginAction} from '../../constants/actionTypes/loginAction';
import PropTypes from 'prop-types';
import Login from './Login';
import Register from './Register';
import JoinIn from './JoinIn';
import Forget from './Forget';

class LoginLayout extends Component {
  static propTypes = {
    pageTab: PropTypes.string,
    changeLoginStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
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
          <div className={styles.containerLogin}>
            <div className={styles.loginContent}>
              {pageTab === 'login' && <Login changeLoginStore={changeLoginStore} pageTab={pageTab} />}
              {pageTab === 'register' && <Register changeLoginStore={changeLoginStore} pageTab={pageTab} />}
              {pageTab === 'joinIn' && <JoinIn changeLoginStore={changeLoginStore} />}
              {pageTab === 'forget' && <Forget changeLoginStore={changeLoginStore} />}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginLayout);
