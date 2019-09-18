import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Form, Select, Cascader, Button, Upload } from 'antd';
import styles from './intelligentExpert.scss';
import WarningTip from '../../Common/WarningTip';
import InputLimit from '../../Common/InputLimit';
import AutoSelect from '../../Common/AutoSelect';

const Option = Select.Option;
const FormItem = Form.Item;

function debounce(callback, delay) { //（防抖）
  let timerId = null;
  return function (args) {
    const that = this;
    clearTimeout(timerId);
    timerId = setTimeout(function () {
      callback.call(that, args);
    }, delay);
  };
}
class AddIntelligent extends Component {
  static propTypes = {
    deviceTypes: PropTypes.array,
    defectTypes: PropTypes.array,
    listParams: PropTypes.object,
    form: PropTypes.object,
    changeIntelligentExpertStore: PropTypes.func,
    getIntelligentTable: PropTypes.func,
    addIntelligent: PropTypes.func,
    getLostGenType: PropTypes.func,
    deviceModeList: PropTypes.array,
    faultCodeList: PropTypes.array,
    getDevicemodes: PropTypes.func,
    stationType: PropTypes.string,
    getFaultCodeList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存！',
      selectDevice: [],
      initFaultCode: '',
      faultDescripDis: true,
    };
  }

  componentDidMount() {
    this.serchFaultCode = debounce(this.serchFaultCode, 400);
  }

  confirmWarningTip = () => { // 确认返回列表页面
    const { changeIntelligentExpertStore } = this.props;
    this.setState({
      showWarningTip: false,
    });
    changeIntelligentExpertStore({
      showPage: 'list',
    });
  }

  cancelWarningTip = () => { // 取消
    this.setState({
      showWarningTip: false,
    });
  }


  onChangeDeviceType = (deviceTypeCode) => { // 选择设备类型
    const { stationType } = this.props;
    this.props.form.setFieldsValue({ defectTypeCode: null, modeId: [] });
    this.props.getDevicemodes({ // 选择设备型号
      deviceTypeCode,
      manufactorId: 0,
      isConnectDevice: 1,
      stationCode: null,
      assetsId: '',
    });
    this.props.getLostGenType({ // 选择缺陷类型
      stationType,
      objectType: 1,
      deviceTypeCode,
    });
  }

  deviceModeListChange = (value) => { // 选择设备类型
    const deviceModeList = value.map(e => (e.value));
    this.setState({}, () => {
      this.props.form.setFieldsValue({ modeId: deviceModeList });
    });
  }


  serchFaultCode = (value) => {
    if (value) {
      this.props.getFaultCodeList({ faultCode: value });
      this.setState({ initFaultCode: value });
    }
  }

  changeFaultCode = (value, item) => {
    const { desc } = item.props;
    this.setState({ faultDescripDis: true });
    if (desc) {
      this.props.form.setFieldsValue({ faultDescription: desc });
    }
  }


  addFaultCode = () => {
    const { initFaultCode } = this.state;
    const { changeIntelligentExpertStore } = this.props;
    if (initFaultCode) {
      this.props.form.setFieldsValue({ 'faultCode': initFaultCode, faultDescription: '' });
      this.setState({ faultDescripDis: false });
      changeIntelligentExpertStore({ faultCodeList: [] });
    }
  }

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    console.log('tets', e.fileList);
    return e && e.fileList;
  };

  saveHandler = (continueAdd) => { // 保存按钮
    const { form, addIntelligent, listParams, stationType } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { faultTypeId, modeId } = values;
        addIntelligent({
          ...values,
          faultTypeId: faultTypeId.length > 0 && faultTypeId[1] || '',
          modeId: modeId.length > 0 && modeId[0] || '',
          continueAdd,
          type: stationType,
        });
        this.props.changeIntelligentExpertStore({
          listParams: {
            ...listParams, orderField: 'update_time',
            sortMethod: 'desc',
          },
        });
        if (continueAdd) {
          form.resetFields();
        }
      }
    });
  }



  render() {
    const { showWarningTip, warningTipText, faultDescripDis, initFaultCode } = this.state;
    const { deviceTypes, defectTypes, deviceModeList, stationType, faultCodeList } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const deviceTypeCode = getFieldValue('deviceTypeCode'); // 设备code
    const option = faultCodeList.map(e => <Option key={e.id} value={e.faultCode} desc={e.faultCodeDesc}>{e.faultCode}</Option>);
    const tmpGenTypes = [];
    defectTypes.forEach(e => e && e.list && e.list.length > 0 && tmpGenTypes.push(...e.list));
    const groupedLostGenTypes = [];
    tmpGenTypes.map(ele => {
      if (ele && ele.list && ele.list.length > 0) {
        const innerArr = { children: [] };
        innerArr.label = ele.name;
        innerArr.value = ele.id;
        ele.list.forEach(innerInfo => {
          innerArr.children.push({
            label: innerInfo.name,
            value: innerInfo.id,
          });
        });
        groupedLostGenTypes.push(innerArr);
      }
    });
    const checkItemsName = stationType === '0' && '故障原因' || '检查项目';
    return (
      <div className={styles.addIntelligent}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.titleTop}>
          <span className={styles.text}>解决方案添加</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={() => this.setState({ showWarningTip: true })} />
        </div>
        <span ref={'wrap'} />
        <div className={styles.formBox}>
          <Form className={styles.preFormStyle}>
            <FormItem label="设备类型" colon={false}>
              {getFieldDecorator('deviceTypeCode', {
                rules: [{ required: true, message: '请选择' }],
                // initialValue: deviceTypes.deviceTypeCode || null,
              })(
                <Select
                  placeholder="请选择"
                  style={{ width: 198 }}
                  onChange={this.onChangeDeviceType}
                >
                  {deviceTypes.map(e => (
                    <Option key={e.deviceTypeCode} value={e.deviceTypeCode}> {e.deviceTypeName}</Option>))}
                </Select>
              )}
            </FormItem>
            <FormItem label="设备型号" colon={false}>
              {getFieldDecorator('modeId', {
                rules: [{ required: stationType === '0', message: '请选择' }],
                initialValue: [],
              })(
                <AutoSelect
                  style={{ width: '198px' }}
                  data={deviceModeList}
                  maxTagCount={0}
                  onChange={this.deviceModeListChange}
                  disabled={!deviceTypeCode}
                  max={1}
                />
              )}
            </FormItem>
            <FormItem label="缺陷类型" className={styles.formItem} colon={false}>
              {getFieldDecorator('faultTypeId', {
                rules: [{ required: true, message: '请选择' }],
              })(
                <Cascader
                  disabled={!deviceTypeCode}
                  style={{ width: 198 }}
                  options={groupedLostGenTypes}
                  expandTrigger="hover"
                  placeholder="请选择"
                />
              )}
            </FormItem>
            {stationType === '1' &&
              <React.Fragment>
                <FormItem className={styles.formItem} label="故障代码" colon={false}>
                  {getFieldDecorator('faultCode', {
                    rules: [{ required: true, message: '请输入缺陷描述' }],
                  })(
                    <InputLimit style={{ marginLeft: -80 }} size={999} width={590} placeholder="请输入..." />
                  )}
                </FormItem>
                <FormItem className={styles.formItem} label="故障描述" colon={false}>
                  {getFieldDecorator('faultDescription', {
                    rules: [{ required: true, message: '请输入故障描述' }],
                  })(
                    <InputLimit style={{ marginLeft: -80 }} size={999} width={590} placeholder="请输入..." />
                  )}
                </FormItem>
              </React.Fragment>
            }
            {stationType === '0' &&
              <React.Fragment>
                <div className={styles.selctWrap}>
                  <FormItem className={styles.formItem} label="故障代码" colon={false}>
                    {getFieldDecorator('faultCode', {
                      rules: [{ required: true, message: '请输入缺陷描述' }],
                    })(
                      <Select
                        showSearch
                        placeholder="请输入..."
                        showArrow={false}
                        onSearch={this.serchFaultCode}
                        onChange={this.changeFaultCode}
                        getPopupContainer={() => this.refs.wrap}
                      >
                        {option}
                      </Select>
                    )}
                  </FormItem>
                  {(faultCodeList.length === 0 && !!initFaultCode) && <Icon type="check" onClick={this.addFaultCode} />}
                </div>
                <FormItem className={styles.formItem} label="故障描述" colon={false}>
                  {getFieldDecorator('faultDescription', {
                    rules: [{ required: true, message: '请输入故障描述' }],
                  })(
                    <InputLimit style={{ marginLeft: -80 }} size={999} width={590} placeholder="请输入..." disabled={faultDescripDis} />
                  )}
                </FormItem>
              </React.Fragment>
            }
            <FormItem className={styles.formItem} label={checkItemsName} colon={false}>
              {getFieldDecorator('checkItems', {
                rules: [{ required: true, message: `请输入${checkItemsName}` }],
              })(
                <InputLimit style={{ marginLeft: -80 }} size={999} width={590} placeholder="请输入..." />
              )}
            </FormItem>
            <FormItem className={styles.formItem} label="处理方法" colon={false}>
              {getFieldDecorator('processingMethod', {
                rules: [{ required: true, message: '请输入处理方法' }],
              })(
                <InputLimit style={{ marginLeft: -80 }} size={999} width={590} placeholder="请输入..." />
              )}
            </FormItem>
            <FormItem className={styles.formItem} label="所需工具" colon={false}>
              {getFieldDecorator('requiredTools', {
                rules: [{
                  message: '请输入...',
                }],
              })(
                <InputLimit style={{ marginLeft: -80 }} size={999} width={590} placeholder="请输入..." />
              )}
            </FormItem>
            <FormItem className={styles.formItem} label="备注">
              {getFieldDecorator('remark', {
                rules: [{
                  message: '请输入......',
                  conlon: false,
                }],
              })(
                <InputLimit style={{ marginLeft: -80 }} size={999} width={590} placeholder="请输入..." />
              )}
            </FormItem>
            <Form.Item label="上传附件" >
              {getFieldDecorator('annexs', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
              })(
                <Upload multiple={true} >
                  <Button> <Icon type="upload" /> 选择文件上传</Button>
                </Upload>
              )}
            </Form.Item>
            <div className={styles.actionBtn}>
              <Button onClick={() => this.saveHandler(false)} className={styles.saveBtn}>保存</Button>
              <Button onClick={() => this.saveHandler(true)} className={styles.saveAndAddHandler}>保存并继续添加</Button>
            </div>

          </Form>
        </div>
      </div >
    );
  }
}

export default Form.create()(AddIntelligent);
