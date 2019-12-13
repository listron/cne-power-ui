

import React, { Component } from 'react';
import { Upload, Button, message } from 'antd';
import PropTypes from 'prop-types';
import path from '@path';
import Cookie from 'js-cookie';

class Uploader extends Component {

  static propTypes = {
    getUserList: PropTypes.func,
    getAllUserBase: PropTypes.func,
    getDepartmentTreeData: PropTypes.func,
    getRoleAllList: PropTypes.func,
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
        // const params = {
        //   enterpriseId: this.props.enterpriseId,
        //   userStatus: this.props.userStatus,
        //   roleId: this.props.roleId,
        //   pageNum: this.props.pageNum,
        //   pageSize: this.props.pageSize,
        // };
        // this.props.getUserList(params);
        this.props.getUserList();
        this.props.getAllUserBase();
        this.props.getDepartmentTreeData();
        this.props.getRoleAllList();
    // 初入页面 请求企业下所有用户基础信息 + 请求部门列表树 + 请求默认未分配部门用户信息
      } else {
        message.error(info.file.response.message);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 导入失败，请重新导入.`);
    }
  }

  render(){
    const url = `${path.basePaths.APIBasePath}${path.APISubPaths.system.importUserBatch}`;
    const authData = localStorage.getItem('authData')|| '';
    const enterpriseId = Cookie.get('enterpriseId') || '';
    const uploadProps = {
      name: 'file',
      action: url,
      headers: { 'Authorization': 'bearer ' + ((authData && authData !== 'undefined') ? authData : '') },
      beforeUpload: this.beforeUpload,
      data: { enterpriseId },
      onChange: this.uploadChange,
      showUploadList: false,
    };
    return (
      <Upload {...uploadProps}>
        <Button>批量导入</Button>
      </Upload>
    );
  }
}

export default Uploader;


