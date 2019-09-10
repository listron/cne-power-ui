import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select } from 'antd';
import { showleftInfo } from '../DetailPoint/detailInfomation';
import AddPointInfoPart from './AddPointInfoPart';
import styles from '../pointSide.scss';
const FormItem = Form.Item;
const { Option } = Select;

class AddNextStep extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    payloadData: PropTypes.object,
    pointDetail: PropTypes.object,
    showPre: PropTypes.func,
    addPoint: PropTypes.func,
    editPoints: PropTypes.func,
    showPage: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }
  gobackPre = () => {
    this.props.showPre();
  }
  addsubmitForm = (e) => {
    const { payloadData } = this.props;
    const { stationCode, deviceTypeCode, manufactorId, deviceModeCode } = payloadData;
    const params = { stationCode, deviceTypeCode, manufactorId, deviceModeCode };
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //发送请求
        this.props.addPoint({ ...values, ...params });
      }
    });
  }
  editsubmitForm = (e) => {
    const { pointDetail } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //发送请求
        this.props.editPoints({ ...pointDetail, ...values });
      }
    });
  }
  setDevicePointDesc = () => {

    this.props.form.setFieldsValue({ 'devicePointName': this.dealPointDetail('deviceStandardPointDesc') });
  }
  dealPointDetail = (name) => {
    const { pointDetail = {} } = this.props;
    const data = (pointDetail[name] || pointDetail[name] === 0) ? pointDetail[name] : '';
    return data;
  }
  render() {
    const { showPage, payloadData, pointDetail = {} } = this.props;

    const domData = showPage === 'add' ? showleftInfo(payloadData) : showleftInfo(pointDetail);
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.pageContainer}>
        <div className={styles.left}>
          {/* {this.detailInfoPart(domData)} */}
          <AddPointInfoPart data={domData} />
        </div>
        <div className={styles.right}>
          <Form className={styles.formPart}>
            <FormItem label="测点编号" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointStandardCode', {
                initialValue: this.dealPointDetail('devicePointStandardCode'),
                rules: [{ required: true, message: '请正确填写', type: 'string', max: 30 }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="测点描述" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointName', {
                initialValue: this.dealPointDetail('devicePointName'),
                rules: [{ required: true, message: '请正确填写', type: 'string', max: 30 }],
              })(
                <Input placeholder="请输入" />
              )}
              {(showPage === 'edit' && this.dealPointDetail('deviceStandardPointDesc')) && (
                <span className={styles.usepoint}>
                  <span> 标准点描述:{this.dealPointDetail('deviceStandardPointDesc')}</span>
                  <Button className={styles.useBtn} onClick={this.setDevicePointDesc}>使用</Button>
                </span>

              )}

            </FormItem>
            <FormItem label="第三方测点名称" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointCode', {
                initialValue: this.dealPointDetail('devicePointCode'),
                rules: [{ required: true, message: '请正确填写', type: 'string', max: 10 }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="英文名称" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointIecname', {
                initialValue: this.dealPointDetail('devicePointIecname'),
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="数据类型" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointDatatype', {
                initialValue: this.dealPointDetail('devicePointDatatype'),
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
                initialValue: this.dealPointDetail('devicePointType'),
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
                initialValue: this.dealPointDetail('devicePointUnit'),
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="系数" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointIndex', {
                initialValue: this.dealPointDetail('devicePointIndex'),
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="小数点位数" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointDecimalplace', {
                initialValue: this.dealPointDetail('devicePointDecimalplace'),
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="是否上传" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('isTransfer', {
                initialValue: this.dealPointDetail('isTransfer'),
              })(
                <Select>
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
                </Select>
              )}
            </FormItem>

            <FormItem label="是否显示" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('isShow', {
                initialValue: this.dealPointDetail('isShow'),
              })(
                <Select>
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
                </Select>
              )}
            </FormItem>

            <FormItem label="理论最大值" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('maxTheory', {
                initialValue: this.dealPointDetail('maxTheory'),
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="理论最小值" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('minTheory', {
                initialValue: this.dealPointDetail('minTheory'),
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="偏差值" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('offset', {
                initialValue: this.dealPointDetail('offset'),
              }

              )(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            {showPage === 'add' && <div className={styles.submitStyle}>
              <Button onClick={this.gobackPre} className={styles.preStyles}>上一步</Button>
              <Button onClick={this.addsubmitForm} className={styles.submitBtn} >保存</Button>
            </div>}
            {showPage === 'edit' && <div className={styles.submitStyle}>
              <Button onClick={this.editsubmitForm} className={styles.submitBtn} >保存</Button>
            </div>}


          </Form>
        </div>
      </div >
    );
  }
}
export default Form.create()(AddNextStep);
