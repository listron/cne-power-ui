import React, { Component } from 'react';
import { Select, Form, Modal, Cascader } from 'antd';
import PropTypes from 'prop-types';
import styles from './realTimeAlarm.scss';
import InputLimit from '../../../Common/InputLimit';
import WarningTip from '../../../Common/WarningTip';
const FormItem = Form.Item;
const Option = Select.Option;


class TransferAlarmModal extends Component {
  static propTypes = {
    form: PropTypes.object,
    onTransferAlarm: PropTypes.func,
    defectTypes: PropTypes.object,
    selectedRowKeys: PropTypes.array,
    onCancel: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: ''
    };
  }

  onSubmit = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '确定是否要转工单'
    });
  }

  onTransferAlarm = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        this.props.onTransferAlarm({
          ...values,
          defectTypeCode: values.defectTypeCode[1],
          warningLogId: this.props.selectedRowKeys,
        });
        this.props.onCancel();
      }
    });
    this.setState({showWarningTip: false});
  }

  onCancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip:false
    })
  }

  render(){
    const { defectTypes } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { showWarningTip, warningTipText } = this.state;
    let tmpGenTypes = [];
    console.log(defectTypes)
    console.log(defectTypes.toJS())
    defectTypes.toJS().forEach(e=>e && e.list && e.list.length > 0 && tmpGenTypes.push(...e.list));
    const groupedLostGenTypes = tmpGenTypes.map(ele=>{
      let innerArr = {children: []};
      innerArr.label= ele.name;
      innerArr.value= ele.id;
      ele && ele.list && ele.list.length > 0 && ele.list.forEach(innerInfo => {
        innerArr.children.push({
          label: innerInfo.name,
          value: innerInfo.id,
        });
      })
      return innerArr;
    })
    return (     
      <Form>
        {showWarningTip && <WarningTip
          hiddenCancel={false}
          onCancel={this.onCancelWarningTip}
          style={{marginTop:'300px',width: '210px',height:'88px'}} 
          onOK={this.onTransferAlarm} value={warningTipText} />}
        <Modal title="转缺陷工单"
          className={styles.transferModal}
          style={{minHeight:450}}
          bodyStyle={{display:'flex',flex:1,flexDirection:'column',padding:24}}
          width={625}
          visible={true}
          onOk={this.onSubmit}
          onCancel={this.props.onCancel}>
          <FormItem className={styles.formItem} label="缺陷类型">
            {getFieldDecorator('defectTypeCode', {
              rules: [{ 
                required: true,
                message: '请选择缺陷类型'
              }],
            })(
              <Cascader
                disabled={groupedLostGenTypes.length === 0}
                style={{ width: 200 }}
                options={groupedLostGenTypes}
                expandTrigger="hover"
                placeholder="请选择"
              />
            )}
          </FormItem>
          <FormItem className={styles.formItem} label="缺陷描述">
            {getFieldDecorator('defectDescribe', {
              rules: [{ 
                required: true,
                message: '请输入缺陷描述'
              }],
            })(
              <InputLimit style={{marginLeft:-80,marginTop:15}} placeholder="请输入不超过80字的缺陷描述..." />
            )}
          </FormItem>
          <div className={styles.instructionText}>注意：保存后，多条告警将转为多个消缺工单。</div>
        </Modal>
      </Form>
    );
  }
}

export default Form.create()(TransferAlarmModal);
