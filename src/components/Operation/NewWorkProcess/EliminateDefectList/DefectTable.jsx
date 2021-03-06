import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CneTable from '@components/Common/Power/CneTable';
import styles from './listPage.scss';
import moment from 'moment';

export default class DefectTable extends Component {

  static propTypes = {
    listParams: PropTypes.object,
    defectListData: PropTypes.array,
    getDefectList: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { clientHeight } = document.body;
    // footer 60; thead: 36, handler: 58; search 63; title 39; padding 15; menu 40;
    this.state = {
      tableListHeight: clientHeight - 315,
      imgs: [],
      videos: [],
    };
  }

  formatMinutes = (minutes) => {
    const day = parseInt(minutes / 60 / 24, 0);
    const hour = parseInt(minutes / 60 % 24, 0);
    const min = parseInt(minutes % 60, 0);
    let time = '';
    if (day > 0) {
      time = day.toString().padStart(2, '0') + '天';
    }
    if (hour > 0) {
      time += hour.toString().padStart(2, '0') + '小时';
    }
    if (min > 0) {
      time += parseFloat(min).toString().padStart(2, '0') + '分钟';
    }
    //三元运算符 传入的分钟数不够一分钟 默认为0分钟
    return time;
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
        >{text && moment(text).format('YYYY-MM-DD HH:mm') || '--'}</div>
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
        >{text && this.formatMinutes(+text) || '--'}</div>
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
      dataIndex: 'sort',
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
              style={{ right: (!!isCoordinate && isOverTime === 1) ? '18.5%' : '3%' }}
              title="协调"
            />}
            {isOverTime === 1 && <span
              className={`iconfont icon-chaoshi ${styles.overtimeIcon}`}
              title="超时"
            />}
          </div>
        );
      },
    }, {
      title: '查看',
      dataIndex: 'handle',
      className: styles.handle,
      render: (text, record) => (
        <span
          className={`iconfont icon-look ${styles.handleIcon}`}
          title="查看"
          onClick={() => this.onDetailSearch(record)}
        />
      ),
    },
  ]

  onDetailSearch = (record) => {
    const { docketId } = record;
    const { location, history } = this.props;
    const { pathname } = location;
    history.push(`${pathname}?page=defectDetail&docketId=${docketId}`);
  }

  tableSortChange = (pagination, filter, sorter) => {
    const { field } = sorter || {};
    const { listParams } = this.props;
    const { sortField, sortMethod } = listParams || {};
    let newField = sortField, newSort = 'descend';
    if (!field || sortField === field) { // 点击的是正在排序的列
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

  render() {
    const { tableListHeight, imgs, videos } = this.state;
    const { defectListData, listParams, listLoading } = this.props;
    const { sortField, sortMethod } = listParams;
    return (
      <div className={styles.eliminateDefectsList}>
        <CneTable
          loading={listLoading}
          sortField={sortField}
          sortMethod={sortMethod}
          onChange={this.tableSortChange}
          columns={this.defectColumn}
          className={styles.defectTable}
          scroll={defectListData.length > 0 ? { y: tableListHeight } : {}}
          dataSource={defectListData.map((e, index) => { return { ...e, key: index }; })}
          dataError={false} // 数据是否请求失败
        />
      </div>
    );
  }
}
