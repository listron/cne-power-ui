

import React, { Component } from 'react';
import { Icon, Popconfirm, Input, Button, message } from 'antd';
import PropTypes from 'prop-types';
import styles from './userSide.scss';
import WarningTip from '../../../../Common/WarningTip';
import { CopyToClipboard } from 'react-copy-to-clipboard';

//企业信息编辑页
class InviteUser extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    changeUserStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state={
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
      copySuccess: false,
    }
  }
  componentWillReceiveProps(){
    
  }
  onWarningTipShow = () =>{
    this.setState({
      showWarningTip: true,
    })
  }
  onCopyLink = () => {

  }
  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
    this.props.changeUserStore({
      showPage: 'list',
    });
  }

  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
  }
  
  render(){
    const { loading } = this.props;
    const { showWarningTip, warningTipText, copySuccess } = this.state;
    return (
      <div className={styles.inviteUser} >
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}      
        <div className={styles.editTop}>
          <span className={styles.text}>编辑</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onWarningTipShow} />
        </div>
        <div className={styles.mainPart} >
          <div>二维码<span>有效期为7天(有效期至2018-08-03)</span>，请尽快分享给用户加入系统~</div>
          <Input value="rytuihgfghjkl" type="text" readOnly={true} id="linkInput" /><Button data-clipboard-target="#linkInput" className="copyBtn" onClick={this.onCopyBtn} >复制链接</Button>{copySuccess && <Button>复制成功</Button>}
        </div>
      </div>
    )
  }
}

export default InviteUser;
