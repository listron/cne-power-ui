import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectHandleForm.scss';
import {Form, Radio, Input, Button, Switch} from 'antd';
import CommonInput from '../../../../Common/CommonInput';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class DefectProcessForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    commonList: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      replace: false
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  }

  onChangeReplace = (checked) => {
    this.setState({
      replace: checked
    });
  }

  render() {   
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const dealResult = getFieldValue('dealResult');
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 32 },
    }
    return (
      <Form onSubmit={this.onSubmit} className={styles.handleForm}>
        <FormItem label="处理结果" {...formItemLayout}>
        {getFieldDecorator('dealResult', {
            rules: [{ 
              required: true 
            }],
            initialValue: 'notSolve'
          })(
            <RadioGroup>
              <RadioButton value="notSolve">未解决</RadioButton>
              <RadioButton value="solve">已解决</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          className={styles.dealProposal} 
          label={dealResult === 'solve'?'处理过程':'处理建议'}>
          {getFieldDecorator('defectSolveInfo', {
              rules: [{ 
                required: dealResult === 'solve', 
                message: '请输入处理过程'
              }],
              initialValue: ''
            })(
            <CommonInput 
              commonList={this.props.commonList} 
              placeholder="请描述，不超过80个汉字" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="添加照片">
          {getFieldDecorator('photoData', {
            initialValue: [],
            valuePropName: 'data'
          })(
            <ImgUploader editable={true}  />
          )}
        </FormItem>
        {dealResult === 'solve' && (
          <FormItem label="更换备件" {...formItemLayout}>
            <div className={styles.replacePart}>
              <Switch checked={this.state.replace} onChange={this.onChangeReplace} />
              {this.state.replace && getFieldDecorator('replaceParts', {
                rules: [{ 
                  required: true, 
                  message: '请输入更换备件'
                }],
              })( 
                <Input placeholder="备件名称+型号" />
              )}
            </div>
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

export default Form.create()(DefectProcessForm);