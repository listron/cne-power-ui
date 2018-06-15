import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import moment from 'moment';
import {Form, DatePicker, Button, Radio} from 'antd';
import InputLimit from '../../../../Common/inputLimit';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ReviewForm extends Component {
  static propTypes = {
    form:PropTypes.object,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      tag: "send"
    };
    this.onChangeTag = this.onChangeTag.bind(this);
    this.onSubmitSend = this.onSubmitSend.bind(this);
    this.onSubmitClose = this.onSubmitClose.bind(this);
    this.onSubmitReject = this.onSubmitReject.bind(this);
  }

  onChangeTag(e) {
    this.setState({
      tag: e.target.value
    });
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
          <Button onClick={this.props.onClose}>取消</Button>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    );
    return Form.create()(rejectForm);
  }


  render() {   
    return (
      <div className={styles.review}>
        <RadioGroup onChange={this.onChangeTag} defaultValue="send" value={this.state.tag}>
          <RadioButton value="send">下发</RadioButton>
          <RadioButton value="close">关闭</RadioButton>
          <RadioButton value="reject">驳回</RadioButton>
        </RadioGroup>
        {this.state.tag === "send" ? this.renderSend() : null}
        {this.state.tag === "close" ? this.renderClose() : null}
        {this.state.tag === "reject" ? this.renderReject() : null}
      </div>
    );
  }  
}

export default ReviewForm;