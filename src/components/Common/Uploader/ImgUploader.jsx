import React, { Component } from 'react';
import { Upload, Modal, message, Icon } from 'antd';
import styles from './uploader.scss';
import PropTypes from 'prop-types';
import UploadedImgModal from './UploadedImgModal'
import { getCookie } from '../../../utils/index.js'

//公共组件，通过父组件传输相关配置：图片数量，大小，路径，是否可编辑，默认已有图片。

class ImgUploader extends Component {
  static propTypes = {
    max: PropTypes.number,//图片最大数量 
    limitSize: PropTypes.number,//图片大小限制
    uploadPath: PropTypes.string, //上传
    editable : PropTypes.bool, //是否可编辑(右旋+删除)
    value: PropTypes.array, //输入图片信息列表
    onChange: PropTypes.func, //输出
  }
  constructor(props) {
    super(props);
    this.state = {
      fileList: [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        response:{
          success: true,
          result:'12312312',
        },
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
  handleUpload = ({file,fileList}) => {
    if (file.status !== 'uploading') {
      console.log(file, fileList);
      const upLoadfiles = fileList.filter(e=>e.response.success).map(e => ({
          uid:e.uid,
          name:e.name,
          response:e.response.result,
          thumbUrl:e.thumbUrl,
          status:e.status
      }))
      this.props.onChange(upLoadfiles)
    }
    this.setState({
      fileList
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
      headers:{"Authorization": "Bearer " + (authData ? authData.access_token : "")},
		};
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className={styles.imgUploader}>
        {value.map((e,i)=><UploadedImgModal key={e.uid} />)}
        
        <Upload
          className={styles.loaderHandler}
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