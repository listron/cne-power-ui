import React, { Component } from 'react';
import styles from './pointManage.scss';
import { Table } from 'antd';
import PropTypes from 'prop-types';

class PointManageList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    queryParams: PropTypes.object,
    pointList: PropTypes.array,
    getPointList: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  tableChange = (pagination, filter, sorter) => { // 排序触发重新请求设备列表
    const { getPointList, queryParams } = this.props;
    const { field, order } = sorter;
    getPointList({
      ...queryParams,
      orderField: field?field:'',
      //sortField: field ? field === 'warningLevel' ? '1' : '2' : '',
      orderType: order ? (sorter.order === 'ascend' ? 0 : 1) : null,
    })
  }

  render() {
    const pointListColumn = [
      {
        title: '测点编号',
        dataIndex: 'devicePointStandardCode',
        key: 'devicePointStandardCode',
      }, {
        title: '测点描述',
        dataIndex: 'devicePointName',
        key: 'devicePointName',
        sorter: true,
      }, {
        title: '第三方测点名称',
        dataIndex: 'devicePointCode',
        key: 'devicePointCode',
        sorter: true,
      }, {
        title: '英文名称',
        dataIndex: 'devicePointIecname',
        key: 'devicePointIecname',
        sorter: true,
      }, {
        title: '分组名称',
        dataIndex: 'groupName',
        key: 'groupName',
      }, {
        title: '数据类型',
        dataIndex: 'devicePointDatatype',
        key: 'devicePointDatatype',
        sorter: true,
      }, {
        title: '测点类型',
        dataIndex: 'devicePointType',
        key: 'devicePointType',
        sorter: true,
      }, {
        title: '单位',
        dataIndex: 'devicePointUnit',
        key: 'devicePointUnit',
      }, {
        title: '系数',
        dataIndex: 'devicePointIndex',
        key: 'devicePointIndex',
      }, {
        title: '点小数位',
        dataIndex: 'devicePointDecimalplace',
        key: 'devicePointDecimalplace',
      },
    ];
    const { loading, pointList } = this.props;
    return (
      <div className={styles.pointManageList}>
        <Table
          loading={loading}
          onChange={this.tableChange}
          columns={pointListColumn}
          dataSource={pointList.map((e, i) => ({ key: i, ...e }))}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
    );
  }
}

export default PointManageList;
