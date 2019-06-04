import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input, Form, Select, Icon, Modal, message } from 'antd';
import styles from '../deviceSide.scss';
const FormItem = Form.Item;
const Option = Select.Option;
class ShowAddDeviceModeModal extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  componentWillReceiveProps(nextProps) {
    const { checkDeviceModeOk, addDeviceTypeData, selectStation } = nextProps;
    if (checkDeviceModeOk !== this.props.checkDeviceModeOk && checkDeviceModeOk === true) {
      this.props.form.validateFieldsAndScroll(["addDeviceModeCodeName", "addManufacturer", "deviceTypeCode"], (err, values) => {
        if (!err) {
          this.props.addDeviceMode({
            deviceTypeCode: addDeviceTypeData.deviceTypeCode ? `${addDeviceTypeData.deviceTypeCode}` : `${values.deviceTypeCode}`,
            // deviceTypeCode:'202',
            deviceModeName: values.addDeviceModeCodeName,
            manufacturer: values.addManufacturer,
          })
          // this.props.getDeviceModel({
          //   // stationCode:selectStation?selectStation[0].stationCode:null,
          //   deviceTypeCode:this.props.selectdeviceType,
          // })
          // this.props.saveFormState(values)
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
    const { addDeviceTypeData } = this.props;
    this.props.form.validateFieldsAndScroll(["addDeviceModeCodeName", "addManufacturer", "deviceTypeCode"], (err, values) => {
      if (!err) {
        this.props.checkDeviceMode({
          deviceModeName: values.addDeviceModeCodeName,
          deviceTypeCode: addDeviceTypeData.deviceTypeCode ? addDeviceTypeData.deviceTypeCode : values.deviceTypeCode
        })
      }
    })

  }
  changeFactors=(value)=>{
    this.props.getfactorsDeviceMode({manufactorId:value})
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { showAddDeviceModeModal ,manufacturerValue,deviceFactorsList} = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };
    return (
      <Modal
        title="新增设备型号"
        visible={showAddDeviceModeModal}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        centered={true}
        mask={false}
        footer={null}
        closable
        maskClosable={false}
      >
        <Form className={styles.preFormStyle}>
          <FormItem label="设备厂家" colon={false} {...formItemLayout} >
            {getFieldDecorator('addManufacturer', {
              initialValue: manufacturerValue,
              rules: [
                { message: '不超过30字', required: true, },
              ]
            })(
              <Select className={styles.modelSelect} placeholder="请选择生产厂家" onChange={this.changeFactors} disabled={!!manufacturerValue}>
                <Option key={'all'} value={''}>请选择生产厂家</Option>
                {deviceFactorsList.map((e, i) => {
                  if (!e) { return null; } else {
                    return <Option key={e.manufactorCode} value={e.manufactorId}>{e.manufactorName}</Option>
                  }
                })}
              </Select>
            )}

          </FormItem>
          <FormItem label="设备型号" colon={false} {...formItemLayout}  >
            {getFieldDecorator('addDeviceModeCodeName', {
              rules: [
                { message: '设备型号不超过30字', required: true, type: 'string', max: 30 },
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
export default Form.create()(ShowAddDeviceModeModal)