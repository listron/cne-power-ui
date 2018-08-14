import React, { Component } from 'react';
import CommonPagination from '../../../../Common/CommonPagination';
import styles from './deviceMonitor.scss';
import PropTypes from 'prop-types';
import { Button, Table, Icon } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

class DeviceAlarmTable extends Component {

  static propTypes = {
    deviceAlarmList: PropTypes.array,
    loading: PropTypes.bool,
  }

  constructor(props){
    super(props);
    this.state = {
      pageSize: 10, 
      currentPage: 1,
      sortName: 'warningLevel',
      descend: false,
    }
  }

  ontableSort = (pagination, filters, sorter) => {
    this.setState({ 
      sortName: sorter.field,
      descend : sorter.order === 'descend'
    })
  }

  initColumn = () => {
    const columns = [
      {
        title: '告警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel', 
        sorter: true, // (a,b) => a.warningLevel - b.warningLevel,
      },{
        title: '告警类型',
        dataIndex: 'warningConfigName',
        key: 'warningConfigName', 
        sorter: true, // (a,b) => a.warningConfigName - b.warningConfigName,
      },{
        title: '告警描述',
        dataIndex: 'warningCheckDesc',
        key: 'warningCheckDesc', 
      },{
        title: '发生时间',
        dataIndex: 'timeOn',
        key: 'timeOn', 
        sorter:  true, // (a,b) => a.timeOn - b.timeOn,
      },{
        title: '持续时间',
        dataIndex: 'durationTime',
        key: 'durationTime', 
        sorter: true, // (a,b) => a.durationTime - b.durationTime,
      },
    ]
    return columns;
  }

  changePagination = ({ pageSize, currentPage }) => {
    this.setState({ pageSize, currentPage })
  }

  render() {
    const { deviceAlarmList, loading } = this.props;
    const { pageSize, currentPage, sortName, descend } = this.state;
    const tableSource = [...deviceAlarmList].map((e, i) => ({
      ...e,
      key: i,
    })).sort((a, b) => { // 手动排序
      const sortType = descend ? -1: 1;
      const sortArray = {
        warningLevel: 'warningLevel',
        warningConfigName: 'warningConfigName',
        timeOn: 'timeOn',
        durationTime: 'durationTime'
      };
      return sortType * (a[sortArray[sortName]] - b[sortArray[sortName]]);
    }).filter((e,i)=>{ // 筛选页面
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return (i >= startIndex && i < endIndex);
    });
    const columns = this.initColumn();
    return (
      <div className={styles.alarmTable} >
        <div className={styles.alarmTip}>
          逆变器告警
          <Icon type="info" title="逆变器告警" />
        </div>
        <div className={styles.tableHeader}>
          <Button className={styles.historyButton}>
            <Link to="/home">查看告警历史--todo</Link>
          </Button>
          <CommonPagination onPaginationChange={this.changePagination} total={deviceAlarmList.length} />
        </div>
        <Table
          dataSource={tableSource} 
          onChange={this.ontableSort}
          columns={columns}
          pagination={false}
          // loading={loading}
        />
      </div>
    )
  }
  
}

export default DeviceAlarmTable;