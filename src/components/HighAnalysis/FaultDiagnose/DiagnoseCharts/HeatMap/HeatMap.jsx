import React from "react";
import PropTypes from "prop-types";
import eCharts from "echarts";
import { heatTemperatureOptions } from "../chartsConfig/chartsConfig";
import styles from "./heatMap.scss";
import moment from "../PreTemperature/PreTemperature";



export default class HeatMap extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    similarityList: PropTypes.array,
    getSimilarityList: PropTypes.func,
    heatLoading: PropTypes.bool,
    faultInfo: PropTypes.object,
    heatTimeCompare: PropTypes.number,
    faultDate: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const  {
      heatChart,
      props: {
        similarityList,
        heatLoading,
        faultInfo: {
          endTime
        },
      }
    } = this;
    const myChart = eCharts.init(heatChart);
    if (heatLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!heatLoading) {
      myChart.hideLoading();
    }
    myChart.setOption(heatTemperatureOptions(similarityList, endTime));
  }

  componentDidUpdate(prevProps) {
    const  {
      heatChart,
      props: {
        similarityList,
        faultInfo: {
          endTime
        },
        faultDate,
        heatLoading,
        heatTimeCompare: currentHeatTimeCompare
      }
    } = this;
    const { heatTimeCompare } = prevProps;
    const myChart = eCharts.init(heatChart);
    if (heatLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!heatLoading) {
      myChart.hideLoading();
    }
    if (currentHeatTimeCompare && heatTimeCompare !== currentHeatTimeCompare) {
      myChart.setOption(heatTemperatureOptions(similarityList, faultDate || endTime));
    }
  }

  render() {
    return (
      <div className={styles.heatChartsBox}>
        <div className={styles.heatChartsDiff}>
          <div>
            相似性热图
          </div>
        </div>
        <div ref={(ref) => {
          this.heatChart = ref;
        }} className={styles.heatCharts} />
      </div>
    );
  }
}
