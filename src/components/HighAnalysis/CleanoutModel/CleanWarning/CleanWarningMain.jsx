

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'antd';
// import StationManageSearch from './StationManageSearch';
// import StationManageTable from './StationManageTable';
import Footer from '../../../Common/Footer';
import FilterCondition from '../../../Common/FilterCondition/FilterCondition';
import CommonPagination from '../../../Common/CommonPagination';
import styles from './cleanStyle.scss';

class CleanWarningMain extends Component { // 电站管理列表页
  static propTypes = {
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    stations: PropTypes.array,
    cleanWarningList: PropTypes.array,
    changeCleanWarningStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  selectStation = ({stationCodes}) => {
    console.log(stationCodes);
    // selectedStations
  }

  paginationChange = ({pageSize, currentPage}) => {
    console.log(pageSize, currentPage)
  }

  showDetail = () => {
    this.props.changeCleanWarningStore({
      showPage: 'detail',
    })
  }

  render() {
    const { stations, total, pageNum, pageSize, cleanWarningList } = this.props;
    return (
      <div className={styles.cleanWarningMain}>
        <div className={styles.stationContent}>
          <FilterCondition
            stations={stations}
            onChange={this.selectStation}
            option={['stationName']}
          />
          <CommonPagination
            total={total}
            pageSize={pageSize}
            currentPage={pageNum}
            onPaginationChange={this.paginationChange}
          />
          <Table
            columns={[]}
            pagination={null}
            dataSource={cleanWarningList}
          />
          <Button onClick={this.showDetail}>按钮</Button>
        </div>
        <Footer />
      </div>
    )
  }
}

export default CleanWarningMain;
