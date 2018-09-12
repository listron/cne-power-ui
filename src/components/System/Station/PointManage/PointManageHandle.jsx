import React, { Component } from 'react';
import styles from './pointManage.scss';
import CommonPagination from '../../../Common/CommonPagination';
import { Button } from 'antd';
import PropTypes from 'prop-types';

class PointManageHandle extends Component {
  static propTypes = {
    stationCode: PropTypes.number,
    totalNum: PropTypes.number,
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
    const { totalNum, pointList } = this.props;
    const { pointModal } = this.state;
    return (
      <div className={styles.deviceManageHandle}>
        <Button onClick={this.showAddPointModal} >
          <span>+</span>
          <span>测点</span>
        </Button>
        <Button disabled={pointList.length === 0}>导出测电表</Button>
        {/* <Button disabled={pointList.length === 0}>查看测试状态</Button> */}
        <Button disabled={pointList.length === 0} onClick={this.deletePointList}>清除测点</Button>
        <CommonPagination  total={totalNum} onPaginationChange={this.onPaginationChange} />
        {pointModal && <div>这个东西啊！</div>}
      </div>
    );
  }
}

export default PointManageHandle;
