
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './cleanoutRecordMain.scss';
import CleanoutRecordTable from './CleanoutRecordTable';
import Pagination from '../../../../../components/Common/CommonPagination/index';
import FilterCondition from '../../../../Common/FilterCondition/FilterCondition';

class CleanoutRecordMain extends Component { // 电站管理列表页
  static propTypes = {
    changeCleanoutRecordStore: PropTypes.func,
    getMainList: PropTypes.func,
    stationCodes: PropTypes.array,
    stations: PropTypes.array,
    pageNum: PropTypes.number,
    total: PropTypes.number,
    pageSize: PropTypes.number,
    sortType: PropTypes.number,
    sortField: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    const { getMainList, stationCodes, pageNum, pageSize, sortField, sortType } = nextProps;
    if ( pageNum !== this.props.pageNum || pageSize !== this.props.pageSize || sortField !== this.props.sortField || sortType !== this.props.sortType) {
      getMainList({ stationCodes, pageNum, pageSize, sortField, sortType })
    }
  }
  
   onPaginationChange = ({ pageSize, currentPage }) => {
    const { getMainList,stationCodes, sortField, sortType } = this.props;
    getMainList({
      stationCodes,
      pageNum: currentPage,
      pageSize, 
      sortField, 
      sortType
    })
  }
  filterCondition = (change) => {//选择电站
    console.log('change', change.stationCodes)
    const { changeCleanoutRecordStore,getMainList, pageNum, pageSize, sortField, sortType } = this.props;
    changeCleanoutRecordStore({ stationCodes: change.stationCodes })
    getMainList({ stationCodes:change.stationCodes, pageNum, pageSize, sortField, sortType })
  }
  render() {
    const { stations,total,pageSize,pageNum } = this.props;
    return (
      <div className={styles.cleanoutRecordMain}>
        <div className={styles.topFilter}>
          <FilterCondition
            option={['stationName',]}
            stations={stations}
            onChange={this.filterCondition}
          />
        </div>
        <div className={styles.paginationStyle}>
          <Pagination total={total} pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} />
        </div>
        <CleanoutRecordTable {...this.props} />
      </div>
    )
  }
}

export default CleanoutRecordMain;
