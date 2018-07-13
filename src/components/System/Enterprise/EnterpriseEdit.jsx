

import React, { Component } from 'react';
import { Button, Upload, Icon } from 'antd';
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
    enterpriseDetail: PropTypes.object,
  }

  constructor(props){
    super(props);
  }

  // componentDidMount(){//数据获取来源于企业详情的数据请求
  //   this.props.getEnterpriseDetail()
  // }

  render(){
    const { changeEnterpriseAttr, enterpriseDetail } = this.props;
    const uploadPath=`${pathConfig.basePaths.newAPIBasePath}${pathConfig.commonPaths.imgUploads}`;
    return (
      <div className={styles.enterpriseEdit} >
          <div className={styles.topHandler}>
            <span className={styles.text}>编辑</span>
          </div>
          <div className={styles.mainPart} >
            <div className={styles.logoPart} >
              <SingleImgUploader uploadPath={uploadPath} />
              <div className={styles.instruction}>
                <span>LOGO上传</span>
                <span>240px*240px为佳，大小不超过2M</span>
              </div>
            </div>
            <EditForm enterpriseDetail={enterpriseDetail} />
          </div>
          <Button type="primary" onClick={()=>changeEnterpriseAttr({showPage:'detail'})}>保存</Button>
      </div>
    )
  }
}

export default EnterpriseEdit;
