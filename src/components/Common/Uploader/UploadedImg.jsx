import React, { Component } from 'react';
import styles from './uploader.scss';
import PropTypes from 'prop-types';

class UploadedImg extends Component {
  static propTypes = {
    thumbUrl: PropTypes.string,
    name: PropTypes.string,
    imgStyle: PropTypes.object,
    data: PropTypes.array,
    uid: PropTypes.any,
    onEdit: PropTypes.func,
    rotate: PropTypes.number,
    showImg: PropTypes.func,
    index: PropTypes.number,
    editable: PropTypes.bool,
    fileList: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.showImg = this.showImg.bind(this);
    this.rotateImg = this.rotateImg.bind(this);
    this.deleteImg = this.deleteImg.bind(this);
  }

  showImg() {
    const { index } = this.props;
    this.props.showImg(index);
  }

  rotateImg() {
    const { data, uid, onEdit } = this.props;
    const imgList = data && data.length > 0 && data.map(e=>{
      if(uid === e.uid){ 
        e.rotate += 90
        e.rotate >= 360 ? e.rotate = e.rotate -360 : null;
      }
      return e;
    });
    onEdit(imgList);
  }

  deleteImg() {
    const { data, uid, onEdit, fileList } = this.props;
    const imgList = data.filter(e=>e.uid !== uid);
    const editFileList = fileList.filter(e=>e.uid !== uid);
    onEdit(imgList,editFileList);
  }

  render() {
    const { thumbUrl, name, imgStyle, rotate, editable  } = this.props;
    const imgStyleContr = {...imgStyle,transform:`rotate(${rotate}deg)`};
    return (
      <div className={styles.uploadedImg}>
        <img 
          src={ thumbUrl } 
          alt={name} 
          style={imgStyleContr} 
          onClick={this.showImg} />
        {editable && <span className={styles.bottomHandler}>
          <span className={styles.eachHandler} onClick={this.rotateImg}>右旋</span>
          <span className={styles.eachHandler} onClick={this.deleteImg}>删除</span>
        </span>}
      </div>
    );  
  }
}
export default UploadedImg;