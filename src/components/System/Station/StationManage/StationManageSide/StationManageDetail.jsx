

import React, { Component } from 'react';
import DetailInfoPart from './DetailInfoPart';
import { baseFun, stationBelongFun, connectionPriceFun, otherFun } from './detailInformation';
import WarningTip from '../../../../Common/WarningTip';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './stationSide.scss';
import { handleRight } from '@utils/utilFunc';
import moment from 'moment';

class StationManageDetail extends Component {
  static propTypes = {
    totalNum: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    selectedStationIndex: PropTypes.number,
    stationList: PropTypes.array,
    queryListParams: PropTypes.object,
    stationDetail: PropTypes.object,
    onShowSideChange: PropTypes.func,
    changeStationManageStore: PropTypes.func,
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
    this.props.changeStationManageStore({
      showPage: 'list',
      selectedStationIndex: null,
    });
  }

  editDetail = () => { // 编辑页
    this.props.onShowSideChange({ showSidePage: 'edit' });
    this.props.changeStationManageStore({ showPage: 'edit' });
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
    const baseInfo = baseFun(stationDetail);
    const connectionPriceInfo = connectionPriceFun(stationDetail);
    const otherInfo = otherFun(stationDetail);
    const stationBelongInfo = stationBelongFun(stationDetail);
    const departmentList = stationDetail.departmentList || [];
    const departmentInfo = this.departmentInfoFun(departmentList);
    const isPv = stationDetail.stationType === 1;
    const isWind = stationDetail.stationType === 0;
    const stationOperation = handleRight('station_export');
    return (
      <div className={styles.stationManageDetail}>
        {showWarningTip && <WarningTip onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.detailTop}>
          <span className={styles.topInfoShow}>
            <span className={styles.title}>{stationDetail.stationName || '--'}详情</span>
            {stationDetail.stationStatus ? <span>
              接入时间:{stationDetail.ongridTime ? moment(stationDetail.ongridTime).format('YYYY-MM-DD') : '--'}
            </span>
              : <span>电站未接入</span>}
            {departmentInfo ? ` | ` : ``}
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
        <div className={styles.stationManageContent} >
          <DetailInfoPart
            title="基本信息"
            infoArray={baseInfo}
            handler={this.editDetail}
            stationOperation
            extraInfo={
              isWind ? <div className={styles.windInfo}>
                <div className={styles.eachItem}>
                  <span className={styles.altitudeName}>海拔</span>
                  <span className={styles.altitudeValue}>{stationDetail.altitude || '--'}m</span>
                </div>
                <div className={styles.eachItem}>
                  <span className={styles.titleStart}>可研报告轮毂高度年平均风速</span>
                  <span className={styles.valueStart}>{stationDetail.hubAnnualAverageSpeed || '--'}m/s</span>
                </div>
                <div className={styles.eachItem}>
                  <span className={styles.titleEnd}>可研报告轮毂高度年平均功率密度</span>
                  <span className={styles.valueEnd}>{stationDetail.hubAnnualAveragePower || '--'}W/㎡</span>
                </div>
              </div> : null
            }
          />
          {isPv && <DetailInfoPart title="电站分类" infoArray={stationBelongInfo} />}
          <DetailInfoPart title="并网信息及电价情况" infoArray={connectionPriceInfo} />
          <DetailInfoPart title="其他信息" infoArray={otherInfo} noBottomBorder />
        </div>
      </div>
    )
  }
}

export default StationManageDetail;


