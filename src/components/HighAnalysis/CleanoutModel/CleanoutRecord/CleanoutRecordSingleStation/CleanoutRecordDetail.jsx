

import React, { Component } from 'react';

import WarningTip from '../../../../Common/WarningTip';
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
      showSidePage: 'single',
      filterValue: 'all'
    }

  }
  componentDidMount() {
    const main = document.getElementById('main');
    main && main.addEventListener('click', this.hideStationChange, true);
  }
  componentWillUnmount() {
    const main = document.getElementById('main');
    main && main.removeEventListener('click', this.hideStationChange, true);
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
  radioChange = (e) => {
    this.setState({
      filterValue: e.target.value
    })
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
    const { stationDetail, stations, showPage, stationName, pageNum, pageSize, } = this.props;
    let { stationCode } = this.props.match.params;
    const { showSidePage } = this.state;
    const stationItems = stations && stations.toJS();
    const { showWarningTip, warningTipText } = this.state;
    const { showStationSelect } = this.state;
    const stationItem = stationItems.filter(e => (e.stationCode.toString() === stationCode))[0];
    //请求的参数
    const queryListParams = {
      stationName, pageNum, pageSize,
    }
    const departmentList = stationDetail.departmentList || [];
    const departmentInfo = this.departmentInfoFun(departmentList);

    console.log(stationCode);
    return (
      <div className={styles.container}>
        <div className={styles.CleanoutRecordDetail}>
          {showWarningTip && <WarningTip onOK={this.confirmWarningTip} value={warningTipText} />}
          <div className={styles.detailTop}>
            {showStationSelect &&
              <ChangeStation stations={stationItems.filter(e => e.stationType === 1)} stationName={stationItem.stationName} baseLinkPath="/analysis/cleanout/record" hideStationChange={this.hideStationChange} />
            }
            <div className={styles.topInfoShow}>
              <div onClick={() => this.setState({ showStationSelect: true })} className={styles.stationName}>
                <Icon className={styles.icon} type="swap" />
              </div>
              <div className={styles.status}>
                <h3>{stationItem.stationName}--{stationItem.provinceName}</h3>
              </div>
            </div>
            <span className={styles.handleArea} >
              <span className={styles.dirtEff}>灰尘影响</span>
              <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToList} />
            </span>
          </div>
          <div className={styles.statisticData}>
            <div className={styles.statisticTarget}>
              <div className={styles.numberColor}>123.89</div>
              <div>累计清洗收益(万kWh)</div>
            </div>
            <div className={styles.statisticTarget}>
              <div className={styles.numberColor}>19</div>
              <div>人工清洗次数(次)</div>
            </div>
            <div className={styles.statisticTarget}>
              <div className={styles.numberColor}>19.4</div>
              <div>平均清洗周期(天)</div></div>
            <div className={styles.statisticTarget}>
              <div className={styles.numberColor}>9.1</div>
              <div>平均清洗用时(天)</div></div>
          </div>
          <div className={styles.filterData}>
            <Radio.Group value={this.state.filterValue} buttonStyle="solid" onChange={this.radioChange}>
              <Radio.Button value="all">全部</Radio.Button>
              <Radio.Button value="people">人工</Radio.Button>
              <Radio.Button value="rain">下雨</Radio.Button>
            </Radio.Group>
            <Pagination />
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


