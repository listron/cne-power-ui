import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from './singleDevice.scss';
import PowercurveChart from './PowercurveChart';
import WindRoseChart from './WindRoseChart';
import PowerSpeedChart from './PowerSpeedChart';
import WindDistributionChart from './WindDistributionChart';
import SequenceChart from './SequenceChart';
import moment from 'moment';


class SingleWindDeviceCharts extends Component {
  static propTypes = {
    pitchanglespeedchartData: PropTypes.array,
    sequencechartData: PropTypes.array,
    roseChartData: PropTypes.array,
    powerspeedchartData: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context)
  }
  compare = (key) => {
    return (a, b) => {
      let val1 = a[key];
      let val2 = b[key];
      if (val1 < val2) { //正序
        return 1;
      } else if (val1 > val2) {
        return -1;
      } else {
        return 0;
      }
    }
  }

  render() {
    const { powerspeedchartData, pitchanglespeedchartData, sequencechartData, roseChartData } = this.props;
    let sortrosedata = roseChartData.length > 0 ? roseChartData.sort(this.compare('rangeId')) : [];
    let rosedata = sortrosedata.length > 0 ? sortrosedata.concat([sortrosedata[0]]) : [];
    const xAxisDate = sequencechartData.length > 0 ? sequencechartData[0].sequenceChartData.map(e => moment(e.time).format('YYYY-MM-DD HH:mm:ss')) : [];
    return (
      <div className={styles.chartsLayout}>
        <div className={styles.topBox}>
          <div className={styles.left}>
            <div className={styles.leftTop}><PowercurveChart {...this.props} /></div>
            <div className={styles.leftBottom}>
              <div className={styles.leftScatter}><PowerSpeedChart {...this.props} chartData={powerspeedchartData} chartId={'powerSpeedChart'} /></div>
              <div className={styles.rightScatter}><PowerSpeedChart {...this.props} chartData={pitchanglespeedchartData} chartId={'pitchange'} /></div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.rightTop}><WindRoseChart {...this.props} rosedata={rosedata} /></div>
            <div className={styles.rightBottom}><WindDistributionChart {...this.props} /></div>
          </div>
        </div>
        <div className={styles.bottomBox}><SequenceChart {...this.props} xAxisDate={xAxisDate} /></div>

      </div>
    )
  }
}
export default (SingleWindDeviceCharts)