import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Row,Col } from 'antd';
import styles from './account.scss';
import Cookie from 'js-cookie';

const FormItem = Form.Item;

class EditUserName extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    userFullName: PropTypes.string,
    form: PropTypes.object,
    editUserName: PropTypes.func,
    history: PropTypes.object,
  }

  saveName = () => { // 保存
    const { form, editUserName, history } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        editUserName({ userFullName: values.userFullName, history })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, userFullName } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 10 },
      },
    }

    return (
      <div className={styles.editUserName}>
        <div className={styles.account}>
          <Form {...formItemLayout}>
            <FormItem label="修改姓名" >
              {getFieldDecorator('userFullName', {
                rules: [
                  { validator: (rule, value, callback) => { 
                    const exactStr = value.trim();
                    if (!exactStr) {
                      callback('请输入姓名!');
                    }
                    const patternRule = /^[A-Za-z \u4e00-\u9fa5]{0,30}$/;
                    if (!patternRule.test(exactStr)) {
                      callback('长度小于等于30个字');
                    }
                    callback();
                  }}
                ]
              })(
                <Input type="userFullName" placeholder={userFullName} addonBefore={<i className="iconfont icon-user"></i>} />
              )}
              <span className={styles.instructionText} style={{ width: 380 }}>中文/英文/空格 长度小于30个字</span>
            </FormItem>
          </Form>
          <Row type={'flex'} className={styles.saveButton}>
            <Col span={8} offset={8}> <Button onClick={this.saveName} loading={loading} className={styles.saveName} >保存</Button></Col>
          </Row>
        </div>
      </div>
    )
  }
}
export default Form.create()(EditUserName);