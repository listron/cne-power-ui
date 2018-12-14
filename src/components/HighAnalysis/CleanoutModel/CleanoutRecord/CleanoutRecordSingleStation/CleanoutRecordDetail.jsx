

import React, { Component } from 'react';


import { Icon, Radio } from 'antd';
import PropTypes from 'prop-types';
import styles from './cleanoutRecordDetail.scss';
import CleanoutPlanRecord from './CleanoutPlanRecord';
import RecordDetailTable from './RecordDetailTable.jsx';
import ChangeStation from '../../../../Monitor/StationMonitor/SingleStation/SingleStationCommon/ChangeStation';
import TransitionContainer from '../../../../../components/Common/TransitionContainer';
import Pagination from '../../../../../components/Common/CommonPagination/index';
import moment from 'moment';

class CleanoutRecordDetail extends Component {
  static propTypes = {
    totalNum: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    match: PropTypes.object,
    onShowSideChange: PropTypes.func,
    changeCleanoutRecordStore: PropTypes.func,
    getDetailList: PropTypes.func,
    history: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      showStationSelect: false,
      showSidePage: 'single',
    }
  }
  componentDidMount() {
    const main = document.getElementById('main');
    main && main.addEventListener('click', this.hideStationChange, true);
    const{getDetailList,singleStationCode,detailPageNum,detailPageSize,cleanType}=this.props;
    getDetailList({stationCode:singleStationCode,cleanType,pageNum:detailPageNum,pageSize:detailPageSize})
  }
  componentWillReceiveProps(nextProps){
    const{getDetailList,detailPageNum,detailPageSize,cleanType,changeCleanoutRecordStore,singleStationCode}=nextProps;
    if (this.props.singleStationCode !== singleStationCode) {
      getDetailList({stationCode:singleStationCode,cleanType,pageNum:detailPageNum,pageSize:detailPageSize})
    }
  }
  componentWillUnmount() {
    const main = document.getElementById('main');
    main && main.removeEventListener('click', this.hideStationChange, true);
    this.props.changeCleanoutRecordStore({showPage:'multiple'})
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
  onPaginationChange = ({ pageSize, currentPage }) => {//分页器
    
    const { changeCleanoutRecordStore,getDetailList,singleStationCode,cleanType } = this.props;
    changeCleanoutRecordStore({detailPageNum:currentPage,detailPageSize:pageSize})
    getDetailList({
      stationCode:singleStationCode,
      cleanType,
      pageNum: currentPage,
      pageSize, 
    
    })
  }
  radioChange = (e) => {
    const{changeCleanoutRecordStore,getDetailList,singleStationCode,cleanType,detailPageNum,detailPageSize}=this.props;
    changeCleanoutRecordStore({cleanType:e.target.value})
    getDetailList({stationCode:singleStationCode,cleanType:e.target.value,pageNum:detailPageNum,pageSize:detailPageSize})
  }
  backToList = () => { // 返回列表页
    this.props.changeCleanoutRecordStore({
      showPage: 'multiple',
      selectedStationIndex: null,
    });
    this.props.history.push(`/analysis/cleanout/record`);
  }
  editDetail = () => { // 编辑页
    // this.props.onShowSideChange({ showSidePage: 'edit' });
    // this.props.changeCleanoutRecordStore({ showPage: 'edit' });
  }
  hideStationChange = () => {//选择电站的隐藏
    this.setState({
      showStationSelect: false
    });
  }
  showStationSelect = () => {//选择电站的展示
    this.setState({
      showStationSelect: true
    });
  }
 
  render() {
    const { stationDetail, stations, showPage,singleStationCode, stationName, pageNum, pageSize,changeCleanoutRecordStore,detailPageNum,detailPageSize,detailtotal,handCleanNum,rainCleanNum,cleanPlanNum ,cleanProfit,cleanCycle,cleanTime,detailListData} = this.props;
    const { stationCode } = this.props.match.params;
    if (stationCode !== singleStationCode) {
      changeCleanoutRecordStore({ singleStationCode: stationCode });
    }
    const { selectedRowKeys,showWarningTip,warningTipText ,showSidePage} = this.state
    const stationItems = stations && stations;
 
    const { showStationSelect } = this.state;
    const stationItem = stationItems&&stationItems.filter(e => (e.stationCode.toString() === stationCode))[0];
    //请求的参数
    const queryListParams = {
      stationName, pageNum, pageSize,
    }
    return (
      <div className={styles.container}>
        <div className={styles.CleanoutRecordDetail}>
          <div className={styles.detailTop}>
            {showStationSelect &&
              <ChangeStation stations={stationItems.filter(e => e.stationType === 1)} stationName={stationItem.stationName} baseLinkPath="/analysis/cleanout/record" hideStationChange={this.hideStationChange} />
            }
            <div className={styles.topInfoShow}>
              <div onClick={() => this.setState({ showStationSelect: true })} className={styles.stationName}>
                <Icon className={styles.icon} type="swap" />
              </div>
              <div className={styles.status}>
                <h3>{stationItem&&stationItem.stationName}--{stationItem&&stationItem.provinceName}</h3>
              </div>
            </div>
            <span className={styles.handleArea} >
              <span className={styles.dirtEff}>灰尘影响</span>
              <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToList} />
            </span>
          </div>
          <div className={styles.statisticData}>
            <div className={styles.statisticTarget}>
              <div className={styles.numberColor}>{cleanProfit}</div>
              <div>累计清洗收益(万kWh)</div>
            </div>
            <div className={styles.statisticTarget}>
              <div className={styles.numberColor}>{handCleanNum}</div>
              <div>人工清洗次数(次)</div>
            </div>
            <div className={styles.statisticTarget}>
              <div className={styles.numberColor}>{cleanCycle}</div>
              <div>平均清洗周期(天)</div></div>
            <div className={styles.statisticTarget}>
              <div className={styles.numberColor}>{cleanTime}</div>
              <div>平均清洗用时(天)</div></div>
          </div>
          <div className={styles.filterData}>
            <Radio.Group value={this.props.cleanType} buttonStyle="solid" onChange={this.radioChange}>
              <Radio.Button value={0}>全部</Radio.Button>
              <Radio.Button value={1}>人工{cleanPlanNum}</Radio.Button>
              <Radio.Button value={2}>下雨{rainCleanNum}</Radio.Button>
            </Radio.Group>
            <Pagination total={detailtotal} pageSize={detailPageSize} currentPage={detailPageNum} onPaginationChange={this.onPaginationChange} />
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


