import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Button, Table, Radio } from "antd";
import moment from 'moment';
import styles from "./stockRecords.scss";
import CommonPagination from '../../Common/CommonPagination';

class StockList extends Component {
  static propTypes = {
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    pageCount: PropTypes.number,
    inRecordListData: PropTypes.object,
    tableLoading:  PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { pageNum, pageSize, tableLoading, inRecordListData } = this.props;
    const { pageCount, dataList } = inRecordListData;

    const columns = [{
      title: '物品编码',
      dataIndex: 'thingCode',
      className: 'thingCode',
      sorter: true,
    }, {
      title: '物品名称',
      dataIndex: 'thingName',
      className: 'thingName',
      sorter: true,
    }, {
      title: '库存类型',
      dataIndex: 'faultDescription',
      className: 'faultDescription',
      sorter: true,
    }, {
      title: '设备型号',
      dataIndex: 'checkItems',
      className: 'checkItems',
      sorter: true,
    }, {
      title: '单价/元',
      dataIndex: 'unitPrice',
      className: 'unitPrice',
      sorter: true,
    }, {
      title: '仓库名称',
      dataIndex: 'warehouseName',
      className: 'warehouseName',
      sorter: true,
    }, {
      title: '入库时间',
      dataIndex: 'InRecordTime',
      className: 'InRecordTime',
      sorter: true,
      render: (text, record) => moment(text).format('YYYY-MM-DD'),
    }, {
      title: '入库人',
      dataIndex: 'InRecordMan',
      className: 'InRecordMan',
      sorter: true,
    }, {
      title: '更多信息',
      dataIndex: 'moreInformation',
      className: 'moreInformation',
      sorter: true,
      render: (text, record, index) => (
        <span className={styles.moreInformation} onClick={()=>this.checked(record)}>查看</span>
      )
    }];

    return (
      <div className={styles.stockList}>
        {/* <div className={styles.stockListTop}>
          <div className={styles.switchBtn}>
            <Radio.Group value={tableType} buttonStyle="solid" onChange={this.changeTable}>
              <Radio.Button value="all">汇总</Radio.Button>
              <Radio.Button value="detail">明细</Radio.Button>
            </Radio.Group>
          </div>
          <CommonPagination
            currentPage={pageNum}
            pageSize={pageSize}
            total={pageCount}
            onPaginationChange={this.onPaginationChange}
          />
        </div> */}
        <Table
          loading={tableLoading}
          className={styles.intelligentList}
          dataSource={ dataList.map((e, i) => ({...e, key: i})) }
          columns={columns}
          onChange={this.tableChange}
          pagination={false}
          locale={{emptyText:<img width="223" height="164" src="/img/nodata.png" />}}
        />
      </div>
      )
    }
  }
  
  export default StockList;