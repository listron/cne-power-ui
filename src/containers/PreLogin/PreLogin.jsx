import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './preLogin.scss';
import { CHANGE_PRELOGIN_PAGE_SAGA } from '../../constants/actionTypes/preLoginAction';
import PropTypes from 'prop-types';
import Login from './Login';
import Register from './Register';
import JoinIn from './JoinIn';
import Forget from './Forget';

class PreLoginContainer extends Component {
  static propTypes = {
    pageTab: PropTypes.string,
    changePreLoginPage: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }

  render() {
    const { pageTab, changePreLoginPage } = this.props;
    return (
      <div className={styles.preLogin}>
        <div className={styles.preLoginImg}>左侧图片区域
          <img width={'200px'} height={'200px'} src={'//www.baidu.com/img/bd_logo1.png?where=super'} />
        </div>
        <div className={styles.preLoginContent}>
          {pageTab==='login' && <Login changePreLoginPage={changePreLoginPage} pageTab={pageTab} />}
          {pageTab==='register' && <Register changePreLoginPage={changePreLoginPage} pageTab={pageTab} />}
          {pageTab==='joinIn' && <JoinIn changePreLoginPage={changePreLoginPage} />}
          {pageTab==='forget' && <Forget changePreLoginPage={changePreLoginPage} />}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  pageTab: state.preLogin.preLoginReducer.get('pageTab'),

});

const mapDispatchToProps = (dispatch) => ({
  changePreLoginPage: params => dispatch({ type: CHANGE_PRELOGIN_PAGE_SAGA, params }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PreLoginContainer);
