import React, { Component } from 'react';
import styles from './alarmManage.scss';
import PropTypes from 'prop-types';
import CneTable from '@components/Common/Power/CneTable';

class AlarmManageList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    queryParams: PropTypes.object,
    alarmList: PropTypes.array,
    sortField: PropTypes.string,
    sortOrder: PropTypes.string,
    getAlarmList: PropTypes.func,
  }

  tableChange = (pagination, filter, sorter) => { // 排序触发重新请求设备列表
    const { queryParams, sortField, sortOrder } = this.props;
    const { field } = sorter || {};
    let newField = sortField, newOrder = '2';
    if (!field || field === sortField) {
      newOrder = sortOrder === '1' ? '2' : '1';
    } else {
      newField = field;
    }
    this.props.getAlarmList({
      ...queryParams,
      sortField: newField,
      sortOrder: newOrder,
    });
  }


  render() {
    const warnTypeList = [
      { warnTypeName: '信息', warnTypeCode: 101 },
      { warnTypeName: '警告', warnTypeCode: 102 },
      { warnTypeName: '故障', warnTypeCode: 103 },
      { warnTypeName: '设备状态', warnTypeCode: 104 },
      { warnTypeName: '开关状态', warnTypeCode: 105 },
    ];

    const alarmListColumn = [
      {
        title: '测点描述',
        dataIndex: 'devicePointDesc',
        key: 'devicePointDesc',
        textAlign: 'left',
        width: '13%',
        render: (text, record) => (<div className={styles.devicePointDesc} title={text || '--'}>{text || '--'}</div>),
      },
      {
        title: '测点编号',
        dataIndex: 'pointCode',
        key: 'pointCode',
        textAlign: 'left',
        width: '12%',
      }, {
        title: '事件编码',
        dataIndex: 'warningCheckRule',
        key: 'warningCheckRule',
        textAlign: 'left',
        width: '9%',
      }, {
        title: '事件/告警描述',
        dataIndex: 'warningDescription',
        key: 'warningDescription',
        textAlign: 'left',
        width: '22%',
        render: (text, record) => (<div className={styles.warningDescription} title={text || '--'}>{text || '--'}</div>),
      }, {
        title: '事件类别',
        dataIndex: 'warningType',
        key: 'warningType',
        textAlign: 'center',
        render: text => {
          const warnTypeInfo = warnTypeList.find(e => e.warnTypeCode === +text) || {};
          return warnTypeInfo.warnTypeName || '--';
        },
        width: '9%',
      }, {
        title: '告警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
        sorter: true,
        textAlign: 'center',
        width: '9%',
      }, {
        title: '是否启用告警',
        dataIndex: 'warningEnable',
        key: 'warningEnable',
        sorter: true,
        textAlign: 'center',
        render: text => text ? '是' : '否',
        width: '12%',
      }, {
        title: '所属部件',
        textAlign: 'left',
        dataIndex: 'belongComponent',
        key: 'belongComponent',
        render: (text, record) => (<div className={styles.belongComponent} title={text || '--'}>{text || '--'}</div>),
        width: '14%',
      },
    ];
    const { loading, alarmList, sortField, sortOrder } = this.props;
    return (
      <div className={styles.alarmManageList}>
        <CneTable
          loading={loading}
          onChange={this.tableChange}
          sortField={sortField}
          sortMethod={sortOrder === '1' ? 'ascend' : 'descend'}
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
