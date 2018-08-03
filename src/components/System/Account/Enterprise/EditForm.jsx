




import React, { Component } from 'react';
import { Button, Input, Form } from 'antd';
import InputLimit from '../../../Common/InputLimit'; 
import PropTypes from 'prop-types';
import styles from './enterprise.scss';
const FormItem = Form.Item;

class EditForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
    enterpriseDetail: PropTypes.object,
    saveEnterpriseInfor: PropTypes.func,
    enterpriseLogo: PropTypes.string
  }

  constructor(props){
    super(props);
  }

  saveEnterprise = () =>{
    const { enterpriseLogo } = this.props;
    this.props.form.validateFieldsAndScroll((error,values)=>{
      if(!error){
        this.props.saveEnterpriseInfor({
          ...values,
          enterpriseLogo
        })
      }
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { enterpriseDetail, loading } = this.props;
    return (
      <Form className={styles.editPart}>
        <FormItem label="用户名" >
          {getFieldDecorator('createUser',{
            initialValue: enterpriseDetail.createUser
          })(
            <span>{enterpriseDetail.createUser}</span>
          )}
        </FormItem>
        <FormItem label="企业名称" >
          {getFieldDecorator('enterpriseName',{
            rules: [{
              required : true,
              message: '请输入30字以内的企业名称',
              max: 29,
            }],
            initialValue: enterpriseDetail.enterpriseName || ''
          })(
            <Input />
          )}
          <span className={styles.instructionText}>(30字以内)</span>
        </FormItem>
        <FormItem label="注册手机" >
          {getFieldDecorator('createPhone',{
            initialValue: enterpriseDetail.createPhone
          })(
            <span>{enterpriseDetail.createPhone}</span>
          )}
        </FormItem>
        <FormItem label="企业域名" >
          {getFieldDecorator('enterpriseDomain',{
            initialValue: enterpriseDetail.enterpriseDomain
          })(
            <span>{enterpriseDetail.enterpriseDomain}</span>
          )}
        </FormItem>
        <FormItem label="企业电话" >
          {getFieldDecorator('enterpriseNum',{rules:[{
              message: '请输入正确格式的企业电话',
              pattern: /^(\d{7,11})([,](\d{7,11})){0,}([,]?)$/,
            }],
            initialValue: enterpriseDetail.enterpriseNum || ''
          })(
            <Input />
          )}
          <span className={styles.instructionText}>(多个电话号码用","隔开)</span>
        </FormItem>
        <FormItem label="网址" >
          {getFieldDecorator('enterpriseWebsite', {
            rules: [{
              max: 79,
              message: '80字以内',
            }],
            initialValue: enterpriseDetail.enterpriseWebsite || ''
          })(
            <Input />
          )}
          <span className={styles.instructionText}>(80字以内)</span>
        </FormItem>
        <FormItem label="地址" >
          {getFieldDecorator('enterpriseAddress', {
            rules: [{
              max: 79,
              message: '80字以内',
            }],
            initialValue: enterpriseDetail.enterpriseAddress || '',
          })(
            <Input />
          )}
          <span className={styles.instructionText}>(80字以内)</span>
        </FormItem>
        <FormItem label="简介" className={styles.dealProposal} >
          {getFieldDecorator('enterpriseProfile',{
            initialValue: enterpriseDetail.enterpriseProfile || ''
          })(
            <InputLimit size={400} height={102} width={736} />
          )}
        </FormItem>
        <Button onClick={this.saveEnterprise} loading={loading} >保存</Button>
      </Form>
    )
  }
}

export default Form.create()(EditForm);
