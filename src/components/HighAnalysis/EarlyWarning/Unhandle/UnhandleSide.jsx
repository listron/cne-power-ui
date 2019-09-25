import React, { Component } from 'react';
import echarts from 'echarts';
import styles from './unhandle.scss';
import PropTypes from 'prop-types';
import { Select, Table, Button, DatePicker, Icon } from 'antd';
// import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import moment from 'moment';
import WarningTip from '../../../Common/WarningTip';
import IgnoreModal from './IgnoreModal';
import { SequenceChart } from '../CommonChart/SequenceChart';
const { RangePicker } = DatePicker;


class UnhandleSide extends Component {
  static propTypes = {
    PowerCurveChart: PropTypes.any,
    handleClose: PropTypes.func,
    ignoreList: PropTypes.func,
    toorder: PropTypes.func,
    warnDetail: PropTypes.object,
    ignoreReason: PropTypes.array,
    changeUnhandleStore: PropTypes.func,
    inefficiencyId: PropTypes.string,
    deviceName: PropTypes.string,
    sequenceChartList: PropTypes.array,
    getSequencechart: PropTypes.func,
    deviceCode: PropTypes.string,
    dealSuccess: PropTypes.bool,
    theme: PropTypes.string,

  }
  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false, //是否可见
      warningTipText: '确认选中预警生成工单？',
      ingoreVisible: false, // 忽略列表
    };
  }



  handleClose = () => { // 点击返回按钮
    this.props.changeUnhandleStore({ pageName: '', dealSuccess: false });
  }


  selectChange = (wayChange) => { // 进行操作 转工单 忽略
    if (wayChange === 'transfer') {
      this.setState({ showWarningTip: true });
    }
    if (wayChange === 'ignore') {
      this.setState({ ingoreVisible: true });
    }
  }

  addReason = (rest) => { // 忽略原因
    const { ignoreList, inefficiencyId } = this.props;
    const { buttonStatus, ignoreReason, ignoreReasonCode, deadline, ignoreTime } = rest;
    if (buttonStatus === 'sure') {
      ignoreList({ inefficiencyIds: Array.of(inefficiencyId), ignoreReason, ignoreReasonCode, deadline, ignoreTime });
    }
    this.setState({ ingoreVisible: false });
  }

  cancelWarningTip = () => { // 点击取消
    this.setState({ showWarningTip: false });
  }

  confirmWarningTip = () => { // 点击确定
    const { toorder, inefficiencyId } = this.props;
    this.setState({ showWarningTip: false });
    toorder({ inefficiencyIds: Array.of(inefficiencyId) });
  }

  disabledDate = (current) => {// 不可以选择的时间
    const { warnDetail } = this.props;
    const happenTime = moment(warnDetail.happenTime);
    return current > happenTime || current < happenTime.subtract(30, 'days');
  }

  timeChange = (time) => {
    const { getSequencechart, deviceCode } = this.props;
    getSequencechart({
      deviceCode,
      startTime: moment.utc(time[0]).format(),
      endTime: moment.utc(time[1]).format(),
    });
  }

  render() {
    const { warnDetail, ignoreReason, sequenceChartList, dealSuccess, theme } = this.props;
    const { showWarningTip, warningTipText, ingoreVisible } = this.state;
    const happenTime = warnDetail.happenTime;
    const deviceName = warnDetail.deviceName;
    const lastHappenTime = happenTime && moment(happenTime).subtract(1, 'days').format('YYYY/MM/DD');
    return (
      <div className={styles.unhandleSide} >
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.top}>
          <div>
            <span>预警处理</span>
            {
              !dealSuccess &&
              <React.Fragment>
                <Button className={styles.warnButton} onClick={() => { this.selectChange('ignore'); }}> 忽略 </Button>
                <Button className={styles.warnButton} onClick={() => { this.selectChange('transfer'); }}> 转工单</Button>
              </React.Fragment>
            }
          </div>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.handleClose} />
        </div>
        <div className={styles.wrap}>
          <div className={styles.detail}>
            <p>电站名称：{warnDetail.stationName || '--'}</p>
            <p>所属方阵：{warnDetail.belongMatrix || '--'}</p>
            <p>设备名称：{warnDetail.parentDeviceName || '--'}</p>
            <p>电流偏低支路：{warnDetail.deviceName || '--'}</p>
            <p>预警时间：{warnDetail.happenTime || '--'}</p>
            <p>电量损失比：{warnDetail.lostGenPercent || '--'}%</p>
          </div>
          <div className={styles.chartTop} ref="time">
            <span className={styles.title}>电流时序图</span>
            {happenTime &&
              <RangePicker
                defaultValue={[moment(lastHappenTime, 'YYYY/MM/DD'), moment(happenTime, 'YYYY/MM/DD')]}
                format={'YYYY/MM/DD'}
                disabledDate={this.disabledDate}
                onChange={this.timeChange}
                getCalendarContainer={() => this.refs.time}
              />}
          </div>
          <div className={styles.chartCont} >
            <SequenceChart idName={'sequenceChart'} sequenceChartList={sequenceChartList} currentDeviceName={deviceName} theme={theme} />
          </div>
        </div>
        <IgnoreModal ignoreReason={ignoreReason} onChange={this.addReason} ingoreVisible={ingoreVisible} />
      </div>

    );
  }
}

export default UnhandleSide;


