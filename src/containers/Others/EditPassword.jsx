import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import styles from './loginLayout.scss';
// import ForgetForm from '../../components/Login/ForgetForm';
import EditPasswordForm from '../../components/Others/EditPasswordForm';
import { loginAction } from '../../constants/actionTypes/loginAction';
import { connect } from 'react-redux';
import Cookie from 'js-cookie';

class EditPassword extends Component {
  static propTypes = {
    editPassword: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const userName = Cookie.get('username');
    return (
      <div>
        <EditPasswordForm />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = (dispatch) => ({
  editPassword: params => dispatch({ type: loginAction.SEND_CODE_SAGA, params}),
})

export default connect(mapStateToProps,mapDispatchToProps)(EditPassword);
