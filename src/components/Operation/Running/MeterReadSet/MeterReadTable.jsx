import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CneTable from '@components/Common/Power/CneTable';
import { Button } from 'antd';
import styles from './meterRead.scss';

class MeterReadTable extends Component{
  static propTypes= {
    tableLoading: PropTypes.bool,
    meterListError: PropTypes.bool,
    meterListData: PropTypes.array,
  }

  constructor(props){
    super(props);
  }

  render(){
    const columns= [
      {
        title: '电表名称',
        dataIndex: 'meterName',
        className: styles.meterName,
      }, {
        title: '表号',
        dataIndex: 'meterNumber',
        className: styles.meterNumber,
      }, {
        title: '计量类型',
        dataIndex: 'meterType',
        className: styles.meterType,
      }, {
        title: '电表倍率',
        dataIndex: 'magnification',
        className: styles.magnification,
      }, {
        title: '初始底码',
        dataIndex: 'meterName',
        className: styles.meterName,
      }, {
        title: '更新时间',
        dataIndex: 'updateTime',
        className: styles.updateTime,
      }, {
        title: '操作',
        dataIndex: 'operation',
        className: styles.operation,
      },
    ];

    const { tableLoading, meterListData, meterListError } = this.props;
    return(
      <div className={styles.meterReadTable}>
        <div className={styles.tableTop}>
          <span>电表设置</span>
          <Button>添加</Button>
        </div>
        <CneTable
          loading={tableLoading}
          dataSource={meterListData.map((e, i) => ({...e, key: i}))}
          columns={columns}
          className={styles.meterTable}
          onChange={this.tableChange}
          pagination={false}
          dataError={meterListError}
        />
      </div>
    );
  }
}

export default MeterReadTable;
