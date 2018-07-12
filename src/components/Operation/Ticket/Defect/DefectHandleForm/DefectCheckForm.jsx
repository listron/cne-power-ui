import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectHandleForm.scss';
import {Form, Button} from 'antd';
import InputLimit from '../../../../Common/InputLimit';
import CheckFormButtons from './CheckFormButtons';
const FormItem = Form.Item;

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
            initialValue: '0'
          })(
            <CheckFormButtons />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          className={styles.dealProposal} 
          label="处理建议">
          {getFieldDecorator('checkInfo', {
            rules: [{ 
              required: dealResult === '1',
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

export default Form.create()(DefectCheckForm);