import React, { Component } from 'react';
import { Form, Modal, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import styles from './realTimeAlarm.scss';
import InputLimit from '../../../Common/InputLimit';
import WarningTip from '../../../Common/WarningTip';
const FormItem = Form.Item;



class RelieveAlarmModal extends Component {
  static propTypes = {
    form: PropTypes.object,
    onRelieveAlarm: PropTypes.func,
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
      warningTipText: '点击确定，解除告警'
    });
  }

  onRelieveAlarm = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        this.props.onRelieveAlarm({
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
        {showWarningTip && <WarningTip onOK={this.onRelieveAlarm} value={warningTipText} />}
        <Modal title="解除告警" 
          visible={true}
          okButtonProps={{
            type: 'primary',
            htmlType: 'submit'
          }}
          onCancel={this.handleCancel}>
          <FormItem label="解除时限">
            {getFieldDecorator('endTime', {
              rules: [{ 
                required: true,
                message: '请输入解除时限'
              }],
            })(
              <DatePicker placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="解除原因">
            {getFieldDecorator('defectDesc', {
              rules: [{ 
                required: true,
                message: '请输入解除原因'
              }],
            })(
              <InputLimit placeholder="请输入不超过80字的解除原因..." />
            )}
          </FormItem>
          <div style={{marginLeft:410}} className={styles.instructionText}>注意：保存后，此设备的同类告警在所选时限内均被解除</div>
        </Modal>
      </Form>
    );
  }
}

export default Form.create()(RelieveAlarmModal);
