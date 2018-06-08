import React, { Component } from 'react';
import { Upload, Modal, message, Icon } from 'antd';
import styles from './uploader.scss';
import PropTypes from 'prop-types';

class UploadedImgModal extends Component {
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
  }
  

  render() {
    return (
      <div className={styles.uploadedImg}>
        <img src='www.baidu.com' alt='12' style={}/>
        <span className={miniHandler}>
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