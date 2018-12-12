

import React, { Component } from 'react';

import WarningTip from '../../../../Common/WarningTip';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './cleanoutRecordDetail.scss';
import CleanoutPlanRecord from './CleanoutPlanRecord';
import RecordDetailTable from './RecordDetailTable.jsx';
import ChangeStation from '../../../../Monitor/StationMonitor/SingleStation/SingleStationCommon/ChangeStation';
import TransitionContainer from '../../../../../components/Common/TransitionContainer';
import moment from 'moment';

class CleanoutRecordDetail extends Component {
  static propTypes = {
    totalNum: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    selectedStationIndex: PropTypes.number,
    stationList: PropTypes.array,
    queryListParams: PropTypes.object,
    stationDetail: PropTypes.object,
    onShowSideChange: PropTypes.func,
    changeCleanoutRecordStore: PropTypes.func,
    getStationDetail: PropTypes.func,
    getOtherPageStationDetail: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
      showStationSelect: false,
      showSidePage: 'single'
    }

  }

  
  onShowSideChange = ({ showSidePage }) => {
    this.setState({ showSidePage });
  }
 
  onToggleSide = () => {
    // const { showPage } = this.props;
    // this.setState({
    //   showSidePage: showPage
    // });
  }
  confirmWarningTip = () => { // 提示框确认
    this.setState({
      showWarningTip: false,
      warningTipText: '',
    })
  }

  backToList = () => { // 返回列表页
    this.props.changeCleanoutRecordStore({
      showPage: 'multiple',
      selectedStationIndex: null,
    });
  }

  editDetail = () => { // 编辑页
    // this.props.onShowSideChange({ showSidePage: 'edit' });
    // this.props.changeCleanoutRecordStore({ showPage: 'edit' });
  }

  departmentInfoFun = (departmentList) => { // 根据部门信息，重组子部门/ 父部门，根据层级关系输出展示。
    const parentDepartmentArray = [];
    const subDepartmentArray = [];
    departmentList.forEach(e => {
      if (!e) { return; }
      e.parentDepartmentId ? subDepartmentArray.push({
        ...e
      }) : parentDepartmentArray.push({
        ...e
      })
    })
    const departmentInfoTree = parentDepartmentArray.map(e => {
      const subArray = subDepartmentArray.filter(sub => sub.parentDepartmentId === e.departmentId);
      return {
        ...e,
        children: subArray,
      }
    })
    const departmentInfo = departmentInfoTree.map(e => {
      let subInfo = '';
      if (e.children && e.children.length > 0) {
        subInfo = `-${e.children.map(sub => sub.departmentName).join(',')}`;
      }
      return `${e.departmentName}${subInfo}`
    })
    return departmentInfo.join('；');
  }
  hideStationChange = () => {
    this.setState({
      showStationSelect: false
    });
  }
  showStationSelect = () => {
    this.setState({
      showStationSelect: true
    });
  }
  render() {
    const { stationDetail, stations, showPage , stationName, pageNum, pageSize,} = this.props;
    const { showSidePage } = this.state;
    const stationItems = stations && stations.toJS();
    const { showWarningTip, warningTipText } = this.state;
    const { showStationSelect } = this.state;
    const stationItem = stationItems.filter(e => (e.stationCode.toString() === '360'))[0];
    //请求的参数
    const queryListParams = {
       stationName, pageNum, pageSize,
    }
    const departmentList = stationDetail.departmentList || [];
    const departmentInfo = this.departmentInfoFun(departmentList);
    
    return (
      <div className={styles.container}>
        <div className={styles.CleanoutRecordDetail}>
          {showWarningTip && <WarningTip onOK={this.confirmWarningTip} value={warningTipText} />}
          <div className={styles.detailTop}>
            {showStationSelect &&
              <ChangeStation stations={stationItems.filter(e => e.stationType === 1)} stationName={stationItem.stationName} baseLinkPath="" hideStationChange={this.hideStationChange} />
            }
            <div className={styles.topInfoShow}>
              <div onClick={() => this.setState({ showStationSelect: true })} className={styles.stationName}>
                <Icon className={styles.icon} type="swap" />
              </div>
              <div>xxxxxx</div>
            </div>
            <span className={styles.handleArea} >
              <span className={styles.dirtEff}>灰尘影响</span>

              <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToList} />
            </span>
          </div>
          <RecordDetailTable {...this.props} onShowSideChange={this.onShowSideChange} />
        </div>
        <TransitionContainer
          show={showSidePage === 'recordPlan'}
          onEnter={this.onToggleSide}
          onExited={this.onToggleSide}
          timeout={500}
          effect="side"
        >
          <CleanoutPlanRecord
            {...this.props}
            showSidePage={showSidePage}
            queryListParams={queryListParams}
            onShowSideChange={this.onShowSideChange}
          />
        </TransitionContainer>
      </div>
    )
  }
}

export default CleanoutRecordDetail;


