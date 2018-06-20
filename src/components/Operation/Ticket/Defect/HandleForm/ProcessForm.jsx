import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import {Form, Radio, Input, Button, Switch} from 'antd';
import CommonInput from '../../../../Common/CommonInput';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ProcessForm extends Component {
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
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeReplace = this.onChangeReplace.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  }

  onChangeReplace(checked) {
    this.setState({
      replace: checked
    });
  }

  hasError() {
    const { getFieldValue } = this.props.form;
    let result = this.state.replace ? !getFieldValue("replaceParts") : false;
    return getFieldValue("defectSolveResult") === "solve" &&
     (!getFieldValue("defectSolveInfo") || result);
  }

  render() {   
    const { getFieldDecorator } = this.props.form;
    const defectSolveResult = this.props.form.getFieldValue("defectSolveResult");
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 32 },
    }
    return (
      <Form onSubmit={this.onSubmit} className={styles.handleForm}>
        <FormItem label="处理结果" {...formItemLayout}>
        {getFieldDecorator('defectSolveResult', {
            rules: [{ 
              required: true 
            }],
            initialValue: "notSolve"
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
          label={defectSolveResult === "solve"?"处理过程":"处理建议"}>
          {getFieldDecorator('defectSolveInfo', {
              rules: [{ 
                required: defectSolveResult === "solve" ? true: false, 
                message: '请输入处理过程' 
              }],
              initialValue: ""
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
            initialValue: []
          })(
            <ImgUploader editable={true} />
          )}
        </FormItem>
        {defectSolveResult === "solve" && (
          <FormItem label="更换备件" {...formItemLayout}>
            <div className={styles.replacePart}>
              <Switch checked={this.state.replace} onChange={this.onChangeReplace} />
              {this.state.replace && getFieldDecorator('replaceParts', {
                rules: [{ 
                  required: true, 
                  message: '请输入更换备件' 
                }],
              })( 
                <Input 
                  placeholder="备件名称+型号" />
              )}
            </div>
          </FormItem>
        )}
        <FormItem className={styles.actionBar}>
          <Button onClick={this.props.onCancel}>取消</Button>
          <Button type="primary" htmlType="submit" disabled={this.hasError()}>提交</Button>
        </FormItem>
      </Form>
    );
  }  
}

export default Form.create()(ProcessForm);