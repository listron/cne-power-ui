import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './eventListPage.scss';

class DiagnoseHeaderTabs extends Component {
  static propTypes = {
    pageKey: PropTypes.string,
    circlingQueryList: PropTypes.func,
    stopCircleQueryList: PropTypes.func,
    changeStore: PropTypes.func,
  }

  pages = [{
    name: '告警事件',
    value: 'alarm',
  }, {
    name: '诊断时间',
    value: 'diagnose',
  }, {
    name: '数据事件',
    value: 'data',
  }]

  changePage = (pageKey) => {
    this.props.stopCircleQueryList(); // 停止当前页面定时请求
    const eventType = ['alarm', 'diagnose', 'data'].indexOf(pageKey) + 1;
    const listParams = { // 列表请求参数: 电站, 设备类型, 发生时间, 告警事件, 事件状态, 归档事件, 
      eventType,
      finished: 0,
      stationCode: null,
      deviceTypeCode: null,
      eventCode: null,
      eventStatus: null,
      eventLevel: null,
      startTime: null, //  起始时间
      endTime: null, // 终止事件
      includeSummary: 1, // 1包括汇总信息, 0不包括
    };
    const listPage = { // 表格排序方式, 表格当前页, 表格每页数据量
      pageNum: 1,
      pageSize: 10,
      sortField: 'eventStatus',
      sortMethod: 'desc',
    };
    this.props.changeStore({ // 清空并重置当前页面所有数据
      pageKey,
      listParams,
      listPage,
      diagnoseListData: [],
      totalNum: 0, // 总量
      summaryInfo: {}, // 汇总统计
      diagnoseUpdateTime: '--', // 表格数据更新时间
    });
    this.props.circlingQueryList({ ...listParams, ...listPage }); // 启动下一个页面的定时实时请求
  }

  render() {
    const { pageKey } = this.props;
    return (
      <div className={styles.diagnoseHeaderTabs} >
        <span className={styles.leftHolder} />
        {this.pages.map(e => (
          <React.Fragment key={e.value}>
            <span
              onClick={() => this.changePage(e.value)}
              className={`${styles.tab} ${e.value === pageKey ? styles.active : styles.inactive}`}
            >{e.name}</span>
            <span className={styles.tabHolder} />
          </React.Fragment>
        ))}
        <span className={styles.rightHolder} />
      </div>
    );
  }
}

export default DiagnoseHeaderTabs;
