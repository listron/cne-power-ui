import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';
import WarningTip from '../../../../../components/Common/WarningTip';
import styles from '../pointSide.scss';
import { leftInfo, rightInfo } from './detailInfomation';
import AddPointInfoPart from '../AddPoint/AddPointInfoPart';
import EditPoint from '../EditPoint/EditPoint';

class DetailPoint extends React.Component {
  static propTypes = {
    changePointManageStore: PropTypes.func,
    deletePoints: PropTypes.func,
    pointDetail: PropTypes.object,
    showPage: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    };
  }
  onWarningTipShow = () => {
    // this.setState({
    //   showWarningTip: true,
    //   warningTipText: '退出后信息无法保存!',
    // });
    this.props.changePointManageStore({
      showPage: 'list',
    });
  }
  confirmWarningTip = () => {
    const { pointDetail } = this.props;
    this.setState({
      showWarningTip: false,
    });
    this.props.changePointManageStore({
      showPage: 'list',
    });
    if (this.state.warningTipText === '确定要删除此测点吗?') {
      //发送删除该测点的请求
      this.props.deletePoints({
        devicePointIds: [pointDetail.devicePointId],
      });
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
      warningTipText: '确定要删除此测点吗?',
    });
  }

  render() {
    const { showWarningTip, warningTipText } = this.state;
    const { pointDetail, showPage } = this.props;
    const leftData = leftInfo(pointDetail);
    const rightData = rightInfo(pointDetail);
    if (showPage === 'detail') {
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
            <i className={`iconfont icon-fanhui ${styles.backIcon}`} onClick={this.onWarningTipShow} />
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
    } else if (showPage === 'edit') {
      return (<EditPoint {...this.props} />);
    }
    return (<div></div>);



  }
}
export default (DetailPoint);
