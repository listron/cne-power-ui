import React, {Component} from 'react';
import {Form, Icon, Input, Button} from 'antd';
import PropTypes from 'prop-types';
import styles from './loginForm.scss';

const FormItem = Form.Item;

class JoinInForm extends Component{
  static propTypes = {
    form: PropTypes.object,
    
  }

  constructor(props){
    super(props);
    this.state = {
      timeValue: 0,
    }
  }

  onHandleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err,values) => {
      if(!err){
        
      }
    })
  }
  
  timeDecline = () => {
    let timeCount = setInterval(() => {
      this.setState({ timeValue: this.state.timeValue-1 })
      if(this.state.timeValue < 0){
        clearInterval(timeCount);
        this.setState({ timeValue: 0 })
      }
    },1000);
  }

  hasErrors = (fieldsError) =>{
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  // 点击获取验证码
  sendCode = () => {
    this.props.form.validateFields(['phoneNum'], (err, values) => {
      if(!err){
        this.setState({ timeValue: 10 })
        this.timeDecline();
      }
    })
  }

  render(){
    const { getFieldDecorator, getFieldsError } = this.props.form;
    return (
      <div>

      </div>
    );
  }
}
const JoinInForms = Form.create()(JoinInForm);
export default JoinInForms;