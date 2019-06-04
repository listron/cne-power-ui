import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input, Form, Modal,  } from 'antd';
import styles from './partInfoBox.scss';
const FormItem = Form.Item;

class ShowAddDeviceModeModal extends Component {
  static propTypes = {
    cancleFactorModal: PropTypes.func,
    addPartsFactors: PropTypes.func,
    showAddfactorsModal: PropTypes.bool,
    form:PropTypes.object,
    deviceCode:PropTypes.string,
  }
  constructor(props, context) {
    super(props, context)
  }

  handleCancel = () => {
    this.props.cancleFactorModal()
  }
  confirmForm = (e) => {
    e.preventDefault();
    const { validateFieldsAndScroll } = this.props.form;
    const { addPartsFactors,deviceCode} = this.props;
    let deviceTypeCode=deviceCode.split('M')[1];
    validateFieldsAndScroll(["addFactorName",], (err, values) => {
      if (!err) {
        addPartsFactors({
          manufactorName: values.addFactorName,
          deviceTypeCode,
          assetsIds:['0'],
        })
        this.props.cancleFactorModal()
      }
    })

  }
 
  render() {
    const { getFieldDecorator,  } = this.props.form;
    const { showAddfactorsModal ,} = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };
    return (
      <Modal
        title="新增组件厂家"
        visible={showAddfactorsModal}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        centered={true}
        mask={false}
        footer={null}
        closable
        maskClosable={false}
      >
        <Form className={styles.preFormStyle}>
         
          <FormItem label="生产厂家" colon={false} {...formItemLayout}  >
            {getFieldDecorator('addFactorName', {
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