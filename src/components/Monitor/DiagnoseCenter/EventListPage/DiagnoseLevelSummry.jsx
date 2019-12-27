import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WarningTotal, UpdateTime } from './FuncComponents';
import styles from './eventListPage.scss';

class DiagnoseLevelSummry extends Component {
  static propTypes = {
    summaryInfo: PropTypes.object,
  }

  warningLevels = ['一级', '二级', '三级', '四级']

  render() {
    const { summaryInfo } = this.props;
    const { level1, level2, level3, level4, total } = summaryInfo || {};
    return (
      <div className={styles.diagnoseLevelSummry} >
        <div>
          <WarningTotal warningNum={total} />
          <div className={styles.levelCounts}>
            {this.warningLevels.map(e => (
              <span className={styles.eachLevel} key={e}>
                <span>{e}</span>
                <span>{e}</span>
              </span>
            ))}
          </div>
        </div>
        <div>
          <UpdateTime currentTime={'2018-11-05'} />
          <div>图标与说明</div>
        </div>
      </div>
    );
  }
}

export default DiagnoseLevelSummry;
