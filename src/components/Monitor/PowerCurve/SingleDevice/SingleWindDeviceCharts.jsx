import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from './singleDevice.scss';
import PowercurveChart from './PowercurveChart';
import WindRoseChart from './WindRoseChart';
import PowerSpeedChart from './PowerSpeedChart';
import WindDistributionChart from './WindDistributionChart';
import SequenceChart from './SequenceChart';


class SingleWindDeviceCharts extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  render() {
    return (
      <div className={styles.chartsLayout}>
        <div className={styles.topBox}>
          <div className={styles.left}>
            <div className={styles.leftTop}><PowercurveChart {...this.props} /></div>
            <div className={styles.leftBottom}>
              <div className={styles.leftScatter}><PowerSpeedChart {...this.props} /></div>
              <div className={styles.rightScatter}><PowerSpeedChart {...this.props} /></div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.rightTop}><WindRoseChart {...this.props} /></div>
            <div className={styles.rightBottom}><WindDistributionChart {...this.props} /></div>
          </div>
        </div>
        <div className={styles.bottomBox}><SequenceChart {...this.props} /></div>

      </div>
    )
  }
}
export default (SingleWindDeviceCharts)