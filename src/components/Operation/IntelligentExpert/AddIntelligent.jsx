import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Form, Select, Cascader, Button, Upload, message } from 'antd';
import styles from './intelligentExpert.scss';
import WarningTip from '../../Common/WarningTip';
import InputLimit from '../../Common/InputLimit';
import AutoSelect from '../../Common/AutoSelect';
import path from '../../../constants/path';
import CneButton from '@components/Common/Power/CneButton';

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
    theme: PropTypes.string,
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
    uploadFileList: PropTypes.array,
    deleteFile: PropTypes.func,
    uploadFile: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      initFaultCode: '',
      faultDescripDis: true,
      tooltipName: 'back', // 提示框的类型 back返回 delete 删除
      deleteFileId: '', //删除附件ID，

    };
  }

  componentDidMount() {
    this.serchFaultCode = debounce(this.serchFaultCode, 400);
    this.props.changeIntelligentExpertStore({ uploadFileList: [] }); // 因为上传 添加 编辑的时候采用的一个字段，所以进来先清除一次
  }

  confirmWarningTip = () => { // 确认返回列表页面
    const { tooltipName, deleteFileId } = this.state;
    const { changeIntelligentExpertStore, uploadFileList, deleteFile } = this.props;
    if (tooltipName === 'back') {
      changeIntelligentExpertStore({ showPage: 'list' });
    }
    if (tooltipName === 'delete') {
      const newUploadFileList = uploadFileList.filter(e => !(e.url === deleteFileId));
      deleteFile({ url: deleteFileId });
      changeIntelligentExpertStore({ uploadFileList: newUploadFileList });
      this.setState({ deleteFileId: '' });
    }
    this.setState({
      showWarningTip: false,
      tooltipName: '',
    });

  }

  cancelWarningTip = () => { // 取消
    this.setState({
      showWarningTip: false,
      tooltipName: '',
      deleteFileId: '',
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
    this.setState({ faultDescripDis: true, initFaultCode: '' });
    if (desc) {
      this.props.form.setFieldsValue({ faultDescription: desc });
    }
  }


  addFaultCode = () => { // 添加 添加之后不显示
    const { initFaultCode } = this.state;
    const { changeIntelligentExpertStore, faultCodeList } = this.props;
    const filterFaultCode = faultCodeList.filter(e => e.faultCode === initFaultCode);
    if (filterFaultCode.length > 0) {
      this.props.form.setFieldsValue({ 'faultCode': initFaultCode, faultDescription: filterFaultCode[0].faultCodeDesc });
      this.setState({ faultDescripDis: true, initFaultCode: '' });
    } else {
      this.props.form.setFieldsValue({ 'faultCode': initFaultCode, faultDescription: '' });
      this.setState({ faultDescripDis: false, initFaultCode: '' });
      changeIntelligentExpertStore({ faultCodeList: [] });
    }
  }

  saveHandler = (continueAdd) => { // 保存按钮
    const { form, addIntelligent, listParams, stationType, uploadFileList } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { faultTypeId, modeId } = values;
        addIntelligent({
          ...values,
          faultTypeId: faultTypeId.length > 0 && faultTypeId[1] || '',
          modeId: modeId.length > 0 && modeId[0] || '',
          continueAdd,
          type: stationType,
          annexs: uploadFileList.map(e => e.url),
        });
        this.props.changeIntelligentExpertStore({
          listParams: {
            ...listParams, orderField: 'update_time',
            sortMethod: 'desc',
          },
          uploadFileList: [],
        });
        if (continueAdd) {
          form.resetFields();
        }
      }
    });
  }

  beforeUploadStation = (file) => { // 上传前的校验
    if (file.size > 100 * 1024 * 1024) {
      message.config({ top: 200, duration: 2, maxCount: 3 });
      message.error('上传文件不得大于100M', 2);
    } else {
      this.uploadFile(file);
    }
    return false;
  }


  uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('originFlag', 0);
    this.props.uploadFile({ formData });
  }


  changeFileList = (fileList) => { // 转化格式
    return fileList.map(item => {
      return {
        name: item.urlName,
        status: 'done',
        url: `${path.basePaths.originUri}${item.url}`,
        uid: item.url,
      };
    });
  }

  onPreview = (a, b, c) => { // 点击文件下载
    return false;
  }

  removeFile = (file) => {
    const { uid } = file;
    this.setState({ showWarningTip: true, tooltipName: 'delete', deleteFileId: uid });
  }


  render() {
    const { showWarningTip, tooltipName, faultDescripDis, initFaultCode } = this.state;
    const { theme, deviceTypes, defectTypes, deviceModeList, stationType, faultCodeList, uploadFileList } = this.props;
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
    const initFileList = this.changeFileList(uploadFileList);
    const warningTipText = {
      'back': '退出后信息无法保存！',
      'delete': '确定要删除该附件吗？',
    }[tooltipName];
    return (
      <div className={styles.addIntelligent}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.titleTop}>
          <span className={styles.text}>添加解决方案</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={() => this.setState({ showWarningTip: true, tooltipName: 'back' })} />
        </div>
        <span ref={'wrap'} />
        <div className={styles.formBox}>
          <Form className={styles.preFormStyle}>
            <FormItem label="设备类型" className={styles.formItem} colon={false}>
              {getFieldDecorator('deviceTypeCode', {
                rules: [{ required: true, message: '请选择' }],
                // initialValue: deviceTypes.deviceTypeCode || null,
              })(
                <Select
                  placeholder="请选择"
                  style={{ width: 198 }}
                  onChange={this.onChangeDeviceType}
                  getPopupContainer={() => this.deviceTypeRef}
                >
                  {deviceTypes.map(e => (
                    <Option key={e.deviceTypeCode} value={e.deviceTypeCode}> {e.deviceTypeName}</Option>))}
                </Select>
              )}
              <span ref={(ref) => { this.deviceTypeRef = ref; }} />
            </FormItem>
            <FormItem label="设备型号" className={styles.formItem} colon={false}>
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
                  theme={theme}
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
                  getPopupContainer={() => this.faultTypeRef}
                />
              )}
              <span ref={(ref) => { this.faultTypeRef = ref; }} />
            </FormItem>
            {stationType === '1' &&
              <React.Fragment>
                <FormItem className={styles.formItem} label="故障代码" colon={false}>
                  {getFieldDecorator('faultCode', {
                    rules: [{ required: false, message: '请输入故障代码' }],
                  })(
                    <InputLimit end={true} size={999} width={590} placeholder="请输入..." />
                  )}
                </FormItem>
                <FormItem className={styles.formItem} label="故障描述" colon={false}>
                  {getFieldDecorator('faultDescription', {
                    rules: [{ required: true, message: '请输入故障描述' }],
                  })(
                    <InputLimit end={true} size={999} width={590} placeholder="请输入..." />
                  )}
                </FormItem>
              </React.Fragment>
            }
            {stationType === '0' &&
              <React.Fragment>
                <div className={styles.selctWrap}>
                  <FormItem className={styles.formItem} label="故障代码" colon={false}>
                    {getFieldDecorator('faultCode', {
                      rules: [{ required: true, message: '请输入故障代码' }],
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
                  {initFaultCode && <i className="iconfont icon-done" onClick={this.addFaultCode} />}
                  <span style={{ marginLeft: 4, fontSize: 12 }}> (注:故障代码与故障描述为联动条目，需等待系统查验是否已存在)</span>
                </div>
                <FormItem className={styles.formItem} label="故障描述" colon={false}>
                  {getFieldDecorator('faultDescription', {
                    rules: [{ required: true, message: '请输入故障描述' }],
                  })(
                    <InputLimit end={true} size={999} width={590} placeholder="请输入..." disabled={faultDescripDis} />
                  )}
                </FormItem>
              </React.Fragment>
            }
            <FormItem className={styles.formItem} label={'故障原因'} colon={false}>
              {getFieldDecorator('checkItems', {
                rules: [{ required: stationType === '0', message: `请输入${'故障原因'}` }],
              })(
                <InputLimit end={true} size={999} width={590} placeholder="请输入..." />
              )}
            </FormItem>
            <FormItem className={styles.formItem} label="处理方法" colon={false}>
              {getFieldDecorator('processingMethod', {
                rules: [{ required: true, message: '请输入处理方法' }],
              })(
                <InputLimit end={true} size={999} width={590} placeholder="请输入..." />
              )}
            </FormItem>
            <FormItem className={styles.formItem} label="所需工具" colon={false}>
              {getFieldDecorator('requiredTools', {
                rules: [{
                  message: '请输入...',
                }],
              })(
                <InputLimit end={true} size={999} width={590} placeholder="请输入..." />
              )}
            </FormItem>
            <FormItem className={styles.formItem} label="备注" colon={false}>
              {getFieldDecorator('remark', {
                rules: [{
                  message: '请输入......',
                  conlon: false,
                }],
              })(
                <InputLimit end={true} size={999} width={590} placeholder="请输入..." />
              )}
            </FormItem>
            <Form.Item label="上传附件" colon={false} className={styles.formItem} >
              {getFieldDecorator('annexs', {
              })(
                <Upload
                  multiple={true}
                  onRemove={(file) => this.removeFile(file)}
                  beforeUpload={this.beforeUploadStation}
                  fileList={initFileList}
                  onPreview={this.onPreview}
                >
                  <CneButton className={styles.uploaderBtn}>
                    <Icon className={styles.icon} type="upload" />选择文件上传
                  </CneButton>
                  <span className={styles.extraSpan}> 上传文件不得大于100M</span>
                </Upload>
              )}
            </Form.Item>
            <div className={styles.actionBtn}>
              <CneButton lengthMode="short" onClick={() => this.saveHandler(false)} className={styles.saveBtn}>保存</CneButton>
              <CneButton onClick={() => this.saveHandler(true)} className={styles.saveAndAddHandler}>保存并继续添加</CneButton>
            </div>
          </Form>
        </div>
      </div >
    );
  }
}

export default Form.create()(AddIntelligent);
