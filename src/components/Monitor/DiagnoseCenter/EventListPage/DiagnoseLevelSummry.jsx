import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { UpdateTime } from './FuncComponents';
import { dataFormats } from '@utils/utilFunc';
import styles from './eventListPage.scss';

class DiagnoseLevelSummry extends Component {
  static propTypes = {
    diagnoseUpdateTime: PropTypes.string,
    summaryInfo: PropTypes.object,
    listParams: PropTypes.object,
    listPage: PropTypes.object,
    changeStore: PropTypes.func,
    stopCircleQueryList: PropTypes.func,
    getDiagnoseList: PropTypes.func,
  }

  warningLevels = [{
    key: 1,
    text: '一级',
    summaryKey: 'level1',
  }, {
    key: 2,
    text: '二级',
    summaryKey: 'level2',
  }, {
    key: 3,
    text: '三级',
    summaryKey: 'level3',
  }, {
    key: 4,
    text: '四级',
    summaryKey: 'level4',
  }]

  getLevelList = (eventLevel) => { // 重新请求列表, 清空下方所有搜索条件, 停止定时请求;
    const { listParams } = this.props;
    const { eventType, finished } = listParams;
    this.props.stopCircleQueryList(); // 停止当前页面定时请求
    const newListParams = { // 列表请求参数: 电站, 设备类型, 发生时间, 告警事件, 事件状态, 归档事件, 
      eventType,
      finished,
      stationCode: null,
      deviceTypeCode: null,
      eventCode: null,
      eventStatus: null,
      eventLevel,
      startTime: null, //  起始时间
      endTime: null, // 终止事件
      hassum: 1, // 1包括汇总信息, 0不包括
    };
    const listPage = { // 表格排序方式, 表格当前页, 表格每页数据量
      pageNum: 1,
      pageSize: 10,
      sortField: 'eventStatus',
      sortMethod: 'desc',
    };
    this.props.changeStore({ // 清空并重置筛选条件
      listParams: newListParams,
      listPage,
    });
    this.props.getDiagnoseList({ ...newListParams, ...listPage }); // 请求列表
  }

  refresh = () => { // 以当前筛选条件再次请求列表
    const { listParams, listPage } = this.props;
    this.props.getDiagnoseList({ ...listParams, ...listPage }); // 请求列表
  }

  render() {
    const { summaryInfo = {}, diagnoseUpdateTime, listParams } = this.props;
    const { eventLevel } = listParams;
    const { total } = summaryInfo || {};
    return (
      <div className={styles.diagnoseLevelSummry} >
        <div className={styles.leftSummary}>
          <i className="iconfont icon-alarm" />
          <div className={styles.levelCounts}>
            <span
              className={`${styles.eachLevel} ${eventLevel ? '' : styles.activeLevel}`}
              onClick={() => this.getLevelList(null)}
            >
              <span className={styles.levelNum}>{dataFormats(total)}</span>
              <span className={styles.levelText}>事件数</span>
              {!eventLevel && <span className={styles.triangle} />}
            </span>
            <span className={styles.gradientLine} />
            {this.warningLevels.map(e => (
              <span
                className={`${styles.eachLevel} ${eventLevel === e.key ? styles.activeLevel : ''}`}
                key={e.key}
                onClick={() => this.getLevelList(e.key)}
              >
                <span className={styles.levelNum}>{summaryInfo ? dataFormats(summaryInfo[e.summaryKey]) : '--'}</span>
                <span className={styles.levelText}>{e.text}</span>
                {eventLevel === e.key && <span className={styles.triangle} />}
              </span>
            ))}
            <span className={styles.gradientLine} />
          </div>
        </div>
        <div className={styles.rightUpdater}>
          <UpdateTime currentTime={diagnoseUpdateTime} />
          <Tooltip
            placement="topLeft"
            overlayStyle={{ width: 418, maxWidth: 500, fontSize: '12px' }}
            title="数据每隔10秒刷新一次，筛选/查询后不再刷新，如需重置，请点此按钮刷新"
          >
              <div className={styles.refreshIcon}>
                <span className={styles.updater} onClick={this.refresh}>
                  <i className="iconfont icon-refresh" />
                </span>
                <i className="iconfont icon-help" />
              </div>
            </Tooltip>
        </div>
      </div>
    );
  }
}

export default DiagnoseLevelSummry;
