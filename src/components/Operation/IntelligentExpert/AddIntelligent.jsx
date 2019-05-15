import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Form, Select, Cascader, Button, Input, Row, Col, } from 'antd';
import styles from './intelligentExpert.scss';
import WarningTip from '../../Common/WarningTip';
import InputLimit from '../../Common/InputLimit';

const Option = Select.Option;
const FormItem = Form.Item;

class AddIntelligent extends Component {
  static propTypes = {
    deviceTypes: PropTypes.array,
    defectTypes: PropTypes.array,
    intelligentTableData: PropTypes.array,
    getIntelligentExpertStore: PropTypes.func,
    addIntelligent: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    }
  }

  onWarningTipShow = () => {
    this.setState({
      showWarningTip: true,
    })
  }

  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
    this.props.getIntelligentExpertStore({
      showPage: 'list',
    });
  }

  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
  }

  saveHandler = () => { // 保存按钮
    const { form, getIntelligentExpertStore, intelligentTableData, addIntelligent } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        addIntelligent({
          deviceTypeCode: values.deviceTypeCode,
          defectTypeCode: values.defectTypeCode,
          faultDescription: values.faultDescription,
          checkItems: values.checkItems,
          processingMethod: values.processingMethod,
          requiredTools: values.requiredTools,
          remark: values.remark,
        })
      }

      const params = {
        // deviceTypeCode: "deviceTypeCode1",
        // deviceTypeName: "deviceTypeCode1",
        // faultName: "deviceTypeCode1",
        // faultTypeId: "deviceTypeCode1",
        // faultDescription: "deviceTypeCode1",
        // processingMethod: "deviceTypeCode1",
        // checkItems: "deviceTypeCode1",
        // requiredTools: "deviceTypeCode1",
        // processingMethod: "deviceTypeCode1",
        // update_time: "deviceTypeCode1",
        // like_count: "deviceTypeCode1",
        // knowledgeBaseId: "deviceTypeCode1",
        // remark:"deviceTypeCode1",
        // recorder: "deviceTypeCode1",
      };

      intelligentTableData.unshift(params);

      getIntelligentExpertStore({
        intelligentTableData,
        showPage: 'list',
      })
    });
  }

  render(){
    const { deviceTypes, defectTypes } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 16 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const { showWarningTip, warningTipText } = this.state; 
    let tmpGenTypes = [];
    defectTypes.forEach(e => e && e.list && e.list.length > 0 && tmpGenTypes.push(...e.list));
    const groupedLostGenTypes = [];
    tmpGenTypes.map(ele => {
      if (ele && ele.list && ele.list.length > 0) {
        let innerArr = { children: [] };
        innerArr.label = ele.name;
        innerArr.value = ele.id;
        ele.list.forEach(innerInfo => {
          innerArr.children.push({
            label: innerInfo.name,
            value: innerInfo.id,
          });
        })
        groupedLostGenTypes.push(innerArr);
      }
    })

    return (
      <div className={styles.addIntelligent}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.addTop}>
          <span className={styles.text}>添加</span>
          <Icon 
          type="arrow-left" 
          className={styles.backIcon} 
          onClick={this.onWarningTipShow} 
          />
        </div>
        <Form {...formItemLayout} className={styles.preFormStyle}>
          <FormItem label="设备类型">
            {getFieldDecorator('deviceTypeCode', {
              rules: [{ required: true, message: '请选择' }],
              initialValue: deviceTypes.deviceTypeCode || null
            })(
              <Select 
                style={{ width: 198 }} 
                placeholder="请选择" 
                onChange={this.onChangeDeviceType}>
                {deviceTypes.map(e => (<Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>))}
              </Select>
            )}
          </FormItem>
          <FormItem label="缺陷类型" className={styles.formItem}>
            {getFieldDecorator('defectTypeCode', {
              rules: [{ required: true, message: '请选择' }],
            })(
              <Cascader
                // disabled={deviceTypeCode.length === 0}
                style={{ width: 200 }}
                options={groupedLostGenTypes}
                expandTrigger="hover"
                placeholder="请选择"
              />
            )}
          </FormItem>
          <FormItem className={styles.formItem} label="缺陷描述">
            {getFieldDecorator('faultDescription', {
              rules: [{
                required: true,
                message: '请输入...'
              },{
                validator: (rule, value, callback)=>{
                  if(value.trim().length > 999){
                    callback('不超过999个字');
                  }else{
                    callback();
                  }
                }
              }],
            })(
              <InputLimit style={{ marginLeft: -80, marginTop: 15 }} size={999} width={960} placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem className={styles.formItem} label="检查项目">
            {getFieldDecorator('checkItems', {
              rules: [{
                required: true,
                message: '请输入...'
              },{
                validator: (rule, value, callback)=>{
                  if(value.trim().length > 999){
                    callback('不超过999个字');
                  }else{
                    callback();
                  }
                }
              }],
            })(
              <InputLimit style={{ marginLeft: -80, marginTop: 15 }} size={999} width={960} placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem className={styles.formItem} label="处理方法">
            {getFieldDecorator('processingMethod', {
              rules: [{
                required: true,
                message: '请输入...'
              },{
                validator: (rule, value, callback)=>{
                  if(value.trim().length > 999){
                    callback('不超过999个字');
                  }else{
                    callback();
                  }
                }
              }],
            })(
              <InputLimit style={{ marginLeft: -80, marginTop: 15 }} size={999} width={960} placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem className={styles.formItem} label="所需工具">
            {getFieldDecorator('requiredTools', {
              rules: [{
                message: '请输入...'
              },{
                validator: (rule, value, callback)=>{
                  if(value.trim().length > 999){
                    callback('不超过999个字');
                  }else{
                    callback();
                  }
                }
              }],
            })(
              <InputLimit style={{ marginLeft: -80, marginTop: 15 }} size={999} width={960} placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem className={styles.formItem} label="备注">
            {getFieldDecorator('remark', {
              rules: [{
                message: '请输入...'
              },{
                validator: (rule, value, callback)=>{
                  if(value.trim().length > 999){
                    callback('不超过999个字');
                  }else{
                    callback();
                  }
                }
              }],
            })(
              <InputLimit style={{ marginLeft: -80, marginTop: 15 }} size={999} width={960} placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem className={styles.actionBtn}>
            <Button onClick={this.saveHandler} className={styles.savePassword}>保存</Button>
            <Button >保存并继续添加</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(AddIntelligent);
