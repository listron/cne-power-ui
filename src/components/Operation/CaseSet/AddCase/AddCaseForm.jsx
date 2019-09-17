import React from 'react';
import PropTypes from 'prop-types';
import styles from '../CasePartSide.scss';
import { Button, Input, Form, Select, Upload, Icon, message } from 'antd';
import TextArea from '../../../Common/InputLimit/index';
import StationSelect from '../../../Common/StationSelect/index';
import AutoSelect from '../../../Common/AutoSelect';

const FormItem = Form.Item;
const { Option } = Select;

class AddCaseForm extends React.Component {
  static propTypes = {
    addCasePart: PropTypes.func,
    editCasePart: PropTypes.func,
    form: PropTypes.object,
    caseDetail: PropTypes.object,
    showPage: PropTypes.string,
    stations: PropTypes.array,
    modesInfo: PropTypes.array,
    questionTypeList: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }
  addsubmitForm = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //发送请求
        const deviceModeList = values.deviceModeList.map((e) => ({ manufactorId: e.split('-')[0], deviceMode: e.split('-')[1] }));
        const stationCodes = values.stationCodes.map(e => (e.stationCode));
        this.props.addCasePart({ ...values, deviceModeList, stationCodes });
        this.props.changeCasePartStore({
          showPage: 'list',
        });
      }
    });

  }
  keepOnAdd = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //发送请求
        const deviceModeList = values.deviceModeList.map((e) => ({ manufactorId: e.split('-')[0], deviceMode: e.split('-')[1] }));
        const stationCodes = values.stationCodes.map(e => (e.stationCode));
        this.props.addCasePart({ ...values, deviceModeList, stationCodes });
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
    if (name === 'deviceModeList') {
      const data = caseDetail['deviceModes'] ? caseDetail['deviceModes'] : '';
      const value = data && data.map((e) => (`${e.manufactorId}-${e.deviceModeCode}`));
      return value;
    }
    if (name === 'stationCodes') {
      const data = caseDetail['stations'] ? caseDetail['stations'] : '';
      const value = data && data.map((e) => (e));
      return value;
    }
    if (name === 'questionTypeCodes') {
      const data = caseDetail['questionTypes'] ? caseDetail['questionTypes'] : [];
      const value = data && data.map((e) => (e.questionTypeCode));
      return value;
    }
    if (name === 'annexs') {
      const data = caseDetail['annexs'] ? caseDetail['annexs'] : [];
      const value = data && data.map((e, i) => ({ name: `${e.annex}`, uid: `${i}` }));
      return value;
    }
    return data;
  }
  beforeUploadStation = (file) => { // 上传前的校验

    const limitSize = 1024 * 1024 * 100;
    if (file.size > limitSize) {
      message.config({ top: 200, duration: 2, maxCount: 3 });
      message.error('上传文件不得大于100M', 2);
    }

    return false;
  }
  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  onModelChange = (value) => {
    const deviceModeList = value.map(e => (e.value));
    this.setState({}, () => {
      this.props.form.setFieldsValue({ deviceModeList });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { showPage, stations, modesInfo, questionTypeList } = this.props;
    return (

      <div className={styles.fromContainer}>
        <Form className={styles.formPart}>
          <FormItem label="机型" colon={false} className={styles.formItemStyle} >
            {getFieldDecorator('deviceModeList', {
              initialValue: this.dealPointDetail('deviceModeList'),
              rules: [{ required: true, message: '请正确填写' }],
            })(
              <AutoSelect
                style={{ width: '198px' }}
                data={modesInfo}
                multiple={true}
                maxTagCount={0}
                onChange={this.onModelChange}
              />
            )}
          </FormItem>
          <FormItem label="风场" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('stationCodes', {
              initialValue: this.dealPointDetail('stationCodes'),
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
            {getFieldDecorator('questionTypeCodes', {
              initialValue: this.dealPointDetail('questionTypeCodes'),
              rules: [{ required: true, message: '请正确填写' }],
            })(
              <Select
                mode="multiple"
              >
                {questionTypeList.map(e => {
                  return <Option key={e} value={e.questionTypeCode}>{e.questionTypeName}</Option>;
                })}
              </Select>
            )}
          </FormItem>
          <FormItem label="相关故障代码" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('faultCode', {
              initialValue: this.dealPointDetail('faultCode'),
              rules: [{ required: true, message: '请正确填写', type: 'string', max: 10 }],
            })(
              <TextArea placeholder="请输入" size={999} width={570} height={34} end={true} />
            )}
          </FormItem>

          <FormItem label="问题描述" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('faultDescription', {
              initialValue: this.dealPointDetail('faultDescription'),
              rules: [{ required: true, message: '请正确填写', type: 'string', max: 10 }],
            })(
              <TextArea placeholder="请输入" size={999} width={570} height={72} end={true} />
            )}
          </FormItem>

          <FormItem label="问题分析" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('faultAnalyse', {
              initialValue: this.dealPointDetail('faultAnalyse'),
              rules: [{ required: true, message: '请正确填写', type: 'string', max: 10 }],
            })(
              <TextArea placeholder="请输入" size={999} width={570} height={72} end={true} />
            )}
          </FormItem>

          <FormItem label="处理措施" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('processingMethod', {
              initialValue: this.dealPointDetail('processingMethod'),
              rules: [{ required: true, message: '请正确填写', type: 'string', max: 10 }],
            })(
              <TextArea placeholder="请输入" size={999} width={570} height={72} end={true} />
            )}
          </FormItem>

          <FormItem label="所需工具" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('requiredTools', {
              initialValue: this.dealPointDetail('requiredTools'),
            })(
              <TextArea placeholder="请输入" size={999} width={570} height={72} end={true} />
            )}
          </FormItem>

          <FormItem label="反馈人" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('feedbackUserName', {
              initialValue: this.dealPointDetail('feedbackUserName'),
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>

          <FormItem label="联系方式" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('feedbackUserPhone', {
              initialValue: this.dealPointDetail('feedbackUserPhone'),
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>

          <FormItem label="上传附件" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('annexs', {
              initialValue: this.dealPointDetail('annexs'),
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload
                beforeUpload={this.beforeUploadStation}
                showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
              >
                <Button className={styles.uploadBtn} >  <Icon type="upload" />选择文件上传</Button>
                <span> 上传文件不得大于100M</span>
              </Upload>
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
