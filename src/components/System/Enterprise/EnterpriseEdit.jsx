

import React, { Component } from 'react';
import { Icon, Popconfirm } from 'antd';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';
import EditForm from './EditForm';
import SingleImgUploader from '../../Common/Uploader/SingleImgUploader';
import pathConfig from '../../../constants/path';
//企业信息编辑页
class EnterpriseEdit extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    changeEnterpriseStore: PropTypes.func,
    getEnterpriseDetail: PropTypes.func,
    saveEnterpriseInfor: PropTypes.func,
    enterpriseDetail: PropTypes.object,
  }

  constructor(props){
    super(props);
    this.state={
      enterpriseLogo: props.enterpriseDetail.enterpriseLogo,
    }
  }
  componentWillUnmount(){
    this.props.changeEnterpriseStore({
      showPage: 'detail',
    });
  }
  uploadLogo = (imgInfor) => {
    this.setState({
      enterpriseLogo: imgInfor.thumbUrl
    })
  }

  cancelEdit = () => {
    this.props.changeEnterpriseStore({
      showPage: 'detail',
      enterpriseDetail:{}
    });
  }

  

  render(){
    const { enterpriseLogo } = this.state;
    const { enterpriseDetail,saveEnterpriseInfor, loading } = this.props;
    const uploadPath=`${pathConfig.basePaths.newAPIBasePath}${pathConfig.commonPaths.imgUploads}`;
    return (
      <div className={styles.enterpriseEdit} >
        <div className={styles.editTop}>
          <span className={styles.text}>编辑</span>
          <Popconfirm overlayClassName={styles.cancelEdit} placement="rightBottom" title="退出后信息无法保存！" onConfirm={this.cancelEdit} okText="确定" cancelText="取消">
            <Icon type="arrow-left" className={styles.backIcon} />
          </Popconfirm>
        </div>
        <div className={styles.mainPart} >
          <div className={styles.logoPart} >
            <SingleImgUploader uploadPath={uploadPath} onOK={this.uploadLogo} data={{thumbUrl:enterpriseLogo}} />
            <div className={styles.instruction}>
              <span>LOGO上传</span>
              <span>240px*240px为佳，大小不超过2M</span>
            </div>
          </div>
          <EditForm enterpriseDetail={enterpriseDetail} enterpriseLogo={enterpriseLogo} saveEnterpriseInfor={saveEnterpriseInfor} loading={loading} />
        </div>
      </div>
    )
  }
}

export default EnterpriseEdit;
