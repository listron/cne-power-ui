import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';
import WarningTip from '../../../../../components/Common/WarningTip';
import styles from '../pointSide.scss';

class EditPoint extends React.Component {
  static propTypes = {
    changePointManageStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    };
  }
  onWarningTipShow = () => {
    this.setState({
      showWarningTip: true,
    });
  }
  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.props.changePointManageStore({
      showPage: 'list',
    });
  }
  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }
  render() {
    const { showWarningTip, warningTipText } = this.state;
    return (
      <div className={styles.pointEdit}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.pageTop}>
          <span> <Button className={styles.saveBtn}>保存</Button></span>

          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onWarningTipShow} />
        </div>
      </div>
    );
  }
}
export default (EditPoint);
