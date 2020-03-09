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
        // width:150,
        width:'13%',
        ellipsis: true,
      },
      {
        title: '测点编号',
        dataIndex: 'pointCode',
        key: 'pointCode',
        // width:120,
        width:'12%',
        ellipsis: true,
      }, {
        title: '事件编码',
        dataIndex: 'warningCheckRule',
        key: 'warningCheckRule',
        // width:100,
        width:'9%',
      }, {
        title: '事件/告警描述',
        dataIndex: 'warningDescription',
        key: 'warningDescription',
        // width:250,
        width:'22%',
        ellipsis: true,
      }, {
        title: '事件类别',
        dataIndex: 'warningType',
        key: 'warningType',
        render: text => warnTypeList.map(e => { if (e.warnTypeCode === +text) return e.warnTypeName }),
        className:styles.warningType,
        // width:100,
        width:'9%',
      }, {
        title: '告警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
        sorter: true,
        className:styles.warningLevel,
        // width:100,
        width:'9%',
      }, {
        title: '是否启用告警',
        dataIndex: 'warningEnable',
        key: 'warningEnable',
        sorter: true,
        render: text => text ? '是' : '否',
        className:styles.warningEnable,
        // width:140,
        width:'12%',
      }, {
        title: '所属部件',
        dataIndex: 'belongComponent',
        key: 'belongComponent',
        render: text => (text || text === 0) ? text : '--',
        // width:150,
        width:'14%',
        ellipsis: true,
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
