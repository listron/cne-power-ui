

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
    listQueryParams: PropTypes.object,
    total: PropTypes.number,
    stations: PropTypes.array,
    cleanWarningList: PropTypes.array,
    getCleanWarningList: PropTypes.func,
    changeCleanWarningStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { listQueryParams, getCleanWarningList } = this.props;
    getCleanWarningList(listQueryParams); // 默认请求
  }

  selectStation = ({stationCodes}) => { // 选择电站
    const { listQueryParams, getCleanWarningList } = this.props;
    getCleanWarningList({
      ...listQueryParams,
      stationCodes,
    })
  }

  paginationChange = ({pageSize, currentPage}) => { // 分页器触发
    const { listQueryParams, getCleanWarningList } = this.props;
    getCleanWarningList({
      ...listQueryParams,
      pageNum: currentPage,
      pageSize,
    })
  }

  tableSort = (a,b,c,d) => { // 表格排序
    console.log(a,b,c,d)
  }

  showDetail = () => {
    this.props.changeCleanWarningStore({
      showPage: 'detail',
    })
  }

  render() {
    const { stations, total, listQueryParams, cleanWarningList } = this.props;
    const { pageSize, pageNum } = listQueryParams;
    return (
      <div className={styles.cleanWarningMain}>
        <FilterCondition
          stations={stations}
          onChange={this.selectStation}
          option={['stationName']}
        />
        <div className={styles.pagination}>
          <CommonPagination
            total={total}
            pageSize={pageSize}
            currentPage={pageNum}
            onPaginationChange={this.paginationChange}
          />
        </div>
        <Table
          columns={[]}
          pagination={null}
          dataSource={cleanWarningList}
          onChange={this.tableSort}
        />
        <Button onClick={this.showDetail}>按钮</Button>
        <Footer />
      </div>
    )
  }
}

export default CleanWarningMain;
