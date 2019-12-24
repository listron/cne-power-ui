import React, { Component } from 'react';
import styles from './alarmManage.scss';
import CommonPagination from '../../../Common/CommonPagination';
import SingleStationImportFileModel from '../../../Common/SingleStationImportFileModel';
import WarningTip from '../../../Common/WarningTip/index'
import { Button } from 'antd';
import PropTypes from 'prop-types';
import path from '../../../../constants/path';
import { handleRight } from '@utils/utilFunc';

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
    getStationDeviceTypes: PropTypes.func,
    changeCommonStore: PropTypes.func,
    changeAlarmManageStore: PropTypes.func,
    downloadAlarmExcel: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      alarmModal: false,
      showWarningTip: false,
      warningTipText: '确定要清除该告警的配置？'
    }
  }

  onPaginationChange = ({ pageSize, currentPage }) => {
    const { queryParams, getAlarmList } = this.props;
    getAlarmList({
      ...queryParams,
      pageNum: currentPage,
      pageSize,
    })
  }

  getUpdateAlarmList = ({ file, selectedStation }) => { // 上传成功后重新请求列表
    const { queryParams, getAlarmList, getStationDeviceTypes, changeAlarmManageStore } = this.props;
    getAlarmList({
      ...queryParams,
      stationCode: selectedStation.stationCode,
      deviceTypeCode: null,
      deviceModeCode: null,
      pointCode: '',
      pageNum: 1,
    });
    getStationDeviceTypes({
      stationCodes: selectedStation.stationCode,
    });
    changeAlarmManageStore({
      deviceModels: [],
      devicePoints: [],
    })
  }

  deleteAlarmList = () => {
    const { stationCode, allStationBaseInfo } = this.props;
    const stationName = allStationBaseInfo.find(e => e.stationCode === stationCode).stationName;
    this.setState({ showWarningTip: true, warningTipText: `确定要清除${stationName}电站告警事件配置？` })
  }

  downloadAlarmExcel = () => {
    const { stationCode, allStationBaseInfo } = this.props;
    const stationName = allStationBaseInfo.find(e => e.stationCode === stationCode).stationName;
    this.props.downloadAlarmExcel({ stationCode, stationName })
  }

  cancelWarningTip = () => {
    this.setState({ showWarningTip: false })
  }

  confirmWarningTip = () => {
    const { deleteAlarmList, stationCode, } = this.props;

    deleteAlarmList({ stationCode });
    this.setState({ showWarningTip: false, })
  }

  render() {
    const { pageSize, pageNum, totalNum, alarmList, allStationBaseInfo, stations } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    const alarmOperation = handleRight('station_alert_operate');

    return (
      <div className={styles.alarmManageHandle}>
        {showWarningTip &&
          <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} style={{width: '210px',height:'100px',marginTop:'50px'}}/>}
        {alarmOperation ?
        <div className={styles.leftHandler}>
          <SingleStationImportFileModel
            data={allStationBaseInfo}
            uploadPath={`${path.basePaths.APIBasePath}${path.APISubPaths.system.importAlarmInfo}`}
            uploaderName={'告警'}
            disableStation={[]}
            uploadExtraData={['stationCode', 'stationType']}
            loadedCallback={this.getUpdateAlarmList}
          />
          {/* <Button disabled={alarmList.length === 0} className={styles.exportInfo} href={downloadHref} download={downloadHref}>导出告警事件信息表</Button> */}
          <Button disabled={alarmList.length === 0} className={styles.exportInfo} onClick={this.downloadAlarmExcel}>导出告警事件信息表</Button>
          <Button disabled={alarmList.length === 0} onClick={this.deleteAlarmList} className={styles.clearAlarm}>清除告警</Button>
          
        </div> : <div></div>}
        <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
      </div>
    );
  }
}

export default AlarmManageHandle;
