import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Form, Button, Upload, Select, Row, Col,message } from 'antd';
const FormItem = Form.Item;
const { Option } = Select;


class ImportDevice extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  cancelModal = () => {
    //this.setState({ showAddRecordModal: false })
    this.props.cancelModal()
    
  }
  confirmAddRecord = () => {
    // this.setState({ showAddRecordModal: false })

    const { getFieldsValue } = this.props.form;
    let recordValue = getFieldsValue(['select', 'upload']);
   
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.props.cancelModal()
      }

    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
       this.confirmAddRecord()
      }
    });
  }
  render() {
    const { showModal } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const props={
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 文件上传成功`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上传失败.`);
        }
      },
    }
    return (
      <div>
        <Modal
          title={`批量导入设备`}
          visible={showModal}
          destroyOnClose={true}
          onOk={this.confirmModal}
          footer={null}
          onCancel={this.cancelModal}
          mask={false}
          centered={true}
          closable={false}
          maskClosable={false} >
          <Form onSubmit={this.handleSubmit}>
            <Form.Item
              {...formItemLayout}
              label="请选择电站"

            >
              {getFieldDecorator('select', {
                rules: [
                  { required: true, message: '请选择电站' },
                ],
              })(
                <Select placeholder="请选择电站">
                  <Option value="china">China</Option>
                  <Option value="usa">U.S.A</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="附件"
            >
              {getFieldDecorator('upload', {
                rules: [
                  { required: true, message: '请上传文件' },
                ],
              })(
                <Upload {...props} >
                  <Button type="primary" >选择文件</Button>
                  <span>支持xls、xlsx文件</span>
                </Upload >
              )}

            </Form.Item>
            <Form.Item
              wrapperCol={{ span: 12, offset: 6 }}
            >
              <Button type="primary" htmlType="submit">导入</Button>
            </Form.Item>
          </Form>

        </Modal>
      </div>
    )
  }
}
export default Form.create()(ImportDevice)