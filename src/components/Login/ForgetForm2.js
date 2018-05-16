import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter} from 'react-router-dom';
import { CHANGE_PSW_SAGA } from '../../constants/actionTypes/Login';
import { Form, Input, Button, message, Row, Col } from 'antd';
// import {}
const FormItem = Form.Item;
class ForgetForm2 extends Component {
  constructor(props) {
    super(props)
    this.state={
      confirmDirty: false,
      autoCompleteResult: [],
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.psw.fetched&&!this.props.psw.fetched){
      this.props.history.push('/login');
    }
    if(nextProps.psw.error&&!this.props.psw.error){
      this.props.form.setFields({
        confirmPwd: {
          value: '******',
          errors: [new Error(nextProps.psw.msg)],
        } 
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let parmas={...values,phone:this.props.code.phone}
        this.props.changePSW(parmas);
      }
    })
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({
      confirmDirty: this.state.confirmDirty || !!value
    });
  }
  //比较两次输入密码
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('密码不一致');
    } else {
      callback();
    }
  }
  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }
  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    const {phone} = this.props.code;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 4
        },
        md: {span:4}, lg: {span:4}
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        },
        md: {span:16}, lg: {span:16}
      },
    };

    return (
      <Form hideRequiredMark={false} onSubmit={this.handleSubmit} className="loginForm"  style={{display:this.props.visible}}>
        <Row>
          <Col span={4} style={{textAlign:"right",color:'rgba(0, 0, 0, 0.85)',marginBottom:"1em"}} className="ant-form-item-required">手机号码：</Col>
          <Col span={20} style={{color:"#999"}}>{!!phone?phone:null}</Col>
        </Row>
        <FormItem
            {...formItemLayout}
            label="新密码"
            extra="6~20位英文字符、数字"
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入有效密码',
                pattern:/^[\x21-\x7E]{6,20}$/,
              }],
            })(
              <Input type="password" placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="确认密码"
          >
            {getFieldDecorator('confirmPwd', {
              rules: [{
                required: true, message: '密码不一致',
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="loginFormButton">
            重置密码
            </Button>
          </FormItem>
        </Form>
    )
  }
}

const ForgetFormS = Form.create()(ForgetForm2);
const mapStateToProps = (state) => ({
  psw:state.login.psw,
  code:state.login.code,
});

const mapDispatchToProps = (dispatch) => ({
  changePSW: (parmas) => dispatch({ type: CHANGE_PSW_SAGA,parmas:parmas }),  
});
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ForgetFormS))