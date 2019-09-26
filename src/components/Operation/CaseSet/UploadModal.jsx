import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Upload, message, Button, Icon, Form } from 'antd';
import styles from './CasePartContainer.scss';
const FormItem = Form.Item;

class UploadModal extends React.Component {
  static propTypes = {
    importCase: PropTypes.func,
    cancelModal: PropTypes.func,
    showModal: PropTypes.bool,
    form: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      fileList: [],
    };
  }
  beforeUploadStation = (file) => { // 上传前的校验
    const validType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const validFile = validType.includes(file.type);
    if (!validFile) {
      message.config({ top: 200, duration: 2, maxCount: 3 });
      message.error('只支持上传excel文件!', 2);
    } else {
      this.removeFile(file);
      this.setState(state => ({
        fileList: [...state.fileList, file],
      }));
    }
    return false;
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { fileList } = this.state;
        const formData = new FormData();
        formData.append('file', fileList[0]);
        this.props.importCase({ formData });
        this.props.cancelModal();
      }
    });
  }
  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
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

  render() {
    const { showModal } = this.props;
    const { fileList } = this.state;
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
      <div>
        <span ref={'modal'} />
        <Modal
          // title={'批量导入案例'}
          visible={showModal}
          destroyOnClose={true}
          onOk={this.confirmModal}
          footer={null}
          bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          onCancel={() => { this.props.cancelModal(); }}
          getContainer={() => this.refs.modal}
          mask={false}
          maskClosable={false}
          closable={true}
          centered={true}
        >
          <Form>
            <FormItem {...formItemLayout} label="批量导入">
              {getFieldDecorator('upload', {
                getValueFromEvent: this.normFile,
              })(
                <Upload
                  onRemove={(file) => this.removeFile(file)}
                  beforeUpload={this.beforeUploadStation}
                  fileList={fileList}
                  showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
                >
                  <Button className={styles.uploadBtn} >  <Icon type="upload" />选择文件上传</Button>
                  {/* <span> 支持xls、xlsx文件</span> */}
                </Upload>
              )}
            </FormItem>
            <Button disabled={fileList.length === 0} className={styles.confireImport} type="primary" htmlType="submit" onClick={this.handleSubmit}>确认导入</Button>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(UploadModal);
