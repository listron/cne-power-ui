/* eslint-disable radix */
import React, { Component } from 'react';
import { Upload, message, Icon } from 'antd';
import styles from './uploader.scss';
import PropTypes from 'prop-types';
import UploadedImg from './UploadedImg';
import ImgListModal from './ImgListModal';
import Cookie from 'js-cookie';

/*
  图片上传共用组件：
  说明： 
    1. 要求组件必须传输属性：路径(uploadPath)
    2. 选填属性： 图片数量上限(max默认为4)，图片大小限制(limitSize默认2*1024*1024)，是否可编辑(editable默认不可编辑查看状态)，每张图片的缩略展示大小(imgStyle默认{width:'104px',height:'104px'})
    3. 已有图片数组信息（data）选填，默认为[],数组中，uid,rotate,thumbUrl必须提供，否则无法正确渲染图片
    props of data: [{   //props of data
      uid: -1,    //必填
      rotate: 0,  //必填
      name: 'xxx.png', 
      status: 'done',  
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',  //必填
    }],
    4. 输出参数为this.props.onOK调用，输入格式同data数组。this.props.onOK([
      {
        response:e.response.result,
        imgStyle,
        uid: -1,    
        rotate: 0,  
        name: 'xxx.png', 
        status: 'done',   
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',   
      }
    ])对于form表单包装的组件，会同时调用this.props.onChange()
*/

class ImgUploader extends Component {
  static propTypes = {
    max: PropTypes.number, //图片最大数量 
    limitSize: PropTypes.number, //图片大小限制
    uploadPath: PropTypes.string, //上传
    editable: PropTypes.bool, //是否可编辑(右旋+删除)
    data: PropTypes.array, //输入图片信息列表
    onChange: PropTypes.func, //输出
    onOK: PropTypes.func, //输出
    imgStyle: PropTypes.object, //图片样式
  }
  static defaultProps = {
    max: 4,
    limitSize: 2 * 1024 * 1024,
    editable: false,
    imgStyle: { width: '104px', height: '104px' },
  }
  constructor(props) {
    super(props);
    this.state = {
      imageListShow: false,
      currentImgIndex: 0,
      fileList: props.data || [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.data || nextProps.data.length === 0) { // 外界要求清空列表时清空已上传文件列表。
      this.setState({ fileList: [] });
    }
  }

  onOK = (imgList, editFileList) => {
    const { onChange, onOK } = this.props;
    onOK && onOK(imgList);
    onChange && onChange(imgList);
    editFileList && this.setState({ fileList: editFileList });
  }

  beforeUpload = (file, fileList) => {
    const isIMG = /^image/.test(file.type);
    const { limitSize, max, data } = this.props;
    const isLimitSize = file.size > limitSize;
    const isLimitNum = (fileList.length + (data && data.length || 0)) > max;
    if (!isIMG) {
      message.error('只支持图片上传！');
    }
    if (isLimitSize) {
      message.error(`图片上传大小不得超过${parseInt(limitSize / 1024 / 1024)}M！`);
    }
    if (isLimitNum) {
      message.error(`图片数量超限，不得超过${max}张！`);
    }
    return isIMG && !isLimitSize && !isLimitNum;
  }

  handleUpload = ({ file, fileList }) => {
    const { imgStyle, data } = this.props;
    if (file.status !== 'uploading') {
      const upLoadfiles = fileList.map(e => {
        const rotateObj = data && data.find(m => m.uid === e.uid);
        const rotate = (rotateObj && rotateObj.rotate) || 0;
        const response = e.response ? e.response.data.address : e.thumbUrl;
        return {
          uid: e.uid,
          name: e.name,
          rotate,
          response,
          thumbUrl: response,
          status: e.status,
          imgStyle,
        };
      });
      this.onOK(upLoadfiles);
    }
    this.setState({ fileList });
  }

  showImg = (index) => {
    this.setState({
      imageListShow: true,
      currentImgIndex: index,
    });
  }

  hideImg = () => {
    this.setState({
      imageListShow: false,
    });
  }

  changeCurrentImgIndex = (index) => {
    this.setState({
      currentImgIndex: index,
    });
  }

  render() {
    const authData = localStorage.getItem('authData') || '';
    const { imageListShow, currentImgIndex, fileList } = this.state;
    const { uploadPath, max, data, editable, imgStyle } = this.props;
    const imageProps = {
      action: `${uploadPath}`,
      onChange: this.handleUpload,
      multiple: true,
      fileList,
      listType: 'picture-card',
      headers: { 'Authorization': 'bearer ' + authData },
      beforeUpload: this.beforeUpload,
    };
    const uploadButton = (
      <div className={styles.uploadBtn}>
        <Icon type="plus" className={styles.add} />
        <div className={styles.text}>点击上传</div>
      </div>
    );
    return (
      <div className={styles.imgUploader}>
        {data && data.length > 0 && data.map((e, i) => (
          <UploadedImg
            editable={editable}
            fileList={fileList}
            showImg={this.showImg}
            key={e.uid}
            {...e}
            index={i}
            data={data}
            onEdit={this.onOK} />
        ))}
        {editable && <Upload
          className={styles.loaderHandler}
          style={imgStyle}
          {...imageProps}
        >
          {(data && data.length >= max) ? null : uploadButton}
        </Upload>}
        <ImgListModal
          data={data}
          imageListShow={imageListShow}
          hideImg={this.hideImg}
          currentImgIndex={currentImgIndex}
          changeCurrentImgIndex={this.changeCurrentImgIndex}
        />
      </div>
    );
  }
}
export default ImgUploader;
