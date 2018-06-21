import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import moment from 'moment';
import {Form, Radio, DatePicker, Button} from 'antd';
import InputLimit from '../../../../Common/InputLimit';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class CheckForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  }

  disabledDate(current) {
    // Can not select days before today
    return current < moment().endOf('day');
  }

  render() {   
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const checkResult = getFieldValue('checkResult');
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 32 },
    }
    return (
      <Form onSubmit={this.onSubmit} className={styles.handleForm}>
        <FormItem label="验收结果" {...formItemLayout}>
        {getFieldDecorator('checkResult', {
            rules: [{ 
              required: true 
            }],
            initialValue: "send"
          })(
            <RadioGroup>
              <RadioButton value="send">下发</RadioButton>
              <RadioButton value="close">关闭</RadioButton>
              <RadioButton value="reject">驳回</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        {reviewResult !== "reject" && (
          <FormItem
            {...formItemLayout}
            className={styles.dealProposal} 
            label="处理建议">
            {getFieldDecorator("defectProposal")(
              <InputLimit placeholder="请描述，不超过80个汉字" />
            )}
          </FormItem>
        )}
        {reviewResult === "reject" && (
          <FormItem
            {...formItemLayout}
            className={styles.dealProposal} 
            label="驳回原因">
            {getFieldDecorator("rejectReason", {
                rules: [{ 
                  required: true, 
                  message: "请输入驳回原因" 
                }],
              })(
              <InputLimit placeholder="请描述，不超过80个汉字" />
            )}
          </FormItem>
        )}
        {reviewResult === "send" && (
          <FormItem label="截止时间" {...formItemLayout}>
            {getFieldDecorator("deadLine")(
              <DatePicker 
                placeholder="默认当前时间"
                format="YYYY-MM-DD"
                showTime={false}
                showToday={false}
                disabledDate={this.disabledDate} />
            )}
          </FormItem>
        )}
        <FormItem className={styles.actionBar}>
          <Button onClick={this.props.onCancel}>取消</Button>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    );
  }  
}

export default Form.create()(CheckForm);