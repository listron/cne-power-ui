

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload, Button, message } from 'antd';
import path from '@path';
// import styles from './list.scss';

class Uploader extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
  }

  beforeUpload = (file) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
    if (!isExcel) {
      message.error('请上传Excel文件!');
    }
    return isExcel;
  }

  uploadChange = (info) => {
    if (info.file.status === 'done') {
      if (info.file.response.code === '10000') {
        message.success(`${info.file.name} 导入完成`);
        // todo 批量导入成功后, 回归默认状态请求 未分配部门人员页面
        // const params = {
        //   enterpriseId: this.props.enterpriseId,
        //   userStatus: this.props.userStatus,
        //   roleId: this.props.roleId,
        //   pageNum: this.props.pageNum,
        //   pageSize: this.props.pageSize,
        // };
        // this.props.getUserList(params);
      } else {
        message.error(info.file.response.message);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 导入失败，请重新导入.`);
    }
  }

  render(){
    const { enterpriseId } = this.props;
    const url = path.basePaths.APIBasePath + path.APISubPaths.system.import;
    const authData = localStorage.getItem('authData')|| '';
    const uploadProps = {
      name: 'file',
      action: url,
      headers: { 'Authorization': 'bearer ' + ((authData && authData !== 'undefined') ? authData : '') },
      beforeUpload: this.beforeUpload,
      data: { enterpriseId },
      onChange: this.uploadChange,
    };
    return (
      <Upload {...uploadProps}>
        <Button>批量导入</Button>
      </Upload>
    );
  }
}

export default Uploader;


