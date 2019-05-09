import React from "react";
import PropTypes from "prop-types";
import styles from "./assetStructure.scss";

import { Button, Input, Form, Icon, Select, InputLimit } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class EditNodeFrom extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  submitForm = (e) => {
    // this.props.form.validateFieldsAndScroll((err, values) => {
    //   if (!err) {
    //   console.log('发送请求，并且刷新别的数据')
    //   }
    // });
  }
  closeFrom = () => {
    this.props.closeFrom();
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    return (
      <div className={styles.editNodeFrom}>
        <div className={styles.title}>
          <div className={styles.leftText}>当前节点编辑</div>
        </div>
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
              <div className={styles.editSaveButton}>
              <Button className={styles.restore} onClick={this.submitForm} >恢复</Button>
              <Button className={styles.saveButton} onClick={this.submitForm} >保存</Button>
              </div>
            </Form>
           
          </div>
        </div>

      </div>

    )
  }
}
export default Form.create()(EditNodeFrom)