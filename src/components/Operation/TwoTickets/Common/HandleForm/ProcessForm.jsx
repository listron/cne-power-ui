import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './handleForm.scss';
import { Form, Input, Button, Switch, Radio } from 'antd';
import pathConfig from '../../../../../constants/path';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';
const FormItem = Form.Item;


class DefectProcessForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    commonList: PropTypes.array,
    onChange: PropTypes.func,
  }


  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let annexImg = values.annexImg.map((e,i) => {
          return {
            imgUrl: e.response,
            rotate: e.rotate,
            uid: i,
          }
        })
        let otherImg = values.otherImg.map((e,i) => {
          return {
            imgUrl: e.response,
            rotate: e.rotate,
          }
        })
        this.props.onChange({
          handleResult:1,
          handleDesc:'',
          ...values,
          annexImg,
          otherImg,
        })
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.onSubmit} className={styles.dealForm}>
        <FormItem label="结果附件" colon={false}>
          <div className={styles.addImg}>
            <div className={styles.maxTip}>最多4张</div>
            {getFieldDecorator('annexImg', {
              rules: [{ required: false, message: '请上传图片' }],
              initialValue: [],
              valuePropName: 'data',
            })(
              <ImgUploader imgStyle={{ width: 98, height: 98 }} uploadPath={`${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`} editable={true} />
            )}
          </div>
        </FormItem>
        <FormItem label="其他附件" colon={false}>
          <div className={styles.addImg}>
            <div className={styles.maxTip}>最多4张</div>
            {getFieldDecorator('otherImg', {
              rules: [{ required: false, message: '请上传图片' }],
              initialValue: [],
              valuePropName: 'data',
            })(
              <ImgUploader imgStyle={{ width: 98, height: 98 }} uploadPath={`${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`} editable={true} />
            )}
          </div>
        </FormItem>
        <div className={styles.actionBar}>
          <Button type="primary" htmlType="submit">提交</Button>
        </div>
      </Form>
    );
  }
}

export default Form.create()(DefectProcessForm);
