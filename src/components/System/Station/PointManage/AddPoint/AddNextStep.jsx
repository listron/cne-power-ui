import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, Icon } from 'antd';
import { showleftInfo } from '../DetailPoint/detailInfomation';
import AddPointInfoPart from './AddPointInfoPart';
import styles from '../pointSide.scss';
const FormItem = Form.Item;
const { Option } = Select;

class AddNextStep extends React.Component {
  static propTypes = {
    form: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context);
  }
  gobackPre = () => {
    this.props.showPre();
  }
  submitBtn = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //发送请求
      }
    });
  }
  render() {
    const { showPage } = this.props;
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
                initialValue: '',
                rules: [{ required: true, message: '请正确填写', type: 'string', max: 30 }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="测点描述" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointName', {
                initialValue: '',
                rules: [{ required: true, message: '请正确填写', type: 'string', max: 30 }],
              })(
                <Input placeholder="请输入" />
              )}
              {showPage === 'edit' && (
                <span className={styles.usepoint}>
                  <span> 标准点描述:{'xxxxxxxxxxx'}</span>
                  <Button className={styles.useBtn}>使用</Button>
                </span>

              )}

            </FormItem>
            <FormItem label="第三方测点名称" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointCode', {
                initialValue: '',
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="英文名称" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointIecname', {
                initialValue: '',
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="数据类型" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointDatatype', {
                initialValue: '',
                rules: [{ required: true }],
              })(
                <Select>
                  <Option value={'float'}>浮点型</Option>
                  <Option value={'int'}>整型</Option>
                  <Option value={'text'}>文本型</Option>
                  <Option value={'bit'}>布尔型</Option>
                </Select>
              )}
            </FormItem>

            <FormItem label="测点类型" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointType', {
                initialValue: '',
                rules: [{ required: true }],
              })(
                <Select>
                  <Option value={'YC'}>YC</Option>
                  <Option value={'YM'}>YM</Option>
                  <Option value={'YX'}>YX</Option>
                </Select>
              )}
            </FormItem>

            <FormItem label="单位" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointUnit', {
                initialValue: '',
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="系数" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointIndex', {
                initialValue: '',
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="小数点位数" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointDecimalplace', {
                initialValue: '',
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="是否上传" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('manufacturer', {
                initialValue: '',
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="是否显示" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('manufacturer', {
                initialValue: '',
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="理论最大值" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('maxTheory', {
                initialValue: '',
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="理论最小值" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('minTheory', {
                initialValue: '',
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="偏差值" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('discrepancy', {
                initialValue: '',
              }

              )(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <div className={styles.submitStyle}>
              {showPage === 'add' && <Button onClick={this.gobackPre} className={styles.preStyles}>上一步</Button>}
              <Button onClick={this.submitForm} className={styles.submitBtn} >保存</Button>
            </div>


          </Form>
        </div>
      </div >
    );
  }
}
export default Form.create()(AddNextStep);
