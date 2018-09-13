import React, { Component } from 'react';
import styles from './alarmManage.scss';
import CommonPagination from '../../../Common/CommonPagination';
import SingleStationImportFileModel from '../../../Common/SingleStationImportFileModel';
import { Button } from 'antd';
import PropTypes from 'prop-types';

class AlarmManageHandle extends Component {
  static propTypes = {
    stationCode: PropTypes.string,
    totalNum: PropTypes.number,
    alarmList: PropTypes.array,
    stations: PropTypes.array,
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
    const { totalNum, alarmList, stations } = this.props;
    const { alarmModal } = this.state;
    return (
      <div className={styles.alarmManageHandle}>
        <SingleStationImportFileModel 
          data={stations} 
          uploadPath={''} 
          uploaderName={'告警'} 
          disableStation={[]}
          uploadExtraData={{}}
        />
        <Button disabled={alarmList.length === 0} className={styles.exportInfo}>导出告警事件信息表</Button>
        <Button disabled={alarmList.length === 0} onClick={this.deleteAlarmList} className={styles.clearAlarm}>清除告警</Button>
        <CommonPagination  total={totalNum} onPaginationChange={this.onPaginationChange} />
        {alarmModal && <div>这个东西啊！</div>}
      </div>
    );
  }
}

export default AlarmManageHandle;
