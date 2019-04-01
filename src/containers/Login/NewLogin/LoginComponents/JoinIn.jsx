
import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, Card } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// import styles from './joinInForm.scss';
import Cookie from 'js-cookie';

const FormItem = Form.Item;


class JoinIn extends Component{
  static propTypes = {
    // pageTab: PropTypes.string, // 四页面关键字：login登录, register注册, joinIn加入企业, forget忘记密码,
    // resetLoginState: PropTypes.func,
  }

  render(){
    // const { form } = this.props;
    // const { getFieldDecorator, getFieldsError } = form;
    // const { enterpriseName, enterpriseInfo } = this.props;
    // const { showEnterpriseInfo } = this.state;
    return (
      <div className={styles.joinIn}>
        {/* <Form className={styles.joinStepOne} >
          <FormItem label="企业名称" {...formItemLayout}>
            {getFieldDecorator('enterpriseName',{
              rules: [{required: true, message: '请输入企业名称/企业域名'}]
            })(
              <Input placeholder="请输入企业名称/企业域名"  />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" onClick={this.getEnterpriseInfo} disabled={this.hasErrors(getFieldsError())} >下一步</Button>
          </FormItem>
          {showEnterpriseInfo && <Card className={styles.enterpriseInfo} >
            {enterpriseName === null ? <div>没有此企业，请重新输入</div> : <div>点击确认要加入的企业</div>}
            {Object.keys(enterpriseInfo).length>0 && enterpriseName === null ? <div></div> : <Button className={styles.enterpriseBtn} onClick={this.changeJoinStep }>{enterpriseName}</Button>}
            <div className={styles.enterpriseBack} ><Icon type="arrow-left" /><span  onClick={this.handleCancel}>返回</span></div>
          </Card>}
        </Form> */}
      </div>
    )
  }
}

export default Form.create()(JoinIn);
