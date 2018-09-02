import React, { Component } from 'react';
import { Form, Modal, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import styles from './realTimeAlarm.scss';
import InputLimit from '../../../Common/InputLimit';
import WarningTip from '../../../Common/WarningTip';
import moment from 'moment';
const FormItem = Form.Item;



class RelieveAlarmModal extends Component {
  static propTypes = {
    form: PropTypes.object,
    onRelieveAlarm: PropTypes.func,
    onCancel: PropTypes.func,
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
          operateReason: values.operateReason,
          endTime: moment('2020-12-31 23:59:59').utc().format(),
          warningLogId: this.props.selectedRowKeys,
        });
      }
    });
  }

  cancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip:false
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { showWarningTip, warningTipText } = this.state;
    return (     
      <Form>
        {showWarningTip && <WarningTip
          hiddenCancel={false} 
          style={{marginTop:'250px',width: '210px',height:'88px'}}
          onCancel={this.cancelWarningTip}
          onOK={this.onRelieveAlarm} value={warningTipText} />}
        <Modal title="解除告警" className={styles.relieveModal}
          style={{minHeight:450}}
          bodyStyle={{display:'flex',flex:1,flexDirection:'column',padding:24}}
          width={625}
          onOk={this.onSubmit}
          visible={true}
          onCancel={this.props.onCancel}>
          {/* <FormItem className={styles.formItem} label="解除时限">
            {getFieldDecorator('endTime', {
              rules: [{ 
                required: true,
                message: '请输入解除时限'
              }],
            })(
              <DatePicker placeholder="请输入" />
            )}
          </FormItem> */}
          <FormItem  className={styles.formItem} label="解除原因">
            {getFieldDecorator('operateReason', {
              rules: [{ 
                required: true,
                message: '请输入解除原因'
              }],
            })(
              <InputLimit style={{marginLeft:-60,marginTop:15}} placeholder="请输入不超过80字的解除原因..." />
            )}
          </FormItem>
          <div className={styles.instructionText}>注意：保存后，此设备的同类告警在所选时限内均被解除。</div>
        </Modal>
      </Form>
    );
  }
}

export default Form.create()(RelieveAlarmModal);
