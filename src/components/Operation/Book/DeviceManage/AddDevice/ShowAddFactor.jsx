import React, { Component } from "react";
import PropTypes from "prop-types";
import { Input, Form, Select, Icon, Modal, message } from 'antd';
import styles from '../deviceSide.scss';
import CneButton from '@components/Common/Power/CneButton';
const FormItem = Form.Item;
const Option = Select.Option;
class ShowAddDeviceModeModal extends Component {
  static propTypes = {
    cancleFactorModal: PropTypes.func,
    form: PropTypes.object,
    addDeviceFactors: PropTypes.func,
    showAddfactorsModal: PropTypes.bool,
  }
  constructor(props, context) {
    super(props, context)
  }

  handleCancel = () => {
    this.props.cancleFactorModal()
  }
  confirmForm = (e) => {
    e.preventDefault();
    const { selectdeviceType } = this.props;
    this.props.form.validateFieldsAndScroll(["addFactorName",], (err, values) => {
      if (!err) {
        this.props.addDeviceFactors({
          manufactorName: values.addFactorName,
          deviceTypeCode:selectdeviceType,
          assetsIds:[''],
        })
        this.props.cancleFactorModal()
      }
    })

  }
 
  render() {
    const { getFieldDecorator,  } = this.props.form;
    const { showAddfactorsModal} = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };
    return (
      <Modal
        title="新增设备厂家"
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
         
          <FormItem label="设备厂家" colon={false} {...formItemLayout}  >
            {getFieldDecorator('addFactorName', {
              rules: [
                { message: '设备型号不超过30字', required: true, type: 'string', max: 30 },
              ]
            })(
              <Input placeholder="请输入..." />
            )}
          </FormItem>

          <CneButton onClick={this.confirmForm} className={styles.nextButton}>确定</CneButton>
        </Form>
      </Modal>
    )
  }
}
export default Form.create()(ShowAddDeviceModeModal)