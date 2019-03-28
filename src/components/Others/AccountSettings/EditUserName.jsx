import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input } from 'antd';
import styles from './style.scss';

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
    this.state = {
      confirmDirty: false,
    };
  }

  saveName = () => { // 保存
    const { form, editUserName, history } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(!err){
        editUserName({
          userFullName: values.userFullName,
          history,
        })
      }
    })
  }

  validateToNewName = (rule, value, callback) => { // 修改姓名
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;

    return (
      <div className={styles.editUserName}>
        <div className={styles.account}>
              <Form>
                <FormItem label="修改姓名" >
                  {getFieldDecorator('userFullName',{
                    rules: [{
                      required: true, message: '请输入姓名!',
                    },{
                      pattern: /^[A-Za-z_\u4e00-\u9fa5\s*]{0,30}$/,
                    },{
                      validator: this.validateToNewName,
                    }],
                  })(
                    <Input type="userFullName" />
                  )}
                  <span className={styles.instructionText}>(中文/英文/空格 长度小于30个字)</span>
                </FormItem>
                <Button onClick={this.saveName} loading={loading} className={styles.saveName} >保存</Button>
              </Form>
            </div>
      </div>
      )
    }
  }
  export default Form.create()(EditUserName);