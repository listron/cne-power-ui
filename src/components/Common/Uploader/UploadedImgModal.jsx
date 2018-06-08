import React, { Component } from 'react';
import { Upload, Modal, message, Icon } from 'antd';
import styles from './uploader.scss';
import PropTypes from 'prop-types';

class UploadedImgModal extends Component {
  static propTypes = {
    thumbUrl: PropTypes.string,
    name: PropTypes.string,
    imgStyle: PropTypes.object,
  }
  constructor(props) {
    super(props);
  }
  

  render() {
    const { thumbUrl, name, imgStyle  } = this.props
    return (
      <div className={styles.uploadedImg}>
        <img src={ thumbUrl } alt={name} style={imgStyle} />
        <span className={styles.bottomHandler}>
          <span>右旋</span>
          <span>删除</span>
        </span>
        {/* <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal> */}
      </div>
    )
    
  }
}
export default UploadedImgModal;