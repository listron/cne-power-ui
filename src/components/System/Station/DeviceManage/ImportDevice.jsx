import React, { Component } from "react";
import PropTypes from "prop-types";
import StationSelect from '../../../../components/Common/StationSelect';
import { Modal, Form, Button, Upload, Select, Row, Col, message } from 'antd';
const FormItem = Form.Item;
class ImportDevice extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      file:File,
      fileList: [],
      uploading: false,
    }
  }

  beforeUploadStation = (file) => { // 上传前的校验
    const validType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']; // 暂时不兼容xls : 'application/vnd.ms-excel'
    const validFile = validType.includes(file.type);
    if (!validFile) {
      message.config({ top: 200, duration: 2, maxCount: 3, });
      message.error('只支持上传excel文件!', 2);
    } else {
      this.removeFile(file)
      this.setState(state => ({
        fileList: [...state.fileList, file],
      }));
    }
    return false
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const{fileList,file}=this.state;
    const formData = new FormData();
    
    fileList.forEach(file => {
      formData.append("file", file);
    });
    formData.append("stationCode", selectstationCode);
    console.log('file: ', file);
    console.log('fileList: ', fileList);
    console.log('formData: ', formData);

    // onStationUpload()
    this.props.importStationDevice({stationCode:selectstationCode,formData})
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { select, upload } = values;
        const selectStaionCode = select.length > 0 && select[0].stationCode || '';
        const formData = new FormData();
        formData.append('file', upload[0].originFileObj);
        this.props.importStationDevice({ stationCode: selectStaionCode, formData })
        this.props.cancelModal()
      }
    });
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    this.setState({
      file:e,
      fileList:e.fileList
    })
    return e && e.fileList;
  }

  removeFile = (file) => {
    this.setState((state) => {
      const index = state.fileList.indexOf(file);
      const newFileList = state.fileList.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList,
      };
    });
  }

  selectStation = () => {
    this.removeFile()
  }

  render() {
    const { showModal, allStationBaseInfo } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
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
    const uploadprops = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        const validType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']; // 暂时不兼容xls : 'application/vnd.ms-excel'
        const validFile = validType.includes(file.type);
        if (!validFile) {
          message.error('只支持上传excel文件!');
        }
        // return !!validFile
        return false;
      },
      fileList,
    };

    return (
      <div>
        <Modal
          title={`批量导入设备`}
          visible={showModal}
          destroyOnClose={true}
          onOk={this.confirmModal}
          footer={null}
          onCancel={() => { this.props.cancelModal() }}
          mask={false}
          maskClosable={false}
          closable={true}
          centered={true}
        >
          <Form>
            <FormItem {...formItemLayout} label="请选择电站">
              {getFieldDecorator('select', {
                rules: [{ required: true, message: '请选择电站' }],
              })(
                <StationSelect
                  data={allStationBaseInfo}
                  onOK={this.selectStation}
                  holderText="请选择电站"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="附件">
              {getFieldDecorator('upload', {
                getValueFromEvent: this.normFile,
                rules: [{ required: true, message: '请上传文件' }],
              })(
                <Upload
                  onRemove={(file) => this.removeFile(file)}
                  beforeUpload={this.beforeUploadStation}
                  fileList={fileList}
                  showUploadList={{showPreviewIcon:false,showRemoveIcon:true}}
                >
                  <Button>选择文件</Button>
                  <span> 支持xls、xlsx文件</span>
                </Upload>
              )}
            </FormItem>
            <FormItem wrapperCol={{ span: 12, offset: 12 }} >
              <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>导入</Button>
            </FormItem>
          </Form>

        </Modal>
      </div>
    )
  }
}
export default Form.create()(ImportDevice)


// <Upload
// action={`${path.basePaths.APIBasePath}${path.APISubPaths.system.importStationDevice}/${stationCode}`}
// onChange={this.onStationUpload}
// headers={{ 'Authorization': 'bearer ' + JSON.parse(authData) }}
// beforeUpload={this.beforeUploadStation}
// data={(file) => ({ file })}
// showUploadList={true}
// fileList={fileList}
// >
// <Button  >选择文件</Button>
// <span>支持xls、xlsx文件</span>
// </Upload >