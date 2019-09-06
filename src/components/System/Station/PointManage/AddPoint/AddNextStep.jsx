import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, Icon } from 'antd';
import { showleftInfo } from '../DetailPoint/detailInfomation';
import AddPointInfoPart from './AddPointInfoPart';
import styles from '../pointSide.scss';
const FormItem = Form.Item;

class AddNextStep extends React.Component {
  static propTypes = {
    form: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const data = {};
    const domData = showleftInfo(data);
    const { getFieldDecorator, getFieldValue } = this.props.form;
    return (
      <div className={styles.pageContainer}>
        <div className={styles.left}>
          {/* {this.detailInfoPart(domData)} */}
          <AddPointInfoPart data={domData} />
        </div>
        <div className={styles.right}>
          <Form className={styles.formPart}>
            <FormItem label="测点编号" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('manufacturer', {
                initialValue: null,
                rules: [{ required: true, message: '请正确填写', type: 'string', max: 30 }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="测点描述" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointName', {
                initialValue: null,
                rules: [{ required: true, message: '请正确填写', type: 'string', max: 30 }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="第三方测点名称" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointCode', {
                initialValue: null,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="英文名称" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointIecname', {
                initialValue: null,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="数据类型" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointDatatype', {
                initialValue: null,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="测点类型" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointType', {
                initialValue: null,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="单位" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointUnit', {
                initialValue: null,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="系数" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointIndex', {
                initialValue: null,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="小数点位数" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointDecimalplace', {
                initialValue: null,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="是否上传" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('manufacturer', {
                initialValue: null,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="是否显示" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('manufacturer', {
                initialValue: null,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="理论最大值" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('maxTheory', {
                initialValue: null,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="理论最小值" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('minTheory', {
                initialValue: null,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="偏差值" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('discrepancy', {}
                initialValue: null,
            })(
                <Input placeholder="请输入" />
              )}
            </FormItem>



          </Form>
        </div>
      </div>
    );
  }
}
export default Form.create()(AddNextStep);
