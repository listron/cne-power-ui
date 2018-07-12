

import React, { Component } from 'react';
import { Upload, Icon } from 'antd';
import PropTypes from 'prop-types';
import { getCookie } from '../../../utils/index.js';
import styles from './uploader.scss';

/*
该组件只用于处理单图片上传；只能上传一张图片，在已上传一张图片后只能重新点选图片进行替换。
  1. 要求组件必须传输属性：路径(uploadPath)
  2. 选填属性： 图片大小限制(limitSize默认2*1024*1024)，每张图片的缩略展示大小(imgStyle默认{width:'104px',height:'104px'})
  3. 已有图片信息（data）选填，默认为{},数组中，uid,thumbUrl必须提供，否则无法正确渲染图片
    props of data: {
      uid: -1,    //必填
      name: 'xxx.png', 
      status: 'done',  
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',  //必填
    },
  4. 输出参数为this.props.onChange调用，输入格式同data。this.props.onOK(
      {
        response:e.response.result,
        imgStyle,
        uid: -1,    
        rotate: 0,  
        name: 'xxx.png', 
        status: 'done',   
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',   
      }
  )对于form表单包装的组件，会同时调用this.props.onChange()
*/

class SingleImgUploader extends Component {
  static propTypes = {
    limitSize: PropTypes.number,//图片大小限制
    uploadPath: PropTypes.string, //上传路径
    data: PropTypes.object, //输入图片信息
    onOK: PropTypes.func, //输出
    onChange: PropTypes.func, //输出
    imgStyle: PropTypes.object, //图片样式
  }
  static defaultProps = {
    limitSize: 2*1024*1024,
    editable: false,
    imgStyle: {width:'104px',height:'104px'}
  }

  constructor(props){
    super(props);
    this.state = {
      preInfor: {},
      currentImgInfor: props.data,
      showCurentUpload: true, 
    }
  }

  onOK = (imgList,editFileList) => {
    const { onChange,onOK } = this.props;
    const { showCurentUpload } = this.state;    
    onOK && onOK(imgList);
    onChange && onChange(imgList);
    console.log('??????????????????????')
    this.setState({showCurentUpload:!showCurentUpload})
  }

  handleUpload = ({file,fileList}) => {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    if (file.status !== 'uploading') {
      const upLoadfiles = fileList.map(e => {
        return {
          uid:e.uid,
          name:e.name,
          response:e.response.data.address,
          thumbUrl:e.response.data.address,
          status:e.status,
        }
      })
      this.onOK(upLoadfiles);
    }
  }


  render(){
    const authData = getCookie('authData');
    const { showCurentUpload } = this.state;
    console.log(showCurentUpload);
    const { uploadPath, imgStyle } = this.props;
    const imageProps = {
			action: `${uploadPath}`,
      onChange: this.handleUpload,
			listType: "picture-card",
      headers:{'Authorization': 'bearer ' + (authData ? JSON.parse(authData).access_token : '')},
      beforeUpload:this.beforeUpload
		};
    return (
      <div className={styles.singleImgUploader}>
        {showCurentUpload && <Upload
          { ...imageProps }
        >
          <div className={imgStyle}>
            <Icon type="plus" />
            <div className="ant-upload-text">点击上传</div>
          </div>
        </Upload>}
        {!showCurentUpload && <Upload 
          { ...imageProps }
        >
          <div className={imgStyle}>
            <Icon type="plus" />
            <div className="ant-upload-text">点击上传</div>
          </div>
        </Upload>}
      </div>
    )
  }
}

export default SingleImgUploader;
