import React, { Component } from 'react';
import CneButton from '@components/Common/Power/CneButton';
import CneTips from '@components/Common/Power/CneTips';
// import PropTypes from 'prop-types';
import styles from './topSubmit.scss';

export default class DetailTopSubmit extends Component {

  static propTypes = {

  };

  state = {
    showTip: false,
    tipText: '',
  };

  onBackHandle = () => { // 返回按钮 => 根据状态, 是否提示弹框
    this.setState({
      showTip: true,
      tipText: '返回列表啦？？',
    });
  }

  onCancelTip = () => {
    this.setState({
      showTip: false,
      tipText: '',
    });
  }

  onConfirmTip = () => {
    this.setState({
      showTip: false,
      tipText: '',
    });
  }

  render() {
    // const { allowedActions } = allowedActions || [];
    const { showTip, tipText } = this.state;
    return (
      <React.Fragment>
        <div className={styles.topSubmit}>
          <div className={styles.detailTitle}>
            <i className="iconfont icon-gdxq" />
            <span className={styles.titleText}>创建工单 或 工单详情</span>
          </div>
          <div className={styles.handlePart}>
            <CneButton
              onClick={this.onSendBack}
              className={styles.handleButton}
              style={{width: '92px'}}
            >
              退回
            </CneButton>
            <CneButton
              onClick={this.onPublish}
              className={styles.handleButton}
            >
              派发
            </CneButton>
            <i className="iconfont icon-fanhui" onClick={this.onBackHandle} />
          </div>
          <CneTips
            visible={showTip}
            width={260}
            onCancel={this.onCancelTip}
            onConfirm={this.onConfirmTip}
            tipText={tipText}
          />
        </div>
      </React.Fragment>
    );
  }
}
