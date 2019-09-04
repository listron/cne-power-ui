import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Form, Select, Cascader, Button } from 'antd';
import styles from './intelligentExpert.scss';
import WarningTip from '../../Common/WarningTip';
import InputLimit from '../../Common/InputLimit';

const Option = Select.Option;
const FormItem = Form.Item;

class AddIntelligent extends Component {
  static propTypes = {
    deviceTypes: PropTypes.array,
    defectTypes: PropTypes.array,
    listParams: PropTypes.object,
    form: PropTypes.object,
    getIntelligentExpertStore: PropTypes.func,
    getIntelligentTable: PropTypes.func,
    addIntelligent: PropTypes.func,
    changeCommonStore: PropTypes.func,
    getLostGenType: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存！',
      deviceTypeCode: '',
    }
  }

  onChangeDeviceType = (deviceTypeCode) => { // 选择设备类型
    let params = { deviceTypeCode };
    this.setState({ deviceTypeCode: deviceTypeCode });
    this.props.changeCommonStore(params);
    this.props.form.setFieldsValue({ defectTypeCode: null, deviceCode: null });
    this.props.getLostGenType({
      objectType: 1,
      deviceTypeCode
    })
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

  saveHandler = () => { // 保存按钮
    const { form, addIntelligent, getIntelligentTable, listParams } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        const { deviceTypeCode, defectTypeCode, faultDescription, checkItems, processingMethod, requiredTools, remark } = values;
        addIntelligent({
          deviceTypeCode: deviceTypeCode,
          defectTypeCode: defectTypeCode[1],
          faultDescription: faultDescription,
          checkItems: checkItems,
          processingMethod: processingMethod,
          requiredTools: requiredTools,
          remark: remark,
          continueAdd: false,
        })
      }
    });
    getIntelligentTable({ // 返回列表页面时重新请求列表数据 && 改变排序字段和排序方式
      ...listParams,
      orderField: "update_time", 
      sortMethod: "desc",
    })
  }

  saveAndAddHandler = () => { // 保存并继续添加
    const { form, addIntelligent } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        addIntelligent({
          deviceTypeCode: values.deviceTypeCode,
          defectTypeCode: values.defectTypeCode[1],
          faultDescription: values.faultDescription,
          checkItems: values.checkItems,
          processingMethod: values.processingMethod,
          requiredTools: values.requiredTools,
          remark: values.remark,
          continueAdd: true,
        })
        form.resetFields();
      }
    });
  }



  render(){
    const { showWarningTip, warningTipText } = this.state; 
    const { deviceTypes, defectTypes } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const deviceTypeCode = getFieldValue('deviceTypeCode');  // 设备code
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
        <div className={styles.titleTop}>
          <span className={styles.text}>添加</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onWarningTipShow} />
        </div>
        <Form className={styles.preFormStyle}>
          <FormItem label="设备类型" colon={false}>
            {getFieldDecorator('deviceTypeCode', {
              rules: [{ required: true, message: '请选择' }],
              initialValue: deviceTypes.deviceTypeCode || null
            })(
              <Select 
                style={{ width: 360 }} 
                placeholder="请选择" 
                onChange={this.onChangeDeviceType}>
                {deviceTypes.map(e => (
                <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>
                {e.deviceTypeName}</Option>))}
              </Select>
            )}
          </FormItem>
          <FormItem label="缺陷类型" className={styles.formItem} colon={false}>
            {getFieldDecorator('defectTypeCode', {
              rules: [{ required: true, message: '请选择' }],
            })(
              <Cascader
                disabled={!deviceTypeCode}
                style={{ width: 360 }}
                options={groupedLostGenTypes}
                expandTrigger="hover"
                placeholder="请选择"
              />
            )}
          </FormItem>
          <FormItem className={styles.formItem} label="缺陷描述" colon={false}>
            {getFieldDecorator('faultDescription', {
              rules: [{ required: true, message: '请输入缺陷描述'}],
            })(
              <InputLimit style={{ marginLeft: -80 }} size={999} width={960} placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem className={styles.formItem} label="检查项目" colon={false}>
            {getFieldDecorator('checkItems', {
              rules: [{ required: true, message: '请输入检查项目' }],
            })(
              <InputLimit style={{ marginLeft: -80 }} size={999} width={960} placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem className={styles.formItem} label="处理方法" colon={false}>
            {getFieldDecorator('processingMethod', {
              rules: [{ required: true, message: '请输入处理方法' }],
            })(
              <InputLimit style={{ marginLeft: -80 }} size={999} width={960} placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem className={styles.formItem} label="所需工具" colon={false}>
            {getFieldDecorator('requiredTools', {
              rules: [{
                message: '请输入...',
              }],
            })(
              <InputLimit style={{ marginLeft: -80 }} size={999} width={960} placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem className={styles.formItem} label="备注">
            {getFieldDecorator('remark', {
              rules: [{ 
                message: '请输入......',
                conlon: false
               }]
            })(
              <InputLimit style={{ marginLeft: -80 }} size={999} width={960} placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem className={styles.actionBtn}>
            <Button onClick={this.saveHandler} className={styles.saveBtn}>保存</Button>
            <Button onClick={this.saveAndAddHandler} className={styles.saveAndAddHandler}>保存并继续添加</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(AddIntelligent);
