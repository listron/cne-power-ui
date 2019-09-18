import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Icon, Upload } from 'antd';
import moment from 'moment';
import styles from './intelligentExpert.scss';
import InputLimit from '../../Common/InputLimit';
import WarningTip from '../../Common/WarningTip';

const FormItem = Form.Item;

class EditIntelligent extends Component {
  static propTypes = {
    form: PropTypes.object,
    intelligentDetail: PropTypes.object,
    editIntelligent: PropTypes.func,
    changeIntelligentExpertStore: PropTypes.func,
    listParams: PropTypes.object,
    getIntelligentTable: PropTypes.func,
    knowledgeBaseId: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存！',
      inputEdited: false,
    };
  }

  onWarningTipShow = () => {
    const { inputEdited } = this.state;
    const { changeIntelligentExpertStore, getIntelligentTable, listParams } = this.props;

    if (inputEdited) {
      this.setState({
        showWarningTip: true,
      });
    } else {
      changeIntelligentExpertStore({
        showPage: 'list',
      });
      getIntelligentTable(listParams);
    }
  }

  confirmWarningTip = () => {
    const { changeIntelligentExpertStore } = this.props;
    this.setState({
      showWarningTip: false,
    });
    changeIntelligentExpertStore({
      showPage: 'list',
    });
  }

  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }

  changeInput = () => { // 内容改变时弹出提示框
    const { inputEdited } = this.state;
    if (!inputEdited) {
      this.setState({
        inputEdited: true,
      });
    }
  }


  saveHandler = () => { // 保存按钮
    const { form, editIntelligent, listParams, stationType } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('values', values);
        editIntelligent(values);
        this.props.changeIntelligentExpertStore({
          listParams: {
            ...listParams, orderField: 'update_time',
            sortMethod: 'desc',
          },
        });
      }
    });
  }

  render() {
    const { showWarningTip, warningTipText } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { intelligentDetail = {}, stationType } = this.props;
    const { recorder, updateTime, likeCount } = intelligentDetail;
    const checkItemsName = stationType === '0' && '故障原因' || '检查项目';
    return (
      <div className={styles.editIntelligent}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.titleTop}>
          <span className={styles.text}>解决方案编辑</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onWarningTipShow} />
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
            <Form.Item label="上传附件" >
              {getFieldDecorator('annexs', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
              })(
                <Upload multiple={true} >
                  <Button> <Icon type="upload" /> 选择文件上传</Button>
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
