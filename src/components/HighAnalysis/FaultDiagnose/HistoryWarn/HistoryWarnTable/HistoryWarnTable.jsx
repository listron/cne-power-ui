import React from 'react';
import PropTypes from 'prop-types';
import styles from './historyWarnTable.scss';
import { Table } from 'antd';
import { dateArrFormat } from '../../formatDateUtils/formatDateUtils';
import CneTable from '../../../../Common/Power/CneTable';

export default class HistoryWarnTable extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    faultWarnHistoryData: PropTypes.object,
    getFaultWarnHistory: PropTypes.func,
    onChangeFilter: PropTypes.func,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    stationCode: PropTypes.number,
    selectDeviceCode: PropTypes.array,
    algorithmModalId: PropTypes.array,
    history: PropTypes.object,
  };

  onShowDetail = (data) => {
    const { history } = this.props;
    const { taskId, deviceName, deviceFullcode, stationCode, algorithmName } = data;
    // 跳到单风机详情图表展示
    history.push(`/hidden/analysis/single/fan/${stationCode}`);
    localStorage.setItem('taskId', taskId);
    localStorage.setItem('faultHistory', '1');
    localStorage.setItem('deviceName', deviceName);
    localStorage.setItem('deviceFullCode', deviceFullcode);
    localStorage.setItem('deviceFullName', algorithmName);
  };

  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const { sortField, sortMethod, onChangeFilter } = this.props;
    const { field } = sorter;
    let newSortField = sortField, newSortMethod = 'desc';
    if (!field || field === newSortField) { // 点击的是正在排序的列
      newSortMethod = sortMethod === 'desc' ? 'asc' : 'desc'; // 交换排序方式
    } else { // 切换列
      newSortField = field;
    }
    onChangeFilter({ sortField: newSortField, sortMethod: newSortMethod });
  };

  render() {
    const { loading, faultWarnHistoryData: {
      dataList,
    }, sortField, sortMethod } = this.props;
    const columns = [{
      title: '电站名称',
      dataIndex: 'stationName',
      sorter: true,
      width: '15%',
      textAlign: 'left',
      render: (value) => <div className={styles.stationNameText} title={value || '--'}>{value || '--'}</div>,
    }, {
      title: '风机名称',
      dataIndex: 'deviceName',
      sorter: true,
      width: '15%',
      textAlign: 'left',
      render: (value) => <div className={styles.deviceNameText} title={value || '--'}>{value || '--'}</div>,
    }, {
      title: '预警日期',
      dataIndex: 'predictionDate',
      sorter: true,
      width: '13%',
      textAlign: 'center',
      render: (predictionDate) => {
        return <span>{dateArrFormat(predictionDate)}</span>;
      },
    }, {
      title: '算法模型',
      dataIndex: 'algorithmName',
      sorter: true,
      width: '21%',
      render: (value) => <div className={styles.algorithmNameText} title={value || '--'}>{value || '--'}</div>,
    }, {
      title: '检测开始日期',
      dataIndex: 'startTime',
      width: '13%',
      textAlign: 'center',
    }, {
      title: '检测结束日期',
      dataIndex: 'endTime',
      width: '13%',
      textAlign: 'center',
    }, {
      title: '预期结果',
      dataIndex: 'result',
      textAlign: 'center',
      width: '10%',
      render: (text, record) => <i className={`iconfont icon-look ${styles.look}`} onClick={() => { this.onShowDetail(record); }} />,
    }];
    return (
      <CneTable
        pagination={false}
        dataSource={dataList}
        loading={loading}
        className={styles.historyWarnTable}
        onChange={this.tableChange}
        rowKey={(record, index) => (record.taskId + index) || 'key'}
        columns={columns}
        sortField={sortField}
        sortMethod={{ 'asc': 'ascend', 'desc': 'descend' }[sortMethod]}
      />
    );
  }
}
