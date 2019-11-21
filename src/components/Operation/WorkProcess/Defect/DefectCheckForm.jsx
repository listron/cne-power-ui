import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defect.scss';
import { Form, Radio } from 'antd';
import InputLimit from '../../../Common/InputLimit/index';

class DefectCheckForm extends Component {
  static propTypes = {
    form: PropTypes.object,
  }

  componentWillUnmount() {
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const dealResult = getFieldValue('checkResult');
    return (
      <React.Fragment>
        <Form.Item label="验收结果" colon={false}>
          {getFieldDecorator('checkResult', {
            rules: [{ required: true, message: '选择验收结果' }],
            initialValue: '0',
          })(
            <Radio.Group>
              <Radio.Button value="0">合格</Radio.Button>
              <Radio.Button value="1">不合格</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="处理建议" colon={false}>
          {getFieldDecorator('checkInfo', {
            rules: [{
              required: dealResult === '1',
              message: '请输入处理建议',
            }],
          })(
            <InputLimit placeholder="请描述，不超过80个汉字" />
          )}
        </Form.Item>
      </React.Fragment>
    );
  }
}

export default DefectCheckForm;
