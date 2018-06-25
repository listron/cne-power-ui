import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button } from 'antd';
import styles from './newDefect.scss';
const FormItem = Form.Item;

class TmpForm extends Component {
  static propTypes = {
    form: PropTypes.func,
  };
  // componentDidMount() {
  //   this.props.form.validateFields();
  // }
  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   this.props.form.validateFields((err, values) => {
  //     if (!err) {
  //       console.log('Received values of form: ', values);
  //     }
  //   });
  // }
  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem
          validateStatus={userNameError ? 'error' : ''}
          help={userNameError || ''}
        >
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem
          validateStatus={passwordError ? 'error' : ''}
          help={passwordError || ''}
        >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
      </Form>
    );
  }
}

const DefectCreateForm = Form.create()(TmpForm);

export default DefectCreateForm;