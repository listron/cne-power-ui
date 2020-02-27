

import React, { Component } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './userSide.scss';
import EditForm from './EditForm';
import SingleImgUploader from '../../../../Common/Uploader/SingleImgUploader';
import pathConfig from '../../../../../constants/path';
import WarningTip from '../../../../Common/WarningTip';

//用户编辑页
class EditUser extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    changeUserStore: PropTypes.func,
    saveUserInfor: PropTypes.func,
    userDetail: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      userLogo: props.userDetail && props.userDetail.toJS().userLogo, // 这句话有屁用？用props到render不行？渣渣代码乱写。

      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    };
  }

  onWarningTipShow = () => {
    this.setState({
      showWarningTip: true,
    });
  }

  uploadLogo = (imgInfor) => {
    this.setState({
      userLogo: imgInfor.thumbUrl,
    });
  }

  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.props.changeUserStore({
      showPage: 'list',
    });
  }

  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }

  render() {
    const { userLogo } = this.state;
    const { userDetail, saveUserInfor, loading } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    const uploadPath = `${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`;
    return (
      <div className={styles.editUser} >
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.editTop}>
          <span className={styles.text}>编辑</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} onClick={this.onWarningTipShow} />
        </div>
        <div className={styles.mainPart} >
          <div className={styles.logoPart} >
            <SingleImgUploader uploadPath={uploadPath} onOK={this.uploadLogo} data={{ thumbUrl: userLogo }} />
            <div className={styles.instruction}>
              <span>头像上传</span>
              <span>240px*240px为佳，大小不超过2M</span>
            </div>
          </div>
          <EditForm
            userDetail={userDetail}
            userLogo={userLogo}
            saveUserInfor={saveUserInfor}
            loading={loading}
            {...this.props}
          />
        </div>
      </div>
    );
  }
}

export default EditUser;
