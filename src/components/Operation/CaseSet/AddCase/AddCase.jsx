import React from 'react';
import PropTypes from 'prop-types';
import styles from '../CasePartSide.scss';
import { Icon } from 'antd';
import WarningTip from '../../../../components/Common/WarningTip';
import AddCaseForm from './AddCaseForm';
class AddCase extends React.Component {
  static propTypes = {
    changeCasePartStore: PropTypes.func,

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
    this.props.changeCasePartStore({
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
      <div className={styles.caseAdd}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.pageTop}>
          <span className={styles.text}>添加案例集</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} onClick={this.onWarningTipShow} />
        </div>
        <AddCaseForm {...this.props} />

      </div>
    );
  }
}
export default (AddCase);
