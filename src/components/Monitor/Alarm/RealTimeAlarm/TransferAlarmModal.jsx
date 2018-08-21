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
          warningLogId: this.props.selectedRowKeys.join(','),
        });
      }
    });
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { showWarningTip, warningTipText } = this.state;
    return (     
      <Form onSubmit={this.onSubmit}>
        {showWarningTip && <WarningTip onOK={this.onTransferAlarm} value={warningTipText} />}
        <Modal title="转缺陷工单" 
          visible={true}
          okButtonProps={{
            type: 'primary',
            htmlType: 'submit'
          }}
          onCancel={this.handleCancel}>
          <FormItem label="缺陷类型">
            {getFieldDecorator('defectTypeCode', {
              rules: [{ 
                required: true,
                message: '请选择缺陷类型'
              }],
            })(
              <Select placeholder="请选择" >
                {this.props.defectTypes.map(item => {
                  return (
                    <Option value={item.get('defectTypeCode')}>{item.get('defectTypeName')}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem label="缺陷描述">
            {getFieldDecorator('defectDesc', {
              rules: [{ 
                required: true,
                message: '请输入缺陷描述'
              }],
            })(
              <InputLimit placeholder="请输入不超过80字的缺陷描述..." />
            )}
          </FormItem>
          <div style={{marginLeft:410}} className={styles.instructionText}>注意：保存后，多条告警将转为多个消缺工单</div>
        </Modal>
      </Form>
    );
  }
}

export default Form.create()(TransferAlarmModal);
