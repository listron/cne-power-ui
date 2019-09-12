import React from 'react';
import PropTypes from 'prop-types';
import styles from '../CasePartSide.scss';
import { Button, Input, Form, Select } from 'antd';
import TextArea from '../../../Common/InputLimit/index';
import StationSelect from '../../../Common/StationSelect/index';

const FormItem = Form.Item;
const { Option } = Select;

class AddCaseForm extends React.Component {
  static propTypes = {
    addCasePart: PropTypes.func,
    editCasePart: PropTypes.func,
    form: PropTypes.object,
    caseDetail: PropTypes.object,
    showPage: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }
  addsubmitForm = (e) => {
    // const {  } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //发送请求
        this.props.addCasePart({ ...values });
      }
    });
    this.props.changeCasePartStore({
      showPage: 'list',
    });
  }
  keepOnAdd = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //发送请求
        this.props.addCasePart({ ...values });
      }
    });
    this.props.form.resetFields();
  }
  editsubmitForm = (e) => {
    const { caseDetail } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //发送请求
        this.props.editCasePart({ ...caseDetail, ...values });
      }
    });
  }
  dealPointDetail = (name) => {
    const { caseDetail = {} } = this.props;
    const data = (caseDetail[name] || caseDetail[name] === 0) ? caseDetail[name] : '';
    return data;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { showPage, stations } = this.props;
    console.log('stations: ', stations);
    return (

      <div className={styles.fromContainer}>
        <Form className={styles.formPart}>
          <FormItem label="机型" colon={false} className={styles.formItemStyle} >
            {getFieldDecorator('devicePointStandardCode', {
              initialValue: this.dealPointDetail('devicePointStandardCode'),
              rules: [{ required: true, message: '请正确填写', type: 'string', max: 10 }],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="风场" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('devicePointName', {
              initialValue: this.dealPointDetail('devicePointName'),
              rules: [{ required: true, message: '请正确填写' }],
            })(
              <StationSelect
                data={stations.filter(e => (e.stationType === 0))}
                multiple={true}
                onOK={this.selectStatioNcode}
              />
            )}

          </FormItem>
          <FormItem label="问题类别" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('devicePointCode', {
              initialValue: this.dealPointDetail('devicePointCode'),
              rules: [{ required: true, message: '请正确填写', type: 'string', max: 10 }],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="相关故障代码" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('devicePointIecname', {
              initialValue: this.dealPointDetail('devicePointIecname'),
              rules: [{ required: true, message: '请正确填写', type: 'string', max: 10 }],
            })(
              <TextArea placeholder="请输入" size={999} width={570} height={34} end={true} />
            )}
          </FormItem>

          <FormItem label="问题描述" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('devicePointDatatype', {
              initialValue: this.dealPointDetail('devicePointDatatype'),
              rules: [{ required: true, message: '请正确填写', type: 'string', max: 10 }],
            })(
              <TextArea placeholder="请输入" size={999} width={570} height={72} end={true} />
            )}
          </FormItem>

          <FormItem label="问题分析" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('devicePointType', {
              initialValue: this.dealPointDetail('devicePointType'),
              rules: [{ required: true, message: '请正确填写', type: 'string', max: 10 }],
            })(
              <TextArea placeholder="请输入" size={999} width={570} height={72} end={true} />
            )}
          </FormItem>

          <FormItem label="处理措施" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('devicePointUnit', {
              initialValue: this.dealPointDetail('devicePointUnit'),
              rules: [{ required: true, message: '请正确填写', type: 'string', max: 10 }],
            })(
              <TextArea placeholder="请输入" size={999} width={570} height={72} end={true} />
            )}
          </FormItem>

          <FormItem label="所需工具" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('devicePointIndex', {
              initialValue: this.dealPointDetail('devicePointIndex'),
            })(
              <TextArea placeholder="请输入" size={999} width={570} height={72} end={true} />
            )}
          </FormItem>

          <FormItem label="反馈人" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('devicePointDecimalplace', {
              initialValue: this.dealPointDetail('devicePointDecimalplace'),
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>

          <FormItem label="联系方式" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('isTransfer', {
              initialValue: this.dealPointDetail('isTransfer'),
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>

          <FormItem label="上传附件" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('isShow', {
              initialValue: this.dealPointDetail('isShow'),
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>

          {showPage === 'add' && <div className={styles.submitStyle}>
            <Button onClick={this.addsubmitForm} className={styles.submitBtn}>保存</Button>
            <Button onClick={this.keepOnAdd} className={styles.keepOnAdd} >保存并继续添加</Button>
          </div>}
          {showPage === 'edit' && <div className={styles.submitStyle}>
            <Button onClick={this.editsubmitForm} className={styles.submitBtn} >保存</Button>
          </div>}


        </Form>
      </div>
    );
  }
}
export default Form.create()(AddCaseForm);
