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
    detailTime: PropTypes.string,
    standardDesc: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showDesc: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    const { detailTime, pointDetail } = nextProps;

    if (detailTime !== this.props.detailTime) {
      this.setState({
        showDesc: pointDetail.deviceStandardPointDesc,
      });
    }
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
    const { devicePointId } = pointDetail;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //发送请求
        this.props.editPoints({ devicePointId, ...values });
      }
    });
  }
  setDevicePointCodeValue = (e) => {
    const { standardDesc } = this.props;
    const value = e.target.value;
    this.props.form.setFieldsValue({ 'devicePointCode': value });
    const findDesc = standardDesc.find(item => item.devicePointStandardCode === value);
    this.setState({
      showDesc: findDesc ? findDesc.devicePointName : '',
    });
  }
  setDevicePointDesc = () => {
    const { showDesc } = this.state;
    this.props.form.setFieldsValue({ 'devicePointName': showDesc });
  }
  dealPointDetail = (name) => {
    const { pointDetail = {} } = this.props;
    const data = (pointDetail[name] || pointDetail[name] === 0) ? pointDetail[name] : '';
    return data;
  }
  render() {
    const { showPage, payloadData, pointDetail = {} } = this.props;
    const { showDesc } = this.state;

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
            <FormItem label="测点编号" colon={false} className={styles.formItemStyle} >
              {getFieldDecorator('devicePointStandardCode', {
                initialValue: this.dealPointDetail('devicePointStandardCode'),
                rules: [{
                  required: true, message: '请输入数字和字符的组合,且不超过30个字符', type: 'string', max: 30,
                  pattern: /^(?![0-9]+$).{0,30}$/,
                }],
                //要求不能纯数字,(?![0-9]+$)反向预查，不能是纯数字
                //这是数字字母特殊字符[0-9A-Za-z`~!@#$%^&*()_+-=[][]\|;:'"",<>.?]，用了.代表任意字符


              })(
                <Input placeholder="请输入" onChange={this.setDevicePointCodeValue} />
              )}
            </FormItem>
            <FormItem label="测点描述" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointName', {
                initialValue: this.dealPointDetail('devicePointName'),
                rules: [{ required: true, message: '不超过50个字符', type: 'string', max: 50 }],
              })(
                <Input placeholder="请输入" />
              )}
              {/* {(showPage === 'edit' && this.dealPointDetail('deviceStandardPointDesc')) && ( */}
              {(showDesc) && (
                <span className={styles.usepoint}>
                  {/* <span> 标准点描述:{this.dealPointDetail('deviceStandardPointDesc')}</span> */}
                  <span className={styles.descStyle} title={showDesc}> 标准点描述:{showDesc}</span>
                  <Button className={styles.useBtn} onClick={this.setDevicePointDesc}>使用</Button>
                </span>

              )}

            </FormItem>
            <FormItem label="第三方测点名称" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointCode', {
                initialValue: this.dealPointDetail('devicePointCode'),
                rules: [{ required: true, message: '请输入数字和字符的组合,且不超过30个字符', type: 'string', max: 30, pattern: /^(?![0-9]+$).{0,30}$/ }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="英文名称" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointIecname', {
                initialValue: this.dealPointDetail('devicePointIecname'),
                rules: [{ message: '不超过50个字符', type: 'string', max: 50 }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="数据类型" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointDatatype', {
                initialValue: this.dealPointDetail('devicePointDatatype'),
                rules: [{ required: true, message: '请选择数据类型' }],
              })(
                <Select>
                  <Option value={'double'}>double</Option>
                  <Option value={'text'}>text</Option>
                </Select>
              )}
            </FormItem>

            <FormItem label="测点类型" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointType', {
                initialValue: this.dealPointDetail('devicePointType'),
                rules: [{ required: true, message: '请选择测点类型' }],
              })(
                <Select>
                  <Option value={'Detail'}>Detail</Option>
                  <Option value={'Event'}>Event</Option>
                  <Option value={'YC'}>YC</Option>
                  <Option value={'YCS'}>YCS</Option>
                  <Option value={'YM'}>YM</Option>
                  <Option value={'YX'}>YX</Option>
                  <Option value={'YXS'}>YXS</Option>
                </Select>
              )}
            </FormItem>

            <FormItem label="单位" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('devicePointUnit', {
                initialValue: this.dealPointDetail('devicePointUnit'),
                rules: [{ message: '不超过10个字符', type: 'string', max: 10 }],
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
                rules: [{ message: '请输入正整数', pattern: /^\d*$/ }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="是否上传" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('isTransfer', {
                initialValue: showPage === 'add' ? 1 : this.dealPointDetail('isTransfer'),
              })(
                <Select>
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
                </Select>
              )}
            </FormItem>

            <FormItem label="是否显示" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('isShow', {
                initialValue: showPage === 'add' ? 1 : this.dealPointDetail('isShow'),
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
