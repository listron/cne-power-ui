import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input, Form, Select,  Icon, Modal,message } from 'antd';
import styles from '../deviceSide.scss';
const FormItem = Form.Item;
const Option = Select.Option;
class ShowAddComponentMode extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  handleCancel = () => {
    this.props.cancleDeviceModeModal()
  }

  confirmForm = (e) => {
    e.preventDefault();
    const { getFieldsValue } = this.props.form;
    // const {stationDeviceTypes}=this.props;

   
    this.props.form.validateFieldsAndScroll(["componentMode","manufacturerCom"],(err,values)=>{
      console.log(values,'values');
   
      if(!err){
        if(values.deviceTypeName==='test'){
          message.error('设备名称名称重复')
        }else{
          this.props.saveFormState(values)
           this.props.cancleDeviceModeModal()
        }
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
        title="新增组件型号"
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
          <FormItem label="组件型号" colon={false} {...formItemLayout}  >
            {getFieldDecorator('componentMode', {
              rules: [
                { message: '设备型号不超过30字', required: true, type: 'string', max: 30 },
              ]
            })(
              <Input placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem label="生产厂家" colon={false} {...formItemLayout} >
            {getFieldDecorator('manufacturerCom', {
             
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