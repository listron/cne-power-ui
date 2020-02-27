

import React, { Component } from 'react';
import { Icon, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './stationSide.scss';
import WarningTip from '../../../../Common/WarningTip';
import Footer from '../../../../Common/Footer';
import EditForm from './EditForm';
import moment from 'moment';
class StationManageEdit extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    stationDetail: PropTypes.object,
    onShowSideChange: PropTypes.func,
    saveStationDetail: PropTypes.func,
    changeStationManageStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    };
  }

  cancelEdit = () => {
    this.setState({
      showWarningTip: true,
    });
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
    this.props.changeStationManageStore({ showPage: 'detail' });
    this.props.onShowSideChange({ showSidePage: 'detail' });
  }

  departmentInfoFun = (departmentList) => { // 根据部门信息，重组子部门/ 父部门，根据层级关系输出展示。
    const parentDepartmentArray = [];
    const subDepartmentArray = [];
    departmentList.forEach(e => {
      if (!e) { return; }
      e.parentDepartmentId ? subDepartmentArray.push({
        ...e,
      }) : parentDepartmentArray.push({
        ...e,
      });
    });
    const departmentInfoTree = parentDepartmentArray.map(e => {
      const subArray = subDepartmentArray.filter(sub => sub.parentDepartmentId === e.departmentId);
      return {
        ...e,
        children: subArray,
      };
    });
    const departmentInfo = departmentInfoTree.map(e => {
      let subInfo = '';
      if (e.children && e.children.length > 0) {
        subInfo = `-${e.children.map(sub => sub.departmentName).join(',')}`;
      }
      return `${e.departmentName}${subInfo}`;
    });
    return departmentInfo.join('；');
  }

  render() {
    const { stationDetail, saveStationDetail, loading } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    const departmentList = stationDetail.departmentList || [];
    const departmentInfo = this.departmentInfoFun(departmentList);
    return (
      <div className={styles.stationManageEdit} >
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.detailTop}>
          <span className={styles.topInfoShow}>
            <span className={styles.title}>电站详情</span>
            {/* {stationDetail.stationStatus?<span>接入时间: 2018-08-08</span>:<span>电站未接入</span>} */}
            {stationDetail.stationStatus ? <span>
              接入时间:{stationDetail.ongridTime ? moment(stationDetail.ongridTime).format('YYYY-MM-DD') : '--'}
            </span>
              : <span>电站未接入</span>}
            {departmentInfo ? ' | ' : ''}
            <span className={styles.departmentInfo} title={departmentInfo}>
              {departmentInfo}
            </span>
          </span>
          <span className={styles.handleArea} >
            <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.cancelEdit} />
          </span>
        </div>
        <EditForm
          stationDetail={stationDetail}
          saveStationDetail={saveStationDetail}
          cancelEdit={this.cancelEdit}
          loading={loading}
          confirmWarningTip={this.confirmWarningTip}
          {...this.props}
        />
      </div>
    );
  }
}

export default StationManageEdit;
