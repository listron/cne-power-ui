import React, { Component } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';

class UploadedImgModal extends Component {
  static propTypes = {
    showImg: PropTypes.bool,
    hideImg: PropTypes.fun,
  }
  constructor(props) {
    super(props);
  }
  handleCancel = () =>{
    this.props.hideImg()
  }
  

  render() {
    const { showImg } = this.props;
    return (
      <Modal visible={showImg} footer={null} onCancel={this.handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    )
    
  }
}
export default UploadedImgModal;