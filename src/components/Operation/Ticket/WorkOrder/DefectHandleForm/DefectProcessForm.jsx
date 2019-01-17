import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectHandleForm.scss';
import { Form, Input, Button, Switch, Radio } from 'antd';
import pathConfig from '../../../../../constants/path';
import CommonInput from '../../../../Common/CommonInput/index1';
import InputLimit from '../../../../Common/InputLimit/index';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class DefectProcessForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    commonList: PropTypes.array,
    onSubmit: PropTypes.func,
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

  onReset = () => {
    this.props.form.resetFields();
  }

  onChangeReplace = (checked) => {
    this.setState({ replace: checked });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const defectFinished = getFieldValue('defectSolveResult') === '0';
    return (
      <Form onSubmit={this.onSubmit} className={styles.dealForm}>
        <FormItem label="处理结果" colon={false}>
          {getFieldDecorator('defectSolveResult', {
            rules: [{ required: true, message: '选择处理结果' }],
            initialValue: '1',
          })(
            <RadioGroup>
              <RadioButton value="1">未解决</RadioButton>
              <RadioButton value="0">已解决</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        {!defectFinished && <FormItem label="处理建议" colon={false}>
          {getFieldDecorator('defectSolveInfo', {
            initialValue: ''
          })(
            <InputLimit placeholder="请描述，不超过80个汉字" />
          )}
        </FormItem>}
        {defectFinished &&
          <React.Fragment>
            <FormItem label="添加照片" colon={false}>
              <div className={styles.addImg}>
                <div className={styles.maxTip}>最多4张</div>
                {getFieldDecorator('photoData', {
                  rules: [{ required: false, message: '请上传图片' }],
                  initialValue: [],
                  valuePropName: 'data',
                })(
                  <ImgUploader imgStyle={{ width: 98, height: 98 }} uploadPath={`${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`} editable={true} />
                )}
              </div>
            </FormItem>
            <FormItem label="产生原因" colon={false}>
              {getFieldDecorator('reasonDesc', {
                rules: [{ required: true, message: '请输入产生原因' }],
                initialValue: ''
              })(
                <InputLimit placeholder="请描述，不超过80个汉字" />
              )}
            </FormItem>
            <FormItem label="处理过程" colon={false}>
              {getFieldDecorator('defectSolveInfo', {
                rules: [{ required: true, message: '请输入处理过程' }],
                initialValue: ''
              })(
                <CommonInput commonList={this.props.commonList} placeholder="请描述，不超过80个汉字" />
              )}
            </FormItem>

            <FormItem label="更换备件" colon={false}>
              <div>
                <Switch checked={this.state.replace} onChange={this.onChangeReplace} />
                {this.state.replace && getFieldDecorator('replaceParts', {
                  rules: [{
                    required: true,
                    message: '请输入更换备件'
                  }],
                })(
                  <Input style={{ marginLeft: 20 }} placeholder="备件名称+型号" />
                )}
              </div>
            </FormItem>
          </React.Fragment>

        }
        <div className={styles.actionBar}>
          <Button className={styles.cancelBtn} onClick={this.onReset}>重置</Button>
          <Button type="primary" htmlType="submit">提交</Button>
        </div>
      </Form>
    );
  }
}

export default Form.create()(DefectProcessForm);
