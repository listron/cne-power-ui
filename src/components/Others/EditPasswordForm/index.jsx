import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';
import Cookie from 'js-cookie';
import styles from './style.scss';
const FormItem = Form.Item;

class EditPasswordForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    history: PropTypes.object,
    loading: PropTypes.bool,
    editPassword: PropTypes.func,
    userName: PropTypes.string,
  }
  
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
    };
  }

  saveNewPassword = () => {
    const userId = Cookie.get('userId');
    const { form, editPassword, history } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        editPassword({
          userId,
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          history,
        })
      }
    });
  }
  
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次密码输入不一致！');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;
    const username = Cookie.get('username');
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Form className={styles.editPasswordForm}>
        <FormItem {...formItemLayout} label="用户名" >
          <span>{username}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="旧密码" >
          {getFieldDecorator('oldPassword', {
            rules: [{
              required: true, message: '请输入旧密码',
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="新密码" >
          {getFieldDecorator('newPassword', {
            rules: [{
              required: true, message: '请输入新密码',
            },{
              pattern: /^[a-zA-Z\d]{6,8}$/, message: '请输入6-8位数字或英文的密码' 
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="新密码确认" >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <div className={styles.saveButton}>
          <Button onClick={this.saveNewPassword} loading={loading}>保存</Button>
        </div>
      </Form>
    );
  }
}

export default Form.create()(EditPasswordForm);

  
