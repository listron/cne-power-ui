import React, { Component } from 'react';
import { Form, Modal, DatePicker, Select } from 'antd';
import PropTypes from 'prop-types';
import styles from './realTimeWarning.scss';
import InputLimit from '../../../Common/InputLimit';
import WarningTip from '../../../Common/WarningTip';
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select;



class HandleRemoveModal extends Component {
  static propTypes = {
    form: PropTypes.object,
    HandleRemoveWarning: PropTypes.func,
    onCancel: PropTypes.func,
    selectedRowKeys: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
      timeType: 'sevenDay',
      endTime: moment().add(7, 'days').utc().format()
    };
  }

  onSubmit = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '点击确定，解除预警'
    });
  }
  onCancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip: false
    })
  }
  onChangeDuration = (value) => {
    console.log(value);
    this.setState({
      timeType: value,
    })

    let endTime;
    if (value === 'sevenDay') {
      endTime = moment().add(7, 'days').utc().format('');
    } else if (value === 'oneDay') {
      endTime = moment().add(1, 'days').utc().format();
    } else if (value = 'threeDay') {
      endTime = moment().add(3, 'days').utc().format('');
    }
    this.setState({
      endTime: endTime,
    })


  }
  HandleRemoveWarning = () => {
    const {  endTime } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      const recordValue = values.endTime ? values.endTime : endTime
      if (!err) {
        this.props.HandleRemoveWarning({
          endTime: recordValue,
          operateReason: values.operateReason,
          warningLogId: this.props.selectedRowKeys,
        });
        this.props.onCancel();
      }
      this.setState({ showWarningTip: false });
    });
  }
  disabledDate=(current)=>{
    return current && current < moment().endOf('day');
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { showWarningTip, warningTipText, timeType } = this.state;
    return (
      <Form>
        {showWarningTip && <WarningTip
          hiddenCancel={false}
          style={{ marginTop: '280px', width: '210px', height: '88px' }}
          onCancel={this.onCancelWarningTip}
          onOK={this.HandleRemoveWarning} value={warningTipText} />}
        <Modal title="手动解除预警" className={styles.relieveModal}
          style={{ minHeight: 450 }}
          bodyStyle={{ display: 'flex', flex: 1, flexDirection: 'column', padding: 24 }}
          width={625}
          onOk={this.onSubmit}
          okText='保存'
          visible={true}
          onCancel={this.props.onCancel}>
          <FormItem className={styles.formItemTime} label="截止时间">
            <Select className={styles.duration} style={{ width: 120 }} value={timeType} onChange={this.onChangeDuration}>
              <Option value="oneDay">1天</Option>
              <Option value="threeDay">3天</Option>
              <Option value="sevenDay">7天</Option>
              <Option value="other">其他</Option>
            </Select>
            {timeType === 'other' ? <div>
              {getFieldDecorator('endTime', {
                rules: [{
                  required: true,
                  message: '请输入解除时间'
                }],
              })(
                <DatePicker placeholder="请输入" disabledDate={this.disabledDate} />
              )}
            </div> : ''}
          </FormItem>
          <FormItem className={styles.formItemReason} label="解除原因">
            {getFieldDecorator('operateReason', {
              rules: [{
                required: true,
                message: '请输入解除原因'
              }],
            })(
              <InputLimit style={{ marginLeft: -80, marginTop: 15 }} placeholder="请输入不超过80字的解除原因..." />
            )}
          </FormItem>
          <div className={styles.instructionText}>注意：保存后，此设备的同类预警在所选时限内均被解除。</div>
        </Modal>
      </Form>
    );
  }
}

export default Form.create()(HandleRemoveModal);
