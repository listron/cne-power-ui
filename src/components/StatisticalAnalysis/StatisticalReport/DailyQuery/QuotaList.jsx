import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'antd';
import CommonPagination from '../../Common/CommonPagination';
import styles from './dailyQuery.scss';

class QuotaList extends Component {

  static propTypes = {
    listParam: PropTypes.object,
    quotaListData: PropTypes.object,
    changeDailyQueryStore: PropTypes.func,
    getQuotaList: PropTypes.func,
    tableLoading: PropTypes.bool,
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器
    const { changeDailyQueryStore, getQuotaList, listParam } = this.props;
    const newParam = {
      ...listParam,
      pageSize,
      pageNum: currentPage,
    };
    changeDailyQueryStore({
      ...newParam,
    });
    getQuotaList({
      ...newParam,
    });
  }

  render(){
    const { listParam, quotaListData, tableLoading } = this.props;
    const { pageNum, pageSize } = listParam;
    const { total = 0, dataList = [] } = quotaListData;
    const dataSource = dataList.map((e, i) => {
      return 
    })
    const columns = [{
      title: '电站名称',
      dataIndex: 'deviceName',
      className: 'deviceName',
      sorter: true,
    }, {
      title: '区域名称',
      dataIndex: 'stationName',
      className: 'stationName',
      sorter: true,
    }, {
      title: '时间',
      dataIndex: 'deviceTypeName',
      className: 'deviceTypeName',
      sorter: true,
    },
    ];

    return (
      <div className={styles.quotaList}>
        <div className={styles.pagination}>
          <Button className={styles.listExport}>导出</Button>
          <CommonPagination
            currentPage={pageNum}
            pageSize={pageSize}
            total={total}
            onPaginationChange={this.onPaginationChange}
          />
        </div>

        <Table
          loading={tableLoading}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
    );
  }
}

export default QuotaList;
