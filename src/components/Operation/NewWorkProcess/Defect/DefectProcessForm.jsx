import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defect.scss';
import { Form, Input, Button, Switch, Radio } from 'antd';
import pathConfig from '@constants/path';
import CommonInput from '../../../Common/CommonInput/index1';
import InputLimit from '../../../Common/InputLimit/index';
import ImgUploader from '../../../Common/Uploader/ImgUploader';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class DefectProcessForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    commonList: PropTypes.array,
    rejectDeatil: PropTypes.object,
  }

  constructor(props) {
    super(props);
    const { rejectDeatil = {} } = props;
    this.state = {
      replace: !!rejectDeatil.replaceParts,
    };
  }

  // componentWillReceiveProps(nextProps){
  //   const {defectId}=this.props;
  //   if (nextProps.defectId !== defectId){
  //     this.setState({ replace:})
  //   }

  // }

  componentWillUnmount() {
    this.props.form.resetFields();
  }

  render() {
    const { rejectDeatil = {} } = this.props;
    const { defectSolveResult, defectProposal, reasonDesc, defectProcess = '', replaceParts, photoAddress } = rejectDeatil;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const defectFinished = getFieldValue('defectSolveResult') === '0';
    const imgDescribe = photoAddress && photoAddress.split(',').filter(e => !!e).map((e, i) => ({
      uid: i, rotate: 0, status: 'done', thumbUrl: e,
    }));
    const { replace } = this.state;
    return (
      <React.Fragment>
        <FormItem label="处理结果" colon={false}>
          {getFieldDecorator('defectSolveResult', {
            rules: [{ required: true, message: '选择处理结果' }],
            initialValue: defectSolveResult || '1',
          })(
            <RadioGroup>
              <RadioButton value="1">未解决</RadioButton>
              <RadioButton value="0">已解决</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        {!defectFinished &&
          <React.Fragment>
            <FormItem label="处理建议" colon={false}>
              {getFieldDecorator('defectProposal', {
                rules: [{ required: false, message: '请输入处理建议' }],
                initialValue: defectProposal,
              })(
                <InputLimit placeholder="请描述，不超过999个汉字" size={999} />
              )}
            </FormItem>
            <FormItem label="处理过程" colon={false}>
              {getFieldDecorator('defectProcess', {
                rules: [{ required: false, message: '请输入处理过程' }],
                initialValue: defectProcess,
              })(
                <CommonInput commonList={this.props.commonList} placeholder="请描述，不超过999个汉字" size={999} />
              )}
            </FormItem>
          </React.Fragment>
        }
        {defectFinished &&
          <React.Fragment>
            <FormItem label="产生原因" colon={false}>
              {getFieldDecorator('reasonDesc', {
                rules: [{ required: true, message: '请输入产生原因' }],
                initialValue: reasonDesc,
              })(
                <InputLimit placeholder="请描述，不超过999个汉字" size={999} />
              )}
            </FormItem>
            <FormItem label="处理过程" colon={false}>
              {getFieldDecorator('defectProcess', {
                rules: [{ required: true, message: '请输入处理过程' }],
                initialValue: defectProcess,
              })(
                <CommonInput commonList={this.props.commonList} placeholder="请描述，不超过999个汉字" size={999} />
              )}
            </FormItem>
          </React.Fragment>
        }
        <FormItem label="添加照片" colon={false}>
          <div className={styles.addImg}>
            <div className={styles.maxTip}>最多4张</div>
            {getFieldDecorator('photoData', {
              rules: [{ required: false, message: '请上传图片' }],
              initialValue: imgDescribe || [],
              valuePropName: 'data',
            })(
              <ImgUploader
                imgStyle={{ width: 98, height: 98 }}
                uploadPath={`${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`} editable={true} />
            )}
          </div>
        </FormItem>
        <FormItem label="更换备件" colon={false}>
          <div className={styles.replaceParts}>
            <Switch checked={replace} onChange={(checked) => { this.setState({ replace: checked }); }} />
            {replace && getFieldDecorator('replaceParts', {
              rules: [{ required: true, message: '请输入更换备件' }],
              initialValue: replaceParts,
            })(
              <Input style={{ marginLeft: 20 }} placeholder="备件名称+型号" />
            )}
          </div>
        </FormItem>
      </React.Fragment>
    );
  }
}

export default DefectProcessForm;
