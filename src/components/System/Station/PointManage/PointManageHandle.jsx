import React, { Component } from 'react';
import styles from './pointManage.scss';
import CommonPagination from '../../../Common/CommonPagination';
import SingleStationImportFileModel from '../../../Common/SingleStationImportFileModel';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import path from '../../../../constants/path';
import WarningTip from '../../../../components/Common/WarningTip';
import { handleRight } from '@utils/utilFunc';
import CneButton from '@components/Common/Power/CneButton';

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
      warningTipText: '确定要删除选中的测点吗?',
    };
    this.clearFlag = 0; //标记删除测点的方式； 0 删除 1 清除测点 
  }

  onPaginationChange = ({ pageSize, currentPage }) => {
    const { queryParams, getPointList } = this.props;
    getPointList({
      ...queryParams,
      pageNum: currentPage,
      pageSize,
    });
    this.props.changePointManageStore({
      selectedRowKeys: [],
    });
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
      deviceModels: [],
    });
  }

  deletePoint = () => {
    this.clearFlag = 1; //清除测点
    this.setState({
      showWarningTip: true,
      warningTipText: '确定要清除测点吗?',
      //deleteInfo: record,
    });
  }

  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }
  confirmWarningTip = () => {
    const { selectedRowData } = this.props;
    this.setState({
      showWarningTip: false,
    });
    if (1 == this.clearFlag)
    { 
      this.deletePointList();
    }
    else {
      this.props.deletePoints({
        devicePointIds: selectedRowData.map(e => (e.devicePointId)),
      });
    }
  }

  toExport = () => {
    const { exportPoints, stationCode } = this.props;
    exportPoints({
      url: `${path.basePaths.APIBasePath}${path.APISubPaths.system.downloadPointInfo}?stationCode=${stationCode}`,
      method: 'get',
      loadingName: 'exportLoading',
      fileName: '电站测点表.xlsx',
    });
  }

  deletePointList = () => {
    const { deletePointList, stationCode } = this.props;
    deletePointList({ stationCode });
  }
  showAddPage = () => {
    this.props.changePointManageStore({
      showPage: 'add',
    });
  }
  deletePoints = () => {
    this.clearFlag = 0; //删除
    this.setState({
      showWarningTip: true,
      warningTipText: '确定要删除选中的测点吗?',
    });
  }

  render() {
    const { pageSize, pageNum, totalNum, pointList, allStationBaseInfo, stationPointStatusList, stationCode, exportLoading, selectedRowKeys } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    const selectedStationInfo = stationPointStatusList.find(e => e.stationCode === stationCode);
    const pointForbidClear = !selectedStationInfo || selectedStationInfo.alarmStatus === 1; // 未找到电站或电站已导入告警，不可清除
    // const downloadHref = `${path.basePaths.APIBasePath}${path.APISubPaths.system.downloadPointInfo}?stationCode=${stationCode}`;
    const downloadTemplet = `${path.basePaths.originUri}${path.APISubPaths.system.downloadPointExcel}`;
    const pointOperation = handleRight('station_point_operate');
    return (
      <div className={styles.pointManageHandle}>
        {pointOperation ? <div className={styles.leftHandler}>
          {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
          <CneButton onClick={this.showAddPage} className={styles.addButton} >
            <div className={styles.icon}>
              <span className={'iconfont icon-newbuilt'} />
            </div>测点
          </CneButton>
          <SingleStationImportFileModel
            showPlusBtn={false}
            data={allStationBaseInfo}
            uploadPath={`${path.basePaths.APIBasePath}${path.APISubPaths.system.importPointsInfo}`}
            uploaderName={'测点表'}
            uploadExtraData={['stationCode']}
            loadedCallback={this.getUpdatePointList}
          />
          <CneButton
            disabled={pointList.length === 0}
            className={styles.exportInfo}
            loading={exportLoading}
            onClick={this.toExport}
          >导出测点表</CneButton>
          {/* <Button disabled={pointList.length === 0}>查看测试状态</Button> */}
          <CneButton disabled={pointList.length === 0 || pointForbidClear} onClick={this.deletePoint} className={styles.clearPoint}>清除测点</CneButton>
          <CneButton disabled={pointList.length === 0 || selectedRowKeys.length === 0} onClick={this.deletePoints}> 删除 </CneButton>
          <CneButton
            className={styles.downloadStyle}
            href={downloadTemplet}
            download={downloadTemplet}
            target="_blank"
          >下载标准点表
          </CneButton>
        </div> : <div></div>}
        <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
      </div>
    );
  }
}

export default PointManageHandle;
