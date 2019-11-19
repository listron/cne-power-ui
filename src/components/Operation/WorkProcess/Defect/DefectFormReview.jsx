import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './defect.scss';
import moment from 'moment';
import { Form, DatePicker, Button } from 'antd';
import InputLimit from '../../../Common/InputLimit/index';
const FormItem = Form.Item;

class Status extends Component {
  static propTypes = {
    value: PropTypes.any,
    changeStatus: PropTypes.func,
  }

  setDealResult = (value) => {
    this.props.changeStatus(value);
  };

  render() {
    const { value = 'send' } = this.props;
    return (
      <div className={styles.reviewType}>
        <Button type={value === 'send' && 'primary'} onClick={() => { this.setDealResult('send'); }} >下发</Button>
        <Button type={value === 'close' && 'primary'} onClick={() => { this.setDealResult('close'); }} >关闭</Button>
        <Button type={value === 'reject' && 'primary'} onClick={() => { this.setDealResult('reject'); }} >驳回</Button>
      </div>
    );
  }
}

class DefectFormReview extends Component {
  static propTypes = {
    form: PropTypes.object,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      dealResult: 'send',
    };
  }

  componentWillUnmount() {
    this.props.form.resetFields();
  }

  disabledDate = (start) => {
    return start && start < moment().subtract(1, 'day').endOf('day');
  }

  statusChange = (value) => {
    this.setState({ dealResult: value });
    this.props.form.setFieldsValue({
      status: value,
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const dealResult = this.state.dealResult;
    return (
      <React.Fragment>
        <FormItem colon={false} label="审核">
          {getFieldDecorator('status', {
            rules: [{ required: false }],
            initialValue: 'send',
          })(
            <Status changeStatus={this.statusChange} />
          )}
        </FormItem>
        {dealResult !== 'reject' && (
          <FormItem colon={false} label="处理建议">
            {getFieldDecorator('defectProposal', {
              rules: [{ required: dealResult === 'close', message: '请输入关闭的处理建议' }],
            })(
              <InputLimit placeholder="请描述，不超过80个汉字" />
            )}
          </FormItem>
        )}
        {dealResult === 'reject' && (
          <FormItem
            colon={false}
            label="驳回原因">
            {getFieldDecorator('rejectReason', {
              rules: [{ required: true, message: '请输入驳回原因' }],
            })(
              <InputLimit placeholder="请描述，不超过80个汉字" />
            )}
          </FormItem>
        )}
        {dealResult === 'send' && (
          <FormItem label="截止时间" colon={false}>
            {getFieldDecorator('deadLine', {
              rules: [{ required: true, message: '清选择截止时间' }],
            })(
              <DatePicker
                placeholder="默认当前时间"
                format="YYYY-MM-DD"
                disabledDate={this.disabledDate}
              />
            )}
          </FormItem>
        )}
      </React.Fragment >
    );
  }
}

export default (DefectFormReview);
