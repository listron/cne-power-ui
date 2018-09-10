

import React, { Component } from 'react';
import DetailInfoPart from './DetailInfoPart';
import { baseFun, connectionPriceFun, otherFun } from './detailInformation';
import WarningTip from '../../../../Common/WarningTip';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './stationSide.scss';
import moment from 'moment';

class StationManageDetail extends Component {
  static propTypes = {
    totalNum: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    selectedStationIndex: PropTypes.number,
    queryListParams: PropTypes.object,
    stationDetail: PropTypes.object,
    onShowSideChange: PropTypes.func,
    changeStationManageStore: PropTypes.func,
    getStationDetail: PropTypes.func,
    getOtherPageStationDetail: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
    }
  }

  onShowSideChange = ({showSidePage}) => {
    this.props.onShowSideChange({ showSidePage:'edit' });
    this.props.changeStationManageStore({ showPage: 'edit' });
  }

  preStation = () => { // 上一个电站详情
    const { queryListParams, selectedStationIndex, pageNum, pageSize, getOtherPageStationDetail, getStationDetail } = this.props;
    if(selectedStationIndex === 0 && pageNum === 1){ // 第一页第一条
      this.setState({
        showWarningTip: true,
        warningTipText: '这是第一个!',
      })
    }else if( selectedStationIndex === 0 && pageNum > 1){ // 其他页向前翻页
      getOtherPageStationDetail({
        ...queryListParams,
        pageNum: pageNum - 1,
        selectedStationIndex: pageSize - 1,
      })
    }else{
      getStationDetail({ // 正常请求上一条电站详情数据
        ...queryListParams,
        selectedStationIndex: selectedStationIndex - 1,
      })
    }
  }

  nextStation = () => { // 下一个电站详情
    const { queryListParams, selectedStationIndex, pageNum, pageSize, getOtherPageStationDetail, totalNum, getStationDetail } = this.props;
    const maxPage = Math.ceil(totalNum / pageSize); // 最后一页页码
    const lastPageMaxIndex = totalNum - (maxPage - 1)*pageSize - 1;
    if(selectedStationIndex === lastPageMaxIndex && pageNum === maxPage){ // 最后一页最后一条
      this.setState({
        showWarningTip: true,
        warningTipText: '这是最后一个!',
      })
    }else if( selectedStationIndex === pageSize - 1 && pageNum < maxPage){ // 向后翻页
      getOtherPageStationDetail({
        ...queryListParams,
        pageNum: pageNum + 1,
        selectedStationIndex: 0,
      })
    }else{
      getStationDetail({ // 请求下一条电站详情数据
        ...queryListParams,
        selectedStationIndex: selectedStationIndex + 1,
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
    this.props.changeStationManageStore({ showPage: 'edit' });
  }

  render(){
    const { stationDetail } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    const baseInfo = baseFun(stationDetail);
    const connectionPriceInfo = connectionPriceFun(stationDetail);
    const otherInfo = otherFun(stationDetail);
    return (
      <div className={styles.stationManageDetail}>
        {showWarningTip && <WarningTip onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.detailTop}>
          <span>电站详情</span>
          {stationDetail.stationStatus?<span>接入时间: 2018-08-08</span>:<span>电站未接入</span>}
          <span className={styles.handleArea} >
            <Icon type="arrow-up" className={styles.previous} title="上一个" onClick={this.preStation} />
            <Icon type="arrow-down" className={styles.next} title="下一个" onClick={this.nextStation} />
            <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToList} />
          </span>
        </div>
        <div className={styles.stationManageContent} >
          <DetailInfoPart title="基本信息" infoArray={baseInfo} handler={this.editDetail} />
          <DetailInfoPart title="并网信息及电价情况" infoArray={connectionPriceInfo} />
          <DetailInfoPart title="其他信息" infoArray={otherInfo} />
        </div>
      </div>
    )
  }
}

export default StationManageDetail ;
