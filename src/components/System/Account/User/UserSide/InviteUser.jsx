

import React, { Component } from 'react';
import { Icon, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './userSide.scss';
import WarningTip from '../../../../Common/WarningTip';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import moment from 'moment';

//用户邀请页
class InviteUser extends Component {
  static propTypes = {
    changeUserStore: PropTypes.func,
    inviteData: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
      copied: false,
      copyTip: '复制成功！',
    };
  }

  onWarningTipShow = () => {
    this.setState({
      showWarningTip: true,
    });
  }

  onCopy = (text, result) => {
    if (result) {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } else {
      this.setState({ copyTip: '复制失败，请重新复制！', copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    }

  }

  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
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



  render() {
    const { showWarningTip, warningTipText, copied, copyTip } = this.state;
    const { inviteData } = this.props;
    return (
      <div className={styles.inviteUser} >
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.editTop}>
          <span className={styles.text}>邀请</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} onClick={this.onWarningTipShow} />
        </div>
        <div className={styles.mainPart} >
          <div className={styles.inviteMainPart} >
            <div className={styles.qrTip} >二维码<span>有效期为7天(有效期至{moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss')})</span>，请尽快分享给用户加入系统~</div>
            <div className={styles.inviteOperate} >
              <Input value={inviteData.get('link')} type="text" readOnly={true} className={styles.inviteInput} />
              <CopyToClipboard text={inviteData.get('link')} onCopy={this.onCopy}>
                <Button className={styles.copyBtn} >复制链接</Button>
              </CopyToClipboard>
              {copied && <Button>{copyTip}</Button>}
            </div>
            <div className={styles.qrCode} >
              <img src={inviteData.get('QRLink')} />
              {/* <a href={inviteData.get('QRLink')} download="cnegroup" target="_blank" onClick={e=>console.log(e)} >下载二维码</a> */}
              <Button href={inviteData.get('QRLink')} download={inviteData.get('QRLink')} target="_blank" >下载二维码</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InviteUser;
