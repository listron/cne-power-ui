import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Icon, Upload, message } from 'antd';
import moment from 'moment';
import styles from './intelligentExpert.scss';
import InputLimit from '../../Common/InputLimit';
import WarningTip from '../../Common/WarningTip';
import path from '../../../constants/path';

const FormItem = Form.Item;

class EditIntelligent extends Component {
  static propTypes = {
    form: PropTypes.object,
    intelligentDetail: PropTypes.object,
    editIntelligent: PropTypes.func,
    changeIntelligentExpertStore: PropTypes.func,
    listParams: PropTypes.object,
    uploadFileList: PropTypes.array,
    deleteFile: PropTypes.func,
    stationType: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      tooltipName: 'back', // 提示框的类型 back返回 delete 删除
      deleteFileId: '', //删除附件ID，
    };
  }


  confirmWarningTip = () => { // 确认返回列表页面
    const { tooltipName, deleteFileId } = this.state;
    const { changeIntelligentExpertStore, uploadFileList, deleteFile } = this.props;
    if (tooltipName === 'back') {
      changeIntelligentExpertStore({ showPage: 'list' });
    }
    if (tooltipName === 'delete') {
      const newUploadFileList = uploadFileList.filter(e => !(e.url === deleteFileId));
      deleteFile({ url: deleteFileId });
      changeIntelligentExpertStore({ uploadFileList: newUploadFileList });
      this.setState({ deleteFileId: '' });
    }
    this.setState({
      showWarningTip: false,
      tooltipName: '',
    });

  }

  cancelWarningTip = () => { // 取消
    this.setState({
      showWarningTip: false,
      tooltipName: '',
      deleteFileId: '',
    });
  }

  saveHandler = () => { // 保存按钮
    const { form, editIntelligent, listParams, uploadFileList, intelligentDetail } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('values', values);
        editIntelligent({
          faultDescription: intelligentDetail.faultDescription,
          ...values,
          knowledgeBaseId: intelligentDetail.knowledgeBaseId,
          annexs: uploadFileList.map(e => e.url),
        });
        this.props.changeIntelligentExpertStore({
          listParams: {
            ...listParams, orderField: 'update_time',
            sortMethod: 'desc',
          },
        });
      }
    });
  }

  beforeUploadStation = (file) => { // 上传前的校验
    if (file.size > 100 * 1024 * 1024) {
      message.config({ top: 200, duration: 2, maxCount: 3 });
      message.error('上传文件不得大于100M', 2);
    } else {
      this.uploadFile(file);
    }
    return false;
  }


  uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('originFlag', 0);
    this.props.uploadFile({ formData });
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

  removeFile = (file) => {
    const { uid } = file;
    this.setState({ showWarningTip: true, tooltipName: 'delete', deleteFileId: uid });
  }


  render() {
    const { showWarningTip, tooltipName } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { intelligentDetail = {}, stationType, uploadFileList } = this.props;
    const checkItemsName = stationType === '0' && '故障原因' || '检查项目';
    const initFileList = this.changeFileList(uploadFileList);
    const warningTipText = {
      'back': '退出后信息无法保存！',
      'delete': '确定要删除该附件吗？',
    }[tooltipName];
    return (
      <div className={styles.editIntelligent}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.titleTop}>
          <span className={styles.text}>解决方案编辑</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={() => this.setState({ showWarningTip: true, tooltipName: 'back' })} />
        </div>
        <div className={styles.editmiddle}>
          <Form className={styles.preFormStyle}>
            <div className={styles.formItem}>
              <div className={styles.label}> <span>*</span> 设备类型</div>
              <div className={styles.value}>{intelligentDetail.deviceTypeName}</div>
            </div>
            <div className={styles.formItem}>
              <div className={styles.label}> <span>*</span> 设备型号</div>
              <div className={styles.value}>{intelligentDetail.modeName}</div>
            </div>
            <div className={styles.formItem}>
              <div className={styles.label}> <span>*</span> 缺陷类型</div>
              <div className={styles.value}>{intelligentDetail.faultName}</div>
            </div>
            <div className={styles.formItem}>
              <div className={styles.label}> <span>*</span> 故障代码</div>
              <div className={styles.value}>{intelligentDetail.faultCode}</div>
            </div>
            {
              `${intelligentDetail.type}` === '0' &&
              <div className={styles.formItem}>
                <div className={styles.label}> <span>*</span> 故障描述</div>
                <div className={styles.value}>{intelligentDetail.faultDescription}</div>
              </div> ||
              <FormItem className={styles.formItem} label="故障描述" colon={false}>
                {getFieldDecorator('faultDescription', {
                  rules: [{ required: true, message: '请输入故障描述' }],
                  initialValue: intelligentDetail.faultDescription,
                })(
                  <InputLimit style={{ marginLeft: -80 }} size={999} width={590} placeholder="请输入..." />
                )}
              </FormItem>
            }
            <FormItem className={styles.formItem} label={checkItemsName} colon={false}>
              {getFieldDecorator('checkItems', {
                rules: [{ required: true, message: `请输入${checkItemsName}` }],
                initialValue: intelligentDetail.checkItems,
              })(
                <InputLimit style={{ marginLeft: -80 }} size={999} width={590} placeholder="请输入..." />
              )}
            </FormItem>
            <FormItem className={styles.formItem} label="处理方法" colon={false}>
              {getFieldDecorator('processingMethod', {
                rules: [{ required: true, message: '请输入处理方法' }],
                initialValue: intelligentDetail.processingMethod,
              })(
                <InputLimit style={{ marginLeft: -80 }} size={999} width={590} placeholder="请输入..." />
              )}
            </FormItem>
            <FormItem className={styles.formItem} label="所需工具" colon={false}>
              {getFieldDecorator('requiredTools', {
                rules: [{ message: '请输入...' }],
                initialValue: intelligentDetail.requiredTools,
              })(
                <InputLimit style={{ marginLeft: -80 }} size={999} width={590} placeholder="请输入..." />
              )}
            </FormItem>
            <FormItem className={styles.formItem} label="备注" colon={false}>
              {getFieldDecorator('remark', {
                rules: [{ message: '请输入......' }],
                initialValue: intelligentDetail.remark,
              })(
                <InputLimit style={{ marginLeft: -80 }} size={999} width={590} placeholder="请输入..." />
              )}
            </FormItem>
            <Form.Item label="上传附件" colon={false}>
              {getFieldDecorator('annexs', {
              })(
                <Upload
                  multiple={true}
                  onRemove={(file) => this.removeFile(file)}
                  beforeUpload={this.beforeUploadStation}
                  fileList={initFileList}
                  onPreview={this.onPreview}
                >
                  <Button> <Icon type="upload" /> 选择文件上传</Button>  <span> 上传文件不得大于100M</span>
                </Upload>
              )}
            </Form.Item>
            <div className={styles.formItem}>
              <div className={styles.label}>  录入人</div>
              <div className={styles.value}>{intelligentDetail.recorder || '无'}</div>
            </div>
            <div className={styles.formItem}>
              <div className={styles.label}> 更新时间</div>
              <div className={styles.value}>{moment(intelligentDetail.updateTime).format('YYYY-MM-DD HH:mm:ss') || '无'}</div>
            </div>
            <div className={styles.formItem}>
              <div className={styles.label}> 点赞数</div>
              <div className={styles.value}>{intelligentDetail.likeCount || 0}</div>
            </div>
            <div className={styles.formItem}>
              <Button onClick={this.saveHandler} className={styles.saveBtn} type="primary">保存</Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(EditIntelligent);
