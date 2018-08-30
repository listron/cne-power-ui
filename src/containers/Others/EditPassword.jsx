import React, { Component } from 'react';
import styles from './editPassword.scss';
import EditPasswordForm from '../../components/Others/EditPasswordForm';
import { otherAction } from '../../constants/actionTypes/otherAction';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class EditPassword extends Component {

  static propTypes = {
    setTopMenu: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.editPassword}>
        <div className={styles.editTitle}>修改密码</div>
        <div className={styles.editContent}>
          <EditPasswordForm {...this.props} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.otherReducer.get('loading')
});

const mapDispatchToProps = (dispatch) => ({
  editPassword: payload => dispatch({ type: otherAction.EDIT_PASSWORD_SAGA, payload, }),
})

export default connect(mapStateToProps,mapDispatchToProps)(EditPassword);
