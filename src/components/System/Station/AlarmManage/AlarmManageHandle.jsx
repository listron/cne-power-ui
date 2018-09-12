import React, { Component } from 'react';
import styles from './alarmManage.scss';
import CommonPagination from '../../../Common/CommonPagination';
import { Button } from 'antd';
import PropTypes from 'prop-types';

class AlarmManageHandle extends Component {
  static propTypes = {
    stationCode: PropTypes.string,
    totalNum: PropTypes.number,
    alarmList: PropTypes.array,
    queryParams: PropTypes.object,
    getAlarmList: PropTypes.func,
    deleteAlarmList: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      alarmModal: false,
    }
  }

  onPaginationChange = ({pageSize, currentPage}) => {
    const { queryParams, getAlarmList } = this.props;
    getAlarmList({
      ...queryParams,
      pageNum: currentPage,
      pageSize,
    })
  }

  deleteAlarmList = () => {
    const { deleteAlarmList, stationCode } = this.props;
    deleteAlarmList({ stationCode });
  }

  showAddAlarmModal = () => {
    this.setState({ alarmModal: true })
  }

  hideAddAlarmModal = () => {
    this.setState({ alarmModal: true })
  }

  importAlarmData = () => {
    this.setState({ alarmModal: false })
  }

  render() {
    const { totalNum, alarmList } = this.props;
    const { alarmModal } = this.state;
    return (
      <div className={styles.deviceManageHandle}>
        <Button onClick={this.showAddPointModal} >
          <span>+</span>
          <span>告警</span>
        </Button>
        <Button disabled={alarmList.length === 0}>导出告警事件信息表</Button>
        <Button disabled={alarmList.length === 0} onClick={this.deleteAlarmList}>清除告警</Button>
        <CommonPagination  total={totalNum} onPaginationChange={this.onPaginationChange} />
        {alarmModal && <div>这个东西啊！</div>}
      </div>
    );
  }
}

export default AlarmManageHandle;