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
    const { addSuccess } = nextprops;
    let planValue =this.props.form.getFieldsValue();
    if (addSuccess !== this.props.addSuccess&&addSuccess===true) {
      this.props.saveFormState(planValue)
      this.props.cancleAddDeviceModal()
    }
  }
  handleCancel = () => {
    this.props.cancleAddDeviceModal()
  }


  confirmForm = (e) => {
    e.preventDefault();
    const { getFieldsValue } = this.props.form;
    const { stationDeviceTypes, saveFormState, cancleAddDeviceModal, addSuccess } = this.props;
    let planValue = getFieldsValue();
    this.props.form.validateFieldsAndScroll(["deviceTypeCode", "isPertain"], (err, values) => {
      // const deviceTypeNameArr = stationDeviceTypes.map(e => e.deviceTypeName);
      // console.log('deviceTypeNameArr: ', deviceTypeNameArr);
      // const modalConfirm = deviceTypeNameArr.includes(values.deviceTypeCode) ? 1 : 0;
      // console.log('modalConfirm: ', modalConfirm);
      if (!err) {
        this.props.addDeviceType({
          isPertain: values.isPertain,
          deviceTypeName: values.deviceTypeCode
        })
      
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
              {getFieldDecorator('deviceTypeCode', {
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
