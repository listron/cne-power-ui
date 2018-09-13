import React, { Component } from 'react';
import styles from './pointManage.scss';
import CommonPagination from '../../../Common/CommonPagination';
import SingleStationImportFileModel from '../../../Common/SingleStationImportFileModel';
import { Button } from 'antd';
import PropTypes from 'prop-types';

class PointManageHandle extends Component {
  static propTypes = {
    stationCode: PropTypes.number,
    totalNum: PropTypes.number,
    stations: PropTypes.array,
    stationList: PropTypes.array,
    pointList: PropTypes.array,
    queryParams: PropTypes.object,
    getPointList: PropTypes.func,
    deletePointList: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      pointModal: false,
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

  deletPointList = () => {
    const { deletePointList, stationCode } = this.props;
    deletePointList({ stationCode });
  }

  showAddPointModal = () => {
    this.setState({ pointModal: true })
  }

  hideAddPointModal = () => {
    this.setState({ pointModal: true })
  }

  importPointData = () => {
    this.setState({ pointModal: false })
  }

  render() {
    const { totalNum, pointList, stations, stationList, stationCode } = this.props;
    const { pointModal } = this.state;
    const selectedStationInfo = stationList.find(e => e.stationCode === stationCode);
    const pointForbidClear = !selectedStationInfo || selectedStationInfo.pointStatus === 1; // 未找到电站或电站已导入告警，不可清除
    return (
      <div className={styles.pointManageHandle}>
        <div className={styles.leftHandler}>
          <SingleStationImportFileModel 
            data={stations} 
            uploadPath={''} 
            uploaderName={'测点'} 
            uploadExtraData={['stationCode']}
          />
          <Button disabled={pointList.length === 0} className={styles.exportInfo}>导出测电表</Button>
          {/* <Button disabled={pointList.length === 0}>查看测试状态</Button> */}
          <Button disabled={pointList.length === 0 || pointForbidClear} onClick={this.deletePointList} className={styles.clearPoint}>清除测点</Button>
        </div>
        <CommonPagination  total={totalNum} onPaginationChange={this.onPaginationChange} />
        {pointModal && <div>这个东西啊！</div>}
      </div>
    );
  }
}

export default PointManageHandle;
