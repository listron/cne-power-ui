import React, { Component } from 'react';
import styles from './alarmManage.scss';
import CommonPagination from '../../../Common/CommonPagination';
import SingleStationImportFileModel from '../../../Common/SingleStationImportFileModel';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import path from '../../../../constants/path';

class AlarmManageHandle extends Component {
  static propTypes = {
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    stationCode: PropTypes.number,
    totalNum: PropTypes.number,
    alarmList: PropTypes.array,
    allStationBaseInfo: PropTypes.array,
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

  getAlarmList = () => {
    const { queryParams, getAlarmList } = this.props;
    getAlarmList({ ...queryParams });
  }

  deleteAlarmList = () => {
    const { deleteAlarmList, stationCode } = this.props;
    deleteAlarmList({ stationCode });
  }

  render() {
    const { pageSize, pageNum, totalNum, alarmList, allStationBaseInfo, stationCode } = this.props;
    const downloadHref = `${path.basePaths.APIBasePath}${path.APISubPaths.system.downloadAlarmInfo}?stationCode=${stationCode}`;
    return (
      <div className={styles.alarmManageHandle}>
        <div className={styles.leftHandler}>
          <SingleStationImportFileModel 
            data={allStationBaseInfo} 
            uploadPath={`${path.basePaths.APIBasePath}${path.APISubPaths.system.importAlarmInfo}`} 
            uploaderName={'告警'} 
            disableStation={[]}
            uploadExtraData={['stationCode','stationType']}
            // loadedCallback={this.getAlarmList}
          />
          <Button disabled={alarmList.length === 0} className={styles.exportInfo} href={downloadHref} download={downloadHref}>导出告警事件信息表</Button>
          <Button disabled={alarmList.length === 0} onClick={this.deleteAlarmList} className={styles.clearAlarm}>清除告警</Button>
        </div>
        <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
      </div>
    );
  }
}

export default AlarmManageHandle;
