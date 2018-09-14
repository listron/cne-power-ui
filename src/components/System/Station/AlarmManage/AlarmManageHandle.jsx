import React, { Component } from 'react';
import styles from './alarmManage.scss';
import CommonPagination from '../../../Common/CommonPagination';
import SingleStationImportFileModel from '../../../Common/SingleStationImportFileModel';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import path from '../../../../constants/path';

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

  render() {
    const { totalNum, alarmList, stations } = this.props;
    return (
      <div className={styles.alarmManageHandle}>
        <div className={styles.leftHandler}>
          <SingleStationImportFileModel 
            data={stations} 
            uploadPath={`${path.basePaths.APIBasePath}${path.APISubPaths.system.importAlarmInfo}`} 
            uploaderName={'告警'} 
            disableStation={[]}
            uploadExtraData={['stationCode','stationType']}
          />
          <Button disabled={alarmList.length === 0} className={styles.exportInfo}>导出告警事件信息表</Button>
          <Button disabled={alarmList.length === 0} onClick={this.deleteAlarmList} className={styles.clearAlarm}>清除告警</Button>
        </div>
        <CommonPagination  total={totalNum} onPaginationChange={this.onPaginationChange} />
      </div>
    );
  }
}

export default AlarmManageHandle;
