import React, { Component } from 'react';
import styles from './alarmManage.scss';
import { Table } from 'antd';
import PropTypes from 'prop-types';

class AlarmManageList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    queryParams: PropTypes.object,
    alarmList: PropTypes.array,
    getAlarmList: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
     
    }
  }

  tableChange = (pagination, filter, sorter) => { // 排序触发重新请求设备列表
    const { getAlarmList, queryParams } = this.props;
    const { field, order } = sorter;
    

    getAlarmList({
      ...queryParams,
      //sortField: field?field:'',
      sortField: field?field==='warningLevel'?'1':'2':'',
      sortOrder: order?(sorter.order==='ascend'?'1':'2'):'',

      // sortOrder: order?(sorter.order==='ascend'?'asc':'desc'):'',

    })
  }
 

  render() {
    const alarmListColumn = [
      {
        title: '测点编号',
        dataIndex: 'pointCode',
        key: 'pointCode',
      },{
        title: '告警描述',
        dataIndex: 'warningDescription',
        key: 'warningDescription',
      },{
        title: '告警参数',
        dataIndex: 'warningCheckRule',
        key: 'warningCheckRule',
      },{
        title: '告警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
        sorter: true,
      },{
        title: '是否启用',
        dataIndex: 'warningEnable',
        key: 'warningEnable',
        sorter: true,
        //render: (text, record) => record.enableDisplay?'是':'否',
        render: (text, record) => record.warningEnable?'是':'否',
      }
    ];
    const { loading, alarmList } = this.props;
    return (
      <div className={styles.alarmManageList}>
        <Table
          loading={loading}
          onChange={this.tableChange}
          columns={alarmListColumn}
          dataSource={alarmList.map((e,i)=>({key: i,...e}))}
          pagination={false}
          locale={{emptyText:<img width="223" height="164" src="/img/nodata.png" />}}
        />
      </div>
    );
  }
}

export default AlarmManageList;
