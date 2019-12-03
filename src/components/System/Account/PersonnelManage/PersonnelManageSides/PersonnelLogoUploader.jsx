

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SingleImgUploader from '@components/Common/Uploader/SingleImgUploader';
import path from '@path';
import styles from './side.scss';

class PersonnelLogoUploader extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  }

  uploadLogo = (imgInfor = {}) => {
    const { thumbUrl = '' } = imgInfor;
    this.props.onChange(thumbUrl);
  }

  render(){
    const { basePaths, commonPaths } = path;
    const { APIBasePath } = basePaths;
    const { imgUploads } = commonPaths;
    const uploadPath=`${APIBasePath}${imgUploads}`;
    const { value } = this.props;
    return (
      <div className={styles.logoPart} >
        <SingleImgUploader uploadPath={uploadPath} onOK={this.uploadLogo} data={{thumbUrl: value}} />
          <div className={styles.logotip}>头像上传</div>
          <div className={styles.logotip}>240px*240px为佳，大小不超过2M</div>
      </div>
    );
  }
}

export default PersonnelLogoUploader;
