import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Icon } from 'antd';
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
    getIntelligentExpertStore: PropTypes.func,
    listParams: PropTypes.object,
    getIntelligentTable: PropTypes.func,
    knowledgeBaseId:  PropTypes.string,
  }

  constructor(props){
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存！',
    }
  }

  onWarningTipShow = () => {
    this.setState({
      showWarningTip: true,
    })
  }

  confirmWarningTip = () => {
    const { getIntelligentExpertStore } = this.props;
    this.setState({
      showWarningTip: false,
    })
    getIntelligentExpertStore({
      showPage: 'list',
    });
  }

  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
  }

  editBtn = () => { // 保存
    const { form, knowledgeBaseId, listParams, getIntelligentTable, editIntelligent } = this.props;
    form.validateFieldsAndScroll((error,values)=>{
      const { checkItems, faultDescription, processingMethod, remark, requiredTools } = values
      if(!error){
        editIntelligent({ knowledgeBaseId, checkItems, faultDescription, processingMethod, remark, requiredTools })
      }
    })
    getIntelligentTable(listParams) // 返回列表页面时重新请求列表数据

  }

  render(){
    const { showWarningTip, warningTipText } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { intelligentDetail } = this.props;
    let { recorder, updateTime, likeCount } = intelligentDetail;

    return (
      <div className={styles.editIntelligent}>
         <div className={styles.editContent}>
            {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
            <div className={styles.titleTop}>
              <span className={styles.text}>编辑</span>
              <Icon type="arrow-left" className={styles.backIcon} onClick={this.onWarningTipShow} />
            </div>
            <div className={styles.editmiddle}>
            <Form className={styles.preFormStyle}>
              <FormItem label="设备类型" colon={false}>
                 {getFieldDecorator('deviceTypeCode',{
                   rules: [{
                     required : true,
                   }],
                   initialValue: intelligentDetail.deviceTypeCode
                 })(
                   <span>{intelligentDetail.deviceTypeName || '无'}</span>
                 )}
              </FormItem>
              <FormItem label="缺陷类型" colon={false}>
                {getFieldDecorator('faultTypeId',{
                  rules: [{
                    required : true,
                  }],
                  initialValue: intelligentDetail.faultTypeId
                })(
                  <span>{intelligentDetail.faultName || '无'}</span>
                )}
              </FormItem>
              <FormItem label="缺陷描述" colon={false}>
                {getFieldDecorator('faultDescription',{
                  rules: [{
                    required : true,
                    message: '请输入...',
                  }],
                  initialValue: intelligentDetail.faultDescription || ''
                })(
                  <InputLimit style={{ marginLeft: -80 }} size={999} width={960} placeholder="请输入..." />
                )}
              </FormItem>
              <FormItem label="检查项目" colon={false}>
                 {getFieldDecorator('checkItems',{
                   rules: [{
                     required : true,
                     message: '请输入...',
                   }],
                   initialValue: intelligentDetail.checkItems || ''
                 })(
                   <InputLimit style={{ marginLeft: -80 }} size={999} width={960} placeholder="请输入..." />
                 )}
               </FormItem>
               <FormItem label="处理方法" colon={false}>
                 {getFieldDecorator('processingMethod',{
                   rules: [{
                     required : true,
                     message: '请输入...',
                   }],
                   initialValue: intelligentDetail.processingMethod || ''
                 })(
                   <InputLimit style={{ marginLeft: -80 }} size={999} width={960} placeholder="请输入..." />
                 )}
               </FormItem>
               <FormItem label="所需工具" colon={false}>
                 {getFieldDecorator('requiredTools',{
                   rules: [{
                     message: '请输入...',
                   }],
                   initialValue: intelligentDetail.requiredTools || ''
                 })(
                   <InputLimit style={{ marginLeft: -80 }} size={999} width={960} placeholder="请输入..." />
                 )}
               </FormItem>
               <FormItem label="备注" colon={false}>
                 {getFieldDecorator('remark',{
                   rules: [{
                     message: '请输入...',
                   }],
                   initialValue: intelligentDetail.remark || ''
                 })(
                   <InputLimit style={{ marginLeft: -80 }} size={999} width={960} placeholder="请输入..." />
                 )}
               </FormItem>
               <div className={styles.intelligentBottom}>
                 <div className={styles.otherInformation}>
                   <div className={styles.information}>
                     <span>录入人：</span>
                     <span className={styles.text}>{recorder || '无'}</span>
                     <span>更新时间：</span>
                     <span className={styles.text}>{moment(updateTime).format('YYYY-MM-DD') || '无'}</span>
                     <span>点赞数：</span>
                     <span className={styles.text}>{likeCount || '无'}</span>
                   </div>
                   <Button onClick={this.editBtn} className={styles.saveBtn}>保存</Button>
                 </div>
               </div>
              </Form>
            </div>
         </div>
      </div>
    )
  }
}

export default Form.create()(EditIntelligent);
