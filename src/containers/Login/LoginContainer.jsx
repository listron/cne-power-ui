import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// import { GET_COMPINFO_SAGA,LOGIN_SAGA } from '../../constants/actionTypes/Login';
// import LoginForm from '../../components/Login/LoginForm';
import PropTypes from 'prop-types';

class Login extends Component {
  static propTypes = {
    fetchCompanyInfo: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        登录页面
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  // domain: state.login.get('domain'),
  // error: state.login.get('error'),
});

const mapDispatchToProps = (dispatch) => ({
  // fetchCompanyInfo: (parmas) => dispatch({type: GET_COMPINFO_SAGA, parmas: parmas}),
  // fetchLogin:(parmas) => dispatch({type: LOGIN_SAGA, parmas: parmas})
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
