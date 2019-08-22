import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Tooltip } from 'antd';
import searchUtil from '../../../../../utils/searchUtil';
import DevicesChart from './DevicesChart';
import DevicesCheckTime from './DevicesCheckTime';
import DevicesAep from './DevicesAep';
import DevicesPsd from './DevicesPsd';
import MonthsChart from './MonthsChart';
import MonthsSelector from './MonthsSelector';
import MonthsAep from './MonthsAep';
import MonthsPsd from './MonthsPsd';
import styles from './curve.scss';

class CurveAnalysis extends Component {

  static propTypes = {
    pageName: PropTypes.string,
    curveTopStringify: PropTypes.string,
    curveDeviceFullcode: PropTypes.string,
    active: PropTypes.bool,
    modeDevices: PropTypes.array,
    location: PropTypes.object,
    getCurveDevices: PropTypes.func,
    getCurveDevicesAep: PropTypes.func,
    getCurveDevicesPsd: PropTypes.func,
    getCurveMonths: PropTypes.func,
    getCurveMonthAep: PropTypes.func,
    getCurveMonthPsd: PropTypes.func,
    changeStore: PropTypes.func,
  }

  render() {
    const { active } = this.props;
    return (
      <div className={`${styles.curveAnalysis} ${styles.eachPage} ${active ? styles.active : styles.inactive}`}>
        <section className={styles.curveAllDevice}>
          <h3 className={styles.header}>
            <span className={styles.headerText}>功率曲线邻比分析</span>
            <Tooltip title="功率曲线所用的均为清洗后的数据" placement="topRight">
              <span className={styles.headerTip}>i</span>
            </Tooltip>
          </h3>
          <div className={styles.content}>
            <DevicesChart {...this.props} />
            <DevicesCheckTime {...this.props} />
            <div className={styles.indicatorDetails}>
              <DevicesAep {...this.props} />
              <DevicesPsd {...this.props} />
            </div>
          </div>
        </section>
        <section className={styles.curveEachMonth}>
          <h3 className={styles.header}>
            <span className={styles.headerText}>功率曲线环比分析</span>
            <Tooltip title="功率曲线所用的均为清洗后的数据" placement="topRight">
              <span className={styles.headerTip}>i</span>
            </Tooltip>
          </h3>
          <div className={styles.content}>
            <MonthsChart {...this.props} />
            <MonthsSelector {...this.props} />
            <div className={styles.indicatorDetails}>
              <MonthsAep {...this.props} />
              <MonthsPsd {...this.props} />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default CurveAnalysis;

