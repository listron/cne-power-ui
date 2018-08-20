




import React, { Component } from 'react';
import { Select, Form, Modal } from 'antd';
import PropTypes from 'prop-types';
import styles from './role.scss';
import InputLimit from '../../../Common/InputLimit';
const FormItem = Form.Item;


class TransferAlarmModal extends Component {
  static propTypes = {
    form: PropTypes.object,
    onTransferAlarm: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    return (     
      <Form onSubmit={this.onSubmit}>
        <Modal title="转缺陷工单" 
          visible={true}
          okButtonProps={{
            type: 'primary',
            htmlType: 'submit'
          }}
          onCancel={this.handleCancel}>
          <FormItem label="缺陷类型">
            {getFieldDecorator('defectType', {
              rules: [{ 
                required: true,
                message: '请选择缺陷类型'
              }],
            })(
              <Select placeholder="请输入..." />
            )}
          </FormItem>
          <div style={{marginLeft:410}} className={styles.instructionText}>选择“保存”按钮后将跳转到对应的列表页；选择“保存并继续添加”按钮将会停留在添加页面</div>
        </Modal>
      </Form>
    );
  }
}

export default Form.create()(TransferAlarmModal);
