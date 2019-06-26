import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './handleForm.scss';
import { Form, Button } from 'antd';
import InputLimit from '../../../../Common/InputLimit/index';
const FormItem = Form.Item;

class DefectCheckForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    getDocketHandle: PropTypes.func,
    docketId: PropTypes.string,
  }


  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.getDocketHandle({
          handleResult: 1,
          ...values,
          annexImg:null,
          otherImg:null,
        })
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
        <FormItem label="处理建议" colon={false}>
          {getFieldDecorator('checkInfo', {
            rules: [{
              required: true,
              message: '请输入处理建议'
            }]
          })(
            <InputLimit placeholder="请描述，不超过999个汉字" />
          )}
        </FormItem>
        <div className={styles.actionBar}>
          <Button className={styles.cancelBtn} onClick={this.onReset}>重置</Button>
          <Button type="primary" htmlType="submit">提交</Button>
        </div>
      </Form>
    );
  }
}

export default Form.create()(DefectCheckForm);
