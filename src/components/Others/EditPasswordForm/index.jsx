import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
// import styles from './loginLayout.scss';
// import ForgetForm from '../../components/Login/ForgetForm';
import { otherAction } from '../../../constants/actionTypes/otherAction';
import { connect } from 'react-redux';

class EditPassword extends Component {
  static propTypes = {
    editPassword: PropTypes.func,
  }
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Button onClick={this.props.editPassword}></Button>
        <span>更改密码页面</span>
        <span>更改密码页面</span>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  editPassword: params => dispatch({ type: otherAction.EDIT_PASSWORD_SAGA, params}),
})

export default connect(mapStateToProps,mapDispatchToProps)(EditPassword);
