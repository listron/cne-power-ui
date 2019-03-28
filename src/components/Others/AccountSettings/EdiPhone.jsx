import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input } from 'antd';
import styles from './style.scss';

const FormItem = Form.Item;

class EdiPhone extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  savePassword = () => {

  }

  validateToNextPassword = () => { // 新密码

  }

  compareToFirstPassword = () => { // 确认新密码

  }

  sendCode = () => { // 获取验证码

  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;

    return (
      <div className={styles.ediPhone}>
        <div className={styles.account}>
              <Form>
                <FormItem label="旧手机号码">
                  {getFieldDecorator('oldPhone',{
                    rules: [{
                      required: true, message: '请输入旧的手机号码',
                    }],
                  })(
                    <Input type="phone" />
                  )}
                </FormItem>
                <FormItem label="新手机号码">
                  {getFieldDecorator('newPhone',{
                    rules: [{
                      required: true, message: '请输入新的手机号码',
                    },{
                      message: '请输入正确的手机号',
                      pattern: /^1\d{10}$/,
                      required: true,
                    }]
                  })(
                    <Input type="phone" />
                  )}
                </FormItem>
                <FormItem  label="填写验证码">
                  {getFieldDecorator('verificationCode', {
                    rules: [{required: true, message: '请输入验证码'}]
                  })(
                    <Input className={styles.testCode} addonBefore={<i className="iconfont icon-password"></i>} />
                  )}
                </FormItem>
                <Button type="primary" onClick={this.sendCode}>获取验证码</Button>
                <Button onClick={this.savePhone} loading={loading} className={styles.savePhone} >保存</Button>
              </Form>
            </div>
      </div>
      )
    }
  }
  export default Form.create()(EdiPhone);