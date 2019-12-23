import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Row, Col } from 'antd';
import styles from './account.scss';

const FormItem = Form.Item;

class EditPhone extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
    editPhone: PropTypes.func,
    history: PropTypes.object,
    sendCode: PropTypes.func,
    savePhone: PropTypes.func,
    getVerification: PropTypes.func,
    error: PropTypes.object,
    phoneCodeRegister: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      timeValue: 0,
    }
  }

  componentWillUnmount = () => {
    clearInterval(this.timeCount);
    this.setState({ timeValue: 0, })
  }


  sendCode = () => { // 获取验证码
    const { form } = this.props;
    form.validateFields(['newPhoneNum'], (err, values) => {
      if (!err) {
        this.props.sendCode(values);
        this.setState({ timeValue: 60 })
        this.timeDecline();
      }
    })
  }

  timeDecline = () => { // 验证码倒数计时
    this.timeCount = setInterval(() => {
      this.setState({ timeValue: this.state.timeValue - 1 })
      if (this.state.timeValue < 0) {
        clearInterval(this.timeCount);
        this.setState({ timeValue: 0 })
      }
    }, 1000);
  }

  phoneCodeRegister = () => { // 保存
    const { form, editPhone, history } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        editPhone({
          ...values,
          history,
        })
      }
    })
  }


  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { loading, sendCode } = this.props;
    const { timeValue } = this.state;
    const currentPhone = getFieldValue('newPhoneNum');
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    return (
      <div className={styles.editPhone}>
        <div className={styles.account}>
          <Form {...formItemLayout}>
            <FormItem label="旧手机号码">
              {getFieldDecorator('oldPhoneNum', {
                rules: [{
                  message: '请输入旧的手机号码',
                  pattern: /^1\d{10}$/,
                  required: true,
                }]
              })(
                <Input type="phone" placeholder={'请输入旧手机号'} addonBefore={<i className="iconfont icon-phone"></i>} />
              )}
            </FormItem>
            <FormItem label="新手机号码">
              {getFieldDecorator('newPhoneNum', {
                rules: [{
                  required: true,
                  message: '请输入新的手机号码'
                },
                {
                  pattern: /(^1\d{10}$)/,
                  message: '新的手机号码输入错误'
                }
                ],
              })(
                <Input type="phone" placeholder={'请输入新手机号'} addonBefore={<i className="iconfont icon-phone"></i>} />
              )}
            </FormItem>
            <FormItem label="填写验证码">
              {getFieldDecorator('verificationCode', {
                rules: [{
                  required: true,
                  message: '请输入手机验证码'
                }]
              })(
                <div>
                  <Input className={styles.testCode} placeholder={'验证码'} addonBefore={<i className="iconfont icon-password"></i>} />
                  <Button type="primary"
                    disabled={timeValue !== 0}
                    onClick={this.sendCode}
                    className={styles[`${timeValue !== 0 ? 'sendCode' : 'getCode'}`]}>
                    {timeValue !== 0 ? timeValue + 's' : "获取验证码"}
                  </Button>
                </div>
              )}
              {timeValue !== 0 && sendCode &&
                <span className={styles.instructionText} style={{ width: 380, color: '#353535' }}>验证码已经发送到 {currentPhone}</span>
              }
            </FormItem>
            <Row type={'flex'} className={styles.saveButton}>
              <Col span={8} offset={8}> <Button onClick={this.phoneCodeRegister} loading={loading} className={styles.savePhone} >保存</Button></Col>
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}
export default Form.create()(EditPhone);