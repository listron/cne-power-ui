import React from "react";
import PropTypes from "prop-types";
import styles from "./assetStructure.scss";

import { Button, Input, Form, Icon,Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class AddNodeFrom extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  submitForm=(e)=>{
    // this.props.form.validateFieldsAndScroll((err, values) => {
    //   if (!err) {
    //   console.log('发送请求，并且刷新别的数据')
    //   }
    // });
  }
  closeFrom=()=>{
    this.props.closeFrom();
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    console.log(111)
    return (
      <div className={styles.addNodeFrom}>
        <div className={styles.title}>
          <div className={styles.leftText}>添加子节点</div>
          <div className={styles.iconstyles} onClick={this.closeFrom}><Icon type="close" /></div>
        </div>
        <div className={styles.contantBox}>
          <div className={styles.contant}>
            <Form className={styles.editPart}>
              <FormItem label="父节点名称" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('parentNode', {
                  rules: [{ required: true, message: '请正确填写,不超过30字', type: "string", max: 30, }],
                })(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
              <FormItem label="节点名称" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('nodeName2', {
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
             
            </Form>
            <Button  onClick={this.submitForm} >保存</Button>
          </div>
        </div>

      </div>

    )
  }
}
export default Form.create()(AddNodeFrom)