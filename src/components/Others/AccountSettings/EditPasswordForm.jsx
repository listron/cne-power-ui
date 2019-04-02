import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Row, Col } from 'antd';
import styles from './account.scss';
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
      if (!err) {
        editPassword({
          userId,
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          history,
        })
      }
    })
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
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    }
    return (
      <div className={styles.editPasswordForm}>
        <div className={styles.account}>
          <Form {...formItemLayout}>
            <FormItem label="旧密码">
              {getFieldDecorator('oldPassword', {
                rules: [{
                  required: true, message: '请输入旧密码!',
                }],
              })(
                <Input type="password" addonBefore={<i className="iconfont icon-password"></i>} />
              )}
              <span className={styles.instructionText}>请输入旧密码</span>
            </FormItem>
            <FormItem label="新密码">
              {getFieldDecorator('newPassword', {
                rules: [{
                  required: true, message: '请输入新密码!',
                }, {
                  pattern: /^[A-Za-z0-9]{6,8}$/,
                  message: '请输入字符长度为6-8的密码'
                }, {
                  validator: this.validateToNextPassword,
                }]
              })(
                <Input type="password" addonBefore={<i className="iconfont icon-password"></i>} />
              )}
              <span className={styles.instructionText}>6-8位数字或英文</span>
            </FormItem>
            <FormItem label="新密码确认">
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: '请确认密码!',
                }, {
                  validator: this.compareToFirstPassword,
                }]
              })(
                <Input type="password" addonBefore={<i className="iconfont icon-password"></i>} onBlur={this.handleConfirmBlur} />
              )}
              <span className={styles.instructionText}>6-8位数字或英文</span>
            </FormItem>
            <Row type={'flex'} className={styles.saveButton}>
              <Col span={8} offset={8}> <Button onClick={this.savePassword} loading={loading} className={styles.savePassword} >保存</Button></Col>
            </Row>
            <div>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}
export default Form.create()(EditPasswordForm);