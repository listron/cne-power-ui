

import React, { Component } from 'react';
import { Button, Upload, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';
import EditForm from './EditForm';
import SingleImgUploader from '../../Common/Uploader/SingleImgUploader';
import pathConfig from '../../../constants/path';

class EnterpriseEdit extends Component {
  static propTypes = {
    changeEnterpriseAttr: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  render(){
    const { changeEnterpriseAttr } = this.props;
    const uploadPath=`${pathConfig.basePaths.newAPIBasePath}${pathConfig.commonPaths.imgUploads}`;
    return (
      <div className={styles.enterpriseEdit} >
          <div className={styles.topHandler}>
            <span className={styles.text}>编辑</span>
          </div>
          <div className={styles.editPart} >
            <SingleImgUploader uploadPath={uploadPath} />
            <EditForm />
          </div>
          这个是新增啊编辑啊的页面，是吧！！
          
          <Button type="primary" onClick={()=>changeEnterpriseAttr({showPage:'detail'})}>保存</Button>
      </div>
    )
  }
}

export default EnterpriseEdit;
