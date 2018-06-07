import React, { Component } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import PropTypes from 'prop-types';

class ImgUploader extends Component {
  static propTypes = {
    code: PropTypes.object,
    phone: PropTypes.object,
    history:PropTypes.array,
    form:PropTypes.func,
    error: PropTypes.string,
    isFetching: PropTypes.bool,
    changePSW:PropTypes.func
  }
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>图片上传插件</div>
    )
  }
}
export default ImgUploader;