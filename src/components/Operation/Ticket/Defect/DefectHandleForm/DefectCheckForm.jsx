import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectHandleForm.scss';
import { Form, Button, Radio } from 'antd';
import InputLimit from '../../../../Common/InputLimit';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class DefectCheckForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  }

  render() {   
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const dealResult = getFieldValue('checkResult');
    return (
      <Form onSubmit={this.onSubmit} className={styles.dealForm}>
        <FormItem label="验收结果" colon={false}>
          {getFieldDecorator('checkResult', {
            rules: [{ required: true, message: '选择验收结果' }],
            initialValue: '0',
          })(
            <RadioGroup>
              <RadioButton value="0">合格</RadioButton>
              <RadioButton value="1">不合格</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label="处理建议" colon={false}>
          {getFieldDecorator('checkInfo', {
            rules: [{ 
              required: dealResult === '1',
              message: '请输入处理建议' 
            }]
          })(
            <InputLimit placeholder="请描述，不超过80个汉字" />
          )}
        </FormItem>
        <div className={styles.actionBar}>
          <Button className={styles.cancelBtn} onClick={this.props.onCancel}>重置</Button>
          <Button type="primary" htmlType="submit">提交</Button>
        </div>
      </Form>
    );
  }  
}

export default Form.create()(DefectCheckForm);