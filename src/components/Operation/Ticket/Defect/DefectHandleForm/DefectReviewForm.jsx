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
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      dealResult: 'send'
    };
  }
  componentDidMount(){
    console.log(moment().endOf('day'));
    console.log(moment().minute(Number));
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

  onReset = () => {
    this.props.form.resetFields();
  }

  range =(start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  disabledDate(current,item) {
    console.log(current,item);
    // Can not select days before today
    return current < moment().endOf('day');
  }
  disabledTime = (date) => {
    return {
      disabledMinutes: () => this.range(0, moment().minute(Number)),
      // disabledSeconds: () => [55, 56],
    };
  }
  render() {   
    const { getFieldDecorator } = this.props.form;
    const dealResult = this.state.dealResult;
    return (
      <Form onSubmit={this.onSubmit} className={styles.dealForm} id="reviewForm" style={{position:'relative'}}>
        <div className={styles.dealResult}>
          <div className={styles.reviewTitle}><span>审</span><span>核</span></div>
          <div className={styles.reviewType}>
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
        </div>

        {dealResult !== 'reject' && (
          <FormItem colon={false} label="处理建议">
            {getFieldDecorator('defectProposal')(
              <InputLimit placeholder="请描述，不超过80个汉字" />
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
              <InputLimit placeholder="请描述，不超过80个汉字" />
            )}
          </FormItem>
        )}
        {dealResult === 'send' && (
          <FormItem label="截止时间" colon={false}>
            {getFieldDecorator('deadLine')(
              <DatePicker 
                placeholder="默认当前时间"
                format="YYYY-MM-DD"
                showTime={true}
                showToday={false}
                getCalendarContainer={() => document.getElementById('reviewForm')}
                disabledDate={this.disabledDate} 
                disabledTime={this.disabledTime}
              />
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