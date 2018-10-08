import React, { Component } from 'react';
import styles from './editPassword.scss';
import EditPasswordForm from '../../components/Others/EditPasswordForm';
import { otherAction } from '../alphaRedux/otherAction';
import { connect } from 'react-redux';

class EditPassword extends Component {
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
  editPassword: payload => dispatch({ type: otherAction.editPassword, payload, }),
})

export default connect(mapStateToProps,mapDispatchToProps)(EditPassword);
