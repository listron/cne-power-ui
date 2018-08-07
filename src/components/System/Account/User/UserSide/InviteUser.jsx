

import React, { Component } from 'react';
import { Icon, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './userSide.scss';
import WarningTip from '../../../../Common/WarningTip';
import { CopyToClipboard } from 'react-copy-to-clipboard';

//用户邀请页
class InviteUser extends Component {
  static propTypes = {
    changeUserStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state={
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
      copied: false,
    }
  }

  onWarningTipShow = () =>{
    this.setState({
      showWarningTip: true,
    })
  }
  
  onCopy = () => {
    this.setState({copied: true})
    setTimeout(()=>this.setState({ copied: false}), 2000);
  }

  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
  }

  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
    this.props.changeUserStore({
      showPage: 'list',
    });
  }

  render(){
    const { showWarningTip, warningTipText, copied } = this.state;
    const tmpLink = "https://www.cnegroup.com";
    return (
      <div className={styles.inviteUser} >
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}      
        <div className={styles.editTop}>
          <span className={styles.text}>编辑</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onWarningTipShow} />
        </div>
        <div className={styles.mainPart} >
          <div className={styles.inviteMainPart} >
            <div>二维码<span>有效期为7天(有效期至2018-08-03)</span>，请尽快分享给用户加入系统~</div>
            <div className={styles.inviteOperate} >
              <Input value={tmpLink} type="text" readOnly={true}  className={styles.inviteInput} />
              <CopyToClipboard text={tmpLink} onCopy={this.onCopy}>
                <Button className={styles.copyBtn} >复制链接</Button>
              </CopyToClipboard>
              {copied && <Button>复制成功!</Button>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default InviteUser;
