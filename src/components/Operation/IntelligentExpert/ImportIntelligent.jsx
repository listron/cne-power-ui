import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button, Upload, message } from 'antd';
import styles from './intelligentExpert.scss';

const FormItem = Form.Item;

class ImportIntelligent extends Component {
  static propTypes = {
    cancelModal: PropTypes.func,
    getImportIntelligent: PropTypes.func,
    getFieldDecorator: PropTypes.func,
    allStationBaseInfo: PropTypes.array,
    showModal: PropTypes.bool,
    form: PropTypes.object,
  }

  constructor(props){
    super(props);
    this.state = {
      file:File,
      fileList: [],
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

  handleSubmit = (e) => { // 导入按钮
    const { form, cancelModal, getImportIntelligent } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        const { fileList } = this.state;
        const formData = new FormData();
        formData.append('file', fileList[0]);
        getImportIntelligent({
          formData
        })
        cancelModal()
      }
    });
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  removeFile = (file) => { // 删除已选文件
    this.setState((state) => {
      const index = state.fileList.indexOf(file);
      const newFileList = state.fileList.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList,
      };
    });
  }

  render(){
    const { fileList } = this.state;
    const { showModal, allStationBaseInfo } = this.props;
    
    
    const { getFieldDecorator } = this.props.form;
    
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
      <div className={styles.importIntelligent}>
      <Modal
          title={`导入`}
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
          <FormItem {...formItemLayout} label="附件">
            {getFieldDecorator('upload', {
              getValueFromEvent: this.normFile,
              rules: [{ required: true, message: '选择文件' }],
            })(
              <Upload
                onRemove={(file) => this.removeFile(file)}
                beforeUpload={this.beforeUploadStation}
                fileList={fileList}
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

export default Form.create()(ImportIntelligent);
