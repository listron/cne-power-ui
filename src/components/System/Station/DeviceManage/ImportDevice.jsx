import React, { Component } from "react";
import PropTypes from "prop-types";
import Cookie from 'js-cookie';
import path from '../../../../constants/path';
import StationSelect from '../../../../components/Common/StationSelect';
import { Modal, Form, Button, Upload, Select, Row, Col, message } from 'antd';
const FormItem = Form.Item;
const { Option } = Select;
class ImportDevice extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      fileList: [],
      uploading: false,
    }

  }
  onStationUpload = ({ file, fileList }) => { // 添加上传电站
    this.setState({
      uploading: true,
      fileList,
    })
    if (file.status !== 'uploading') {
      console.log(file, fileList);
      this.setState({
        uploading: false,
      })
    }
    if (file.status === 'done' && file.response && file.response.code === '10000') {
      message.success(`${file.name} 文件上传成功`);
      this.setState({ fileList: [] });
    } else if (file.status === 'done' && (!file.response || file.response.code !== '10000')) {
      message.error(`${file.name} 文件上传失败: ${file.response.message},请重试!`);
    } else if (file.status === 'error') {
      message.error(`${file.name} 文件上传失败,请重试!`);
    }
  }
  beforeUploadStation = (file) => { // 上传前的校验
    const validType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']; // 暂时不兼容xls : 'application/vnd.ms-excel'
    const validFile = validType.includes(file.type);
    if (!validFile) {
      message.error('只支持上传excel文件!');
    }
    return !!validFile
  }
  cancelModal = () => {
    this.props.cancelModal()
  }


  handleSubmit = (e) => {
    const{stationCode,pageNum,pageSize,deviceModeCode,deviceTypeCode,sortMethod,sortField,getDeviceList}=this.props;
   const params={stationCode,pageNum,pageSize,deviceModeCode,deviceTypeCode,sortMethod,sortField};
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        getDeviceList({...params})
        this.props.cancelModal()
      }
    });
  }
  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }



  render() {
    const { showModal, allStationBaseInfo } = this.props;
    const authData = Cookie.get('authData') || null;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const selectStationArr=getFieldValue('select');
    const stationCode=selectStationArr?selectStationArr[0]['stationCode']:null
    const { fileList } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <div>
        <Modal
          title={`批量导入设备`}
          visible={showModal}
          destroyOnClose={true}
          onOk={this.confirmModal}
          footer={null}
          onCancel={this.cancelModal}
          mask={false}
          maskClosable={true}
          closable={true}
          centered={true}
        >
          <Form onSubmit={this.handleSubmit}>
            <Form.Item
              {...formItemLayout}
              label="请选择电站"

            >
              {getFieldDecorator('select', {
                rules: [
                  { required: true, message: '请选择电站' },
                ],
              })(
                <StationSelect
                  data={allStationBaseInfo}
                  onOK={this.selectStation}
                  holderText="请选择电站"
                />
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="附件"
            >
              {getFieldDecorator('upload', {
                getValueFromEvent: this.normFile,
                rules: [
                  { required: true, message: '请上传文件' },
                ],
              })(
                <Upload
                  action={`${path.basePaths.APIBasePath}${path.APISubPaths.system.importStationDevice}/${stationCode}`}
                  onChange={this.onStationUpload}
                  headers={{ 'Authorization': 'bearer ' + JSON.parse(authData) }}
                  beforeUpload={this.beforeUploadStation}
                  data={(file) => ({ file })}
                  showUploadList={false}
                  fileList={fileList}
                >
                  <Button  >选择文件</Button>
                  <span>支持xls、xlsx文件</span>
                </Upload >
              )}

            </Form.Item>
            <Form.Item
              wrapperCol={{ span: 12, offset: 12 }}
            >
              <Button type="primary" htmlType="submit">导入</Button>
            </Form.Item>
          </Form>

        </Modal>
      </div>
    )
  }
}
export default Form.create()(ImportDevice)