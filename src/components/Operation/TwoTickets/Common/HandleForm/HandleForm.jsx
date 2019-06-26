import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './handleForm.scss';
import ReviewForm from './ReviewForm';
import ProcessForm from './ProcessForm';
import CheckForm from './CheckForm';
import { Form, } from "antd";

class HandleForm extends Component {
  static propTypes = {
    getDocketHandle: PropTypes.func,
    operStatus: PropTypes.number,
    operTitle: PropTypes.string,
    taskId: PropTypes.number,
  }

  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    const { taskId } = this.props;
    this.props.getDocketHandle({ taskId, ...value })
  }

  render() {
    const { operStatus,operTitle } = this.props;
    return (
      <div className={styles.handleForm}>
        <div className={styles.title}>
          <div className={styles.border}></div>
          <div className={styles.text}>{operTitle}</div>
          <div className={styles.border}></div>
        </div>
        {operStatus === 1 && <ReviewForm onChange={this.onChange} />}
        {operStatus === 2 && <ProcessForm {...this.props} onChange={this.onChange} />}
        {operStatus === 3 && <CheckForm {...this.props} onChange={this.onChange} />}
      </div>
    );
  }
}
export default HandleForm;
