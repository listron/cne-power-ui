




import React, { Component } from 'react';
import { Button, Input, Form } from 'antd';
import InputLimit from '../../../Common/InputLimit'; 
import PropTypes from 'prop-types';
import styles from './enterprise.scss';
import CneButton from '@components/Common/Power/CneButton';

const FormItem = Form.Item;

class EditForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    enterpriseId: PropTypes.string,
    form: PropTypes.object,
    enterpriseDetail: PropTypes.object,
    saveEnterpriseInfor: PropTypes.func,
    enterpriseLogo: PropTypes.string
  }

  constructor(props){
    super(props);
  }

  saveEnterprise = () =>{
    const { enterpriseId, enterpriseLogo } = this.props;
    this.props.form.validateFieldsAndScroll((error,values)=>{
      // console.log({
      //   enterpriseId,
      //     ...values,
      //     enterpriseLogo
      // })
      if(!error){
        this.props.saveEnterpriseInfor({
          enterpriseId,
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
          {getFieldDecorator('phoneNum',{
            initialValue: enterpriseDetail.phoneNum
          })(
            <span>{enterpriseDetail.phoneNum}</span>
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
          {getFieldDecorator('enterpriseNum',{
            initialValue: enterpriseDetail.enterpriseNum || ''
          })(
            <Input placeholder="请输入..." />
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
            <Input placeholder="请输入..." />
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
            <Input placeholder="请输入..." />
          )}
          <span className={styles.instructionText}>(80字以内)</span>
        </FormItem>
        <FormItem label="简介" className={styles.dealProposal} >
          {getFieldDecorator('enterpriseProfile',{
            initialValue: enterpriseDetail.enterpriseProfile || ''
          })(
            <InputLimit size={400} height={102} width={736} placeholder="请输入..." />
          )}
        </FormItem>
        <CneButton onClick={this.saveEnterprise} loading={loading} lengthMode="short" className={styles.saveInfo}>保存</CneButton>
      </Form>
    )
  }
}

export default Form.create()(EditForm);
