import React, { Component } from 'react';
import CommonPagination from '../../../../Common/CommonPagination';
import styles from './deviceMonitor.scss';
import PropTypes from 'prop-types';
import { Button, Table } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

class DeviceAlarmTable extends Component {

  static propTypes = {
    deviceAlarmList: PropTypes.array,
  }

  constructor(props){
    super(props);
    this.state = {
      pageSize: 10, 
      currentPage: 1,
      sortedInfo: {
        columnKey: 'warningLevel',
        order: 'ascend',
      }
    }
  }

  ontableSort = (pagination, filters, sorter) => {
    console.log(sorter)
    this.setState({
      sortedInfo: sorter,
    });
  }

  initColumn = () => {
    const columns = [
      {
        title: '告警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel', 
        sorter: (a,b) => a.warningLevel - b.warningLevel,
      },{
        title: '告警类型',
        dataIndex: 'warningConfigName',
        key: 'warningConfigName', 
        sorter: (a,b) => a.warningConfigName - b.warningConfigName,
      },{
        title: '告警描述',
        dataIndex: 'warningCheckDesc',
        key: 'warningCheckDesc', 
      },{
        title: '发生时间',
        dataIndex: 'timeOn',
        key: 'timeOn', 
        sorter:  (a,b) => a.timeOn - b.timeOn,
      },{
        title: '持续时间',
        dataIndex: 'durationTime',
        key: 'durationTime', 
        sorter:  (a,b) => a.durationTime - b.durationTime,
      },
    ]
    return columns;
  }

  changePagination = ({ pageSize, currentPage }) => {
    console.log(pageSize, currentPage)
  }

  render() {
    const { deviceAlarmList } = this.props;
    const { pageSize, currentPage, sortedInfo } = this.state;
    const tableSource = [...deviceAlarmList].map((e, i) => ({
      ...e,
      key: i,
    }));
    const columns = this.initColumn();
    return (
      <div className={styles.alarmTable} >
        <div>告警</div>
        <div>
          <Button>
            <Link to="/home">查看告警历史--todo</Link>
          </Button>
          <CommonPagination onPaginationChange={this.changePagination} total={deviceAlarmList.length} />
        </div>
        <Table
          dataSource={tableSource} 
          onChange={this.ontableSort}
          columns={columns}
          pagination={false}
        />
      </div>
    )
  }
  
}

export default DeviceAlarmTable;