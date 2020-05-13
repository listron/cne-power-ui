
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './cleanoutRecordMain.scss';
import CleanoutRecordTable from './CleanoutRecordTable';
import Pagination from '../../../../../components/Common/CommonPagination/index';
import FilterCondition from '../../../../Common/FilterConditions/FilterCondition';

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
    theme: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    const { stationCodes, getMainList, pageNum, pageSize, sortField, sortType } = this.props;
    getMainList({
      stationCodes: [],
      pageNum,
      pageSize,
      sortField,
      sortType,
    });
  }
  componentWillReceiveProps(nextProps) {
    const { getMainList, stationCodes, pageNum, pageSize, sortField, sortType } = nextProps;
    if (pageNum !== this.props.pageNum || pageSize !== this.props.pageSize || sortField !== this.props.sortField || sortType !== this.props.sortType) {
      getMainList({ stationCodes, pageNum, pageSize, sortField, sortType });
    }
  }
  componentWillUnmount() {
    const { changeCleanoutRecordStore } = this.props;
    changeCleanoutRecordStore({ mainListData: [] });
  }

  onPaginationChange = ({ pageSize, currentPage }) => {
    const { getMainList, stationCodes, sortField, sortType } = this.props;
    getMainList({
      stationCodes,
      pageNum: currentPage,
      pageSize,
      sortField,
      sortType,
    });
  }
  filterCondition = (change) => {//选择电站
    const { changeCleanoutRecordStore, getMainList, pageNum, pageSize, sortField, sortType } = this.props;
    changeCleanoutRecordStore({ stationCodes: change.stationCodes });
    getMainList({ stationCodes: change.stationCodes, pageNum, pageSize, sortField, sortType });
  }
  render() {
    const { stations, total, pageSize, pageNum, theme } = this.props;
    return (
      <div className={`${styles.cleanoutRecordMain} ${styles[theme]}`}>
        <div className={styles.cleanoutcontainer}>
          <div className={styles.topFilter}>
            <FilterCondition
              theme={theme}
              onChange={this.filterCondition}
              option={[
                {
                  name: '电站名称',
                  type: 'stationName',
                  typeName: 'stationCodes',
                  data: stations.filter(e => e.stationType === 1),
                },
              ]}
            />
          </div>
          <div className={styles.paginationStyle}>
            <Pagination total={total} pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} theme={theme} />
          </div>
          <div className={styles.wrap}>
            <CleanoutRecordTable {...this.props} />
          </div>
        </div>

      </div>
    );
  }
}

export default CleanoutRecordMain;
