import React, { Component } from 'react';
import ImgModal from './UploadedImgModal';
import styles from './uploader.scss';
import PropTypes from 'prop-types';

class UploadedImgModal extends Component {
  static propTypes = {
    thumbUrl: PropTypes.string,
    name: PropTypes.string,
    imgStyle: PropTypes.object,
    value: PropTypes.array,
    uid: PropTypes.any,
    onEdit: PropTypes.func,
    rotate: PropTypes.number,
  }
  constructor(props) {
    super(props);
    this.state={
      showImg: false
    }
  }
  showImg = () => {
    this.setState({
      showImg: true
    })
  }
  hideImg = () => {
    this.setState({
      showImg: false
    })
  }
  rotateImg = () =>{
    const { value, uid, onEdit } = this.props;
    const fileList = value.map(e=>{
      if(uid === e.uid){ 
        e.rotate += 90
        e.rotate >= 360 ? e.rotate = e.rotate -360 : null;
      }
      return e
    })
    onEdit(fileList)
  }
  deleteImg = () => {
    const { value, uid, onEdit } = this.props
    const fileList = value.filter(e=>e.uid !== uid)
    onEdit(fileList)
  }
  

  render() {
    const { thumbUrl, name, imgStyle, rotate, value  } = this.props;
    const { showImg } = this.state;
    const imgStyleContr = {...imgStyle,transform:`rotate(${rotate}deg)`};
    return (
      <div className={styles.uploadedImg}>
        <img src={ thumbUrl } alt={name} style={imgStyleContr} onClick={this.showImg} />
        <span className={styles.bottomHandler}>
          <span className={styles.eachHandler} onClick={this.rotateImg}>右旋</span>
          <span className={styles.eachHandler} onClick={this.deleteImg}>删除</span>
        </span>
        <ImgModal showImg={showImg} value={value} hideImg={this.hideImg} />
        {/* <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal> */}
      </div>
    )
    
  }
}
export default UploadedImgModal;