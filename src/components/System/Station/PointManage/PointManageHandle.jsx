import React, { Component } from 'react';
import styles from './pointManage.scss';
import CommonPagination from '../../../Common/CommonPagination';
import SingleStationImportFileModel from '../../../Common/SingleStationImportFileModel';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import path from '../../../../constants/path';
import WarningTip from '../../../../components/Common/WarningTip';

class PointManageHandle extends Component {
  static propTypes = {
    exportLoading: PropTypes.bool,
    stationCode: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    totalNum: PropTypes.number,
    allStationBaseInfo: PropTypes.array,
    stationPointStatusList: PropTypes.array,
    pointList: PropTypes.array,
    queryParams: PropTypes.object,
    getPointList: PropTypes.func,
    deletePointList: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    changeCommonStore: PropTypes.func,
    changePointManageStore: PropTypes.func,
    exportPoints: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '确定要删除?',
    }
  }

  onPaginationChange = ({ pageSize, currentPage }) => {
    const { queryParams, getPointList } = this.props;
    getPointList({
      ...queryParams,
      pageNum: currentPage,
      pageSize,
    })
  }

  getUpdatePointList = ({ file, selectedStation }) => { // 上传成功后重新请求列表
    const { queryParams, getPointList, getStationDeviceTypes, changePointManageStore } = this.props;
    getPointList({
      ...queryParams,
      stationCode: selectedStation.stationCode,
      deviceTypeCode: null,
      deviceModeCode: null,
      pageNum: 1,
    });
    getStationDeviceTypes({
      stationCodes: selectedStation.stationCode,
    });
    changePointManageStore({
      deviceModels: []
    })
  }

  deletePoint = () => {
    this.setState({
      showWarningTip: true,
      //deleteInfo: record,
    })
  }

  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
  }
  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
    this.deletePointList()
  }

  toExport = () => {
    const { exportPoints, stationCode } = this.props;
    exportPoints({
      url: `${path.basePaths.APIBasePath}${path.APISubPaths.system.downloadPointInfo}?stationCode=${stationCode}`,
      method: 'get',
      loadingName: 'exportLoading',
      fileName: '电站测电表.xlsx',
    })
  }

  deletePointList = () => {
    const { deletePointList, stationCode } = this.props;
    deletePointList({ stationCode });
  }


  render() {
    const { pageSize, pageNum, totalNum, pointList, allStationBaseInfo, stationPointStatusList, stationCode, exportLoading } = this.props;
    const { showWarningTip, warningTipText, } = this.state;
    const selectedStationInfo = stationPointStatusList.find(e => e.stationCode === stationCode);
    const pointForbidClear = !selectedStationInfo || selectedStationInfo.alarmStatus === 1; // 未找到电站或电站已导入告警，不可清除
    // const downloadHref = `${path.basePaths.APIBasePath}${path.APISubPaths.system.downloadPointInfo}?stationCode=${stationCode}`;
    return (
      <div className={styles.pointManageHandle}>
        <div className={styles.leftHandler}>
          {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
          <SingleStationImportFileModel
            data={allStationBaseInfo}
            uploadPath={`${path.basePaths.APIBasePath}${path.APISubPaths.system.importPointsInfo}`}
            uploaderName={'测点'}
            uploadExtraData={['stationCode']}
            loadedCallback={this.getUpdatePointList}
          />
          <Button
            disabled={pointList.length === 0}
            className={styles.exportInfo}
            loading={exportLoading}
            onClick={this.toExport}
          >导出测点表</Button>
          {/* <Button disabled={pointList.length === 0}>查看测试状态</Button> */}
          <Button disabled={pointList.length === 0 || pointForbidClear} onClick={this.deletePoint} className={styles.clearPoint}>清除测点</Button>
        </div>
        <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
      </div>
    );
  }
}

export default PointManageHandle;
