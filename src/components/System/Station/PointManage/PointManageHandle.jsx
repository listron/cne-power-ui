import React, { Component } from 'react';
import styles from './pointManage.scss';
import CommonPagination from '../../../Common/CommonPagination';
import SingleStationImportFileModel from '../../../Common/SingleStationImportFileModel';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import path from '../../../../constants/path';

class PointManageHandle extends Component {
  static propTypes = {
    stationCode: PropTypes.number,
    totalNum: PropTypes.number,
    allStationBaseInfo: PropTypes.array,
    stationList: PropTypes.array,
    pointList: PropTypes.array,
    queryParams: PropTypes.object,
    getPointList: PropTypes.func,
    deletePointList: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  onPaginationChange = ({pageSize, currentPage}) => {
    const { queryParams, getPointList } = this.props;
    getPointList({
      ...queryParams,
      pageNum: currentPage,
      pageSize,
    })
  }

  // getPointList = () => { // 上传成功后重新请求列表
  //   const { queryParams, getPointList } = this.props;
  //   getPointList({ ...queryParams });
  // }

  deletPointList = () => {
    const { deletePointList, stationCode } = this.props;
    deletePointList({ stationCode });
  }

  render() {
    const { totalNum, pointList, allStationBaseInfo, stationList, stationCode } = this.props;
    const selectedStationInfo = stationList.find(e => e.stationCode === stationCode);
    const pointForbidClear = !selectedStationInfo || selectedStationInfo.pointStatus === 1; // 未找到电站或电站已导入告警，不可清除
    const downloadHref = `${path.basePaths.APIBasePath}${path.APISubPaths.system.downloadPointInfo}?stationCode=${stationCode}`;
    return (
      <div className={styles.pointManageHandle}>
        <div className={styles.leftHandler}>
          <SingleStationImportFileModel 
            data={allStationBaseInfo} 
            uploadPath={`${path.basePaths.APIBasePath}${path.APISubPaths.system.importPointsInfo}`} 
            uploaderName={'测点'} 
            uploadExtraData={['stationCode']}
            // loadedCallback={this.getPointList}
          />
          <Button disabled={pointList.length === 0} className={styles.exportInfo} href={downloadHref} download={downloadHref}>导出测点表</Button>
          {/* <Button disabled={pointList.length === 0}>查看测试状态</Button> */}
          <Button disabled={pointList.length === 0 || pointForbidClear} onClick={this.deletePointList} className={styles.clearPoint}>清除测点</Button>
        </div>
        <CommonPagination  total={totalNum} onPaginationChange={this.onPaginationChange} />
      </div>
    );
  }
}

export default PointManageHandle;
