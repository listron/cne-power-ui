




import React, { Component } from 'react';
import { Button, Input, Form } from 'antd';
import InputLimit from '../../Common/InputLimit'; 
import PropTypes from 'prop-types';
import styles from './enterprise.scss';
const FormItem = Form.Item;

class EditForm extends Component {
  static propTypes = {
    form: PropTypes.object,
  }

  constructor(props){
    super(props);
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className={styles.editPart}>
        <FormItem
          label="企业名称"
          className={styles.enterpriseName}
        >
          {getFieldDecorator('enterpriseName',{rules: [{
            required : true,
            message: '请输入30字以内的企业名称',
            max: 29
          }]})(
            <Input />
          )}
          <span className={styles.instructionText}>(30字以内)</span>
        </FormItem>
        <FormItem
          label="企业电话"
        >
          {getFieldDecorator('enterpriseNum',{rules:[{
            message: '请输入正确格式的手机号码',
            pattern: /^(\d{11})([,](\d{11})){0,}([,]?)$/
          }]})(
            <Input />
          )}
          <span className={styles.instructionText}>(11位手机号码,多个电话号码用","隔开)</span>
        </FormItem>
        <FormItem
          label="域名设置"
        >
          {getFieldDecorator('enterpriseDomain',{rules: [{
            required : true,
            message: '请输入80字以内的域名',
            max: 79
          }]})(
            <Input />
          )}
          <span className={styles.instructionText}>(80字以内,如myweb,保存后不可修改)</span>
          <div className={styles.confirmDomain}>
            <span className={styles.domainText}>.cnecloud.cn</span>
            <Button className={styles.domainButton}>验证是否可用</Button>
          </div>
        </FormItem>
        <FormItem
          label="网址"
        >
          {getFieldDecorator('enterpriseWebsite', {
            rules: [{
              max: 79,
              message: '网址长度80字以内',
            }]
          })(
            <Input />
          )}
          <span className={styles.instructionText}>(80字以内)</span>
        </FormItem>
        <FormItem
          label="地址"
        >
          {getFieldDecorator('enterpriseAddress', {
            rules: [{
              max: 79,
              message: '地址长度80字以内',
            }]
          })(
            <Input />
          )}
          <span className={styles.instructionText}>(80字以内)</span>
        </FormItem>
        <FormItem
          label="简介"
          className={styles.dealProposal} 
        >
          {getFieldDecorator('enterpriseProfile')(
            <InputLimit size={80} />
          )}
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(EditForm);
