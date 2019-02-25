import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input, Form, Select,  Icon, Modal,message } from 'antd';
import styles from '../deviceSide.scss';
const FormItem = Form.Item;
const Option = Select.Option;
class ShowAddDeviceModeModal extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  componentWillReceiveProps(nextProps){
    const{checkDeviceModeOk,addDeviceTypeData}=nextProps;
    if(checkDeviceModeOk!==this.props.checkDeviceModeOk&&checkDeviceModeOk===true){
      this.props.form.validateFieldsAndScroll(["deviceModeCode","manufacturer"],(err,values)=>{
        if(!err){
          this.props.addDeviceMode({
            deviceTypeCode:addDeviceTypeData.deviceTypeCode,
            deviceModeName:values.deviceModeCode,
            manufacturer:values.manufacturer,
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
    const{addDeviceTypeData}=this.props;
    // const {stationDeviceTypes}=this.props;

   
    this.props.form.validateFieldsAndScroll(["deviceModeCode","manufacturer"],(err,values)=>{
      if(!err){
       this.props.checkDeviceMode({
        deviceModeName:values.deviceModeCode
       })
        
          // this.props.saveFormState(values)
          //  this.props.cancleDeviceModeModal()
       
      }
    })
  
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { showAddDeviceModeModal } = this.props;
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
          <FormItem label="设备型号" colon={false} {...formItemLayout}  >
            {getFieldDecorator('deviceModeCode', {
              rules: [
                { message: '设备型号不超过30字', required: true, type: 'string', max: 30 },
              ]
            })(
              <Input placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem label="生产厂家" colon={false} {...formItemLayout} >
            {getFieldDecorator('manufacturer', {
             
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
export default Form.create()(ShowAddDeviceModeModal)