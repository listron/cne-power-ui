import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './handleForm.scss';
import { Form, Button } from 'antd';
import InputLimit from '../../../../Common/InputLimit/index';
import CneButton from '@components/Common/Power/CneButton';
const FormItem = Form.Item;

class DefectCheckForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    getDocketHandle: PropTypes.func,
    onChange: PropTypes.func,
  }

  componentWillUnmount() {
    this.props.form.resetFields();
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onChange({
          handleResult: 1,
          ...values,
        });
      }
    });
  }

  onReset = () => {
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.onSubmit} className={styles.dealForm}>
        <FormItem label="作废原因" colon={false}>
          {getFieldDecorator('handleDesc', {
            rules: [{
              required: true,
              message: '请输入作废原因',
            }],
          })(
            <InputLimit placeholder="请描述，不超过999个汉字" size={999} />
          )}
        </FormItem>
        <div className={styles.actionBar}>
          <CneButton className={styles.cancelBtn} onClick={this.onReset}>重置</CneButton>
          <CneButton className={styles.submitBtn} htmlType="submit">提交</CneButton>
        </div>
      </Form>
    );
  }
}

export default Form.create()(DefectCheckForm);
