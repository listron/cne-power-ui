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
        <div className={styles.preLoginImg}>左侧图片区域
          <img width={'200px'} height={'200px'} src={'//www.baidu.com/img/bd_logo1.png?where=super'} />
        </div>
        <div className={styles.preLoginContent}>
          {pageTab==='login' && <Login changeLoginPage={changeLoginPage} pageTab={pageTab} />}
          {pageTab==='register' && <Register changeLoginPage={changeLoginPage} pageTab={pageTab} />}
          {pageTab==='joinIn' && <JoinIn changeLoginPage={changeLoginPage} pageTab={pageTab} />}
          {pageTab==='forget' && <Forget changeLoginPage={changeLoginPage} pageTab={pageTab} />}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  pageTab: state.login.get('pageTab'),

});

const mapDispatchToProps = (dispatch) => ({
  changeLoginPage: params => dispatch({ type: LoginAction.CHANGE_LOGIN_PAGE_SAGA, params }),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginLayout);
