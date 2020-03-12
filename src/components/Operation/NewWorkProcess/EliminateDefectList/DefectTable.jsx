import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CneTable from '@components/Common/Power/CneTable';
import styles from './listPage.scss';

export default class DefectTable extends Component {

  static propTypes = {
    listParams: PropTypes.object,
    defectListData: PropTypes.array,
    getDefectList: PropTypes.func,
  };

  defectColumn = [
    {
      title: '电站名称',
      dataIndex: 'stationName',
      sorter: true,
      className: styles.stationName,
      render: (text) => (
        <div
          className={styles.stationNameText}
          title={text || ''}
        >{text || '--'}</div>
      ),
    }, {
      title: '工单描述',
      dataIndex: 'docketDesc',
      className: styles.docketDesc,
      render: (text) => (
        <div
          className={styles.docketDescText}
          title={text || ''}
        >{text || '--'}</div>
      ),
    }, {
      title: '事件数量',
      dataIndex: 'eventNum',
      className: styles.eventNum,
      sorter: true,
      render: (text) => (
        <div
          className={styles.eventNumText}
          title={text || ''}
        >{text || '--'}</div>
      ),
    }, {
      title: '工单创建时间',
      dataIndex: 'createTime',
      className: styles.createTime,
      sorter: true,
      render: (text) => (
        <div
          className={styles.createTimeText}
          title={text || ''}
        >{text || '--'}</div>
      ),
    }, {
      title: '持续时间',
      dataIndex: 'keepLength',
      className: styles.keepLength,
      sorter: true,
      render: (text) => (
        <div
          className={styles.keepLengthText}
          title={text || ''}
        >{text || '--'}</div>
      ),
    }, {
      title: '执行人',
      dataIndex: 'operName',
      className: styles.operName,
      render: (text) => (
        <div
          className={styles.operNameText}
          title={text || ''}
        >{text || '--'}</div>
      ),
    }, {
      title: '状态',
      dataIndex: 'status',
      className: styles.status,
      sorter: true,
      render: (text, record) => {
        const { stateName, isCoordinate, isOverTime } = record;
        return (
          <div
            className={styles.statusContent}
            title={stateName || ''}
          >
            <span>{stateName || '--'}</span>
            {!!isCoordinate && <span
              className={`iconfont icon-xietiao ${styles.coordinateIcon}`}
              style={{right: (!!isCoordinate && !!isOverTime) ? '18.5%' : '3%'}}
              title="协调"
            />}
            {!!isOverTime && <span
              className={`iconfont icon-chaoshi ${styles.overtimeIcon}`}
              title="超时"
            />}
          </div>
        );
      },
    }, {
      title: '操作',
      dataIndex: 'handle',
      className: styles.handle,
      render: (text, record) => (
          <span
            className={`iconfont icon-viewplan ${styles.handleIcon}`}
            title="查看"
            onClick={() => this.onDetailSearch(record)}
          />
      ),
    },
  ]

  onDetailSearch =(record) => {
    console.log(record); // 点击某行进行操作;
  }

  tableSortChange = (pagination, filter, sorter) => {
    const { field } = sorter || {};
    const { listParams } = this.props;
    const { sortField, sortMethod } = listParams || {};
    let newField = sortField, newSort = 'descend';
    if(!field || sortField === field) { // 点击的是正在排序的列
      newSort = sortMethod === 'descend' ? 'ascend' : 'descend'; // 交换排序方式
    } else { // 切换列
      newField = field;
    }
    const newListParams = {
      ...listParams,
      sortField: newField,
      sortMethod: newSort,
    };
    this.props.getDefectList({ ...newListParams });
  }


  defectMockListData = [
    {
      stationName: '电站1',
      docketDesc: '这是随手写的静态数据',
      eventNum: 12,
      keepLength: '21天22小时08分',
      createTime: '2019-07-12 14:00',
      operName: '张三, 李四, 王五, 赵六, 祝七, 黑八, 林九',
      stateName: '已结单',
      isCoordinate: 1,
      isOverTime: 1,
    }, {
      stationName: '电站1',
      docketDesc: '这是随手写的静态数据',
      eventNum: 12,
      keepLength: '21天22小时08分',
      createTime: '2019-09-20 00:00',
      operName: '张三, 李四, 王五, 赵六, 祝七, 黑八, 林九',
      stateName: '执行中',
      isCoordinate: 1,
      isOverTime: 1,
    },
  ]

  render() {
    const { defectListData, listParams } = this.props;
    const { sortField, sortMethod } = listParams;
    return (
      <div className={styles.eliminateDefectsList}>
        <CneTable
          sortField={sortField}
          sortMethod={sortMethod}
          onChange={this.tableSortChange}
          columns={this.defectColumn}
          className={styles.defectTable}
          // dataSource={defectListData}
          dataSource={this.defectMockListData}
          dataError={false} // 数据是否请求失败
        />
      </div>
    );
  }
}
