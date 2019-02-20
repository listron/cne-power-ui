import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from '../deviceSide.scss';
import { Input, Form, DatePicker, Select, Checkbox, Row, Col } from 'antd';
const FormItem = Form.Item;
const { Option } = Select;

class Confluence extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.rightStyles}>
        <FormItem label="组件型号" colon={false} className={styles.formItemStyle}>
          {getFieldDecorator('componentMode')(
            <Select>
              <Option value="true">是</Option>
              <Option value="false">否</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="支路个数" colon={false} className={styles.formItemStyle}>
          {getFieldDecorator('branchCount', {
            rules: [
              { message: '1~20之间的整数', required: true,pattern:/^(0|1\d?|20?|[3-9])$/ },
            ]
          })(
            <Input placeholder="1~20之间的整数" />
          )}
        </FormItem>
        <FormItem label="所用支路" colon={false} className={styles.formItemStyle}>
          {getFieldDecorator('connectedBranches', {
            rules: [
              { message: '选择所用支路', required: true, },
            ]
          })(
            <Checkbox.Group  >
              <Row>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e, i) => {
                  return (
                    <Col span={3} key={i}>
                      <div>第{e}支路</div>
                      <Checkbox value={i} key={e}></Checkbox>
                    </Col>)
                })}



              </Row>
            </Checkbox.Group>,

          )}
          <div className={styles.linestyle}>(  点击后变<span className={styles.selectRingStyle}></span>，表示接入;<span className={styles.ringStyle}></span>表示未接入 )</div>
        </FormItem>

      </div>
    )
  }
}
export default (Confluence)