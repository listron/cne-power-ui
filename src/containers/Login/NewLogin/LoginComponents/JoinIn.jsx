
import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, Card } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './joinIn.scss';
import Cookie from 'js-cookie';

const FormItem = Form.Item;

class JoinIn extends Component{
  static propTypes = {
    // pageTab: PropTypes.string, // 四页面关键字：login登录, register注册, joinIn加入企业, forget忘记密码,
    // resetLoginState: PropTypes.func,
    form: PropTypes.object,
    joinStep: PropTypes.number,
    enterpriseLoading: PropTypes.bool,
    showEnterpriseInfo: PropTypes.bool,
    enterpriseInfo: PropTypes.object,
    getEnterpriseInfo: PropTypes.func,
    changeLoginStore: PropTypes.func,
  }

  toLogin = () => { // 返回登录状态
    const { changeLoginStore } = this.props;
    changeLoginStore({
      showEnterpriseInfo: false,
      enterpriseInfo: {},
      pageTab :'login',
    })
  }

  toCheckEnterprise = () => {
    const { form, getEnterpriseInfo } = this.props;
    form.validateFields((err,values) => {
      if (!err) {
        getEnterpriseInfo({ enterpriseName: values.enterpriseName });
      }
    })
  }

  joinEnterprise = () => { // 点击进入下一步
    const { changeLoginStore } = this.props;
    changeLoginStore({ joinStep: 2 })
  }

  handleCancel = () => { // 返回加入企业第一步
    const { changeLoginStore } = this.props;
    changeLoginStore({
      showEnterpriseInfo: false,
      enterpriseInfo: {},
    });
  }

  render(){
    const { form, enterpriseInfo, showEnterpriseInfo, enterpriseLoading, joinStep } = this.props;
    const { getFieldDecorator } = form;
    const { enterpriseName, enterpriseId } = enterpriseInfo || {};
    return (
      <div className={styles.joinIn}>
        <div className={styles.joinTop}>
          <span className={styles.toLogin} onClick={this.toLogin}>登录</span>
        </div>
        {joinStep === 1 && <Form className={styles.stepOne}>
          {!showEnterpriseInfo && <FormItem label="企业名称" labelCol={{sm: 8}} wrapperCol={{sm: 16}}>
            {getFieldDecorator('enterpriseName', {
              rules: [{required: true, message: '请输入企业名称/企业域名'}]
            })(
              <Input placeholder="请输入企业名称/企业域名" className={styles.nameInput} />
            )}
          </FormItem>}
          {!showEnterpriseInfo && <Button
            type="primary"
            className={styles.checkName}
            onClick={this.toCheckEnterprise}
            loading={enterpriseLoading}
          >下一步</Button>}
          {showEnterpriseInfo && <Card className={styles.enterpriseInfo} >
            {enterpriseId ? <div>点击确认要加入的企业</div> : <div>没有此企业，请重新输入</div>}
            {enterpriseId && <Button
              className={styles.enterpriseBtn}
              onClick={this.joinEnterprise
            }>{enterpriseName}</Button>}
            <div className={styles.enterpriseBack}>
              <Icon type="arrow-left" />
              <span onClick={this.handleCancel}>返回</span>
            </div>
          </Card>}
        </Form>}
      </div>
    )
  }
}

export default Form.create()(JoinIn);
