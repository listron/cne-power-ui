import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input } from 'antd';
import styles from './style.scss';

const FormItem = Form.Item;

class EditPhone extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
    editPhone:PropTypes.func,
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
      confirmDirty: false,
      timeValue: 0,
    }
  }

  componentWillUnmount = () => {
    this.setState({
      timeValue: 0,
    })
  }

  // savePhone = () => { // 保存
  //   const { form, editPhone, history} = this.props;
  //   form.validateFieldsAndScroll((err, values) => {
  //     if(!err){
  //       editPhone({
  //         oldPhoneNum: values.oldPhoneNum,
  //         newPhoneNum: values.newPhoneNum,
  //         verificationCode: values.verificationCode,
  //         history,
  //       })
  //     }
  //   })
  // }

  // validateToOldPhone = ( rule, value, callback ) => { // 旧手机号
  //   if ( this.props.error && this.props.error.get('code') === '20028' ) {
  //     this.props.form.setFields({
  //       oldPhoneNum: {
  //         errors: [new Error('旧的手机号码输入错误')],
  //       }
  //     })
  //   }else{
  //     callback();
  //   }
  // }

  validateToNewPhone = ( rule, value, callback ) => { // 新手机号
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  sendCode = () => { // 获取验证码
    const { form } = this.props;
    form.validateFields(['newPhoneNum'],(err, values) => {
      if (!err) {
        this.props.sendCode(values);
        this.setState({timeValue: 60})
        this.timeDecline();
      }
    })
  }

timeDecline = () => { // 验证码倒数计时
  let timeCount = setInterval(() => {
    this.setState({timeValue: this.state.timeValue - 1})
    if (this.state.timeValue < 0) {
      clearInterval(timeCount);
      this.setState({timeValue: 0})
    }
  }, 1000);
}

phoneCodeRegister = () => { // 检验验证码
  const { form, editPhone, history } = this.props;
  form.validateFields(['newPhoneNum','verificationCode'], (err, values) => {
    console.log(err);
    if(!err){
      // editPhone({
      //   oldPhoneNum: values.oldPhoneNum,
      //   newPhoneNum: values.newPhoneNum,
      //   verificationCode: values.verificationCode,
      //   history,
      // })
      setTimeout(() => {
        if(this.props.error && (this.props.error.get('message') === '验证码错误' || this.props.error.get('message') === '验证码已失效')) {
          this.props.form.setFields({
            verificationCode: {
              value: values.verificationCode,
              errors: "验证码错误",
            },
          });
        }      
      }, 500);
    }
  })
}

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;
    const { timeValue } = this.state;
    
    // const formItemLayout = {
    //   labelCol:{
    //     xs: { span: 24 },
    //     sm: { span: 8 },
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 8 },
    //   },
    // }

    return (
      <div className={styles.editPhone}>
        <div className={styles.account}>
              <Form>
                <FormItem label="旧手机号码">
                  {getFieldDecorator('oldPhoneNum',{
                    rules: [{
                      required: true, 
                      message: '请输入旧的手机号码',
                    },{
                      // validator: this.validateToOldPhone,
                    }],
                  })(
                    <Input type="phone" addonBefore={<i className="iconfont icon-phone"></i>} />
                  )}
                </FormItem>
                <FormItem label="新手机号码">
                  {getFieldDecorator('newPhoneNum',{
                    rules: [{
                      required: true, 
                      message: '请输入新的手机号码' 
                    },
                    { 
                      pattern: /^1\d{10}$/,
                      message: '新的手机号码输入错误',
                    },{
                      validator: this.validateToNewPhone,
                    }]
                  })(
                  <Input type="phone" addonBefore={<i className="iconfont icon-phone"></i>} />
                  )}
                </FormItem>
                <FormItem label="填写验证码">
                  {getFieldDecorator('verificationCode', {
                    rules: [{
                      required: true, 
                      message: '请输入验证码'
                    }]
                  })(
                    <Input className={styles.testCode} addonBefore={<i className="iconfont icon-password"></i>} />
                  )}
                </FormItem>
                <Button type="primary" disabled={timeValue !== 0} onClick={this.sendCode}>
                { timeValue !== 0 ? timeValue : "获取验证码" }
                </Button>
                <Button onClick={this.savePhone} onClick={this.phoneCodeRegister} loading={loading} className={styles.savePhone} >保存</Button>
              </Form>
            </div>
      </div>
      )
    }
  }
  export default Form.create()(EditPhone);