import React, { Component } from 'react';
import styles from './alarmManage.scss';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import CneTable from '@components/Common/Power/CneTable';

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
      sortField: field ? field === 'warningLevel' ? '1' : '2' : '',
      sortOrder: order ? (sorter.order === 'ascend' ? '1' : '2') : '',

      // sortOrder: order?(sorter.order==='ascend'?'asc':'desc'):'',

    })
  }


  render() {
    const warnTypeList = [
      { warnTypeName: '信息', warnTypeCode: 101 },
      { warnTypeName: '警告', warnTypeCode: 102 },
      { warnTypeName: '故障', warnTypeCode: 103 },
      { warnTypeName: '设备状态', warnTypeCode: 104 },
      { warnTypeName: '开关状态', warnTypeCode: 105 },
    ]

    const alarmListColumn = [
      {
        title: '测点描述',
        dataIndex: 'devicePointDesc',
        key: 'devicePointDesc',
      },
      {
        title: '测点编号',
        dataIndex: 'pointCode',
        key: 'pointCode',
      }, {
        title: '事件编码',
        dataIndex: 'warningCheckRule',
        key: 'warningCheckRule',
      }, {
        title: '事件/告警描述',
        dataIndex: 'warningDescription',
        key: 'warningDescription',
      }, {
        title: '事件类别',
        dataIndex: 'warningType',
        key: 'warningType',
        render: text => warnTypeList.map(e => { if (e.warnTypeCode === +text) return e.warnTypeName }),
        className:styles.warningType,
      }, {
        title: '告警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
        sorter: true,
        className:styles.warningLevel
      }, {
        title: '是否启用告警',
        dataIndex: 'warningEnable',
        key: 'warningEnable',
        sorter: true,
        render: text => text ? '是' : '否',
        className:styles.warningEnable,
      }, {
        title: '所属部件',
        dataIndex: 'belongComponent',
        key: 'belongComponent',
        render: text => (text || text === 0) ? text : '--'
      }
    ];
    const { loading, alarmList } = this.props;
    return (
      <div className={styles.alarmManageList}>
        <CneTable
          loading={loading}
          onChange={this.tableChange}
          columns={alarmListColumn}
          dataSource={alarmList.map((e, i) => ({ key: i, ...e }))}
          pagination={false}
          className={styles.alarmTable}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
    );
  }
}

export default AlarmManageList;
