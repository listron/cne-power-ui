import React from 'react';
import PropTypes from 'prop-types';
import styles from '../CasePartSide.scss';
import { Button, Input, Form, Select, Upload, Icon, message } from 'antd';
import TextArea from '../../../Common/InputLimit/index';
import StationSelect from '../../../Common/StationSelect/index';
import AutoSelect from '../../../Common/AutoSelect';

const FormItem = Form.Item;
const { Option } = Select;

class AddCaseForm extends React.Component {
  static propTypes = {
    addCasePart: PropTypes.func,
    editCasePart: PropTypes.func,
    uploadCaseFile: PropTypes.func,
    form: PropTypes.object,
    caseDetail: PropTypes.object,
    showPage: PropTypes.string,
    stations: PropTypes.array,
    modesInfo: PropTypes.array,
    questionTypeList: PropTypes.array,
    uploadUrlArr: PropTypes.array,
    editFileList: PropTypes.array,
    deleteCaseFile: PropTypes.func,
    changeCasePartStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      savefileList: [],
      curfileList: [],
    };
  }
  componentWillReceiveProps(nextProps) {
    const { curfileList } = this.state;
    const { uploadUrlArr, editFileList, showPage } = nextProps;
    const fileNameList = showPage === 'add' ? curfileList.map(e => (e.name)) : editFileList.map(e => (e.name));//页面中所有的文件名
    const deleteItem = uploadUrlArr.filter(e => (!fileNameList.includes(e.urlName)));//删除的那一项
    const deleteObj = deleteItem[0] ? deleteItem[0] : {};
    const name = showPage === 'add' ? deleteObj.urlName : deleteObj.name;
    const newUrlArr = uploadUrlArr.filter(e => (fileNameList.includes(e.urlName)));
    const filterDeleteItem = uploadUrlArr.filter(e => (e.urlName === name));
    const { url } = filterDeleteItem[0] ? filterDeleteItem[0] : {};
    if (showPage === 'edit') {
      if (editFileList.length < uploadUrlArr.length) {
        this.props.deleteCaseFile({
          url: url,
        });
        this.props.changeCasePartStore({
          uploadUrlArr: newUrlArr,
        });
      }
    }
    if (showPage === 'add') {
      if (uploadUrlArr.length && uploadUrlArr.length > curfileList.length) {
        this.props.deleteCaseFile({
          url: url,
        });
        this.props.changeCasePartStore({
          uploadUrlArr: newUrlArr,
        });
      }
    }

  }

  sendRequire = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //发送请求
        const { uploadUrlArr } = this.props;
        const annexs = uploadUrlArr.map(e => (e.url));
        const deviceModeList = values.deviceModeList.map((e) => ({ manufactorId: e.split('-')[0], deviceMode: e.split('-')[1] }));
        const stationCodes = values.stationCodes.map(e => (e.stationCode));
        this.props.addCasePart({ ...values, deviceModeList, stationCodes, annexs });
      }
    });
  }
  addsubmitForm = (e) => {
    e.preventDefault();
    this.sendRequire();
    // this.props.changeCasePartStore({
    //   showPage: 'list',
    // });
  }
  keepOnAdd = (e) => {
    e.preventDefault();
    this.sendRequire();
    this.props.form.resetFields();
  }
  editsubmitForm = (e) => {
    const { caseDetail } = this.props;
    const { caseBaseId } = caseDetail;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //发送请求
        const { uploadUrlArr } = this.props;
        const annexs = uploadUrlArr.map(e => (e.url));
        const deviceModeList = values.deviceModeList.map((e) => ({ manufactorId: e.split('-')[0], deviceMode: e.split('-')[1] }));
        const stationCodes = values.stationCodes.map(e => (e.stationCode));
        this.props.editCasePart({ ...values, caseBaseId, deviceModeList, stationCodes, annexs });
      }
    });
  }
  dealPointDetail = (name) => {
    const { caseDetail = {} } = this.props;
    const data = (caseDetail[name] || caseDetail[name] === 0) ? caseDetail[name] : '';
    if (name === 'deviceModeList') {
      const data = caseDetail['deviceModes'] ? caseDetail['deviceModes'] : '';
      const value = data && data.map((e) => (`${e.manufactorId}-${e.deviceModeCode}`));
      return value;
    }
    if (name === 'stationCodes') {
      const data = caseDetail['stations'] ? caseDetail['stations'] : '';
      const value = data && data.map((e) => (e));
      return value;
    }
    if (name === 'questionTypeCodes') {
      const data = caseDetail['questionTypes'] ? caseDetail['questionTypes'] : [];
      const value = data && data.map((e) => (e.questionTypeCode));
      return value;
    }
    if (name === 'annexs') {
      const data = caseDetail['annexs'] ? caseDetail['annexs'] : [];
      const value = data && data.map((e, i) => ({ name: `${e.name}`, uid: `${i}` }));
      return value;
    }
    return data;
  }
  beforeUploadStation = (file) => { // 上传前的校验
    const limitSize = 1024 * 1024 * 100;
    if (file.size > limitSize) {
      message.config({ top: 200, duration: 2, maxCount: 3 });
      message.error('上传文件不得大于100M', 2);
    } else {
      this.setState({
        savefileList: [...this.state.savefileList, file],
      }, () => {
        const formData = new FormData();
        formData.append('file', file);
        this.props.uploadCaseFile({
          formData,
        });
      });
    }
    return false;
  }
  normFile = (e) => {
    this.setState({
      curfileList: e.fileList,
    });
    if (this.props.showPage === 'edit') {
      const fileList = e.fileList;
      const fileListArr = fileList.map(e => {
        const queryName = e.name.split('/');
        const name = queryName[queryName.length - 1];
        return { name, url: e.name };
      });
      this.props.changeCasePartStore({
        editFileList: fileListArr,
      });
    }
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  onModelChange = (value) => {
    const deviceModeList = value.map(e => (e.value));
    this.setState({}, () => {
      this.props.form.setFieldsValue({ deviceModeList });
    });
  }
  detailInfo = () => {
    const detailArr = [
      { name: '填报人', value: this.dealPointDetail('createUserName') },
      { name: '联系方式', value: this.dealPointDetail('createUserPhone') },
      { name: '更新时间', value: this.dealPointDetail('updateTime') },
      { name: '点赞数', value: this.dealPointDetail('likeCount') },
    ];
    return detailArr;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { showPage, stations, modesInfo, questionTypeList } = this.props;
    const detailArr = this.detailInfo();
    return (

      <div className={styles.fromContainer}>
        <Form className={styles.formPart}>
          <FormItem label="机型" colon={false} className={`${styles.formItemStyle} ${styles.autoSelect}`} >
            {getFieldDecorator('deviceModeList', {
              initialValue: this.dealPointDetail('deviceModeList'),
              rules: [{ required: true, message: '请选择机型' }],
            })(
              <AutoSelect
                holderText="输入关键字快速查询"
                style={{ width: '198px' }}
                data={modesInfo}
                multiple={true}
                maxTagCount={0}
                onChange={this.onModelChange}
              />
            )}
          </FormItem>
          <FormItem label="风场" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('stationCodes', {
              initialValue: this.dealPointDetail('stationCodes'),
              rules: [{ required: true, message: '请选择风场' }],
            })(
              <StationSelect
                data={stations.filter(e => (e.stationType === 0))}
                multiple={true}
                onOK={this.selectStatioNcode}
              />
            )}

          </FormItem>
          <FormItem label="问题类别" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('questionTypeCodes', {
              initialValue: this.dealPointDetail('questionTypeCodes'),
              rules: [{ required: true, message: '请选择问题类别' }],
            })(
              <Select
                mode="multiple"
                placeholder="请输入关键字快速查询"
              >
                {questionTypeList.map(e => {
                  return <Option key={e} value={e.questionTypeCode}>{e.questionTypeName}</Option>;
                })}
              </Select>
            )}
          </FormItem>
          <FormItem label="相关故障代码" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('faultCode', {
              initialValue: this.dealPointDetail('faultCode'),
              rules: [{ required: true, message: '请输入相关故障代码', type: 'string', max: 999 }],
            })(
              <TextArea placeholder="请输入..." size={999} width={570} height={34} end={true} />
            )}
          </FormItem>

          <FormItem label="问题描述" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('faultDescription', {
              initialValue: this.dealPointDetail('faultDescription'),
              rules: [{ required: true, message: '请输入问题描述', type: 'string', max: 999 }],
            })(
              <TextArea placeholder="请输入..." size={999} width={570} height={72} end={true} />
            )}
          </FormItem>

          <FormItem label="问题分析" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('faultAnalyse', {
              initialValue: this.dealPointDetail('faultAnalyse'),
              rules: [{ required: true, message: '请输入问题分析', type: 'string', max: 999 }],
            })(
              <TextArea placeholder="请输入..." size={999} width={570} height={72} end={true} />
            )}
          </FormItem>

          <FormItem label="处理措施" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('processingMethod', {
              initialValue: this.dealPointDetail('processingMethod'),
              rules: [{ required: true, message: '请输入处理措施', type: 'string', max: 999 }],
            })(
              <TextArea placeholder="请输入..." size={999} width={570} height={72} end={true} />
            )}
          </FormItem>

          <FormItem label="所需工具" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('requiredTools', {
              initialValue: this.dealPointDetail('requiredTools'),
            })(
              <TextArea placeholder="请输入..." size={999} width={570} height={72} end={true} />
            )}
          </FormItem>

          <FormItem label="反馈人" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('feedbackUserName', {
              initialValue: this.dealPointDetail('feedbackUserName'),
            })(
              <Input placeholder="请输入..." />
            )}
          </FormItem>

          <FormItem label="联系方式" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('feedbackUserPhone', {
              initialValue: this.dealPointDetail('feedbackUserPhone'),
              rules: [{ message: '请输入正确的手机号码', type: 'string', pattern: /^\d*$/ }],

            })(
              <Input placeholder="请输入..." />
            )}
          </FormItem>

          <FormItem label="上传附件" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('annexs', {
              initialValue: this.dealPointDetail('annexs'),
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload
                beforeUpload={this.beforeUploadStation}
                showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
              >
                <Button className={styles.uploadBtn} >  <Icon type="upload" />选择文件上传</Button>
                <span> 上传文件不得大于100M</span>
              </Upload>
            )}
          </FormItem>
          {showPage === 'edit' &&
            <div className={styles.detailStyle}>
              {detailArr.map((e, i) => (
                <div className={styles.formItemStyle} key={e.name}>
                  <div className={styles.name}>{e.name}</div>
                  <div className={styles.value}>{e.value}</div>
                </div>

              ))}

            </div>
          }

          {showPage === 'add' && <div className={styles.submitStyle}>
            <Button onClick={this.addsubmitForm} className={styles.submitBtn}>保存</Button>
            <Button onClick={this.keepOnAdd} className={styles.keepOnAdd} >保存并继续添加</Button>
          </div>}
          {showPage === 'edit' && <div className={styles.submitStyle}>
            <Button onClick={this.editsubmitForm} className={styles.submitBtn} >保存</Button>
          </div>}
        </Form>
      </div>
    );
  }
}
export default Form.create()(AddCaseForm);
