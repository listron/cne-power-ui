import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input, Form, Select, DatePicker, Icon, Modal,message } from 'antd';
import styles from '../deviceSide.scss';
const FormItem = Form.Item;
const Option = Select.Option;
class ShowAddDeviceModal extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  handleCancel = () => {
    this.props.cancleAddDeviceModal()
  }

  confirmForm = (e) => {
    e.preventDefault();
    const { getFieldsValue } = this.props.form;
    const {stationDeviceTypes}=this.props;

    let planValue = getFieldsValue();
    this.props.form.validateFieldsAndScroll(["deviceTypeCode","belong"],(err,values)=>{
      console.log(values,'values');
      console.log(planValue, '1111');
     const test= stationDeviceTypes.map(e=>e.deviceTypeName);
     console.log('test: ', test);
    //  const haha=test.has(values.deviceTypeName)?1:0;
    //  console.log('haha: ', haha);

      if(!err){
        if(values.deviceTypeName==='test'){
          message.error('设备名称名称重复')
        }else{
          this.props.saveFormState(planValue)
          this.props.cancleAddDeviceModal()
        }
      }
    })
       


      

   
   
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { showAddDeviceModal } = this.props;
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
            {getFieldDecorator('belong', {
              initialValue: 'false',
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
          <Button type="primary" onClick={this.confirmForm} className={styles.nextButton}>确定</Button>
        </Form>
      </Modal>
    )
  }
}
export default Form.create()(ShowAddDeviceModal)