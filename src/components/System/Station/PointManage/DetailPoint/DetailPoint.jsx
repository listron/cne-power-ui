import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';
import WarningTip from '../../../../../components/Common/WarningTip';
import styles from '../pointSide.scss';
import { leftInfo, rightInfo } from './detailInfomation';
import AddPointInfoPart from '../AddPoint/AddPointInfoPart';

class DetailPoint extends React.Component {
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
    if (this.state.warningTipText !== '退出后信息无法保存!') {
      //发送删除该测点的请求
      console.log('删除该测点');
    }
  }
  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }
  showEditPage = () => {
    this.props.changePointManageStore({
      showPage: 'edit',
    });
  }
  deletePoint = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '确定要删除改测点?',
    });
  }

  render() {
    const { showWarningTip, warningTipText } = this.state;
    const { pointDetailData = {} } = this.props;
    const leftData = leftInfo(pointDetailData);
    const rightData = rightInfo(pointDetailData);
    return (
      <div className={styles.pointDetail}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.pageTop}>
          <div className={styles.leftContainer}>
            <span className={styles.text}>详情</span>
            <span >
              <Button className={styles.saveBtn} onClick={this.showEditPage}>编辑</Button>
              <Button className={styles.saveBtn} onClick={this.deletePoint}>删除</Button>
            </span>
          </div>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onWarningTipShow} />
        </div>
        <div className={styles.pageContainer}>
          <div className={styles.left}>
            {/* {this.detailInfoPart(leftData)} */}
            <AddPointInfoPart data={leftData} />
          </div>
          <div className={styles.right}>
            <AddPointInfoPart data={rightData} />
            {/* {this.detailInfoPart(rightData)} */}

          </div>
        </div>

      </div>
    );
  }
}
export default (DetailPoint);
