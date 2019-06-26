import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './handleForm.scss';
import moment from 'moment';
import { Form, DatePicker, Button, Radio } from 'antd';
import InputLimit from '../../../../Common/InputLimit/index';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class DefectReviewForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    getDocketHandle: PropTypes.func,
    docketId: PropTypes.string,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      dealResult: 'send'
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dealResult } = this.state;
        this.props.onChange({
          handleResult:dealResult==='send'?1:2,
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

  changeType = (e) => {
    this.setState({ dealResult: e.target.value })
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { dealResult } = this.state;
    return (
      <Form onSubmit={this.onSubmit} className={styles.dealForm} id="reviewForm" style={{ position: 'relative' }}>
        <div className={styles.dealResult}>
          <div className={styles.reviewTitle}><span>审</span><span>核</span></div>
          <div className={styles.reviewType}>
            <RadioGroup onChange={this.changeType} value={dealResult}>
              <RadioButton value="send">通过</RadioButton>
              <RadioButton value="reject">驳回</RadioButton>
            </RadioGroup>
          </div>
        </div>
        {dealResult !== 'reject' && (
          <FormItem colon={false} label="处理建议">
            {getFieldDecorator('handleDesc')(
              <InputLimit placeholder="请描述，不超过999个汉字" />
            )}
          </FormItem>
        )}
        {dealResult === "reject" && (
          <FormItem
            colon={false}
            label="驳回原因">
            {getFieldDecorator('rejectReason', {
              rules: [{
                required: true,
                message: '请输入驳回原因'
              }],
            })(
              <InputLimit placeholder="请描述，不超过999个汉字" />
            )}
          </FormItem>
        )}
        <div className={styles.actionBar}>
          <Button className={styles.cancelBtn} onClick={this.onReset}>重置</Button>
          <Button type="primary" htmlType="submit">提交</Button>
        </div>
      </Form>
    );
  }
}

export default Form.create()(DefectReviewForm);

