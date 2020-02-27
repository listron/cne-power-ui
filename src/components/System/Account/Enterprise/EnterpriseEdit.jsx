

import React, { Component } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';
import EditForm from './EditForm';
import SingleImgUploader from '../../../Common/Uploader/SingleImgUploader';
import pathConfig from '../../../../constants/path';
import WarningTip from '../../../Common/WarningTip';

//企业信息编辑页
class EnterpriseEdit extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    enterpriseId: PropTypes.string,
    changeEnterpriseStore: PropTypes.func,
    getEnterpriseDetail: PropTypes.func,
    saveEnterpriseInfor: PropTypes.func,
    enterpriseDetail: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      enterpriseLogo: props.enterpriseDetail && props.enterpriseDetail.enterpriseLogo,
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    };
  }

  componentWillUnmount() {
    this.props.changeEnterpriseStore({
      showPage: 'detail',
    });
  }

  onWarningTipShow = () => {
    this.setState({
      showWarningTip: true,
    });
  }

  uploadLogo = (imgInfor) => {
    this.setState({
      enterpriseLogo: imgInfor.thumbUrl,
    });
  }

  confirmWarningTip = () => {
    this.props.changeEnterpriseStore({
      showPage: 'detail',
    });
  }

  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }

  render() {
    const { enterpriseLogo } = this.state;
    const { enterpriseId, enterpriseDetail, saveEnterpriseInfor, loading } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    const uploadPath = `${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`;
    return (
      <div className={styles.enterpriseEdit} >
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.editTop}>
          <span className={styles.text}>编辑</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} onClick={this.onWarningTipShow} />
        </div>
        <div className={styles.mainPart} >
          <div className={styles.logoPart} >
            <SingleImgUploader uploadPath={uploadPath} onOK={this.uploadLogo} data={{ thumbUrl: enterpriseLogo }} />
            <div className={styles.instruction}>
              <span>LOGO上传</span>
              <span>240px*240px为佳，大小不超过2M</span>
            </div>
          </div>
          <EditForm
            enterpriseDetail={enterpriseDetail}
            enterpriseLogo={enterpriseLogo}
            saveEnterpriseInfor={saveEnterpriseInfor}
            loading={loading}
            enterpriseId={enterpriseId}
          />
        </div>
      </div>
    );
  }
}

export default EnterpriseEdit;
