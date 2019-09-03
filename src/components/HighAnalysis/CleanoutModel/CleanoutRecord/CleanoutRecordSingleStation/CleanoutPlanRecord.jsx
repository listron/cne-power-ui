

import React, { Component } from 'react';

import WarningTip from '../../../../Common/WarningTip';
import PropTypes from 'prop-types';
import styles from './cleanoutPlanRecord.scss';
import PlanRecordTable from './PlanRecordTable';
import AddCleanoutRecord from './AddCleanoutRecord';
import Pagination from '../../../../../components/Common/CommonPagination/index';
import InputLimit from '../../../../Common/InputLimit';
import moment from 'moment';
import { Table, Icon, Modal, Form, DatePicker, Input, Button } from 'antd';
const FormItem = Form.Item;


const { RangePicker } = DatePicker;
class CleanoutPlanRecord extends Component {
  static propTypes = {
    totalNum: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    selectedStationIndex: PropTypes.number,
    stationList: PropTypes.array,
    singleStationCode: PropTypes.string,
    stationDetail: PropTypes.object,
    onShowSideChange: PropTypes.func,
    changeCleanoutRecordStore: PropTypes.func,
    getAddCleanRecord: PropTypes.func,
    getPlanRecordList: PropTypes.func,
    getDetailList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
      showAddRecordModal: false,
    };
  }
  onPaginationChange = ({ pageSize, currentPage }) => {//分页器
    const { changeCleanoutRecordStore, getPlanRecordList, planId, cleanType } = this.props;
    changeCleanoutRecordStore({ cleanRecordPageNum: currentPage, cleanRecordPageSize: pageSize });
    getPlanRecordList({
      planId,
      pageNum: currentPage,
      pageSize,
    });
  }
  preStation = () => { // 上一个电站详情
    const { singleStationCode, cleanType, detailListData, selectedStationIndex, detailPageNum, detailPageSize, getDetailList, getPlanRecordList, cleanRecordPageNum, cleanRecordPageSize } = this.props;

    if (selectedStationIndex === 0 && detailPageNum === 1) { // 第一页第一条
      this.setState({
        showWarningTip: true,
        warningTipText: '这是第一个!',
      });
    } else if (selectedStationIndex === 0 && detailPageNum > 1) { // 其他页向前翻页
      getDetailList({
        singleStationCode,
        cleanType,
        pageNum: detailPageNum - 1,
        pageSize: detailPageSize,
        selectedStationIndex: detailPageSize - 1,
      });
    } else {
      getPlanRecordList({ // 正常请求上一条电站详情数据
        planId: detailListData[selectedStationIndex - 1].planId,
        pageNum: cleanRecordPageNum,
        pageSize: cleanRecordPageSize,
        selectedStationIndex: selectedStationIndex - 1,
      });
    }
  }

  nextStation = () => { // 下一个电站详情
    const { singleStationCode, detailListData, cleanType, selectedStationIndex, detailPageNum, detailPageSize, getDetailList, detailtotal, getPlanRecordList, cleanRecordPageNum, cleanRecordPageSize } = this.props;
    const maxPage = Math.ceil(detailtotal / detailPageSize); // 最后一页页码
    const lastPageMaxIndex = detailtotal - (maxPage - 1) * detailPageSize - 1;
    if (selectedStationIndex === lastPageMaxIndex && detailPageNum === maxPage) { // 最后一页最后一条
      this.setState({
        showWarningTip: true,
        warningTipText: '这是最后一个!',
      });
    } else if (selectedStationIndex === detailPageSize - 1 && detailPageNum < maxPage) { // 向后翻页
      getDetailList({
        singleStationCode,
        cleanType,
        pageNum: detailPageNum + 1,
        pageSize: detailPageSize,
        selectedStationIndex: 0,
      });
    } else {
      getPlanRecordList({ // 请求下一条电站详情数据
        planId: detailListData[selectedStationIndex + 1].planId,
        selectedStationIndex: selectedStationIndex + 1,
        pageNum: cleanRecordPageNum,
        pageSize: cleanRecordPageSize,
      });
    }
  }

  confirmWarningTip = () => { // 提示框确认
    this.setState({
      showWarningTip: false,
      warningTipText: '',
    });
  }

  backToList = () => { // 返回列表页
    this.props.changeCleanoutRecordStore({
      selectedStationIndex: null,
    });
    this.props.onShowSideChange({ showSidePage: 'detail' });
  }

  addRecord = () => {
    this.setState({ showAddRecordModal: true });
  }
  cancelAddRecord = () => {
    this.setState({ showAddRecordModal: false });
  }


  render() {
    const { cleanRecordTotal, cleanRecordCost, cleanRecordProfit, cleanRecordTime, cleanRecordPageSize, cleanRecordPageNum, cleanRecordPlanTime, stationName, provinceName, theme } = this.props;
    const { showWarningTip, warningTipText, showAddRecordModal } = this.state;
    // const record = { name: 'dali' }
    return (
      <div className={`${styles.sidePage} ${styles[theme]}`}>
        <div className={styles.CleanoutPlanRecord}>
          <div className={styles.testBackground}>
            {showWarningTip && <WarningTip onOK={this.confirmWarningTip} value={warningTipText} />}
            <div className={styles.detailTop}>
              <span className={styles.topInfoShow}>
                {cleanRecordPlanTime}
                <span className={styles.departmentInfo} >
                  清洗计划-清洗记录
          </span>
                ({stationName}-{provinceName})
        </span>
              <span className={styles.handleArea} >
                <i className="iconfont icon-last" title="上一个" onClick={this.preStation} />
                <i className="iconfont icon-next" title="下一个" onClick={this.nextStation} />
                <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToList} />
              </span>
            </div>
            <div className={styles.statisticData}>
              <div className={styles.statisticTarget}>
                <div className={styles.numberColor}>{cleanRecordProfit}</div>
                <div>累计清洗收益(万kWh)</div>
              </div>
              <div className={styles.statisticTarget}>
                <div className={styles.numberColor}>{cleanRecordCost}</div>
                <div>清洗成本(元)</div>
              </div>
              <div className={styles.statisticTarget}>
                <div className={styles.numberColor}>{cleanRecordTime}</div>
                <div>清洗用时(天)</div></div>
            </div>
            <div className={styles.wrap}>
              <div className={styles.filterData}>
                <Button type="add" onClick={this.addRecord} className={styles.plusButton}><i>+</i>添加</Button>
                {showAddRecordModal ? <AddCleanoutRecord {...this.props} getAddOrEditCleanRecord={this.props.getAddCleanRecord} showAddRecordModal={showAddRecordModal} cancelAddRecord={this.cancelAddRecord} /> : ''}
                <Pagination total={cleanRecordTotal} pageSize={cleanRecordPageSize} currentPage={cleanRecordPageNum} onPaginationChange={this.onPaginationChange} theme={theme} />
              </div>
              <PlanRecordTable {...this.props} />
            </div>

          </div>


        </div>
      </div>

    );
  }
}

export default Form.create()(CleanoutPlanRecord);

