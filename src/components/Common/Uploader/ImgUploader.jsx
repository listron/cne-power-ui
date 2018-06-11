import React, { Component } from 'react';
import { Upload, message, Icon } from 'antd';
import styles from './uploader.scss';
import PropTypes from 'prop-types';
import UploadedImg from './UploadedImg';
import ImgListModal from './ImgListModal'
import { getCookie } from '../../../utils/index.js'

/*
  图片上传共用组件：
  说明： 
    1. 要求组件必须传输属性：路径(uploadPath)
    2. 选填属性： 图片数量上限(max默认为4)，图片大小限制(limitSize默认1024*1024)，是否可编辑(editable默认不可编辑查看状态)，每张图片的缩略展示大小(imgStyle默认{width:'104px',height:'104px'})
    3. 已有图片数组信息（value）选填，默认为[],数组中，uid,rotate,thumbUrl必须提供，否则无法正确渲染图片
    props of value: [{   //props of value
      uid: -1,    //必填
      rotate: 0,  //必填
      name: 'xxx.png', 
      status: 'done',  
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',  //必填
    }],
    4. 输出参数为this.props.onChange调用，输入格式同value数组。this.props.onChange([
      {
        response:e.response.result,
        imgStyle,
        uid: -1,    
        rotate: 0,  
        name: 'xxx.png', 
        status: 'done',   
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',   
      }
    ])
*/

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
  static defaultProps = {
    max: 4,
    limitSize: 2*1024*1024,
    editable: false,
    imgStyle: {width:'104px',height:'104px'}
  }
  constructor(props) {
    super(props);
    this.state = {
      imageListShow: false,
      currentImgIndex:0,
      fileList: [],
    };
  }
  beforeUpload = (file) => {
    const isIMG = /^image/.test(file.type);
    const isLimitSize = file.size / 1024 / 1024 > 1;
    if(!isIMG){
      message.error('只支持图片上传！')
    }
    if(isLimitSize){
      message.error('图片上传大小不得超过1M！')
    }
    return isIMG && !isLimitSize
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
    const { uploadPath, max,  value, onChange, editable } = this.props;
		const imageProps = {
			action: `${uploadPath}`,
      onChange: this.handleUpload,
			multiple: true,
			listType: 'picture-card',
      headers:{"Authorization": "Bearer " + (authData ? authData.access_token : "")},
      beforeUpload:this.beforeUpload
		};
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className={styles.imgUploader}>
        {value.map((e,i)=><UploadedImg editable={editable} showImg={this.showImg} key={e.uid} {...e} index={i} value={value} onEdit={onChange} />)}
        {editable && <Upload
          className={styles.loaderHandler}
          { ...imageProps }
        >
          {value.length >= max ? null : uploadButton}
        </Upload>}
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