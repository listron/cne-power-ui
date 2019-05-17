import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input, Form, Select, DatePicker, Icon, Modal, message } from 'antd';
import styles from '../deviceSide.scss';
const FormItem = Form.Item;
const Option = Select.Option;
class ShowAddDeviceModal extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      isShowConfirmModal: false
    }
  }
  componentWillReceiveProps(nextprops) {
    const { addSuccess, checkDeviceTypeok, selectStation,form } = nextprops;
    let planValue = this.props.form.getFieldsValue();
    if (checkDeviceTypeok !== this.props.checkDeviceTypeok && checkDeviceTypeok === true) {
      this.props.form.validateFieldsAndScroll(["addDeviceTypeCodeName", "isPertain"], (err, values) => {
        if (!err) {
          this.props.addDeviceType({
            stationCode: this.props.selectStation,
            isPertain: values.isPertain,
            deviceTypeName: values.addDeviceTypeCodeName
          })
          this.props.saveFormState(planValue)
          this.props.cancleAddDeviceModal()
          if(addSuccess){
            form.resetFields("deviceTypeCode");
          }
        }
      })
    }
   
  }
  handleCancel = () => {
    this.props.cancleAddDeviceModal()
  }
  confirmForm = (e) => {
    e.preventDefault();
    const { getFieldsValue } = this.props.form;
    const { stationDeviceTypes, saveFormState, cancleAddDeviceModal, addSuccess, selectStation } = this.props;
    console.log('selectStation: ', selectStation);
    this.props.changeDeviceManageStore({checkDeviceTypeok:null})
    this.props.form.validateFieldsAndScroll(["addDeviceTypeCodeName", "isPertain"], (err, values) => {
      if (!err) {
        this.props.checkDeviceType({ deviceTypeName: values.addDeviceTypeCodeName })
      }
    })
  }
  render() {
    const { isShowConfirmModal } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { showAddDeviceModal } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };
    return (
      <div>
        <Modal
          title="新增设备类型"
          visible={showAddDeviceModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          centered={true}
          mask={false}
          footer={null}
          closable
          maskClosable={false}
        >
          <Form className={styles.preFormStyle}>
            <FormItem label="设备类型" colon={false} {...formItemLayout}  >
              {getFieldDecorator('addDeviceTypeCodeName', {
                rules: [
                  { message: '设备名称不超过30字', required: true, type: 'string', max: 30 },
                ]
              })(
                <Input placeholder="请输入..." />
              )}
            </FormItem>
            <FormItem label="属于升压站" colon={false} {...formItemLayout} >
              {getFieldDecorator('isPertain', {
                initialValue: '0',
                rules: [
                  { message: '设备名称不超过30字', required: true, type: 'string', max: 30 },
                ]
              })(
                <Select>
                  <Option value="1">是</Option>
                  <Option value="0">否</Option>
                </Select>
              )}
            </FormItem>
            <Button type="primary" onClick={this.confirmForm} className={styles.nextButton}>确定</Button>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(ShowAddDeviceModal)
