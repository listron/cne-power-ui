import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input } from 'antd';
import styles from './style.scss';
import Cookie from 'js-cookie';

const FormItem = Form.Item;

class EditPasswordForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
    editPassword: PropTypes.func,
    history: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
    };
  }

  savePassword = () => { // 保存
    const userId = Cookie.get('userId');
    const { form, editPassword, history } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(!err){
        editPassword({
          userId,
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          history,
        })
      }
    })
  }

  validateToNextPassword = (rule, value, callback) => { // 新密码
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  compareToFirstPassword = (rule, value, callback) => { // 确认新密码
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次密码输入不一致！');
    }else {
      callback();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;
    const formItemLayout = {
      labelCol:{
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    return (
      <div className={styles.editPasswordForm}>
        <div className={styles.account}>
              <Form>
                <FormItem {...formItemLayout} label="旧密码">
                  {getFieldDecorator('oldPassword',{
                    rules: [{
                      required: true, message: '请输入旧密码!',
                    }],
                  })(
                    <Input type="password" />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="新密码">
                  {getFieldDecorator('newPassword',{
                    rules: [{
                      required: true, message: '请输入新密码!',
                    },{
                      pattern: /^[A-Za-z0-9~!@#$%^&*()_+.]{6,25}$/,
                      message: '请输入字符长度为6-25的密码'
                    },{
                      validator: this.validateToNextPassword,
                    }]
                  })(
                    <Input type="password" />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="新密码确认">
                  {getFieldDecorator('confirm',{
                    rules: [{
                      required: true, message: '请确认密码!',
                    },{
                      validator: this.compareToFirstPassword,
                    }]
                  })(
                    <Input type="password" />
                  )}
                </FormItem>
                <Button onClick={this.savePassword} loading={loading} className={styles.savePassword} >保存</Button>
              </Form>
            </div>
      </div>
      )
    }
  }
  export default Form.create()(EditPasswordForm);