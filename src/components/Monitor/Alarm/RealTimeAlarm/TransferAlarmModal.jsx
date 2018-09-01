import React, { Component } from 'react';
import { Select, Form, Modal } from 'antd';
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
          warningLogId: this.props.selectedRowKeys,
        });
      }
    });
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { showWarningTip, warningTipText } = this.state;
    return (     
      <Form>
        {showWarningTip && <WarningTip
          style={{marginTop:'250px',width: '210px',height:'88px'}} 
          onOK={this.onTransferAlarm} value={warningTipText} />}
        <Modal title="转缺陷工单"
          className={styles.transferModal}
          style={{height:630}}
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
              <Select placeholder="请选择" style={{width:200}}>
                {this.props.defectTypes.map((item, i) => {
                  return (
                    <Option key={i} value={item.get('defectTypeCode')}>{item.get('defectTypeName')}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem className={styles.formItem} label="缺陷描述">
            {getFieldDecorator('defectDescribe', {
              rules: [{ 
                required: true,
                message: '请输入缺陷描述'
              }],
            })(
              <InputLimit style={{marginLeft:-60,marginTop:15}} placeholder="请输入不超过80字的缺陷描述..." />
            )}
          </FormItem>
          <div className={styles.instructionText}>注意：保存后，多条告警将转为多个消缺工单。</div>
        </Modal>
      </Form>
    );
  }
}

export default Form.create()(TransferAlarmModal);
