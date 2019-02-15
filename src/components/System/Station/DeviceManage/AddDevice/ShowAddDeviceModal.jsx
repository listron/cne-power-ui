import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input, Form, Select, DatePicker, Icon, Modal } from 'antd';
import styles from '../deviceSide.scss';
const FormItem = Form.Item;
const Option = Select.Option;
class ShowAddDeviceModal extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  handleCancel=()=>{
    this.props.cancleAddDeviceModal()
  }
  handleOk=()=>{
    const { getFieldsValue } = this.props.form;
    
    let planValue = getFieldsValue();
   
    this.props.form.validateFieldsAndScroll((error, values)=>{
      if (!error) {
        console.log(planValue);
      }

    })
    this.props.cancleAddDeviceModal()
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {showAddDeviceModal}=this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };
    return (
      <Modal
        title="新增设备类型"
        visible={showAddDeviceModal}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        centered={true}
        mask={false}
        footer={null}
        closable={false}
        maskClosable={false}
      >
        <Form className={styles.preFormStyle}>
          <FormItem label="设备类型" colon={false} {...formItemLayout}  >
            {getFieldDecorator('deviceTypeName', {
              rules: [
                { message: '设备名称不超过30字', required: true, type: 'string', max: 30 },
              ]
            })(
              <Input placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem label="属于升压站" colon={false} {...formItemLayout} >
            {getFieldDecorator('belong', { initialValue: 'false' ,
              rules: [
                { message: '设备名称不超过30字', required: true, type: 'string', max: 30 },
              ]
            })(
              <Select>
                <Option value="true">是</Option>
                <Option value="false">否</Option>
              </Select>
            )}

          </FormItem>
          <Button type="primary" onClick={this.handleOk} className={styles.nextButton}>确定</Button>
        </Form>
      </Modal>
    )
  }
}
export default Form.create()(ShowAddDeviceModal)