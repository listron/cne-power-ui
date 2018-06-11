import React, { Component } from 'react';
import { Upload, Modal, message, Icon } from 'antd';
import styles from './uploader.scss';
import PropTypes from 'prop-types';
import UploadedImg from './UploadedImg';
import ImgListModal from './ImgListModal'
import { getCookie } from '../../../utils/index.js'

//图片上传公共组件:父组件传输相关配置：图片数量，大小，路径，是否可编辑，默认已有图片。

class ImgUploader extends Component {
  static propTypes = {
    max: PropTypes.number,//图片最大数量 
    limitSize: PropTypes.number,//图片大小限制
    uploadPath: PropTypes.string, //上传
    editable : PropTypes.bool, //是否可编辑(右旋+删除)
    value: PropTypes.array, //输入图片信息列表
    onChange: PropTypes.func, //输出
    imgStyle: PropTypes.object, //图片样式
  }
  constructor(props) {
    super(props);
    this.state = {
      imageListShow: false,
      currentImgIndex:0,
      fileList: [{
        uid: -1,
        rotate: 0,
        name: 'xxx.png',
        status: 'done',
        response:{
          success: true,
          result:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }],
    };
  }
  handleUpload = ({file,fileList}) => {
    const { imgStyle } = this.props
    if (file.status !== 'uploading') {
      const upLoadfiles = fileList.filter(e=>(e.response && e.response.success)).map(e => ({
          uid:e.uid,
          name:e.name,
          rotate: 0,
          response:e.response.result,
          thumbUrl:e.thumbUrl,
          status:e.status,
          imgStyle
      }))
      this.props.onChange(upLoadfiles)
    }
    this.setState({
      fileList
    })
  }
  showImg = (index) => {
    this.setState({
      imageListShow: true,
      currentImgIndex:index
    })
  }
  hideImg = () => {
    this.setState({
      imageListShow: false
    })
  }
  changeCurrentImgIndex = (index) =>{
    this.setState({
      currentImgIndex:index
    })
  }

  render() {
    const authData = getCookie('authData');
    const { imageListShow, currentImgIndex } = this.state;
    const { uploadPath, max,  value, onChange } = this.props;
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
        {value.map((e,i)=><UploadedImg showImg={this.showImg} key={e.uid} {...e} index={i} value={value} onEdit={onChange} />)}
        <Upload
          className={styles.loaderHandler}
          { ...imageProps }
          fileList={this.state.fileList}
        >
          {value.length >= max ? null : uploadButton}
        </Upload>
        <ImgListModal 
          value={value} 
          imageListShow={imageListShow} 
          hideImg={this.hideImg} 
          currentImgIndex={currentImgIndex} 
          changeCurrentImgIndex={this.changeCurrentImgIndex}
        />
      </div>
    )
    
  }
}
export default ImgUploader;