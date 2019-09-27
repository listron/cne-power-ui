import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    stationInfoStr: PropTypes.string,
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
    pageQuery: PropTypes.func,

    curveAllDevice: PropTypes.array,
    curveCheckedDevice: PropTypes.array,
    activeDevice: PropTypes.string,
    curveAllMonths: PropTypes.array,
    curveCheckedMonths: PropTypes.array,
  }

  handleContextMenu = () => {
    const {
      stationInfoStr, pageName, curveAllDevice, curveCheckedDevice, activeDevice, curveAllMonths, curveCheckedMonths,
    } = this.props;
    if (curveAllDevice.length !== curveCheckedDevice.length || activeDevice || curveAllMonths.length !== curveCheckedMonths.length) {
      event.preventDefault();
      this.props.pageQuery(stationInfoStr, pageName);
    }
  }

  render() {
    const { active } = this.props;
    return (
      <div
        onContextMenu={this.handleContextMenu}
        className={`${styles.eachPage}
        ${active ? styles.active : styles.inactive}`}
      >
        <div className={styles.curveAnalysis}>
          <section className={styles.curveAllDevice}>
            <h3 className={styles.header}>功率曲线邻比分析</h3>
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
            <h3 className={styles.header}>功率曲线环比分析</h3>
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
      </div>
    );
  }
}

export default CurveAnalysis;

