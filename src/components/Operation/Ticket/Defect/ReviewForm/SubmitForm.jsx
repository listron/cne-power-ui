import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import moment from 'moment';
import {Form, DatePicker, Button, Radio} from 'antd';
import InputLimit from '../../../../Common/InputLimit';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class SubmitForm extends Component {
  static propTypes = {
    type: PropTypes.string,
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    type: "send"
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let parmas = {...values, type: this.props.type}
        this.props.onSubmit(parmas);
      }
    });
  }

  disabledDate(current) {
    // Can not select days before today
    return current < moment().endOf('day');
  }

  rendClose() {
    const { getFieldDecorator } = this.props.form;
    let closeForm =  (
      <Form onSubmit={this.onSubmit} className="closeForm">
        <FormItem label="处理建议">
          {getFieldDecorator('defectProposal')(
            <InputLimit placeholder="请描述，不超过80个汉字" />
          )}
        </FormItem>
        <FormItem>
          <Button onClick={this.props.onClose}>取消</Button>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    );
    return Form.create()(closeForm);
  }

  renderSend() {
    const { getFieldDecorator } = this.props.form;
    let sendForm =  (
      <Form onSubmit={this.onSubmit} className="sendForm">
        <FormItem label="处理建议">
          {getFieldDecorator('defectProposal')(
            <InputLimit placeholder="请描述，不超过80个汉字" />
          )}
        </FormItem>
        <FormItem label="截止时间">
          {getFieldDecorator('deadLine')(
            <DatePicker 
              placeholder="默认当前时间"
              format="YYYY-MM-DD"
              showTime={false}
              showToday={false}
              disabledDate={this.disabledDate} />
          )}
        </FormItem>
        <FormItem>
          <Button onClick={this.props.onClose}>取消</Button>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    );
    return Form.create()(sendForm);
  }

  renderReject() {
    const { getFieldDecorator } = this.props.form;
    let rejectForm =  (
      <Form onSubmit={this.onSubmit} className="rejectForm">
        <FormItem label="驳回原因">
          {getFieldDecorator('defectProposal', {
              rules: [{ required: true, message: '请输入驳回原因' }],
            })(
            <InputLimit placeholder="请描述，不超过80个汉字" />
          )}
        </FormItem>
        <FormItem>
          <Button onClick={this.props.onCancel}>取消</Button>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    );
    return Form.create()(rejectForm);
  }


  render() {   
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.onSubmit} className="submitForm">
        <FormItem label="处理建议">
          {getFieldDecorator('defectProposal', {
              rules: [{ 
                required: this.props.type === "reject" ? true: false, 
                message: '请输入驳回原因' 
              }],
            })(
            <InputLimit placeholder="请描述，不超过80个汉字" />
          )}
        </FormItem>
        {this.props.type === "send" && (
          <FormItem label="截止时间">
            {getFieldDecorator('deadLine')(
              <DatePicker 
                placeholder="默认当前时间"
                format="YYYY-MM-DD"
                showTime={false}
                showToday={false}
                disabledDate={this.disabledDate} />
            )}
          </FormItem>
        )}
        <FormItem>
          <Button onClick={this.props.onClose}>取消</Button>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    );
  }  
}

export default Form.create()(SubmitForm);