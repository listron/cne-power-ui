import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectHandleForm.scss';
import moment from 'moment';
import {Form, DatePicker, Button} from 'antd';
import InputLimit from '../../../../Common/InputLimit';
const FormItem = Form.Item;

class DefectReviewForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
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
        values.dealResult = this.state.dealResult;
        this.props.onSubmit(values);
      }
    });
  }

  disabledDate(current) {
    // Can not select days before today
    return current < moment().endOf('day');
  }

  render() {   
    const { getFieldDecorator } = this.props.form;
    const dealResult = this.state.dealResult;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 32 },
    }
    return (
      <Form onSubmit={this.onSubmit} className={styles.handleForm}>
        <div>
          <span>审   核</span>
          <Button 
            type={this.state.dealResult==='send'?'primary':null}
            onClick={()=>{this.setState({dealResult:'send'})}}
          >下发</Button>
          <Button 
            type={this.state.dealResult==='close'?'primary':null}
            onClick={()=>{this.setState({dealResult:'close'})}}
          >关闭</Button>
          <Button 
            type={this.state.dealResult==='reject'?'primary':null}
            onClick={()=>{this.setState({dealResult:'reject'})}}
          >驳回</Button>
        </div>

        {dealResult !== 'reject' && (
          <FormItem
            {...formItemLayout}
            className={styles.dealProposal} 
            label="处理建议">
            {getFieldDecorator('defectProposal')(
              <InputLimit placeholder="请描述，不超过80个汉字" />
            )}
          </FormItem>
        )}
        {dealResult === "reject" && (
          <FormItem
            {...formItemLayout}
            className={styles.dealProposal} 
            label="驳回原因">
            {getFieldDecorator('rejectReason', {
                rules: [{ 
                  required: true, 
                  message: '请输入驳回原因'
                }],
              })(
              <InputLimit placeholder="请描述，不超过80个汉字" />
            )}
          </FormItem>
        )}
        {dealResult === 'send' && (
          <FormItem label="截止时间" {...formItemLayout}>
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
        <FormItem className={styles.actionBar}>
          <Button onClick={this.props.onCancel}>取消</Button>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    );
  }  
}

export default Form.create()(DefectReviewForm);