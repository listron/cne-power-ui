import React from 'react';
import PropTypes from 'prop-types';
import styles from './alarmStatistic.scss';
import { Table } from 'antd';
import moment from 'moment';
import CommonPagination from '../../../Common/CommonPagination';

class AlarmSingleStationTable extends React.Component {
  static propTypes = {
    singleAlarmStatistic: PropTypes.array,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
    onChangeFilter: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }

  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    this.props.onChangeFilter({
      pageNum: currentPage,
      pageSize
    });
  }

  onChangeTable = (pagination, filters, sorter) => {
    const field = sorter.field;
    const arr = ['time', 'alarmNum', 'transferWorkAlarmNum', 'noTransferWorkAlarmNum', 'transferWorkRate']
    this.props.onChangeFilter({
      orderField: (arr.indexOf(field)+1).toString(),
      orderCommand: sorter.order === 'ascend' ? '1' : '2'
    });
  }

  renderColumn() {
    const columns = [
      {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
        sorter: true,
        render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm'),
      },
      {
        title: '告警总数',
        dataIndex: 'alarmNum',
        key: 'alarmNum',
        sorter: true,
      },
      {
        title: '转工单数',
        dataIndex: 'transferWorkAlarmNum',
        key: 'transferWorkAlarmNum',
        sorter: true,
      },
      {
        title: '未转工单数',
        dataIndex: 'noTransferWorkAlarmNum',
        key: 'noTransferWorkAlarmNum',
        sorter: true,
      },
      {
        title: '转工单率',
        dataIndex: 'transferWorkRate',
        dataIndex: 'transferWorkRate',
        render: (text, record) => `${text}%`,
        sorter: true,
      }
    ];
    return columns;
  }

  render() {
    const { singleAlarmStatistic, pageNum, pageSize } = this.props;
   
    const totalNum = singleAlarmStatistic && singleAlarmStatistic.length;
    let startRow = (pageNum - 1) * pageSize;
    let endRow = pageNum * pageSize;
    endRow = (endRow > totalNum) ? totalNum : endRow;
    let data = singleAlarmStatistic && singleAlarmStatistic.slice(startRow, endRow).map((item,index)=>{
      item.key=index;
      return item;
    });
    return (
      <div className={styles.singleStationTable}>
        <div className={styles.pagination}>
          <CommonPagination total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table 
          columns={this.renderColumn()} 
          dataSource={data} 
          onChange={this.onChangeTable} 
          pagination={false} 
          locale={{emptyText:<div className={styles.noData}><img src="/img/nodata.png" style={{width: 223,height:164}} /></div>}} />
      </div>
    );
  }
}
export default AlarmSingleStationTable;