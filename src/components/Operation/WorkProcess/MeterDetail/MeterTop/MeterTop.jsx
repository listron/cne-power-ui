import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import CneTips from '@components/Common/Power/CneTips';
import styles from './meterTop.scss';

export default class MeterTop extends React.Component {
  static propTypes = {
    meterDetail: PropTypes.object,
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
    };
  }

  onCancelEdit = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '返回后修改内容将不会保存!',
    });
  };

  onCancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  };

  onConfirmWarningTip = () => {
    this.setState({
      showWarningTip: true,
    }, () => {
      const { history } = this.props;
      const { pathname } = history.location;
      history.push(`${pathname}?page=list&tab=meter`);
    });
  };

  render() {
    const { showWarningTip, warningTipText } = this.state;
    return (
      <React.Fragment>
        <div className={styles.meterTop} >
          <div className={styles.meterTopTitle}>
            <div className={styles.titleBox}>
              <i className="iconfont icon-gdxq" />
            </div>
            <span>工单详情</span>
          </div>
          <div className={styles.meterTopBtn}>
            <div className={styles.btnBox}>
              <Button
                className={`${styles.btnGreen} ${styles.am} ${styles.amGreenScale}`}
                onClick={this.exportHistory}
              >
              <span>
                <i className="iconfont icon-wrong" />
                <span>驳回</span>
              </span>
              </Button>
              <Button
                className={`${styles.btnOrange} ${styles.am} ${styles.amOrangeScale}`}
                onClick={this.exportHistory}
              >
              <span>
                <i className="iconfont icon-lingqu" />
                <span>领取</span>
              </span>
              </Button>
            </div>
            <div className={styles.btnBack} onClick={this.onCancelEdit}>
              <i className="iconfont icon-fanhui" />
            </div>
          </div>
        </div>
        <CneTips
          visible={showWarningTip}
          width={260}
          onCancel={this.onCancelWarningTip}
          onConfirm={this.onConfirmWarningTip}
          tipText={warningTipText}
        />
      </React.Fragment>
    );
  }
}
