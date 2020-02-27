

import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';
import WarningTip from '../../../../Common/WarningTip';
import Footer from '../../../../Common/Footer';
import AssignUserModal from '../AssignUserModal/AssignUserModal';
import AssignStationModal from '../AssignStationModal/AssignStationModal';
import moment from 'moment';

class DepartmentDetail extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
    userId: PropTypes.string,
    enterpriseName: PropTypes.string,
    enterpriseName: PropTypes.string,
    departmentSource: PropTypes.number,
    departmentName: PropTypes.string,
    parentDepartmentName: PropTypes.string,
    stationName: PropTypes.string,
    sort: PropTypes.string,
    ascend: PropTypes.bool,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    totalNum: PropTypes.number,
    allDepartment: PropTypes.object,
    departmentUser: PropTypes.object,
    DepartmentStation: PropTypes.object,
    loginData: PropTypes.object,
    showAssignUserModal: PropTypes.bool,
    showAssignStationModal: PropTypes.bool,

    departmentData: PropTypes.array,
    getOtherPageDetail: PropTypes.func,
    getDepartmentDetail: PropTypes.func,
    changeDepartmentStore: PropTypes.func,
    onShowSideChange: PropTypes.func,
    getDepartmentUser: PropTypes.func,
    getDepartmentStation: PropTypes.func,
    setDepartmentUser: PropTypes.func,
    setDepartmentStation: PropTypes.func,
    departmentDetail: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
    };
  }

  onShowSideChange = ({ showSidePage }) => {
    this.props.onShowSideChange({ showSidePage: 'edit' });
    this.props.changeDepartmentStore({ showPage: 'edit' });
  }

  setDepartmentUser = () => {
    this.props.changeDepartmentStore({
      showAssignUserModal: true,
    });
  }

  setDepartmentStation = () => {
    this.props.changeDepartmentStore({
      showAssignStationModal: true,
    });
  }

  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
      warningTipText: '',
    });
  }

  preDepartment = () => {
    const { getOtherPageDetail, getDepartmentDetail, departmentDetail, departmentData, enterpriseId, departmentSource, departmentName, parentDepartmentName, stationName, sort, ascend, pageNum, pageSize } = this.props;
    const detailIndex = departmentData.findIndex(e => e.departmentId === departmentDetail.departmentId);
    const params = { enterpriseId, departmentSource, departmentName, parentDepartmentName, stationName, sort, ascend, pageNum, pageSize };
    if (pageNum === 1 && detailIndex === 0) {//第一条记录
      this.setState({
        showWarningTip: true,
        warningTipText: '这是第一个!',
      });
    } else if (pageNum > 1 && detailIndex === 0) {
      params.pageNum = pageNum - 1;
      getOtherPageDetail(params, { previous: true });
    } else if (detailIndex > 0) {
      const { departmentId } = departmentData[detailIndex - 1];
      getDepartmentDetail({ departmentId });
    } else {
      console.log('部门id信息有误，在tablelist中未获取');
    }
  }

  nextDepartment = () => {
    const { getOtherPageDetail, getDepartmentDetail, departmentDetail, departmentData, enterpriseId, departmentSource, departmentName, parentDepartmentName, stationName, sort, ascend, pageNum, pageSize, totalNum } = this.props;
    const detailIndex = departmentData.findIndex(e => e.departmentId === departmentDetail.departmentId);
    const params = { enterpriseId, departmentSource, departmentName, parentDepartmentName, stationName, sort, ascend, pageNum, pageSize };
    const maxPage = Math.ceil(totalNum / pageSize);
    const lastPageMaxIndex = totalNum - (maxPage - 1) * pageSize - 1;
    if (pageNum === maxPage && detailIndex === lastPageMaxIndex) {//最后一条记录
      this.setState({
        showWarningTip: true,
        warningTipText: '这是最后一个!',
      });
    } else if (pageNum < maxPage && detailIndex === pageSize - 1) {
      params.pageNum = pageNum + 1;
      getOtherPageDetail(params, { previous: false });
    } else if (pageNum <= maxPage) {
      const { departmentId } = departmentData[detailIndex + 1];
      getDepartmentDetail({ departmentId });
    } else {
      console.log('部门id信息有误，在tablelist中未获取');
    }
  }

  backToList = () => {
    this.props.changeDepartmentStore({ showPage: 'list' });
  }

  renderAssignUserModal() {
    const { userId, enterpriseId, enterpriseName, departmentData, departmentDetail, allDepartment, departmentUser, getDepartmentUser, setDepartmentUser, changeDepartmentStore } = this.props;
    const detailIndex = departmentData.findIndex(e => e.departmentId === departmentDetail.departmentId);
    return (
      <AssignUserModal
        currentUserId={userId}
        enterpriseId={enterpriseId}
        enterpriseName={enterpriseName}
        departmentList={allDepartment}
        userList={departmentUser}
        getUserList={getDepartmentUser}
        onSetDepartmentUser={setDepartmentUser}
        onCancel={() => changeDepartmentStore({ showAssignUserModal: false })}
        selectedDepartment={[departmentData[detailIndex]]}
      />
    );
  }

  renderAssignStationModal() {
    const { enterpriseId, enterpriseName, departmentData, departmentDetail, allDepartment, DepartmentStation, getDepartmentStation, setDepartmentStation, changeDepartmentStore } = this.props;
    const detailIndex = departmentData.findIndex(e => e.departmentId === departmentDetail.departmentId);
    return (
      <AssignStationModal
        enterpriseId={enterpriseId}
        enterpriseName={enterpriseName}
        departmentList={allDepartment}
        stationList={DepartmentStation}
        getStationList={getDepartmentStation}
        onSetDepartmentStation={setDepartmentStation}
        onCancel={() => changeDepartmentStore({ showAssignStationModal: false })}
        selectedDepartment={[departmentData[detailIndex]]}
      />
    );
  }

  render() {
    const { departmentDetail, departmentData, showAssignUserModal, showAssignStationModal } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    const userFullNames = (departmentDetail.userFullNameDatas && departmentDetail.userFullNameDatas.length > 0) ? departmentDetail.userFullNameDatas.map(e => e.userFullName).join(',') : ' -- ';
    const stationNames = (departmentDetail.stationNameDatas && departmentDetail.stationNameDatas.length > 0) ? departmentDetail.stationNameDatas.map(e => e.stationName).join(',') : ' -- ';
    const tmpDepartmentSub = departmentData.find(e => e.departmentId === departmentDetail.departmentId);
    const forbiddenEdit = tmpDepartmentSub && tmpDepartmentSub.departmentSource === 0;
    const createTime = departmentDetail.createTime ? moment(departmentDetail.createTime).format('YYYY年MM月DD日 HH时mm分') : ' -- ';
    const updateTime = departmentDetail.updateTime ? moment(departmentDetail.updateTime).format('YYYY年MM月DD日 HH时mm分') : ' -- ';
    const rightHandler = localStorage.getItem('rightHandler');
    const departmentUpdateRight = rightHandler && rightHandler.split(',').includes('account_department_update');
    const userSetRight = rightHandler && rightHandler.split(',').includes('account_department_user');
    const stationSetRight = rightHandler && rightHandler.split(',').includes('account_department_station');
    return (
      <div className={styles.departmentDetail}>
        {showWarningTip && <WarningTip onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.detailTop}>
          {departmentUpdateRight && <Button className={styles.editButton} disabled={forbiddenEdit} onClick={() => this.onShowSideChange({ showSidePage: 'edit' })}>编辑</Button>}
          <span className={styles.handleArea} >
            <i className="iconfont icon-last" title="上一个" onClick={this.preDepartment} />
            <i className="iconfont icon-next" title="下一个" onClick={this.nextDepartment} />
            <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.backToList} />
          </span>
        </div>
        <div className={styles.departmentBox} >
          <div className={styles.departmentInfo} >
            <div className={styles.eachInfo}>
              <span className={styles.title}>部门名称</span>
              <span className={styles.value}>{departmentDetail.departmentName || ' -- '}</span>
            </div>
            <div className={styles.eachInfo}>
              <span className={styles.title}>所属部门</span>
              <span className={styles.value}>{departmentDetail.parentDepartmentName || '无'}</span>
            </div>
            <div className={styles.eachInfo}>
              <span className={styles.title}>成员</span>
              <div className={styles.memberInfo}>
                <span className={styles.value}>{userFullNames}</span>
                {userSetRight && <Button className={styles.setting} onClick={this.setDepartmentUser}>设置</Button>}
              </div>
            </div>
            <div className={styles.eachInfo}>
              <span className={styles.title}>负责电站</span>
              <div className={styles.stationInfo}>
                <span className={styles.value}>{stationNames}</span>
                {stationSetRight && <Button className={styles.setting} onClick={this.setDepartmentStation} >设置</Button>}
              </div>
            </div>
            <div className={styles.line}></div>
            <div className={styles.eachInfo}>
              <span className={styles.title}>创建者</span>
              <span className={styles.value}>{departmentDetail.createUser || '--'}</span>
            </div>
            <div className={styles.eachInfo}>
              <span className={styles.title}>创建时间</span>
              <span className={styles.value}>{createTime}</span>
            </div>
            <div className={styles.eachInfo}>
              <span className={styles.title}>最后修改人</span>
              <span className={styles.value}>{departmentDetail.updateUser || ' -- '}</span>
            </div>
            <div className={styles.eachInfo}>
              <span className={styles.title}>最后修改时间</span>
              <span className={styles.value}>{updateTime}</span>
            </div>
          </div>
        </div>
        {showAssignUserModal && this.renderAssignUserModal()}
        {showAssignStationModal && this.renderAssignStationModal()}
      </div>
    );
  }
}

export default DepartmentDetail;
