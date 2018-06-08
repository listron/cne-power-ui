import React, { Component } from 'react';
import { Upload, Modal, message, Icon } from 'antd';
import PropTypes from 'prop-types';
import { getCookie } from '../../../utils/index.js'
// import config from '../../config/apiConfig';
// const apiHostUri = config.apiHostUri;
// const Cookie = require('js-cookie');

class ImgUploader extends Component {
  static propTypes = {
    max: PropTypes.number,//max 图片数量
    limitSize: PropTypes.number,//图片大小限制。
    uploadPath: PropTypes.string, //上传的文件路径
    editable : PropTypes.bool, //是否可编辑组件
    value: PropTypes.array, //现有文件信息列表
    onChange: PropTypes.func, //输出上传插件信息
  }
  constructor(props) {
    super(props);
    this.state = {
      fileList: [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }],
    };
  }
  // handleCancel = () => this.setState({ previewVisible: false })
  // handlePreview = (file,a,b) => {
  //   console.log(a,b)
  //   this.setState({
  //     previewImage: file.url || file.thumbUrl,
  //     previewVisible: true,
  //   });
  // }
  handleUpload = (info) => {
    console.log(info)
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      console.log(info)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    // this.setState({ fileList })

    this.setState({
      fileList: info.fileList
    })
  }

  render() {
    const authData = getCookie('authData');
    const { uploadPath, max,  value } = this.props;
		const imageProps = {
			action: `${uploadPath}`,
      onChange: this.handleUpload,
			multiple: true,
			listType: 'picture-card',
			headers:{"Authorization": "Bearer " + (authData ? authData.access_token : "")}
		};
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        {value.map((e,i)=><div key={i}>这是第{i}个图片，准备渲染！</div>)}
        <Upload
          { ...imageProps }
          fileList={this.state.fileList}
        >
          {value.length >= max ? null : uploadButton}
        </Upload>
        {/* <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal> */}
      </div>
    )
    
  }
}
export default ImgUploader;