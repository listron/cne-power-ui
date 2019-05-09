import React from "react";
import PropTypes from "prop-types";
import styles from "./assetStructure.scss";
import WarningTip from '../../../../Common/WarningTip';

import { Button, Input, Form, Icon, Select, InputLimit } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class AddNodeFrom extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showWarningTip: false,
      warningTipText: '',
    }
  }
  onConfirmWarningTip = () => {

    this.setState({
      showWarningTip: false,
      warningTipText: ''
    });
    this.props.closeFrom();
  }

  onCancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip: false
    });
  }
  submitForm = (e) => {
    // this.props.form.validateFieldsAndScroll((err, values) => {
    //   if (!err) {
    //   console.log('发送请求，并且刷新别的数据')
    //   }
    // });
  }
  closeFrom = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '确定关闭,关闭后数据不会被保存'
    })
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { showWarningTip, warningTipText } = this.state;
    return (
      <div className={styles.addNodeFrom}>
        <div className={styles.title}>
          <div className={styles.leftText}>添加子节点</div>
          <div className={styles.iconstyles} onClick={this.closeFrom}><Icon type="close" /></div>
        </div>
        {showWarningTip && <WarningTip
          style={{ marginTop: '350px', width: '240px', height: '88px' }}
          onCancel={this.onCancelWarningTip}
          hiddenCancel={false}
          onOK={this.onConfirmWarningTip}
          value={warningTipText} />}
        <div className={styles.contantBox}>
          <div className={styles.contant}>
            <Form className={styles.editPart}>
              <FormItem className={styles.formItemStyle} colon={false} label="父节点名称">
                {getFieldDecorator('parentNodeName', {
                  rules: [{
                    required: true,
                    message: '请输入缺陷描述'
                  }],
                })(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>


              <FormItem label="节点名称" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('nameNode', {
                  rules: [{ required: true, message: '请正确填写,不超过30字', type: "string", max: 30, }],
                })(
                  <Input placeholder="30字以内" />
                )}
              </FormItem>

              <FormItem label="分类" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('nodeType', {
                  rules: [{ required: true, message: '请正确填写,不超过30字', type: "string", max: 30, }],
                })(
                  <Input placeholder="30字以内" />
                )}
              </FormItem>
              <FormItem label="计量单位" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('valueUnit', {
                  rules: [{ required: true, message: '请正确填写,不超过30字', type: "string", max: 6, }],
                })(
                  <Input placeholder="6字以内" />
                )}
              </FormItem>
              <Button className={styles.saveStyle} onClick={this.submitForm} >添加</Button>

            </Form>

          </div>
        </div>

      </div>

    )
  }
}
export default Form.create()(AddNodeFrom)