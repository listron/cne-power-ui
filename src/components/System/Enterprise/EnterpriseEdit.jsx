

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';
import EditForm from './EditForm';
import SingleImgUploader from '../../Common/Uploader/SingleImgUploader';
import pathConfig from '../../../constants/path';
//企业信息编辑页
class EnterpriseEdit extends Component {
  static propTypes = {
    changeEnterpriseAttr: PropTypes.func,
    getEnterpriseDetail: PropTypes.func,
    saveEnterpriseInfor: PropTypes.func,
    enterpriseDetail: PropTypes.object,
  }

  constructor(props){
    super(props);
    this.state={
      logoImg: props.enterpriseDetail.enterpriseLogo,
    }
  }

  // componentDidMount(){//数据获取来源于企业详情的数据请求
  //   this.props.getEnterpriseDetail()
  // }
  uploadLogo = (imgInfor) => {
    console.log(imgInfor)
    this.setState({
      logoImg: imgInfor.thumbUrl
    })
  }

  render(){
    const { logoImg } = this.state;
    const { enterpriseDetail,saveEnterpriseInfor } = this.props;
    const uploadPath=`${pathConfig.basePaths.newAPIBasePath}${pathConfig.commonPaths.imgUploads}`;
    return (
      <div className={styles.enterpriseEdit} >
          <div className={styles.topHandler}>
            <span className={styles.text}>编辑</span>
          </div>
          <div className={styles.mainPart} >
            <div className={styles.logoPart} >
              <SingleImgUploader uploadPath={uploadPath} onOK={this.uploadLogo} />
              <div className={styles.instruction}>
                <span>LOGO上传</span>
                <span>240px*240px为佳，大小不超过2M</span>
              </div>
            </div>
            <EditForm enterpriseDetail={enterpriseDetail} logoImg={logoImg} saveEnterpriseInfor={saveEnterpriseInfor} />
          </div>
      </div>
    )
  }
}

export default EnterpriseEdit;
