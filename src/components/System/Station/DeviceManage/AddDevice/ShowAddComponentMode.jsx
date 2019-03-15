import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input, Form, Select, Icon, Modal, message } from 'antd';
import styles from '../deviceSide.scss';
const FormItem = Form.Item;
const Option = Select.Option;
class ShowAddComponentMode extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  componentWillReceiveProps(nextProps) {
    const { checkDeviceModeOk, addDeviceTypeData,selectStation } = nextProps;
    console.log('selectStation: ', selectStation);
    console.log('addDeviceTypeData: ', addDeviceTypeData);
    if (checkDeviceModeOk !== this.props.checkDeviceModeOk && checkDeviceModeOk === true) {
      this.props.form.validateFieldsAndScroll(["addComponentMode", "addmanufacturerCom", "deviceTypeCode"], (err, values) => {
        console.log('values: ', values);
        if (!err) {
          this.props.addPvDeviceMode({
            // deviceTypeCode:addDeviceTypeData.deviceTypeCode?`${addDeviceTypeData.deviceTypeCode}`:`${values.deviceTypeCode}`,
            deviceTypeCode: '509',
            deviceModeName: values.addComponentMode,
            manufacturer: values.addmanufacturerCom,
          })
          this.props.saveFormState(values)
          this.props.cancleDeviceModeModal()
        }
      })
    }
  }
  handleCancel = () => {
    this.props.cancleDeviceModeModal()
  }
  confirmForm = (e) => {
    e.preventDefault();
    const { getFieldsValue } = this.props.form;
    // const {stationDeviceTypes}=this.props;
    this.props.form.validateFieldsAndScroll(["addComponentMode", "addmanufacturerCom"], (err, values) => {
      if (!err) {
        this.props.checkDeviceMode({
          deviceModeName: values.addComponentMode,
          deviceTypeCode: 509
        })
      }
    })
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { showAddComponentMode } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };
    return (
      <Modal
        title="新增组件型号"
        visible={showAddComponentMode}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        centered={true}
        mask={false}
        footer={null}
        closable
        maskClosable={false}
      >
        <Form className={styles.preFormStyle}>
          <FormItem label="组件型号" colon={false} {...formItemLayout}  >
            {getFieldDecorator('addComponentMode', {
              rules: [
                { message: '设备型号不超过30字', required: true, type: 'string', max: 30 },
              ]
            })(
              <Input placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem label="生产厂家" colon={false} {...formItemLayout} >
            {getFieldDecorator('addmanufacturerCom', {
              rules: [
                { message: '不超过30字', required: true, type: 'string', max: 30 },
              ]
            })(
              <Input placeholder="请输入..." />
            )}
          </FormItem>
          <Button type="primary" onClick={this.confirmForm} className={styles.nextButton}>确定</Button>
        </Form>
      </Modal>
    )
  }
}
export default Form.create()(ShowAddComponentMode)