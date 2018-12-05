

import React, { Component } from 'react';

import WarningTip from '../../../../Common/WarningTip';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './cleanoutPlanRecord.scss';
import PlanRecordTable from './PlanRecordTable';
import moment from 'moment';

class CleanoutPlanRecord extends Component {
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
    }
  }

  preStation = () => { // 上一个电站详情
    const { queryListParams, selectedStationIndex, pageNum, pageSize, getOtherPageStationDetail, getStationDetail, stationList } = this.props;
    if (selectedStationIndex === 0 && pageNum === 1) { // 第一页第一条
      this.setState({
        showWarningTip: true,
        warningTipText: '这是第一个!',
      })
    } else if (selectedStationIndex === 0 && pageNum > 1) { // 其他页向前翻页
      getOtherPageStationDetail({
        ...queryListParams,
        pageNum: pageNum - 1,
        selectedStationIndex: pageSize - 1,
      })
    } else {
      getStationDetail({ // 正常请求上一条电站详情数据
        ...queryListParams,
        selectedStationIndex: selectedStationIndex - 1,
        stationCode: stationList[selectedStationIndex].stationCode,
      })
    }
  }

  nextStation = () => { // 下一个电站详情
    const { queryListParams, selectedStationIndex, pageNum, pageSize, getOtherPageStationDetail, totalNum, getStationDetail, stationList } = this.props;
    const maxPage = Math.ceil(totalNum / pageSize); // 最后一页页码
    const lastPageMaxIndex = totalNum - (maxPage - 1) * pageSize - 1;
    if (selectedStationIndex === lastPageMaxIndex && pageNum === maxPage) { // 最后一页最后一条
      this.setState({
        showWarningTip: true,
        warningTipText: '这是最后一个!',
      })
    } else if (selectedStationIndex === pageSize - 1 && pageNum < maxPage) { // 向后翻页
      getOtherPageStationDetail({
        ...queryListParams,
        pageNum: pageNum + 1,
        selectedStationIndex: 0,
      })
    } else {
      getStationDetail({ // 请求下一条电站详情数据
        ...queryListParams,
        selectedStationIndex: selectedStationIndex + 1,
        stationCode: stationList[selectedStationIndex].stationCode,
      })
    }
  }

  confirmWarningTip = () => { // 提示框确认
    this.setState({
      showWarningTip: false,
      warningTipText: '',
    })
  }

  backToList = () => { // 返回列表页
    // this.props.changeCleanoutRecordStore({
    //   showPage: 'list',
    //   selectedStationIndex: null,
    // });
    this.props.onShowSideChange({showSidePage:'detail'}) 
  }

  editDetail = () => { // 编辑页
    this.props.onShowSideChange({ showSidePage: 'edit' });
    this.props.changeCleanoutRecordStore({ showPage: 'edit' });
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

  render() {
    const { stationDetail } = this.props;
    const { showWarningTip, warningTipText } = this.state;

    const departmentList = stationDetail.departmentList || [];
    const departmentInfo = this.departmentInfoFun(departmentList);
    return (
      <div className={styles.CleanoutPlanRecord}>
        {showWarningTip && <WarningTip onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.detailTop}>
          <span className={styles.topInfoShow}>
            <span className={styles.title}>{stationDetail.stationName || '--'}详情</span>
           
            <span className={styles.departmentInfo} title={departmentInfo}>
              {departmentInfo}
            </span>
          </span>
          <span className={styles.handleArea} >
            <i className="iconfont icon-last" title="上一个" onClick={this.preStation} />
            <i className="iconfont icon-next" title="下一个" onClick={this.nextStation} />
            <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToList} />
          </span>
        </div>
        <PlanRecordTable {...this.props} />
      </div>
    )
  }
}

export default CleanoutPlanRecord;


