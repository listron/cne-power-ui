import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import moment from 'moment';
import {Form, Radio, Button} from 'antd';
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
            initialValue: 'ok'
          })(
            <RadioGroup>
              <RadioButton value="ok">合格</RadioButton>
              <RadioButton value="notOk">不合格</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          className={styles.dealProposal} 
          label="处理建议">
          {getFieldDecorator('checkInfo', {
            rules: [{ 
              required: checkResult === "notOk",
              message: '请输入处理建议' 
            }]
          })(
            <InputLimit placeholder="请描述，不超过80个汉字" />
          )}
        </FormItem>
        <FormItem className={styles.actionBar}>
          <Button onClick={this.props.onCancel}>取消</Button>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    );
  }  
}

export default Form.create()(CheckForm);