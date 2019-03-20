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
    const {powerspeedchartData,pitchanglespeedchartData,sequencechartData,roseChartData}=this.props;
   let rosedata= roseChartData.length>0?roseChartData.concat([roseChartData[0]]):[];
    const xAxisDate=sequencechartData.length>0?sequencechartData[0].sequenceChartData.map(e=>e.time):[];
    return (
      <div className={styles.chartsLayout}>
        <div className={styles.topBox}>
          <div className={styles.left}>
            <div className={styles.leftTop}><PowercurveChart {...this.props}  /></div>
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