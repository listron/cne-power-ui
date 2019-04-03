import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Row,Col } from 'antd';
import styles from './account.scss';
import Cookie from 'js-cookie';

const FormItem = Form.Item;

class EditUserName extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
    editUserName: PropTypes.func,
    history: PropTypes.object,
  }

  constructor(props) {
    super(props);
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
    const userFullName = Cookie.get('userFullName');
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;
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
                rules: [{
                  required: true, message: '请输入姓名!',
                }, {
                  pattern: /^[A-Za-z_\u4e00-\u9fa5\u0020]{0,30}$/,
                  message: '长度小于等于30个字'
                }],
              })(
                <Input type="userFullName" addonBefore={<i className="iconfont icon-user"></i>} />
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