import React from 'react';
import PropTypes from 'prop-types';
import styles from '../CasePartSide.scss';
import { Button, Input, Form, Select, Upload, Icon, message } from 'antd';
import TextArea from '../../../Common/InputLimit/index';
import StationSelect from '../../../Common/StationSelect/index';
import AutoSelect from '../../../Common/AutoSelect';
import WarningTip from '../../../Common/WarningTip';
import path from '../../../../constants/path';

const FormItem = Form.Item;
const { Option } = Select;

class AddCaseForm extends React.Component {
  static propTypes = {
    addCasePart: PropTypes.func,
    editCasePart: PropTypes.func,
    uploadCaseFile: PropTypes.func,
    form: PropTypes.object,
    caseDetail: PropTypes.object,
    showPage: PropTypes.string,
    stations: PropTypes.array,
    modesInfo: PropTypes.array,
    questionTypeList: PropTypes.array,
    uploadUrlArr: PropTypes.array,
    editFileList: PropTypes.array,
    deleteCaseFile: PropTypes.func,
    changeCasePartStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      // savefileList: [],
      deleteFileId: '',
      // curfileList: [],
      showWarningTip: false,
      fileListArr: [],
      warningTipText: '确定要删除附件吗?',
    };
  }

  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }
  confirmWarningTip = () => {
    const { deleteFileId } = this.state;
    const { uploadUrlArr } = this.props;
    const newUrlArr = uploadUrlArr.filter(e => !(e.url === deleteFileId));
    this.props.deleteCaseFile({
      url: deleteFileId,
    });
    this.props.changeCasePartStore({
      uploadUrlArr: newUrlArr,
    });
    this.setState({
      showWarningTip: false,
      deleteFileId: '',
    });
  }
  sendRequire = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //发送请求
        const { uploadUrlArr } = this.props;
        const annexs = uploadUrlArr.map(e => (e.url));
        const deviceModeList = values.deviceModeList.map((e) => ({ manufactorId: e.split('-')[0], deviceMode: e.split('-')[1] }));
        const stationCodes = values.stationCodes.map(e => (e.stationCode));
        this.props.addCasePart({ ...values, deviceModeList, stationCodes, annexs });
      }
    });
  }
  addsubmitForm = (e) => {
    e.preventDefault();
    this.sendRequire();
    this.props.changeCasePartStore({
      showPage: 'list',
    });
  }
  keepOnAdd = (e) => {
    e.preventDefault();
    this.sendRequire();
    this.props.form.resetFields();
  }
  editsubmitForm = (e) => {
    const { caseDetail } = this.props;
    const { caseBaseId } = caseDetail;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //发送请求
        const { uploadUrlArr } = this.props;
        const annexs = uploadUrlArr.map(e => (e.url));
        const deviceModeList = values.deviceModeList.map((e) => ({ manufactorId: e.split('-')[0], deviceMode: e.split('-')[1] }));
        const stationCodes = values.stationCodes.map(e => (e.stationCode));
        this.props.editCasePart({ ...values, caseBaseId, deviceModeList, stationCodes, annexs });
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
      const value = data && data.map((e, i) => ({ name: `${e.name}`, uid: `${i}` }));
      return value;
    }
    return data;
  }
  beforeUploadStation = (file) => { // 上传前的校验
    const limitSize = 1024 * 1024 * 100;
    if (file.size > limitSize) {
      message.config({ top: 200, duration: 2, maxCount: 3 });
      message.error('上传文件不得大于100M', 2);
    } else {

      const formData = new FormData();
      formData.append('file', file);
      this.props.uploadCaseFile({
        formData,
      });

    }
    return false;
  }


  onModelChange = (value) => {
    const deviceModeList = value.map(e => (e.value));
    this.setState({}, () => {
      this.props.form.setFieldsValue({ deviceModeList });
    });
  }
  detailInfo = () => {
    const detailArr = [
      { name: '填报人', value: this.dealPointDetail('createUserName') },
      { name: '联系方式', value: this.dealPointDetail('createUserPhone') },
      { name: '更新时间', value: this.dealPointDetail('updateTime') },
      { name: '点赞数', value: this.dealPointDetail('likeCount') },
    ];
    return detailArr;
  }
  removeFile = (file) => {
    const { uid } = file;
    this.setState({ showWarningTip: true, deleteFileId: uid });
  }
  changeFileList = (fileList) => { // 转化格式
    return fileList.map(item => {
      return {
        name: item.urlName,
        status: 'done',
        url: `${path.basePaths.originUri}${item.url}`,
        uid: item.url,
      };
    });
  }
  onPreview = (a, b, c) => { // 点击文件下载
    return false;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { showPage, stations, modesInfo, questionTypeList, uploadUrlArr } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    const initFileList = showPage === 'add' ? this.changeFileList(uploadUrlArr) : this.changeFileList(uploadUrlArr);
    const detailArr = this.detailInfo();
    return (
      <div className={styles.fromContainer}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <Form className={styles.formPart}>
          <FormItem label="机型" colon={false} className={`${styles.formItemStyle} ${styles.autoSelect}`} >
            {getFieldDecorator('deviceModeList', {
              initialValue: this.dealPointDetail('deviceModeList'),
              rules: [{ required: true, message: '请选择机型' }],
            })(
              <AutoSelect
                holderText="输入关键字快速查询"
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
              initialValue: showPage === 'edit' ? this.dealPointDetail('stationCodes') : [],
              rules: [{ required: true, message: '请选择风场' }],
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
              rules: [{ required: true, message: '请选择问题类别' }],
            })(
              <Select
                mode="multiple"
                placeholder="请输入关键字快速查询"
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
              rules: [{ required: true, message: '请输入相关故障代码', type: 'string', max: 999 }],
            })(
              <TextArea placeholder="请输入..." size={999} width={570} height={34} end={true} />
            )}
          </FormItem>

          <FormItem label="问题描述" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('faultDescription', {
              initialValue: this.dealPointDetail('faultDescription'),
              rules: [{ required: true, message: '请输入问题描述', type: 'string', max: 999 }],
            })(
              <TextArea placeholder="请输入..." size={999} width={570} height={72} end={true} />
            )}
          </FormItem>

          <FormItem label="问题分析" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('faultAnalyse', {
              initialValue: this.dealPointDetail('faultAnalyse'),
              rules: [{ required: true, message: '请输入问题分析', type: 'string', max: 999 }],
            })(
              <TextArea placeholder="请输入..." size={999} width={570} height={72} end={true} />
            )}
          </FormItem>

          <FormItem label="处理措施" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('processingMethod', {
              initialValue: this.dealPointDetail('processingMethod'),
              rules: [{ required: true, message: '请输入处理措施', type: 'string', max: 999 }],
            })(
              <TextArea placeholder="请输入..." size={999} width={570} height={72} end={true} />
            )}
          </FormItem>

          <FormItem label="所需工具" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('requiredTools', {
              initialValue: this.dealPointDetail('requiredTools'),
            })(
              <TextArea placeholder="请输入..." size={999} width={570} height={72} end={true} />
            )}
          </FormItem>

          <FormItem label="反馈人" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('feedbackUserName', {
              initialValue: this.dealPointDetail('feedbackUserName'),
            })(
              <Input placeholder="请输入..." />
            )}
          </FormItem>

          <FormItem label="联系方式" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('feedbackUserPhone', {
              initialValue: this.dealPointDetail('feedbackUserPhone'),
              rules: [{ message: '请输入正确的手机号码', type: 'string', pattern: /^\d*$/ }],

            })(
              <Input placeholder="请输入..." />
            )}
          </FormItem>

          <FormItem label="上传附件" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('annexs', {

            })(
              <Upload
                multiple={true}
                onRemove={(file) => this.removeFile(file)}
                beforeUpload={this.beforeUploadStation}
                fileList={initFileList}
                onPreview={this.onPreview}
              >
                <Button> <Icon type="upload" /> 选择文件上传</Button>  <span className={styles.extraSpan}> 上传文件不得大于100M</span>
              </Upload>
            )}
          </FormItem>
          {showPage === 'edit' &&
            <div className={styles.detailStyle}>
              {detailArr.map((e, i) => (
                <div className={styles.formItemStyle} key={e.name}>
                  <div className={styles.name}>{e.name}</div>
                  <div className={styles.value}>{e.value}</div>
                </div>
              ))}
            </div>
          }
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
