import React, { Component } from 'react';
import { Icon, Table, Select, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import { ReserveDetail } from './ManageCommon/ReserveDetail';
import CommonPagination from '../../../Common/CommonPagination';
import styles from './warehouseManageComp.scss';

export default class SpareReserve extends Component {

  static propTypes = {
    tabName: PropTypes.string,
    reserveDetail: PropTypes.object,
    reserveListInfo: PropTypes.object,
    reserveParams: PropTypes.object,
    backList: PropTypes.func,
    changeStore: PropTypes.func,
    getReserveDetail: PropTypes.func,
    getReserveList: PropTypes.func,
  }

  onPaginationChange = ({pageSize, currentPage}) => { // 翻页
    // const { reserveParams, getWarehouseManageList, changeStore } = this.props;
    // changeStore({
    //   pageNum: currentPage,
    //   pageSize,
    //   checkedStocks: [], // 清空选中
    // });
    // getWarehouseManageList({
    //   ...tableParams,
    //   pageNum: currentPage, 
    //   pageSize
    // });
  }

  tableChange = (pagination, filter, sorter) => { // 排序 todo 主页面的排序同样未完成
    // const { field, order } = sorter;
    // const {} = this.props;
    // getAlarmList({
    //   ...queryParams,
    //   //sortField: field?field:'',
    //   sortField: field ? field === 'warningLevel' ? '1' : '2' : '',
    //   sortOrder: order ? (sorter.order === 'ascend' ? '1' : '2') : '',

    //   // sortOrder: order?(sorter.order==='ascend'?'asc':'desc'):'',

    // })
  }

  reserveColumn = () => [ // todo 
    {
      title: '物资编码',
      dataIndex: 'materialCode',
    }
  ]

  backToList = () => {
    this.props.changeStore({
      reserveDetail: {},
      reserveListInfo: {},
    });
    this.props.backList();
  }

  render(){
    const { reserveDetail, reserveListInfo, tabName, reserveParams } = this.props;
    const { pageSize, pageNum } = reserveParams;
    const { pageCount = 0 } = reserveListInfo;
    const dataList = reserveListInfo.dataList || [];
    return (
      <section className={styles.reserve}>
        <h3 className={styles.title}>
          <span className={styles.text}>备品备件 - 库存</span>
          <Icon type="arrow-left" onClick={this.backToList} className={styles.backIcon} />
        </h3>
        <ReserveDetail reserveDetail={reserveDetail} tabName={tabName} />
        <CommonPagination
          total={pageCount}
          pageSize={pageSize}
          currentPage={pageNum}
          onPaginationChange={this.onPaginationChange}
        />
        <Table
          // loading={loading}
          onChange={this.tableChange}
          columns={this.reserveColumn()}
          dataSource={dataList.map(e => ({ key: e.materialCode, ...e }))}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </section>
    )
  }
}

