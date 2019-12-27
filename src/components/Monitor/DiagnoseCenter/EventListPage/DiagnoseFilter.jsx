import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import moment from 'moment';
import { WarningTotal, UpdateTime } from './FuncComponents';
import { dataFormats } from '@utils/utilFunc';
import styles from './eventListPage.scss';

class DiagnoseLevelSummry extends Component {
  static propTypes = {
    diagnoseUpdateTime: PropTypes.string,
    summaryInfo: PropTypes.object,
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

  getLevelList = (eventLevel) => {
    console.log('新等级列表请求 -> level ' + eventLevel);
  }

  refresh = () => { // 
    console.log('重新刷新refresh list data');
  }

  render() {
    const { summaryInfo = {}, diagnoseUpdateTime } = this.props;
    const { total } = summaryInfo || {};
    return (
      <div className={styles.diagnoseLevelSummry} >
        <div className={styles.leftSummary}>
          <WarningTotal warningNum={dataFormats(total)} />
          <div className={styles.levelCounts}>
            <span className={styles.gradientLine} />
            {this.warningLevels.map(e => (
              <span className={styles.eachLevel} key={e.key} onClick={() => this.getLevelList(e.key)}>
                <span className={styles.levelNum}>{summaryInfo ? dataFormats(summaryInfo[e.summaryKey]) : '--'}</span>
                <span className={styles.levelText}>{e.text}</span>
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
              <div className={styles.refreshIcon} onClick={this.refresh}>
                <span className={styles.updater}>
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
