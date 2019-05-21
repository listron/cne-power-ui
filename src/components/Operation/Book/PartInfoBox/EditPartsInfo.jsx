import React from "react";
import PropTypes from "prop-types";
import styles from "./partInfoBox.scss";
import { Button, Table,  Icon,Input, } from 'antd';

import WarningTip from '../../../../components/Common/WarningTip';

class EditPartsInfo extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    }
  }
  backToList=()=>{
    this.props.changePartInfoStore({ showPage: 'list' });
    this.props.onShowSideChange('list');
  }
  render() {
    const { showWarningTip, warningTipText, } = this.state;
    return (
      <div className={styles.editDevice}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.editTop}>
          <span className={styles.text}>编辑</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToList} />
        </div>
       这是form
      </div>
    )
  }
}
export default (EditPartsInfo)